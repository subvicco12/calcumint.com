import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';

for (const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGPORT','PGUSER','PGPASSWORD','PGDATABASE']) {
  assert(!process.env[key], 'External database selector refused: ' + key);
}
const root = 'docs/architecture/proposals/';
const proposals = [
  ['API-RLS-HELPER-EXECUTE.sql', /PROPOSAL ONLY: isolated helper acceptance/],
  ['MEMBERSHIP-ADMIN-FENCING.sql', /PROPOSAL ONLY: isolated membership acceptance/],
  ['20261021-v1-authentic-account-security.sql', /UNAPPLIED_AUTHENTIC_SCHEMA_V1/],
];
const db = await startGoTrueFixture({
  initializeSchema: async sql => {
    for (const file of ['001_b3_accounts.sql','003_b5_business.sql']) {
      await sql(await readFile('supabase/migrations/' + file, 'utf8'));
    }
    return {scope:'Minimal repository schema, no held SQL activated'};
  },
});
try {
  const metadata = () => db.sql(`
    SELECT jsonb_build_object(
      'policies',(SELECT jsonb_agg(to_jsonb(p) ORDER BY policyname) FROM pg_policies p
         WHERE schemaname='public' AND tablename IN ('organizations','organization_members')),
      'triggers',(SELECT jsonb_agg(tgname ORDER BY tgname) FROM pg_trigger
         WHERE tgrelid IN ('public.organizations'::regclass,'public.organization_members'::regclass)),
      'helpers',(SELECT jsonb_agg(jsonb_build_array(p.oid::regprocedure::text,p.proacl) ORDER BY p.oid)
         FROM pg_proc p WHERE p.oid IN ('public.has_org_role(uuid,text[])'::regprocedure,
          'public.is_org_member(uuid)'::regprocedure,'public.org_role(uuid)'::regprocedure))
    );`);
  const before = await metadata();
  const refused = [];
  for (const [file, message] of proposals) {
    const sql = await readFile(root + file, 'utf8');
    await assert.rejects(db.sql(sql), message);
    assert.equal(await metadata(), before, file + ' must leave metadata unchanged');
    refused.push({file,sha256:createHash('sha256').update(sql).digest('hex')});
  }
  // Prove the two ACL conditions independently against effective privileges.
  // The grants below exist only in a rolled-back synthetic preflight.
  const prerequisites = await db.sql(`
    BEGIN;
    REVOKE EXECUTE ON FUNCTION public.org_role(uuid),public.has_org_role(uuid,text[]) FROM PUBLIC,authenticated;
    SELECT has_function_privilege('authenticated','public.has_org_role(uuid,text[])','EXECUTE'),
           has_function_privilege('authenticated','public.org_role(uuid)','EXECUTE');
    GRANT EXECUTE ON FUNCTION public.has_org_role(uuid,text[]) TO authenticated;
    SELECT has_function_privilege('authenticated','public.has_org_role(uuid,text[])','EXECUTE'),
           has_function_privilege('authenticated','public.org_role(uuid)','EXECUTE');
    GRANT EXECUTE ON FUNCTION public.org_role(uuid) TO PUBLIC;
    SELECT has_function_privilege('authenticated','public.has_org_role(uuid,text[])','EXECUTE'),
           has_function_privilege('authenticated','public.org_role(uuid)','EXECUTE');
    ROLLBACK;`);
  assert.equal(prerequisites,'f|f\nt|f\nt|t');
  assert.equal(await metadata(),before);
  console.log(JSON.stringify({
    passed:true, refused, unchangedMetadata:true,
    effectiveAclCases:['missing intended helper','intended helper only','internal helper inherited from PUBLIC'],
    fixtureImages:db.provenance.images, productionEquivalence:'UNKNOWN',
  },null,2));
} finally {
  await db.close();
}
