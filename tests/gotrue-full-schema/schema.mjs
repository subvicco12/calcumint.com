import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {buildAuthenticUpgradeReview} from '../../scripts/build-authentic-upgrade-review.mjs';
const root=new URL('../../',import.meta.url);
export async function initializeFullSchema(sql){
 assert.equal(await sql('SELECT count(*) FROM auth.schema_migrations;'),'75');
 assert.equal(await sql("SELECT pg_get_userbyid(proowner) FROM pg_proc WHERE oid='auth.uid()'::regprocedure;"),'supabase_auth_admin');
 const sources=[];
 const read=async path=>{const raw=await readFile(new URL(path,root),'utf8');sources.push({path,sha256:createHash('sha256').update(raw).digest('hex')});return raw;};
 const unguard=raw=>{const pattern=/DO (\$[a-z_]*\$) BEGIN\s*RAISE EXCEPTION[\s\S]*?END \1;/i;assert.match(raw,pattern);return raw.replace(pattern,'-- isolated repository model only: reviewed guard removed');};
 // Deliberately reproduce the existing broad-default repository model, then adopt
 // the reviewed security bundle. This is not a hosted platform ACL assertion.
 await sql(`GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
 ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon,authenticated,service_role;
 ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon,authenticated,service_role;`);
 const inventory=JSON.parse(await read('docs/audits/migration-contract-2026-10-20/inventory.json'));
 const deferred=['009_country_preferences.sql','038_client_account_billing_privileges.sql','032_atomic_reviewer_qa_audit.sql','033_atomic_reviewer_assignment_audit.sql','034_atomic_lifecycle_transition_audit.sql','035_atomic_catalog_creation.sql'];
 const applied=[];
 for(const file of inventory.candidateSequence){
  if(deferred.includes(file))continue;
  if(file==='011_b8_free_save_quotas.sql'){
   await read('supabase/migrations/'+file); // hash retained broken historical source too
   await sql(unguard(await read('docs/architecture/proposals/20261020-v1-legacy-save-quota-repair.sql')));
   continue;
  }
  await sql(await read('supabase/migrations/'+file));applied.push(file);
 }
 await sql('GRANT EXECUTE ON FUNCTION public.org_role(uuid) TO authenticated,service_role;');
 const bundle=buildAuthenticUpgradeReview();
 // Ensure the unchanged review artifact remains guarded before local adoption.
 await assert.rejects(sql(bundle.sql));
 await sql(unguard(bundle.sql));
 return {scope:'Full repository candidate model plus locally adopted guarded review bundle; NOT raw historical-chain success or authentic captured production equivalence',authMigrationCount:75,authUidOwner:'supabase_auth_admin',schemaCoverage:JSON.parse(await sql("SELECT jsonb_build_object('tables',(SELECT jsonb_agg(tablename ORDER BY tablename) FROM pg_tables WHERE schemaname='public'),'policies',(SELECT count(*) FROM pg_policies WHERE schemaname='public'),'publicFunctions',(SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public'),'tablesWithoutRls',(SELECT jsonb_agg(c.relname ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' AND NOT c.relrowsecurity));")),appliedHistoricalSources:applied,deferredToBundle:deferred,legacy011:'unchanged broken source fingerprinted; existing missing-contract repair adopted only locally',sources,bundle:bundle.manifest,productionEquivalence:'UNKNOWN',captureAvailable:false};
}
