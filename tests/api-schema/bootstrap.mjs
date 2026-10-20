// Repo-owned dependencies are loaded whole, unchanged. Supabase's auth schema and
// platform ACLs are modeled explicitly here; they are not production attestations.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
export const member='00000000-0000-4000-8000-000000000004';
export async function bootstrapSchema(sql,{a,b}) {
 await sql(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;
 CREATE SCHEMA auth;
 CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}'::jsonb);
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claim.sub',true),''),nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid $$;
 GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;`);
 for(const migration of ['001_b3_accounts','003_b5_business','004_b6_builder','005_b7_delivery','006_b8_api_automation','029_account_rls_auth_initplan','032_business_builder_rls_auth_initplan']) {
  await sql(await readFile(`supabase/migrations/${migration}.sql`,'utf8'));
 }
 await sql(`INSERT INTO auth.users(id,email) VALUES('${a}','owner@example.invalid'),('${b}','outsider@example.invalid'),('${member}','member@example.invalid');
 UPDATE public.profiles SET plan='business' WHERE id='${a}';
 INSERT INTO public.organizations(id,name,slug,owner_user_id) VALUES('${a}','Synthetic one','synthetic-one','${a}'),('${b}','Synthetic two','synthetic-two','${b}');
 INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${a}','${a}','owner'),('${a}','${member}','member'),('${b}','${b}','owner');
 INSERT INTO public.custom_calculators(id,organization_id,name,slug,status,published_version,created_by) VALUES('${a}','${a}','Synthetic calculator','synthetic-calculator','published',1,'${a}');
 GRANT SELECT ON public.profiles,public.organizations,public.organization_members,public.custom_calculators,public.custom_calculator_versions,public.embed_configs,public.embed_leads,public.lead_consents,public.batch_calculation_jobs TO authenticated;`);
 // Assert the former org-id=user-id shortcut cannot satisfy this fixture.
 assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${member}';SELECT public.is_org_member('${a}') AND NOT public.has_org_role('${a}',ARRAY['owner','admin']);`),'t');
 assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${b}';SELECT public.is_org_member('${a}');`),'f');
 assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${member}';SELECT count(*) FROM public.custom_calculators;`),'1');
 assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${b}';SELECT count(*) FROM public.custom_calculators;`),'0');
 assert.equal(await sql(`SELECT count(*) FROM public.profiles;`),'3');
 await assert.rejects(sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${a}';UPDATE public.profiles SET plan='business';`),/permission denied/);
 console.log('PASS repo schema dependencies: auth trigger, membership helper, member/outsider builder RLS, profile plan ACL');
}

// Start a real owner transaction before the RPC, then await its committed state.
// Poll the server's wait event instead of assuming a client scheduling order.
export async function committedMutation(sql,mutation,attempt) {
 const label='schema-race-'+Math.random().toString(16).slice(2);
 const writer=sql(`SET application_name='${label}';BEGIN;${mutation};SELECT pg_sleep(2);COMMIT;`);
 try {
  for(let n=0;;n++) {
   if(await sql(`SELECT EXISTS(SELECT FROM pg_stat_activity WHERE application_name='${label}' AND wait_event='PgSleep');`)==='t')break;
   if(n===100)throw new Error('Owner mutation did not reach server barrier');
   await new Promise(resolve=>setTimeout(resolve,20));
  }
  await attempt();
 } finally {await writer;}
}

export async function verifyDefiners(sql,names) {
 for(const name of names) {
  const result=JSON.parse(await sql(`SELECT json_build_object('definer',prosecdef,'config',proconfig,'owner',pg_get_userbyid(proowner),'service',has_function_privilege('service_role',oid,'EXECUTE'),'anon',has_function_privilege('anon',oid,'EXECUTE'),'authenticated',has_function_privilege('authenticated',oid,'EXECUTE')) FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname='${name}';`));
  assert.equal(result.definer,true);assert.equal(result.owner,'postgres');
  assert.ok(result.config.some(value=>/^search_path=/.test(value)));
  assert.equal(result.service,true);assert.equal(result.anon,false);assert.equal(result.authenticated,false);
 }
 assert.equal(await sql("SELECT rolbypassrls FROM pg_roles WHERE rolname='service_role';"),'t');
 console.log('PASS effective RPC grants, definer ownership/search path and service BYPASSRLS');
}
