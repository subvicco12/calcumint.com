import assert from 'node:assert/strict';
import test from 'node:test';
import { validateCatalog, verifyDriftDetection } from './validate.mjs';
const roles=['anon','authenticated','service_role'];
function fixture() {
 const tables=['profiles','organizations','organization_members','custom_calculators','custom_calculator_versions','custom_calculator_runs','embed_configs','embed_leads','lead_consents','business_api_keys','api_usage_events','batch_calculation_jobs','batch_request_receipts','embed_lead_receipts'];
 const signatures={submit_verified_batch_job_v1:'uuid, text, uuid, uuid, uuid, jsonb, integer, jsonb, jsonb',read_verified_batch_job_v1:'uuid, text, uuid, uuid',capture_verified_embed_lead_v1:'text, uuid, uuid, uuid, integer, bigint, uuid, jsonb'};
 return {version:1,roles:roles.map(rolname=>({rolname,rolsuper:false,rolinherit:true,rolbypassrls:rolname==='service_role'})),tables:tables.map(name=>({name,rls:true,owner:'fixture_owner',constraints:[{type:'p'},{type:'f'}],policies:[{name:'fixture_policy'}],grants:roles.map(role=>({role,select:role!=='anon',insert:false,update:false,delete:false}))})),functions:Object.entries(signatures).map(([name,types])=>({name,arguments:types.split(', ').map((type,i)=>`p_${i} ${type}`).join(', '),result:'jsonb',definer:true,config:['search_path=pg_catalog, public'],owner:'fixture_owner',grants:roles.map(role=>({role,execute:role==='service_role'}))}))};
}
for(const lane of ['batch','embed','both']) {
 test(`${lane}: complete bounded evidence and tamper checks`,()=>{const catalog=fixture();validateCatalog(catalog,{lane});verifyDriftDetection(catalog,lane);});
 test(`${lane}: empty function grants fail closed`,()=>{const catalog=fixture();for(const f of catalog.functions)f.grants=[];assert.throws(()=>validateCatalog(catalog,{lane}));});
}
