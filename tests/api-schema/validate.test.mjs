import assert from 'node:assert/strict';
import test from 'node:test';
import { validateCatalog, verifyDriftDetection } from './validate.mjs';
const roles=['anon','authenticated','service_role'];
function fixture() {
 const tables=['profiles','organizations','organization_members','custom_calculators','custom_calculator_versions','custom_calculator_runs','embed_configs','embed_leads','lead_consents','business_api_keys','api_usage_events','batch_calculation_jobs','batch_request_receipts','embed_lead_receipts'];
 const signatures={submit_verified_batch_job_v1:'p_api_key_id uuid, p_key_hash text, p_organization_id uuid, p_request_id uuid, p_calculator_id uuid, p_input_rows jsonb, p_version integer, p_definition jsonb, p_output_rows jsonb',read_verified_batch_job_v1:'p_api_key_id uuid, p_key_hash text, p_organization_id uuid, p_request_id uuid',capture_verified_embed_lead_v1:'p_public_key text, p_config_id uuid, p_organization_id uuid, p_calculator_id uuid, p_version integer, p_expires_at bigint, p_request_id uuid, p_payload jsonb'};
 return {version:1,roles:roles.map(rolname=>({rolname,rolsuper:false,rolinherit:true,rolbypassrls:rolname==='service_role'})),tables:tables.map(name=>({name,rls:true,owner:'fixture_owner',constraints:[{type:'p'},{type:'f'}],policies:[{name:'fixture_policy'}],grants:roles.map(role=>({role,select:role!=='anon',insert:false,update:false,delete:false}))})),functions:Object.entries(signatures).map(([name,types])=>({name,arguments:types,result:'jsonb',definer:true,config:['search_path=pg_catalog, public'],owner:'fixture_owner',grants:roles.map(role=>({role,execute:role==='service_role'}))}))};
}
for(const lane of ['batch','embed','both']) {
 test(`${lane}: complete bounded evidence and tamper checks`,()=>{const catalog=fixture();validateCatalog(catalog,{lane});verifyDriftDetection(catalog,lane);});
 test(`${lane}: renamed RPC parameters fail closed`,()=>{const catalog=fixture();for(const f of catalog.functions)f.arguments=f.arguments.replace(/^\w+ /,'p_wrong ');assert.throws(()=>validateCatalog(catalog,{lane}));});
 test(`${lane}: empty function grants fail closed`,()=>{const catalog=fixture();for(const f of catalog.functions)f.grants=[];assert.throws(()=>validateCatalog(catalog,{lane}));});
}
