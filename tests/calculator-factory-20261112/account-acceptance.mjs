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
const artifacts=path.resolve(process.env.FACTORY_ACCOUNT_ARTIFACTS||'/tmp/calculator-factory-account');
await mkdir(artifacts,{recursive:true});
const cases=[
 [208,'percentage-change-calculator',{old:100,next:125}],
 [209,'percentage-increase-calculator',{value:100,percent:20}],
 [210,'percentage-decrease-calculator',{value:100,percent:20}],
 [211,'ratio-calculator',{a:12,b:18}],
 [212,'proportion-calculator',{a:3,b:5}],
 [215,'fraction-to-decimal-calculator',{numerator:3,denominator:4}],
 [216,'average-two-numbers-calculator',{a:10,b:20}],
 [218,'square-calculator',{x:12}],[219,'cube-calculator',{x:5}],[220,'square-root-calculator',{x:144}],
 [423,'length-converter',{value:1,fromUnit:'mi',toUnit:'km'}],
 [424,'area-converter',{value:1,fromUnit:'acre',toUnit:'m2'}],
 [425,'volume-converter',{value:1,fromUnit:'l',toUnit:'ml'}],
 [427,'temperature-converter',{value:0,fromUnit:'c',toUnit:'f'}],
 [428,'speed-converter',{value:36,fromUnit:'km_h',toUnit:'m_s'}],
 [430,'energy-converter',{value:1,fromUnit:'kwh',toUnit:'mj'}],
 [431,'power-converter',{value:1,fromUnit:'kw',toUnit:'w'}],
 [432,'time-converter',{value:2,fromUnit:'h',toUnit:'min'}],
 [433,'angle-converter',{value:180,fromUnit:'deg',toUnit:'rad'}],
 [434,'data-storage-converter',{value:1,fromUnit:'GiB',toUnit:'MiB'}],
 [438,'force-converter',{value:1,fromUnit:'kn',toUnit:'n'}],
 [440,'frequency-converter',{value:2.4,fromUnit:'ghz',toUnit:'mhz'}],
].map(([catalogId,slug,input])=>({catalogId,slug,input}));
const sha=x=>createHash('sha256').update(x).digest('hex');
const producerSources={};for(const p of ['tests/calculator-factory-20261112/account-acceptance.mjs','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs'])producerSources[p]=sha(await readFile(new URL('../../'+p,import.meta.url)));
const bundle=path.join(artifacts,'factory-registry.mjs');
await build({entryPoints:[path.join(sourceRoot,'src/lib/calculator-factory/registry.ts')],outfile:bundle,bundle:true,platform:'node',format:'esm',alias:{'@':path.join(sourceRoot,'src')},banner:{js:"import {createRequire} from 'node:module';const require=createRequire(import.meta.url);"},logLevel:'silent'});
const {calculateFactory}=await import(pathToFileURL(bundle));assert.equal(typeof calculateFactory,'function');
const restoreBundle=path.join(artifacts,'factory-business-restore.mjs');
await build({entryPoints:[path.join(sourceRoot,'src/lib/calculator-factory/completion/business.ts')],outfile:restoreBundle,bundle:true,platform:'node',format:'esm',alias:{'@':path.join(sourceRoot,'src')},banner:{js:"import {createRequire} from 'node:module';const require=createRequire(import.meta.url);"},logLevel:'silent'});
const {verifyFactoryStoredSnapshot}=await import(pathToFileURL(restoreBundle));
const sourceHashes={};for(const p of ['src/lib/calculator-factory/registry.ts','src/lib/calculator-factory/completion/business.ts','src/calculators/launch-portfolio.ts','src/calculators/conversion/catalog-batch-1.ts','src/calculators/conversion/catalog-batch-2.ts','src/calculators/conversion/catalog-batch-3.ts'])sourceHashes[p]=sha(await readFile(path.join(sourceRoot,p)));
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
   assert.equal(snapshot.calculatorSlug,c.slug);assert.equal(snapshot.calculatorVersion,1);assert.deepEqual(snapshot.input,c.input);assert(snapshot.output&&typeof snapshot.output==='object');
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
 assert.equal(observations.length,66);
 const receipt={passed:true,kind:'FACTORY_GENUINE_LOCAL_ACCOUNT_POSTGREST_ACCEPTANCE',sourceRoot,producerSources,sourceHashes,catalogIds:cases.map(c=>c.catalogId),observations,requests:db.requests,fixture:db.provenance,releaseHold:true,productionWrites:false,certificationGranted:false,publicationGranted:false,limitations:['Real disposable GoTrue/PostgREST/Postgres repository candidate schema with existing guarded review bundle locally adopted; production equivalence UNKNOWN.','Direct actual atomic RPC acceptance, not browser or Next server-action journey.','Server-trusted SQL persists actual current engine snapshots; this does not prove SQL recomputes mathematics.','Plans assigned to disposable test profiles; same calculateFactory current engine called for each plan, no billing acceptance.','No synthetic public publication, certification or reviewer facts.']};
 await writeFile(path.join(artifacts,'account-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
}finally{if(db)await db.close();}
