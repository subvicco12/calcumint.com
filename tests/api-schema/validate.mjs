import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
// This checks the bounded contract only. A pass cannot authorize adoption or
// attest a hosted environment; review unexpected additional grants separately.
export function validateCatalog(catalog,{lane='both'}={}) {
 assert.ok(['both','batch','embed'].includes(lane),'unknown lane');
 assert.equal(catalog.version,1);
 for(const role of ['anon','authenticated','service_role']) {
  const actual=catalog.roles.find(r=>r.rolname===role);assert.ok(actual,`missing role ${role}`);
  assert.equal(actual.rolsuper,false,`${role} superuser`);
  assert.equal(actual.rolbypassrls,role==='service_role',`${role} BYPASSRLS`);
 }
 const tables=['profiles','organizations','organization_members','custom_calculators','custom_calculator_versions','custom_calculator_runs','embed_configs','embed_leads','lead_consents','business_api_keys','api_usage_events','batch_calculation_jobs'];
 const rpc=lane==='batch'?['submit_verified_batch_job_v1','read_verified_batch_job_v1']:lane==='embed'?['capture_verified_embed_lead_v1']:['submit_verified_batch_job_v1','read_verified_batch_job_v1','capture_verified_embed_lead_v1'];
 tables.push(...(lane==='batch'?['batch_request_receipts']:lane==='embed'?['embed_lead_receipts']:['batch_request_receipts','embed_lead_receipts']));
 for(const name of tables) {
  const table=catalog.tables.find(t=>t.name===name);assert.ok(table,`missing table ${name}`);
  assert.equal(table.rls,true,`${name} RLS`);
  assert.ok(table.constraints.some(c=>c.type==='p'),`${name} primary key`);
  assert.ok(table.constraints.some(c=>c.type==='f'),`${name} foreign key`);
  if(!name.endsWith('receipts'))assert.ok(table.policies.length,`${name} policies`);
  assert.equal(table.grants.find(g=>g.role==='anon').select,false,`${name} anon SELECT`);
 }
 const types={submit_verified_batch_job_v1:'uuid, text, uuid, uuid, uuid, jsonb, integer, jsonb, jsonb',read_verified_batch_job_v1:'uuid, text, uuid, uuid',capture_verified_embed_lead_v1:'text, uuid, uuid, uuid, integer, bigint, uuid, jsonb'};
 for(const name of rpc) {
  const matches=catalog.functions.filter(f=>f.name===name);assert.equal(matches.length,1,`${name} unique signature`);
  const f=matches[0];assert.equal(f.definer,true,`${name} SECURITY DEFINER`);assert.equal(f.result,'jsonb');
  assert.equal(f.arguments.split(', ').map(arg=>arg.slice(arg.indexOf(' ')+1)).join(', '),types[name],`${name} argument types`);
  assert.ok(f.config.includes('search_path=pg_catalog, public'),`${name} search path`);
  assert.ok(!['anon','authenticated','service_role'].includes(f.owner),`${name} trusted owner`);
  for(const grant of f.grants)assert.equal(grant.execute,grant.role==='service_role',`${name} ${grant.role} execute`);
 }
 return {status:'bounded catalog contract satisfied; environment provenance unverified',lane,tables:tables.length,functions:rpc.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
 const catalog=JSON.parse(await readFile(process.argv[2],'utf8'));
 console.log(validateCatalog(catalog,{lane:process.argv[3]??'both'}));
}

export function verifyDriftDetection(catalog,lane) {
 const mutations=[
  [c=>{c.tables.find(t=>t.name==='profiles').rls=false;},/profiles RLS/],
  [c=>{c.tables.find(t=>t.name==='custom_calculators').constraints=[];},/primary key/],
  [c=>{c.tables.find(t=>t.name==='lead_consents').policies=[];},/policies/],
  [c=>{c.functions.find(f=>f.name.includes('verified')).config=['search_path=public'];},/search path/],
  [c=>{c.functions.find(f=>f.name.includes('verified')).grants.find(g=>g.role==='anon').execute=true;},/anon execute/],
  [c=>{c.functions.find(f=>f.name.includes('verified')).arguments='p_wrong uuid';},/argument types/],
 ];
 for(const [mutate,error] of mutations) {const broken=structuredClone(catalog);mutate(broken);assert.throws(()=>validateCatalog(broken,{lane}),error);}
}
