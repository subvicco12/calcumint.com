// Disposable PostgreSQL17.6 only. Optional authentic fixture is a local, SHA-bound owner artifact,
// never committed here. Default CI lane uses repository DDL plus captured broad-default shape.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash,randomUUID} from 'node:crypto';
import {buildAuthenticUpgradeReview} from '../../scripts/build-authentic-upgrade-review.mjs';
import {ACCOUNT_SCHEMA_PREFLIGHT_SQL,assessAccountSchemaPreflight} from './account-schema-preflight.mjs';
const image='postgres:17.6-alpine@sha256:ef257d85f76e48da1c64832459b59fcaba1a4dac97bf5d7450c77753542eee94';
const name=`calcumint-authentic-security-${randomUUID()}`;
const env={...process.env};for(const k of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[k];
const docker=(args,input='')=>execFileSync('docker',['--host=unix:///var/run/docker.sock',...args],{env,input,encoding:'utf8',stdio:['pipe','pipe','pipe'],timeout:30000}).trim();
const sql=q=>docker(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],q);
const read=p=>readFileSync(p,'utf8');
const unguard=s=>{
 const pattern=/DO (\$[a-z_]*\$) BEGIN\s*RAISE EXCEPTION[\s\S]*?END \1;/i;
 assert.match(s,pattern,'one review guard must be present');return s.replace(pattern,'-- disposable-only guard removal');
};
const fixture=process.argv.indexOf('--fixture');
let created=false,count=0;
const test=(label,fn)=>{fn();count++;console.log(`PASS ${label}`);};
const denied=q=>assert.throws(()=>sql(q),error=>/permission denied|not authorized|owner|HISTORY_WRITE_REJECTED/i.test(error.stderr?.toString()??error.message));
try{
 docker(['run','-d','--rm','--pull=never','--name',name,'--network','none','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);created=true;
 for(let n=0;;n++){try{sql('SELECT 1');break;}catch(error){if(n>=100)throw error;await new Promise(r=>setTimeout(r,100));}}
 assert.equal(sql('SHOW server_version;').split(' ')[0],'17.6');
 if(fixture>=0){
  const text=read(process.argv[fixture+1]);const expected=process.argv[process.argv.indexOf('--sha256')+1];
  assert.match(expected??'',/^[a-f0-9]{64}$/);assert.equal(createHash('sha256').update(text).digest('hex'),expected);
  sql(text);console.log('LANE authentic public metadata; synthetic auth/platform, empty data, not production');
 }else{
  sql(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}');CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$SELECT nullif(current_setting('request.jwt.claim.role',true),'')$$;GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon,authenticated,service_role;ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon,authenticated,service_role;`);
  const inventory=JSON.parse(read('docs/audits/migration-contract-2026-10-20/inventory.json'));
  for(const file of inventory.candidateSequence){
   if(['009_country_preferences.sql','038_client_account_billing_privileges.sql','032_atomic_reviewer_qa_audit.sql','033_atomic_reviewer_assignment_audit.sql','034_atomic_lifecycle_transition_audit.sql','035_atomic_catalog_creation.sql'].includes(file))continue;
   if(file==='011_b8_free_save_quotas.sql'){sql(unguard(read('docs/architecture/proposals/20261020-v1-legacy-save-quota-repair.sql')));continue;}
   sql(read('supabase/migrations/'+file));
  }
  // Actual observed prerequisite mismatch, not a production change.
  sql('GRANT EXECUTE ON FUNCTION public.org_role(uuid) TO authenticated,service_role;');
  console.log('LANE repository fresh model; broad defaults modeled, not authentic production');
 }
 const before=sql(`SELECT jsonb_agg(jsonb_build_array(c.relname,c.relacl::text,c.relrowsecurity) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p');`);
 const security=read('docs/architecture/proposals/20261021-v1-authentic-account-security.sql');
 test('intact security guard refuses without ACL changes',()=>{assert.throws(()=>sql(security));assert.equal(sql(`SELECT jsonb_agg(jsonb_build_array(c.relname,c.relacl::text,c.relrowsecurity) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p');`),before);});
 const bundle=unguard(buildAuthenticUpgradeReview().sql);
 test('composed upgrade validates postconditions and rolls back all constituent groups',()=>{
  assert.throws(()=>sql(bundle.replace(/COMMIT;\s*$/, 'SELECT public.inject_missing_failure();COMMIT;')));
  assert.equal(sql("SELECT to_regprocedure('public.atomic_account_plan(uuid)') IS NULL;"),'t');
  sql(bundle.replace(/COMMIT;\s*$/,'ROLLBACK;'));
  assert.equal(sql("SELECT to_regprocedure('public.atomic_account_plan(uuid)') IS NULL;"),'t');
 });
 const country=read('supabase/migrations/009_country_preferences.sql');sql(country);
 test('late composed-security failure restores original grants',()=>{assert.throws(()=>sql(unguard(security).replace('COMMIT;','SELECT public.inject_missing_failure();COMMIT;')));assert.equal(sql("SELECT has_function_privilege('authenticated','public.org_role(uuid)','EXECUTE');"),'t');});
 sql(unguard(security));
 test('all public client TRUNCATE paths denied',()=>{assert.equal(sql("SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p') AND (has_table_privilege('anon',c.oid,'TRUNCATE') OR has_table_privilege('authenticated',c.oid,'TRUNCATE'));"),'0');for(const role of ['anon','authenticated'])denied(`SET ROLE ${role};TRUNCATE public.favorites;`);});
 test('org_role internal, intended helpers still callable',()=>{denied("SET ROLE authenticated;SELECT public.org_role('00000000-0000-0000-0000-000000000001');");assert.equal(sql("SELECT has_function_privilege('authenticated','public.is_org_member(uuid)','EXECUTE') AND has_function_privilege('authenticated','public.has_org_role(uuid,text[])','EXECUTE');"),'t');});
 test('strict account contract passes modeled adoption',()=>{assert.equal(assessAccountSchemaPreflight(JSON.parse(sql(`SELECT row_to_json(p) FROM (${ACCOUNT_SCHEMA_PREFLIGHT_SQL}) p;`)),'verified-equivalent').ready,true);});
 for(const f of ['032_atomic_reviewer_qa_audit.sql','033_atomic_reviewer_assignment_audit.sql','034_atomic_lifecycle_transition_audit.sql','035_atomic_catalog_creation.sql'])sql(read('supabase/migrations/'+f));
 for(const f of ['ATOMIC-BILLING-TRANSACTION-PROPOSAL.md','ATOMIC-ACCOUNT-HISTORY.sql','ATOMIC-API-QUOTA.sql','ATOMIC-BATCH-JOB.sql','ATOMIC-EMBED-LEAD-CONSENT.sql']){
  let source=read('docs/architecture/proposals/'+f);if(f.endsWith('.md'))source=source.match(/```sql\n([\s\S]*?)\n```/)[1];sql(unguard(source));
 }
 test('broad creation defaults reproduce unintended service table and internal execution',()=>{assert.equal(sql("SELECT has_table_privilege('service_role','public.embed_lead_receipts','TRUNCATE') AND has_function_privilege('service_role','public.atomic_account_plan(uuid)','EXECUTE');"),'t');});
 const acl=read('docs/architecture/proposals/20261021-v1-atomic-object-privileges.sql');
 test('object ACL guard refuses; late failure rolls back prior revokes',()=>{assert.throws(()=>sql(acl));assert.throws(()=>sql(unguard(acl).replace('COMMIT;','SELECT public.inject_missing_failure();COMMIT;')));assert.equal(sql("SELECT has_function_privilege('service_role','public.atomic_account_plan(uuid)','EXECUTE');"),'t');});
 sql(unguard(acl));sql(unguard(acl));
 test('explicit object ACLs deny direct service receipt and internal calls',()=>{denied('SET ROLE service_role;TRUNCATE public.embed_lead_receipts;');denied("SET ROLE service_role;SELECT public.atomic_account_plan('00000000-0000-0000-0000-000000000001');");assert.equal(sql("SELECT has_function_privilege('service_role','public.read_billing_fence_v1(uuid)','EXECUTE') AND has_function_privilege('authenticated','public.save_calculation_history_atomic(uuid,text,integer,jsonb,jsonb,uuid)','EXECUTE');"),'t');});
 const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
 sql(`INSERT INTO auth.users(id) VALUES('${a}'),('${b}');INSERT INTO public.profiles(id,plan) VALUES('${a}','free'),('${b}','free') ON CONFLICT(id) DO NOTHING;`);
 const owner=q=>`SET ROLE authenticated;SET request.jwt.claim.sub='${a}';${q}`;
 const save=`SELECT public.save_calculation_history_atomic('${a}','slope-calculator',1,'{"rise":2,"run":4}','{"slope":0.5}','${a}');`;
 test('legitimate profile/preferences, immutable history replay and ownership survive',()=>{
  sql(owner(`UPDATE public.profiles SET display_name='Synthetic';INSERT INTO public.user_preferences(user_id) VALUES('${a}') ON CONFLICT(user_id) DO UPDATE SET locale='en';${save}${save}`));
  assert.equal(sql('SELECT count(*) FROM public.calculation_history;'),'1');
  denied(`SET ROLE authenticated;SET request.jwt.claim.sub='${b}';${save}`);
  denied(owner("UPDATE public.profiles SET plan='business';"));
 });
 test('inherited TRUNCATE causes full composed-security rollback',()=>{sql('CREATE ROLE fixture_unsafe_truncate;GRANT TRUNCATE ON public.favorites TO fixture_unsafe_truncate;GRANT fixture_unsafe_truncate TO authenticated;');assert.throws(()=>sql(unguard(security)));sql('REVOKE fixture_unsafe_truncate FROM authenticated;');});
 console.log(`${count} security-contract cases passed; no production access.`);
}finally{if(created)docker(['rm','-f',name]);}
