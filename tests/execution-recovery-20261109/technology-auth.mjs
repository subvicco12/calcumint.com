import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGSERVICE','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External target selector refused: '+key);
assert.equal(process.argv.length,2,'No connection arguments accepted');
const directory=process.env.TECHNOLOGY_AUTH_REPORT||'/tmp/calcumint-technology-auth';await mkdir(directory,{recursive:true});
const temporary=await mkdtemp('/tmp/technology-auth-'),checks=[],journeys=[];let db;
const hash=x=>createHash('sha256').update(x).digest('hex');
const pass=x=>{checks.push(x);console.log('PASS '+x);};
const ok=async query=>{const r=await query;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const denied=async(query,pattern)=>{const r=await query;assert(r.error,'Explicit denial required');if(pattern)assert.match(r.error.message,pattern);return r.error.code;};
try{
 const bundled=await build({stdin:{contents:"export {calculatorRegistry} from './src/calculators/registry';export {runCalculator} from './src/calculators/engine';export {saveHistoryAtomically,readAccountEntitlements} from './src/lib/account-persistence';export {validateHistoricalCalculationSnapshot,readPersistedCalculationSnapshot} from './src/lib/persisted-calculation';export {verifyRegisteredSnapshot} from './src/lib/registered-snapshot-verification';",resolveDir:process.cwd(),sourcefile:'technology-auth-adapter.ts',loader:'ts'},bundle:true,platform:'node',format:'esm',outfile:temporary+'/adapter.mjs',metafile:true});
 const math=await import(temporary+'/adapter.mjs'),vectors=JSON.parse(await readFile('tests/execution-recovery-20261109/technology-cases.json','utf8')).rows;assert.equal(vectors.length,19);
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});const users=[];
 for(const plan of ['free','pro','business']){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const signed=await ok(sdk.auth.signUp({email:plan+'-'+randomUUID()+'@example.invalid',password:'Fixture-'+randomUUID(),options:{data:{plan:'business'}}}));const id=signed.user.id;
  assert.equal((await math.readAccountEntitlements(sdk,id)).historyLimit,20);
  if(plan!=='free')await db.sql("UPDATE public.profiles SET plan='"+plan+"' WHERE id='"+id+"';");
  const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:id,name:'Synthetic Technology acceptance'}).select().single());users.push({plan,sdk,id,project});
 }
 for(const vector of vectors){
  const definition=math.calculatorRegistry.getBySlug(vector.slug);assert(definition);assert.equal(definition.version,vector.version);
  const run=math.runCalculator(definition,definition.examples[0].input);
  const snapshot=math.validateHistoricalCalculationSnapshot({calculatorSlug:vector.slug,calculatorVersion:vector.version,input:run.input,output:run.output});
  assert.equal(snapshot.output.value,vector.expected);const original=JSON.stringify(snapshot);
  const verified=math.verifyRegisteredSnapshot(snapshot);assert.equal(verified.engineId,definition.id);assert.deepEqual(verified.snapshot,snapshot);assert(Object.isFrozen(verified.snapshot.input));assert.equal(JSON.stringify(snapshot),original);
  for(const version of [vector.version+1,vector.version===2?1:0])assert.throws(()=>math.verifyRegisteredSnapshot({...snapshot,calculatorVersion:version}));
  assert.throws(()=>math.verifyRegisteredSnapshot({...snapshot,output:{...snapshot.output,value:123456789}}));
  for(const user of users){
   const foreign=users.find(x=>x!==user&&x.plan!=='free'),historyId=randomUUID();
   await math.saveHistoryAtomically(user.sdk,historyId,snapshot,user.id);await math.saveHistoryAtomically(user.sdk,historyId,snapshot,user.id);
   assert.equal(await db.sql("SELECT count(*) FROM public.calculation_history WHERE id='"+historyId+"'"),'1');
   const row=await ok(user.sdk.from('calculation_history').select('*').eq('id',historyId).single());
   assert.deepEqual(math.verifyRegisteredSnapshot(math.readPersistedCalculationSnapshot(row)).snapshot,snapshot);
   assert.equal(await ok(foreign.sdk.from('calculation_history').select('id').eq('id',historyId).maybeSingle()),null);
   assert.deepEqual(await ok(foreign.sdk.from('calculation_history').update({output_data:{value:999}}).eq('id',historyId).select()),[]);
   let scenario='PLAN_DENIED',negativeCode;
   if(user.plan==='free'){
    negativeCode=await denied(user.sdk.rpc('save_project_scenario_atomic',{p_expected_owner_id:user.id,p_request_id:randomUUID(),p_project_id:users[1].project.id,p_history_id:historyId,p_name:'Free denied'}));
   }else{
    const args={p_expected_owner_id:user.id,p_request_id:randomUUID(),p_project_id:user.project.id,p_history_id:historyId,p_name:'Exact '+vector.slug};
    const replies=await Promise.all([user.sdk.rpc('save_project_scenario_atomic',args),user.sdk.rpc('save_project_scenario_atomic',args)]);for(const r of replies){assert.equal(r.error,null);assert.equal(r.data,args.p_request_id);}
    assert.equal(await db.sql("SELECT count(*) FROM public.saved_scenarios WHERE id='"+args.p_request_id+"'"),'1');
    const reopen=async()=>math.verifyRegisteredSnapshot(math.readPersistedCalculationSnapshot(await ok(user.sdk.from('saved_scenarios').select('*').eq('id',args.p_request_id).single()))).snapshot;
    assert.deepEqual(await reopen(),snapshot);
    await denied(user.sdk.rpc('save_project_scenario_atomic',{...args,p_name:'Conflicting retry'}),/SCENARIO_REQUEST_CONFLICT/);
    await denied(user.sdk.from('saved_scenarios').update({output_data:{value:999}}).eq('id',args.p_request_id),/SCENARIO_SNAPSHOT_IMMUTABLE/);
    negativeCode=await denied(foreign.sdk.rpc('save_project_scenario_atomic',{...args,p_expected_owner_id:foreign.id,p_request_id:randomUUID()}),/SCENARIO_WRITE_REJECTED/);
    assert.equal(await ok(foreign.sdk.from('saved_scenarios').select('id').eq('id',args.p_request_id).maybeSingle()),null);
    assert.deepEqual(await ok(foreign.sdk.from('saved_scenarios').update({name:'Foreign overwrite'}).eq('id',args.p_request_id).select()),[]);
    assert.deepEqual(await reopen(),snapshot);scenario='EXACT_RETRY_IMMUTABLE_REPLAY';
   }
   journeys.push({masterId:vector.masterId,slug:vector.slug,version:vector.version,engineId:definition.id,plan:user.plan,literalExpected:vector.expected,actual:snapshot.output.value,history:'ATOMIC_IDEMPOTENT_PERSISTED_REPLAY',scenario,foreignReadUpdateDenied:true,negativeCode,snapshotSha256:hash(original),wrongVersionsRejected:true});
   pass('#'+vector.masterId+' '+user.plan+' exact history/replay and account boundaries; scenario '+scenario);
  }
 }
 const sources=[];for(const file of [...new Set(['tests/execution-recovery-20261109/technology-auth.mjs','tests/execution-recovery-20261109/technology-cases.json','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs',...Object.keys(bundled.metafile.inputs).filter(p=>p!=='technology-auth-adapter.ts')])].sort())sources.push({path:file,sha256:hash(await readFile(file))});
 await writeFile(directory+'/receipt.json',JSON.stringify({passed:true,observedAt:new Date().toISOString(),sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),checks,journeys,sources,provenance:db.provenance,requests:db.requests,productionWrites:false,releaseHold:true,limitations:['Genuine isolated GoTrue JWT/Supabase SDK/PostgREST/PG17.6; no browser or Next server-action claim','Synthetic privileged plan setup is not billing-provider acceptance','19 exact existing example contracts only; no full canonical/source/competent acceptance','Website bandwidth v2 only; v1 refused without upgrade; unchanged original engine bytes']},null,2)+'\n');
}catch(error){await writeFile(directory+'/failure.json',JSON.stringify({checks,error:error.stack},null,2));throw error;}finally{await db?.close();await rm(temporary,{recursive:true,force:true});}
