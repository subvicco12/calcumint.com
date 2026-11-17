import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';

// Real local GoTrue/PostgREST/Postgres transport; no Next/server-action or public API claim.
const sourceRoot=path.resolve(process.env.FACTORY_SOURCE_ROOT||process.cwd());
const artifacts=path.resolve(process.env.FACTORY_ACCOUNT_ARTIFACTS||'/workspace/artifacts/milestone60-20261113/business-account');
await mkdir(artifacts,{recursive:true});
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External database selector refused: '+key);
assert(process.env.BUSINESS_CASES_INPUT,'Provide exact cohort JSON via BUSINESS_CASES_INPUT');
const cases=JSON.parse(await readFile(process.env.BUSINESS_CASES_INPUT,'utf8')).map(row=>({...row,catalogId:row.catalogId??row.id}));
assert(cases.length>0);assert.equal(new Set(cases.map(c=>c.catalogId)).size,cases.length);
for(const c of cases){assert(Number.isInteger(c.catalogId));assert.equal(c.version,1);assert.equal(typeof c.slug,'string');assert(c.input&&typeof c.input==='object');}
const sha=x=>createHash('sha256').update(x).digest('hex');
const producerSources={};for(const p of ['tests/milestone60-20261113/business-account.mjs','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs'])producerSources[p]=sha(await readFile(new URL('../../'+p,import.meta.url)));
const bundle=path.join(artifacts,'factory-registry.mjs');
const registryBuild=await build({metafile:true,entryPoints:[path.join(sourceRoot,'src/lib/calculator-factory/registry.ts')],outfile:bundle,bundle:true,platform:'node',format:'esm',alias:{'@':path.join(sourceRoot,'src')},banner:{js:"import {createRequire} from 'node:module';const require=createRequire(import.meta.url);"},logLevel:'silent'});
const {calculateFactory}=await import(pathToFileURL(bundle));assert.equal(typeof calculateFactory,'function');
const restoreBundle=path.join(artifacts,'factory-business-restore.mjs');
const restoreBuild=await build({metafile:true,entryPoints:[path.join(sourceRoot,'src/lib/calculator-factory/completion/business.ts')],outfile:restoreBundle,bundle:true,platform:'node',format:'esm',alias:{'@':path.join(sourceRoot,'src')},banner:{js:"import {createRequire} from 'node:module';const require=createRequire(import.meta.url);"},logLevel:'silent'});
const {verifyFactoryStoredSnapshot}=await import(pathToFileURL(restoreBundle));
const sourceHashes={};
for(const p of new Set([...Object.keys(registryBuild.metafile.inputs),...Object.keys(restoreBuild.metafile.inputs)])){
 const absolute=path.resolve(p);if(absolute.startsWith(sourceRoot+'/src/'))sourceHashes[path.relative(sourceRoot,absolute)]=sha(await readFile(absolute));
}
const casesSHA256=sha(await readFile(process.env.BUSINESS_CASES_INPUT));
const ok=async q=>{const r=await q;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const denied=async q=>{const r=await q;assert(r.error,'Expected authenticated boundary refusal');return{code:r.error.code,message:r.error.message};};
let db;const observations=[];
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 const client=()=>createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const signup=async plan=>{const sdk=client(),auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:'Local-'+randomUUID()}));assert(auth.session&&auth.user);await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';`);assert.equal((await ok(sdk.from('profiles').select('plan').single())).plan,plan);return{sdk,id:auth.user.id,plan};};
 const foreign=await signup('business'),paid={pro:await signup('pro'),business:await signup('business')};
 const anon=client();
 for(const c of cases){
  const parity=[];
  for(const plan of ['free','pro','business']){
   // Fresh Free identity preserves the actual20-row quota without overriding policy.
   const user=plan==='free'?await signup(plan):paid[plan];
   const snapshot=calculateFactory(c.catalogId,Object.fromEntries(Object.entries(c.input).map(([key,value])=>[key,String(value)])));
   assert.equal(snapshot.calculatorSlug,c.slug);assert.equal(snapshot.calculatorVersion,1);assert(snapshot.output&&typeof snapshot.output==='object');
   parity.push(snapshot.output);
   const id=randomUUID(),args={p_request_id:id,p_calculator_slug:c.slug,p_calculator_version:1,p_input_data:snapshot.input,p_output_data:snapshot.output,p_expected_owner_id:user.id};
   assert.equal(await ok(user.sdk.rpc('save_calculation_history_atomic',args)),id);
   assert.equal(await ok(user.sdk.rpc('save_calculation_history_atomic',args)),id);
   const row=await ok(user.sdk.from('calculation_history').select('*').eq('id',id).single());
   assert.deepEqual(row.input_data,snapshot.input);assert.deepEqual(row.output_data,snapshot.output);assert.equal(row.calculator_version,1);
   await denied(user.sdk.rpc('save_calculation_history_atomic',{...args,p_output_data:{tampered:true}}));
   await denied(foreign.sdk.rpc('save_calculation_history_atomic',args));
   assert.deepEqual(await ok(foreign.sdk.from('calculation_history').select('id').eq('id',id)),[]);
   assert.deepEqual(await ok(foreign.sdk.from('calculation_history').update({output_data:{tampered:true}}).eq('id',id).select('id')),[]);
   assert.deepEqual(await ok(foreign.sdk.from('calculation_history').delete().eq('id',id).select('id')),[]);
   await denied(anon.rpc('save_calculation_history_atomic',{...args,p_request_id:randomUUID()}));
   const scenarioId=randomUUID();let scenario;
   if(plan==='free'){
    await denied(user.sdk.from('calculation_projects').insert({user_id:user.id,name:'Denied Free project'}));
    await denied(user.sdk.rpc('save_project_scenario_atomic',{p_request_id:scenarioId,p_project_id:null,p_history_id:id,p_name:'Denied Free scenario',p_expected_owner_id:user.id}));
   }else{
    const project=await ok(user.sdk.from('calculation_projects').insert({user_id:user.id,name:'Factory '+c.catalogId}).select('id').single());
    const args2={p_request_id:scenarioId,p_project_id:project.id,p_history_id:id,p_name:'Exact registered snapshot',p_expected_owner_id:user.id};
    assert.equal(await ok(user.sdk.rpc('save_project_scenario_atomic',args2)),scenarioId);
    assert.equal(await ok(user.sdk.rpc('save_project_scenario_atomic',args2)),scenarioId);
    scenario=await ok(user.sdk.from('saved_scenarios').select('*').eq('id',scenarioId).single());assert.deepEqual(scenario.input_data,row.input_data);assert.deepEqual(scenario.output_data,row.output_data);
    const restored=verifyFactoryStoredSnapshot({calculatorSlug:scenario.calculator_slug,calculatorVersion:scenario.calculator_version,input:scenario.input_data,output:scenario.output_data});
    assert.equal(restored.catalogId,c.catalogId);assert.deepEqual(restored.snapshot,snapshot);
    await denied(foreign.sdk.rpc('save_project_scenario_atomic',args2));
    await denied(foreign.sdk.rpc('save_project_scenario_atomic',{...args2,p_request_id:randomUUID(),p_expected_owner_id:foreign.id}));
    assert.deepEqual(await ok(foreign.sdk.from('saved_scenarios').select('id').eq('id',scenarioId)),[]);
   }
   const unchanged=await ok(user.sdk.from('calculation_history').select('*').eq('id',id).single());assert.deepEqual(unchanged.output_data,snapshot.output);
   observations.push({catalogId:c.catalogId,slug:c.slug,version:1,plan,input:snapshot.input,output:snapshot.output,historyId:id,scenarioId:scenario?scenarioId:null,registeredRestoreVerified:!!scenario,realJWT:true,exactRetry:true,conflictDenied:true,foreignReadUpdateDeleteDenied:true,freeScenarioDenied:plan==='free'});
  }
  assert.deepEqual(parity[0],parity[1]);assert.deepEqual(parity[0],parity[2]);console.log('PASS '+c.catalogId+' genuine history/scenario/RLS and Free/Pro/Business mathematical parity');
 }
 assert.equal(observations.length,cases.length*3);
 const receipt={passed:true,kind:'MILESTONE60_GENUINE_LOCAL_ACCOUNT_POSTGREST_ACCEPTANCE',sourceRoot,producerSources,sourceHashes,casesSHA256,catalogIds:cases.map(c=>c.catalogId),observations,requests:db.requests,fixture:db.provenance,releaseHold:true,productionWrites:false,certificationGranted:false,publicationGranted:false,limitations:['Real disposable GoTrue/PostgREST/Postgres repository candidate schema with existing guarded review bundle locally adopted; production equivalence UNKNOWN.','Direct actual atomic RPC acceptance, not browser or Next server-action journey.','Server-trusted SQL persists actual current engine snapshots; this does not prove SQL recomputes mathematics.','Plans assigned to disposable test profiles; same calculateFactory current engine called for each plan, no billing acceptance.','No synthetic public publication, certification or reviewer facts.']};
 await writeFile(path.join(artifacts,'account-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
}finally{if(db)await db.close();}
