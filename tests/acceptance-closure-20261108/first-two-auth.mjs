import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
const directory=process.env.FIRST_TWO_AUTH_RECEIPT||'/tmp/calcumint-first-two-auth';await mkdir(directory,{recursive:true});
const temporary=await mkdtemp('/tmp/first-two-auth-');
const bundled=await build({entryPoints:['tests/critical440-auth/adapter.ts'],bundle:true,platform:'node',format:'esm',outfile:temporary+'/adapter.mjs',metafile:true});
const math=await import(temporary+'/adapter.mjs');
const checks=[],artifacts=[],negativeReceipts=[];let db;
const pass=name=>{checks.push(name);console.log('PASS '+name)};
const ok=async query=>{const r=await query;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const denied=async(query,pattern)=>{const r=await query;assert(r.error,'explicit denial expected');if(pattern)assert.match(r.error.message,pattern);negativeReceipts.push({code:r.error.code,message:r.error.message});return r.error;};
const vectors=[{catalogId:432,engineId:'conversion.time',slug:'time-converter',input:{value:1.5,fromUnit:'week',toUnit:'h'},expected:252},{catalogId:440,engineId:'conversion.frequency',slug:'frequency-converter',input:{value:0.125,fromUnit:'mhz',toUnit:'hz'},expected:125000}];
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});assert.equal(await db.sql('SHOW server_version;'),'17.6');
 const client=()=>createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 const users=[];
 for(const plan of ['free','pro','business']){const sdk=client();const signed=await ok(sdk.auth.signUp({email:plan+'-'+randomUUID()+'@example.invalid',password:'Fixture-'+randomUUID(),options:{data:{plan:'business'}}}));const id=signed.user.id;assert.equal((await math.readAccountEntitlements(sdk,id)).historyLimit,20);if(plan!=='free')await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${id}';`);users.push({sdk,id,plan});}
 const [free,pro,business]=users;
 for(const vector of vectors){
  const snapshot=math.validateHistoricalCalculationSnapshot(math.generate(vector.catalogId,vector.input));assert.equal(snapshot.calculatorSlug,vector.slug);assert.equal(snapshot.calculatorVersion,1);assert.equal(snapshot.output.result,vector.expected);assert.equal(math.verifyRegisteredSnapshot(snapshot).engineId,vector.engineId);
  const histories=new Map();
  for(const user of users){const id=randomUUID();assert.deepEqual(await math.saveHistoryAtomically(user.sdk,id,snapshot,user.id),{id});histories.set(user.plan,id);const row=await ok(user.sdk.from('calculation_history').select('*').eq('id',id).single());assert.deepEqual(math.verifyRegisteredSnapshot(math.readPersistedCalculationSnapshot(row)).snapshot,snapshot);}
  for(const user of [pro,business]){
   const foreign=user===pro?business:pro;
   const project=await ok(user.sdk.from('calculation_projects').insert({user_id:user.id,name:'Exact '+vector.slug}).select().single());
   const args={p_expected_owner_id:user.id,p_request_id:randomUUID(),p_project_id:project.id,p_history_id:histories.get(user.plan),p_name:'Immutable '+vector.slug};
   const replies=await Promise.all([user.sdk.rpc('save_project_scenario_atomic',args),user.sdk.rpc('save_project_scenario_atomic',args)]);for(const reply of replies){assert.equal(reply.error,null);assert.equal(reply.data,args.p_request_id);}
   assert.equal(await db.sql(`SELECT count(*) FROM public.saved_scenarios WHERE id='${args.p_request_id}';`),'1');
   const reopen=async()=>math.verifyRegisteredSnapshot(math.readPersistedCalculationSnapshot(await ok(user.sdk.from('saved_scenarios').select('*').eq('id',args.p_request_id).single()))).snapshot;
   assert.deepEqual(await reopen(),snapshot);
   await denied(user.sdk.rpc('save_project_scenario_atomic',{...args,p_name:'Conflicting retry'}),/SCENARIO_REQUEST_CONFLICT/);
   await denied(user.sdk.from('saved_scenarios').update({output_data:{result:999}}).eq('id',args.p_request_id),/SCENARIO_SNAPSHOT_IMMUTABLE/);
   await denied(foreign.sdk.rpc('save_project_scenario_atomic',{...args,p_request_id:randomUUID(),p_expected_owner_id:foreign.id}),/SCENARIO_WRITE_REJECTED/);
   await denied(foreign.sdk.rpc('save_project_scenario_atomic',args),/SCENARIO_WRITE_REJECTED/);
   assert.equal(await ok(foreign.sdk.from('saved_scenarios').select('id').eq('id',args.p_request_id).maybeSingle()),null);
   assert.deepEqual(await ok(foreign.sdk.from('saved_scenarios').update({name:'Foreign overwrite'}).eq('id',args.p_request_id).select()),[]);
   await denied(free.sdk.rpc('save_project_scenario_atomic',{...args,p_expected_owner_id:free.id,p_request_id:randomUUID()}));
   assert.equal(await ok(free.sdk.from('saved_scenarios').select('id').eq('id',args.p_request_id).maybeSingle()),null);
   assert.deepEqual(await reopen(),snapshot);
   artifacts.push({catalogId:vector.catalogId,engineId:vector.engineId,plan:user.plan,scenarioId:args.p_request_id,historyId:args.p_history_id,snapshot,sha256:createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')});
   user.lastArgs=args;user.lastSnapshot=snapshot;
   pass(`#${vector.catalogId} ${user.plan}: concurrent exact retry one row, immutable replay, conflicting retry and foreign read/update/copy denied`);
  }
 }
 for(const user of [pro,business]){
  await db.sql(`UPDATE public.profiles SET plan='free' WHERE id='${user.id}';`);
  for(const artifact of artifacts.filter(x=>x.plan===user.plan)){
   const args={...user.lastArgs,p_project_id:(await ok(user.sdk.from('saved_scenarios').select('project_id').eq('id',artifact.scenarioId).single())).project_id,p_history_id:artifact.historyId,p_request_id:randomUUID()};
   await denied(user.sdk.rpc('save_project_scenario_atomic',args),/SCENARIO_PLAN_REQUIRED/);
   const row=await ok(user.sdk.from('saved_scenarios').select('*').eq('id',artifact.scenarioId).single());assert.deepEqual(math.verifyRegisteredSnapshot(math.readPersistedCalculationSnapshot(row)).snapshot,artifact.snapshot);
  }
  pass(`${user.plan} downgraded to Free: new #432/#440 scenario denied, existing immutable snapshots readable`);
 }
 const sources=[];for(const file of [...new Set(['tests/acceptance-closure-20261108/first-two-auth.mjs','tests/critical440-auth/adapter.ts','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs',...Object.keys(bundled.metafile.inputs)])].sort())sources.push({path:file,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});
 await writeFile(directory+'/first-two-auth-receipt.json',JSON.stringify({passed:true,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),checks,artifacts,negativeReceipts,sources,provenance:db.provenance,requests:db.requests,releaseHold:true,productionWrites:false,newApproval:false,limits:['Disposable internal Docker repository candidate schema; production equivalence UNKNOWN','Genuine GoTrue JWT/Supabase SDK/PostgREST/PG17.6 and actual persistence/replay helpers; not Next server-action/browser acceptance','Privileged local entitlement setup; no billing-provider acceptance','Retains prior browser/export/source evidence; no new competent approval, canonical adoption, certification or publication']},null,2)+'\n');
}catch(e){await writeFile(directory+'/first-two-auth-failure.json',JSON.stringify({checks,error:e.stack,provenance:db?.provenance},null,2));throw e;}finally{await db?.close();await rm(temporary,{recursive:true,force:true});}
