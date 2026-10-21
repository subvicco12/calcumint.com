// Read-only release preflight, not an application migration or permission repair.
// Expected descriptor is derived from actual001/009/029/038 account contracts.
import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

export const ACCOUNT_SCHEMA_PREFLIGHT_SQL = `
WITH targets AS (
  SELECT c.oid, c.relname, c.relkind, c.relrowsecurity, c.relforcerowsecurity, c.relowner
  FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='public' AND c.relname IN ('profiles','user_preferences')
), columns AS (
  SELECT t.relname, a.attname, a.attnum, a.attrelid,
    pg_catalog.format_type(a.atttypid,a.atttypmod) AS type,
    a.attnotnull AS not_null, a.attidentity AS identity, a.attgenerated AS generated,
    pg_catalog.pg_get_expr(d.adbin,d.adrelid) AS default_expression
  FROM targets t JOIN pg_catalog.pg_attribute a ON a.attrelid=t.oid
  LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum
  WHERE a.attnum>0 AND NOT a.attisdropped AND
    (t.relname='user_preferences' OR a.attname IN ('id','display_name','plan','created_at','updated_at'))
), client_roles AS (
  SELECT oid,rolname,rolsuper,rolbypassrls FROM pg_catalog.pg_roles
  WHERE rolname IN ('anon','authenticated')
)
SELECT
  EXISTS(SELECT FROM targets WHERE relname='user_preferences') AS preferences_table_present,
  EXISTS(SELECT FROM columns WHERE relname='user_preferences' AND attname='country_code') AS country_code_present,
  EXISTS(SELECT FROM columns WHERE relname='profiles' AND attname='display_name') AS display_name_present,
  (SELECT count(*)=2 AND bool_and(pg_catalog.has_table_privilege(current_user,oid,'SELECT')) FROM targets)
    AS metadata_accessible,
  pg_catalog.jsonb_build_object(
    'relations', (SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'table',relname,'kind',relkind,'rls',relrowsecurity,'force_rls',relforcerowsecurity,
      'owner',pg_catalog.pg_get_userbyid(relowner)) ORDER BY relname) FROM targets),
    'columns', (SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'table',relname,'column',attname,'type',type,'not_null',not_null,
      'identity',identity,'generated',generated,'default',default_expression)
      ORDER BY relname,attname) FROM columns),
    'constraints', (SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'table',t.relname,'type',c.contype,'validated',c.convalidated,
      'deferrable',c.condeferrable,'deferred',c.condeferred,
      'definition',pg_catalog.pg_get_constraintdef(c.oid,false))
      ORDER BY t.relname,c.contype,pg_catalog.pg_get_constraintdef(c.oid,false))
      FROM targets t JOIN pg_catalog.pg_constraint c ON c.conrelid=t.oid),
    'policies', (SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'table',t.relname,'command',p.polcmd,'permissive',p.polpermissive,
      'roles',(SELECT pg_catalog.jsonb_agg(CASE WHEN role_oid=0 THEN 'public' ELSE pg_catalog.pg_get_userbyid(role_oid) END ORDER BY role_oid)
        FROM pg_catalog.unnest(p.polroles) role_oid),
      'using',pg_catalog.pg_get_expr(p.polqual,p.polrelid),
      'check',pg_catalog.pg_get_expr(p.polwithcheck,p.polrelid))
      ORDER BY t.relname,p.polcmd,p.polname)
      FROM targets t JOIN pg_catalog.pg_policy p ON p.polrelid=t.oid),
    'roles', (SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'role',rolname,'superuser',rolsuper,'bypass_rls',rolbypassrls) ORDER BY rolname) FROM client_roles),
    'memberships', (SELECT COALESCE(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'role',r.rolname,'member_of',parent.rolname) ORDER BY r.rolname,parent.rolname),'[]'::jsonb)
      FROM client_roles r CROSS JOIN pg_catalog.pg_roles parent
      WHERE r.oid<>parent.oid AND pg_catalog.pg_has_role(r.oid,parent.oid,'MEMBER')),
    'table_privileges', (SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'role',r.rolname,'table',t.relname,'privilege',v.privilege,
      'allowed',pg_catalog.has_table_privilege(r.oid,t.oid,v.privilege)) ORDER BY r.rolname,t.relname,v.privilege)
      FROM client_roles r CROSS JOIN targets t CROSS JOIN
        (VALUES('SELECT'),('INSERT'),('UPDATE'),('DELETE'),('TRUNCATE'),('TRIGGER'),('REFERENCES')) v(privilege)),
    'column_privileges', (SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'role',r.rolname,'table',c.relname,'column',c.attname,'privilege',v.privilege,
      'allowed',pg_catalog.has_column_privilege(r.oid,c.attrelid,c.attnum,v.privilege))
      ORDER BY r.rolname,c.relname,c.attname,v.privilege)
      FROM client_roles r CROSS JOIN columns c CROSS JOIN
        (VALUES('SELECT'),('INSERT'),('UPDATE'),('REFERENCES')) v(privilege)),
    'helper_access', (SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'role',r.rolname,'public_usage',pg_catalog.has_schema_privilege(r.oid,'public','USAGE'),
      'public_create',pg_catalog.has_schema_privilege(r.oid,'public','CREATE'),
      'auth_usage',pg_catalog.has_schema_privilege(r.oid,n.oid,'USAGE'),
      'uid_execute',pg_catalog.has_function_privilege(r.oid,p.oid,'EXECUTE')) ORDER BY r.rolname)
      FROM client_roles r CROSS JOIN pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid=p.pronamespace
      WHERE n.nspname='auth' AND p.proname='uid' AND p.pronargs=0)
  ) AS contract
`;

const expectedContract = JSON.parse(readFileSync(new URL('./account-schema-contract.json', import.meta.url), 'utf8'));

export function assessAccountSchemaPreflight(row, migrationEvidence) {
  const blockers = [];
  if (row?.preferences_table_present !== true) blockers.push('public.user_preferences is absent or inaccessible');
  if (row?.country_code_present !== true) blockers.push('public.user_preferences.country_code is absent or inaccessible');
  if (row?.display_name_present !== true) blockers.push('public.profiles.display_name is absent or inaccessible');
  if (row?.metadata_accessible !== true) blockers.push('account contract metadata is inaccessible or incomplete');
  for (const section of Object.keys(expectedContract)) {
    if (!isDeepStrictEqual(row?.contract?.[section], expectedContract[section])) {
      blockers.push(`account contract mismatch or missing metadata: ${section}`);
    }
  }
  // Deployment evidence is independent of schema equivalence.
  if (migrationEvidence !== 'recorded' && migrationEvidence !== 'verified-equivalent') {
    blockers.push('country_preferences deployment history is unverified');
  }
  return { ready: blockers.length === 0, blockers };
}

// SQL/transport/permission errors must not be mistaken for empty compatible metadata.
// Adapter returns one plain row; raw database diagnostics are not exposed to users.
export async function runAccountSchemaPreflight(queryRow, migrationEvidence) {
  try {
    return assessAccountSchemaPreflight(await queryRow(ACCOUNT_SCHEMA_PREFLIGHT_SQL), migrationEvidence);
  } catch {
    return { ready: false, blockers: ['account contract metadata query failed or was denied'] };
  }
}
