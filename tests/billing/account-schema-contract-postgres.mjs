// Only invoked with a disposable database adapter. Uses real migrations, never production credentials.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ACCOUNT_SCHEMA_PREFLIGHT_SQL, assessAccountSchemaPreflight, runAccountSchemaPreflight } from './account-schema-preflight.mjs';

export async function verifyAccountSchemaContract(sql) {
  await sql(`CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated;`);
  for (const file of ['001_b3_accounts.sql','002_b4_billing.sql','009_country_preferences.sql','029_account_rls_auth_initplan.sql','038_client_account_billing_privileges.sql']) {
    await sql(await readFile(`supabase/migrations/${file}`, 'utf8'));
  }
  const query = `SELECT row_to_json(p) FROM (${ACCOUNT_SCHEMA_PREFLIGHT_SQL}) p;`;
  const read = async prefix => JSON.parse(await sql(`${prefix ?? ''}${query}`));
  const compatible = await read();
  assert.equal(assessAccountSchemaPreflight(compatible,'recorded').ready,true,'canonical migrations must pass');
  let count=1;
  const cases = [
    ['wrong type', 'ALTER TABLE public.profiles ALTER COLUMN display_name TYPE integer USING NULL;'],
    ['wrong nullability', 'ALTER TABLE public.user_preferences ALTER COLUMN country_code SET NOT NULL;'],
    ['wrong default', "ALTER TABLE public.user_preferences ALTER COLUMN country_code SET DEFAULT 'US';"],
    ['missing column', 'ALTER TABLE public.user_preferences DROP COLUMN country_code;'],
    ['missing constraint', 'ALTER TABLE public.user_preferences DROP CONSTRAINT user_preferences_country_code_check;'],
    ['unvalidated constraint', "ALTER TABLE public.user_preferences DROP CONSTRAINT user_preferences_country_code_check; ALTER TABLE public.user_preferences ADD CHECK(country_code IS NULL OR country_code IN ('IN','US','GB','CA','AU')) NOT VALID;"],
    ['wrong constraint', "ALTER TABLE public.user_preferences DROP CONSTRAINT user_preferences_country_code_check; ALTER TABLE public.user_preferences ADD CHECK(country_code IS NULL OR country_code='US');"],
    ['missing ownership FK', 'ALTER TABLE public.user_preferences DROP CONSTRAINT user_preferences_user_id_fkey;'],
    ['missing primary key', 'ALTER TABLE public.user_preferences DROP CONSTRAINT user_preferences_pkey;'],
    ['disabled RLS', 'ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;'],
    ['permissive extra policy', 'CREATE POLICY unsafe_extra ON public.user_preferences FOR ALL USING(true) WITH CHECK(true);'],
    ['wrong owner policy', 'ALTER POLICY preferences_update_own ON public.user_preferences USING(true) WITH CHECK(true);'],
    ['missing required privilege', 'REVOKE UPDATE ON public.user_preferences FROM authenticated;'],
    ['unsafe anon column privilege', 'GRANT SELECT(country_code) ON public.user_preferences TO anon;'],
    ['unsafe plan update', 'GRANT UPDATE(plan) ON public.profiles TO authenticated;'],
    ['unsafe truncate', 'GRANT TRUNCATE ON public.user_preferences TO authenticated;'],
    ['inherited privilege', 'CREATE ROLE unsafe_account_writer; GRANT TRUNCATE ON public.profiles TO unsafe_account_writer; GRANT unsafe_account_writer TO authenticated;'],
    ['set-role only membership', 'CREATE ROLE unsafe_set_role NOINHERIT; GRANT postgres TO unsafe_set_role; GRANT unsafe_set_role TO authenticated;'],
    ['unsafe schema CREATE', 'GRANT CREATE ON SCHEMA public TO authenticated;'],
    ['missing helper privilege', 'REVOKE EXECUTE ON FUNCTION auth.uid() FROM PUBLIC,authenticated;'],
    ['client bypass RLS', 'ALTER ROLE authenticated BYPASSRLS;'],
    ['missing table', 'DROP TABLE public.user_preferences;']
  ];
  for (const [label, mutation] of cases) {
    const row = JSON.parse(await sql(`BEGIN; ${mutation} ${query} ROLLBACK;`));
    assert.equal(assessAccountSchemaPreflight(row,'recorded').ready,false,label);
    count++;
  }
  // A metadata reader without account-table visibility cannot attest the contract.
  await sql('CREATE ROLE account_metadata_denied;');
  assert.equal(assessAccountSchemaPreflight(await read('SET ROLE account_metadata_denied;'),'recorded').ready,false);
  count++;
  let denied = false;
  const inaccessible = await runAccountSchemaPreflight(async queryText => {
    try {
      return JSON.parse(await sql(`BEGIN; REVOKE SELECT ON pg_catalog.pg_attribute FROM PUBLIC; SET ROLE authenticated; SELECT row_to_json(p) FROM (${queryText}) p; ROLLBACK;`));
    } catch (error) {
      assert.match(error.message,/permission denied/);
      denied = true;
      throw error;
    }
  },'recorded');
  assert.equal(denied,true,'must exercise an actual PostgreSQL permission denial');
  assert.equal(inaccessible.ready,false);
  assert.deepEqual(inaccessible.blockers,['account contract metadata query failed or was denied']);
  count++;
  console.log(`PASS account schema contract: ${count} compatible/drift/permission cases`);
  return compatible;
}
