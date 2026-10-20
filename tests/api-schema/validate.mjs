import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
// This checks the bounded contract only. A pass cannot authorize adoption or
// attest a hosted environment; review unexpected additional grants separately.
const observedRoles=['anon','authenticated','service_role'];
function namedRows(rows,key,label,expected) {
 assert.ok(Array.isArray(rows),`${label} array required`);
 const names=rows.map(row=>{assert.ok(row&&typeof row==='object',`${label} row required`);assert.equal(typeof row[key],'string',`${label} name required`);assert.ok(row[key].trim(),`${label} nonempty name required`);return row[key];});
 assert.equal(new Set(names).size,names.length,`${label} duplicate names`);
 if(expected)assert.deepEqual([...names].sort(),[...expected].sort(),`${label} complete observed roles required`);
}
function ownerCategory(owner,label) {
 assert.equal(typeof owner,'string',`${label} owner string required`);
 assert.ok(owner.trim(),`${label} owner nonempty required`);
 assert.ok(!observedRoles.includes(owner),`${label} owner must be outside observed client/service roles`);
}
export function validateCatalog(catalog,{lane='both'}={}) {
 assert.ok(['both','batch','embed'].includes(lane),'unknown lane');
 assert.equal(catalog.version,1);
 namedRows(catalog.roles,'rolname','roles',observedRoles);
 namedRows(catalog.tables,'name','tables');
 assert.ok(Array.isArray(catalog.functions),'functions array required');
 for(const role of ['anon','authenticated','service_role']) {
  const actual=catalog.roles.find(r=>r.rolname===role);assert.ok(actual,`missing role ${role}`);
  assert.equal(typeof actual.rolinherit,'boolean',`${role} inherit boolean required`);
  assert.equal(actual.rolsuper,false,`${role} superuser`);
  assert.equal(actual.rolbypassrls,role==='service_role',`${role} BYPASSRLS`);
 }
 const tables=['profiles','organizations','organization_members','custom_calculators','custom_calculator_versions','custom_calculator_runs','embed_configs','embed_leads','lead_consents','business_api_keys','api_usage_events','batch_calculation_jobs'];
 const rpc=lane==='batch'?['submit_verified_batch_job_v1','read_verified_batch_job_v1']:lane==='embed'?['capture_verified_embed_lead_v1']:['submit_verified_batch_job_v1','read_verified_batch_job_v1','capture_verified_embed_lead_v1'];
 tables.push(...(lane==='batch'?['batch_request_receipts']:lane==='embed'?['embed_lead_receipts']:['batch_request_receipts','embed_lead_receipts']));
 for(const name of tables) {
  const table=catalog.tables.find(t=>t.name===name);assert.ok(table,`missing table ${name}`);
  ownerCategory(table.owner,name);
  assert.ok(Array.isArray(table.constraints),`${name} constraints array required`);
  assert.ok(Array.isArray(table.policies),`${name} policies array required`);
  namedRows(table.grants,'role',`${name} grants`,observedRoles);
  for(const grant of table.grants)for(const privilege of ['select','insert','update','delete'])assert.equal(typeof grant[privilege],'boolean',`${name} ${grant.role} ${privilege} boolean required`);
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
  assert.equal(typeof f.arguments,'string',`${name} arguments string required`);
  assert.equal(f.arguments.split(', ').map(arg=>arg.slice(arg.indexOf(' ')+1)).join(', '),types[name],`${name} argument types`);
  assert.ok(Array.isArray(f.config)&&f.config.every(value=>typeof value==='string'&&value.trim()),`${name} config strings required`);
  assert.ok(f.config.includes('search_path=pg_catalog, public'),`${name} search path`);
  ownerCategory(f.owner,name);
  namedRows(f.grants,'role',`${name} grants`,observedRoles);
  for(const grant of f.grants)assert.equal(typeof grant.execute,'boolean',`${name} ${grant.role} execute boolean required`);
  for(const grant of f.grants)assert.equal(grant.execute,grant.role==='service_role',`${name} ${grant.role} execute`);
 }
 return {status:'bounded catalog contract satisfied; environment provenance unverified',lane,tables:tables.length,functions:rpc.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
 const catalog=JSON.parse(await readFile(process.argv[2],'utf8'));
 console.log(validateCatalog(catalog,{lane:process.argv[3]??'both'}));
}

export function verifyDriftDetection(catalog,lane) {
 const rpc=c=>c.functions.find(f=>lane==='embed'?f.name==='capture_verified_embed_lead_v1':f.name==='read_verified_batch_job_v1');
 const mutations=[
  [c=>{c.tables.find(t=>t.name==='profiles').rls=false;},/profiles RLS/],
  [c=>{c.tables.find(t=>t.name==='custom_calculators').constraints=[];},/primary key/],
  [c=>{c.tables.find(t=>t.name==='lead_consents').policies=[];},/policies/],
  [c=>{rpc(c).config=['search_path=public'];},/search path/],
  [c=>{rpc(c).grants.find(g=>g.role==='anon').execute=true;},/anon execute/],
  [c=>{rpc(c).arguments='p_wrong uuid';},/argument types/],
  [c=>{rpc(c).grants=[];},/complete observed roles/],
  [c=>{rpc(c).grants=rpc(c).grants.filter(g=>g.role!=='anon');},/complete observed roles/],
  [c=>{rpc(c).grants=rpc(c).grants.filter(g=>g.role!=='authenticated');},/complete observed roles/],
  [c=>{rpc(c).grants.push({...rpc(c).grants[0]});},/duplicate names/],
  [c=>{rpc(c).grants[0].execute='false';},/boolean required/],
  [c=>{delete rpc(c).grants;},/array required/],
  [c=>{rpc(c).owner='';},/owner nonempty/],
  [c=>{rpc(c).owner=null;},/owner string/],
  [c=>{rpc(c).owner='anon';},/owner must be outside/],
  [c=>{rpc(c).config=null;},/config strings/],
  [c=>{rpc(c).config=[];},/search path/],
  [c=>{c.roles.pop();},/complete observed roles/],
  [c=>{c.roles.push({...c.roles[0]});},/duplicate names/],
  [c=>{c.roles[0].rolname='unexpected';},/complete observed roles/],
  [c=>{c.tables[0].grants=[];},/complete observed roles/],
  [c=>{c.tables[0].grants.pop();},/complete observed roles/],
  [c=>{c.tables[0].grants.push({...c.tables[0].grants[0]});},/duplicate names/],
  [c=>{c.tables[0].grants[0].select=null;},/boolean required/],
  [c=>{c.tables.push({...c.tables[0]});},/duplicate names/],

 ];
 for(const [mutate,error] of mutations) {const broken=structuredClone(catalog);mutate(broken);assert.throws(()=>validateCatalog(broken,{lane}),error);}
}
