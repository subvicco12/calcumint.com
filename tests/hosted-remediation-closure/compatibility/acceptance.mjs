import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../../gotrue-runtime/fixture.mjs';
import {artifactDirectory} from '../../batch17-issuance/artifacts.mjs';
import {initializeCompatibility} from './initializer.mjs';
import {waitForCachedColumn} from '../../p0-publication-business/cache/readiness.mjs';
const artifacts=await artifactDirectory(process.env.COMPATIBILITY_ARTIFACTS),checks=[];
const pass=s=>{checks.push(s);console.log('PASS '+s);};
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const deny=async p=>{const r=await p;assert(r.error,'Expected denial');return r.error;};
const hashes={};for(const p of ['supabase/migrations/009_country_preferences.sql','supabase/migrations/038_client_account_billing_privileges.sql','docs/hosted-schema-remediation/effects-privileges.sql','tests/hosted-remediation-closure/compatibility/initializer.mjs','tests/hosted-remediation-closure/compatibility/acceptance.mjs','tests/hosted-remediation-closure/compatibility/scoped-descriptor.json','tests/hosted-remediation-closure/compatibility/fixture-manifest.json',...(process.env.HOSTED_DESCRIPTOR?[process.env.HOSTED_DESCRIPTOR]:[])])hashes[p]=createHash('sha256').update(await readFile(p)).digest('hex');
let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeCompatibility});
 const signup=async()=>{const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});const d=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:randomUUID()}));return {sdk,id:d.user.id};};
 const a=await signup(),b=await signup();
 const preference=(user,country='GB')=>({user_id:user.id,locale:'en-GB',currency:'GBP',unit_system:'metric',country_code:country,updated_at:new Date().toISOString()});
 const missing=await deny(a.sdk.from('user_preferences').select('country_code'));assert.equal(missing.code,'42703');
 await deny(a.sdk.from('user_preferences').upsert(preference(a),{onConflict:'user_id'}));pass('Captured account country read/upsert fails before 009');
 await db.sql('BEGIN;SET LOCAL ROLE anon;TRUNCATE public.user_preferences;ROLLBACK;');pass('Captured anonymous TRUNCATE succeeds despite RLS, rolled back');
 const guarded=await readFile('docs/hosted-schema-remediation/effects-privileges.sql','utf8');await assert.rejects(db.sql(guarded),/production execution is not authorized/);pass('Unchanged review artifact abort guard rejects execution');
 await db.sql(await readFile('supabase/migrations/009_country_preferences.sql','utf8'));
 const proposal=guarded.replace(/DO \$blocked\$[\s\S]*?\$blocked\$;/,'-- Guard bypass in disposable fixture only');
 const grants=()=>db.sql("SELECT json_agg(x ORDER BY x)::text FROM (SELECT table_name,privilege_type,is_grantable FROM information_schema.role_table_grants WHERE grantee='service_role' AND table_schema='public' AND table_name IN ('profiles','user_preferences','subscriptions','billing_customers')) x;");
 const before=await grants();
 await db.sql('CREATE ROLE compatibility_inherited_writer;GRANT UPDATE ON public.subscriptions TO compatibility_inherited_writer;GRANT compatibility_inherited_writer TO authenticated;');
 await assert.rejects(db.sql(proposal),/Unexpected inherited billing UPDATE/);assert.equal(await db.sql("SELECT has_table_privilege('anon','public.user_preferences','TRUNCATE');"),'t');
 await db.sql('REVOKE compatibility_inherited_writer FROM authenticated;DROP OWNED BY compatibility_inherited_writer;DROP ROLE compatibility_inherited_writer;');pass('Inherited grant forces transaction rollback preserving captured anonymous ACL');
 await db.sql(proposal);await db.sql(proposal);
 const {data:{session}}=await a.sdk.auth.getSession();assert(session?.access_token);
 const schemaHeaders={apikey:db.anonKey,Authorization:'Bearer '+session.access_token};
 // Demonstrate the CI defect before notifying: SQL projection sees the new
 // column, yet the mutation parser's cached OpenAPI definition is still old.
 await ok(a.sdk.from('user_preferences').select('country_code'));
 const stale=await fetch(db.url+'/rest/v1/',{headers:{...schemaHeaders,Accept:'application/openapi+json'},signal:AbortSignal.timeout(5000)});assert.equal(stale.status,200);
 assert(!Object.hasOwn((await stale.json()).definitions.user_preferences.properties,'country_code'));
 pass('Successful country SELECT does not prove mutation schema-cache readiness');
 await db.sql("NOTIFY pgrst, 'reload schema';");
 await waitForCachedColumn({url:db.url+'/rest/v1/',headers:schemaHeaders,relation:'user_preferences',column:'country_code'});
 assert.equal(await grants(),before);pass('Disposable 009 + guarded 038 adoption is idempotent and preserves service-role grants');
 await ok(a.sdk.from('user_preferences').upsert(preference(a),{onConflict:'user_id'}));
 await ok(a.sdk.from('user_preferences').upsert(preference(a,'IN'),{onConflict:'user_id'}));
 await db.sql(`INSERT INTO public.billing_customers(user_id,paddle_customer_id) VALUES('${a.id}','ctm_a'),('${b.id}','ctm_b');INSERT INTO public.subscriptions(user_id,provider_subscription_id,plan,status) VALUES('${a.id}','sub_a','pro','active'),('${b.id}','sub_b','business','active');`);
 for(const table of ['subscriptions','billing_customers'])assert.deepEqual((await ok(a.sdk.from(table).select('user_id'))).map(r=>r.user_id),[a.id]);
 pass('Captured billing SELECT policies retain own-row access and hide the other account');
 const rows=await ok(a.sdk.from('user_preferences').select('user_id,country_code'));assert.deepEqual(rows,[{user_id:a.id,country_code:'IN'}]);
 await deny(a.sdk.from('user_preferences').upsert(preference(b),{onConflict:'user_id'}));
 assert.deepEqual(await ok(a.sdk.from('user_preferences').update({currency:'INR'}).eq('user_id',b.id).select()),[]);
 assert.equal((await ok(b.sdk.from('user_preferences').select('currency')))[0].currency,'USD');
 assert.equal((await ok(a.sdk.from('profiles').select('id'))).length,1);pass('Real GoTrue authenticated PostgREST account read/upsert works; cross-user upsert denied and update hidden');
 await assert.rejects(db.sql('SET ROLE anon;TRUNCATE public.user_preferences;'),/permission denied/);
 await deny(a.sdk.from('profiles').update({plan:'business'}).eq('id',a.id));
 await deny(a.sdk.from('subscriptions').insert({user_id:a.id}));
 for(const table of ['profiles','user_preferences','subscriptions','billing_customers']){
  assert.equal(await db.sql(`SELECT has_table_privilege('anon','public.${table}','SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') OR has_any_column_privilege('anon','public.${table}','SELECT,INSERT,UPDATE,REFERENCES');`),'f');
 }
 pass('Anonymous table/column ACLs cleared, actual TRUNCATE rejected, authenticated plan and billing writes denied');
 const service=createClient(db.url,db.serviceKey,{auth:{persistSession:false}});assert.equal((await ok(service.from('profiles').select('id'))).length,2);pass('Service-role PostgREST still reads both synthetic accounts');
 await writeFile(artifacts+'/receipt.json',JSON.stringify({status:'PASS_RUNTIME_POLICY_APPROVAL_BLOCKED',checks,hashes,provenance:db.provenance,requests:db.requests,runtime:process.version,productionQueries:false,approval:false,blockers:['Owner approval for display_name UPDATE allowance','Owner approval and RLS disposition for billing_customers SELECT','Runtime compatibility is not authorization to apply 009 or 038']},null,2)+'\n');
}finally{if(db)await db.close();}
