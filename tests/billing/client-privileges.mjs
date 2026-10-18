// Invoked only inside the disposable harness, in a separate synthetic database.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
export async function verifyClientPrivileges(sql, atomicProposal) {
  const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002';
  const tables=['profiles','subscriptions','billing_customers','user_preferences'];
  await sql(`CREATE SCHEMA client_privilege_fixture; GRANT USAGE,CREATE ON SCHEMA client_privilege_fixture TO anon,authenticated;
    CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;`);
  for(const migration of ['001_b3_accounts.sql','002_b4_billing.sql','009_country_preferences.sql'])await sql(await readFile(`supabase/migrations/${migration}`,'utf8'));
  await sql(`INSERT INTO auth.users(id) VALUES('${a}'),('${b}');
    GRANT ALL ON public.profiles,public.subscriptions,public.billing_customers,public.user_preferences TO anon,authenticated,service_role;
    REVOKE UPDATE ON public.profiles FROM authenticated; GRANT UPDATE(display_name) ON public.profiles TO authenticated;
    GRANT INSERT(plan),REFERENCES(plan) ON public.profiles TO anon;
    GRANT UPDATE(plan) ON public.subscriptions TO authenticated;
    GRANT SELECT ON public.billing_customers TO PUBLIC;`);
  await sql(atomicProposal);
  const policies=await sql("SELECT json_agg(p ORDER BY tablename,policyname)::text FROM pg_policies p WHERE schemaname='public';");
  // Reproduce the RLS bypass without the proposed migration.
  await sql('BEGIN; SET LOCAL ROLE anon; TRUNCATE public.user_preferences; ROLLBACK;');
  console.log('PASS reproduced anon TRUNCATE despite enabled RLS (rolled back)');
  const migration=await readFile('supabase/migrations/038_client_account_billing_privileges.sql','utf8');
  await sql('CREATE ROLE fixture_inherited_writer; GRANT UPDATE ON public.subscriptions TO fixture_inherited_writer; GRANT fixture_inherited_writer TO authenticated;');
  await assert.rejects(sql(migration), /Unexpected inherited billing UPDATE/);
  assert.equal(await sql("SELECT has_table_privilege('anon','public.user_preferences','TRUNCATE');"),'t','failed migration rolls back all revokes');
  await sql('REVOKE fixture_inherited_writer FROM authenticated; REVOKE UPDATE ON public.subscriptions FROM fixture_inherited_writer; DROP ROLE fixture_inherited_writer;');
  await sql(migration);
  await sql(migration); // Reapplying must preserve the same least-privilege contract.
  const actor=(role,query)=>sql(`SET ROLE ${role}; SET request.jwt.claim.sub='${a}'; ${query}`);
  let count=0;
  const denied=async(query,pattern=/permission denied/)=>{await assert.rejects(query,pattern);count++;};
  await sql('CREATE FUNCTION public.fixture_client_trigger() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$;');
  for(const table of tables){
    assert.equal(await sql(`SELECT has_table_privilege('anon','public.${table}','SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') OR has_any_column_privilege('anon','public.${table}','SELECT,INSERT,UPDATE,REFERENCES');`),'f');
    for(const role of ['anon','authenticated']){
      for(const permission of ['TRUNCATE','TRIGGER','REFERENCES'])assert.equal(await sql(`SELECT has_table_privilege('${role}','public.${table}','${permission}');`),'f');
      await denied(actor(role,`TRUNCATE public.${table};`));
      await denied(actor(role,`CREATE TRIGGER denied_trigger AFTER INSERT ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.fixture_client_trigger();`));
      const key=table==='profiles'||table==='subscriptions'?'id':'user_id';
      await denied(actor(role,`CREATE TABLE client_privilege_fixture.denied_reference(owner uuid REFERENCES public.${table}(${key}));`));
    }
    for(const privilege of ['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER'])assert.equal(await sql(`SELECT has_table_privilege('service_role','public.${table}','${privilege}');`),'t');
  }
  await denied(actor('anon','SELECT * FROM public.profiles;'));
  await denied(actor('authenticated',"UPDATE public.profiles SET plan='business';"));
  await denied(actor('authenticated',`INSERT INTO public.profiles(id) VALUES('${a}');`));
  await denied(actor('authenticated','DELETE FROM public.profiles;'));
  await actor('authenticated',`UPDATE public.profiles SET display_name='My account' WHERE id='${a}';`);
  assert.equal(await sql(`SELECT display_name FROM public.profiles WHERE id='${a}';`),'My account');
  assert.equal(await actor('authenticated','SELECT count(*) FROM public.profiles;'),'1');
  await actor('authenticated',`UPDATE public.profiles SET display_name='wrong owner' WHERE id='${b}';`);
  assert.equal(await sql(`SELECT display_name IS NULL FROM public.profiles WHERE id='${b}';`),'t');
  for(const table of ['billing_customers','subscriptions']){
    for(const query of [`INSERT INTO public.${table}(user_id) VALUES('${a}');`,`UPDATE public.${table} SET user_id='${b}';`,`DELETE FROM public.${table};`])await denied(actor('authenticated',query));
  }
  await sql(`INSERT INTO public.billing_customers(user_id,paddle_customer_id) VALUES('${a}','ctm_a'),('${b}','ctm_b');
    INSERT INTO public.subscriptions(user_id,provider_subscription_id,plan,status) VALUES('${a}','sub_a','pro','active'),('${b}','sub_b','business','active');`);
  for(const table of ['billing_customers','subscriptions'])assert.equal(await actor('authenticated',`SELECT user_id FROM public.${table};`),a);
  // Uses the real application's upsert columns, including the conflict key.
  await actor('authenticated',`INSERT INTO public.user_preferences(user_id,locale,currency,unit_system,country_code,updated_at) VALUES('${a}','en-IN','INR','metric','IN',now()) ON CONFLICT(user_id) DO UPDATE SET user_id=excluded.user_id,locale=excluded.locale,currency=excluded.currency,unit_system=excluded.unit_system,country_code=excluded.country_code,updated_at=excluded.updated_at;`);
  assert.equal(await actor('authenticated','SELECT currency FROM public.user_preferences;'),'INR');
  await actor('authenticated',`UPDATE public.user_preferences SET currency='GBP' WHERE user_id='${b}';`);
  assert.equal(await sql(`SELECT currency FROM public.user_preferences WHERE user_id='${b}';`),'USD');
  await denied(actor('authenticated',`INSERT INTO public.user_preferences(user_id) VALUES('00000000-0000-0000-0000-000000000003');`),/row-level security/);
  await denied(actor('authenticated',`UPDATE public.user_preferences SET user_id='00000000-0000-0000-0000-000000000003' WHERE user_id='${a}';`),/row-level security/);
  await denied(actor('authenticated','DELETE FROM public.user_preferences;'));
  await sql("INSERT INTO auth.users(id) VALUES('00000000-0000-0000-0000-000000000003');");
  assert.equal(await sql("SELECT plan FROM public.profiles WHERE id='00000000-0000-0000-0000-000000000003';"),'free');
  assert.equal(await sql('SELECT count(*) FROM public.user_preferences;'),'3');
  assert.equal(await sql("SELECT json_agg(p ORDER BY tablename,policyname)::text FROM pg_policies p WHERE schemaname='public';"),policies);
  const event={event_id:'evt_privileges',event_type:'subscription.updated',data:{id:'sub_a',custom_data:{calcumint_user_id:a}}};
  const snapshot={id:'sub_a',customer_id:'ctm_a',status:'active',custom_data:{calcumint_user_id:a},items:[{price_id:'pri_pro'}]};
  const applied=await actor('service_role',`SELECT public.apply_verified_billing_event_v1('${a}',0,'${JSON.stringify(event)}'::jsonb,'${JSON.stringify(snapshot)}'::jsonb,'pri_pro','pro','monthly');`);
  assert.equal(JSON.parse(applied).status,'applied');
  assert.equal(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`),'pro');
  console.log(`PASS client privilege matrix, ${count} actual rejected statements, owner RLS, preference upsert, bootstrap, column ACLs and idempotent migration`);
}
