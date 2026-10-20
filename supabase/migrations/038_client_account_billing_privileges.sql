-- REVIEW REQUIRED: unapplied client-role least-privilege proposal.
-- Apply only after effective role memberships/grants and dependent clients are reviewed.
-- No RLS policies, service_role grants, table ownership or billing RPCs are changed.
BEGIN;

REVOKE ALL PRIVILEGES ON TABLE public.profiles, public.user_preferences,
  public.subscriptions, public.billing_customers FROM PUBLIC, anon, authenticated;

-- Table-level REVOKE does not remove pre-existing column ACLs. Clear those too,
-- including PUBLIC grants, before restoring the explicit client allowlist.
DO $$
DECLARE
  table_name text;
  columns_sql text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['profiles','user_preferences','subscriptions','billing_customers'] LOOP
    SELECT pg_catalog.string_agg(pg_catalog.quote_ident(a.attname), ', ' ORDER BY a.attnum)
      INTO columns_sql FROM pg_catalog.pg_attribute a
      WHERE a.attrelid = ('public.' || table_name)::pg_catalog.regclass
        AND a.attnum > 0 AND NOT a.attisdropped;
    EXECUTE pg_catalog.format('REVOKE ALL PRIVILEGES (%s) ON TABLE public.%I FROM PUBLIC, anon, authenticated', columns_sql, table_name);
  END LOOP;
END $$;

GRANT SELECT ON TABLE public.profiles, public.subscriptions, public.billing_customers,
  public.user_preferences TO authenticated;
GRANT UPDATE (display_name) ON TABLE public.profiles TO authenticated;
-- Account preferences use INSERT ... ON CONFLICT DO UPDATE, including user_id.
-- Existing owner WITH CHECK policies continue to prevent ownership reassignment.
GRANT INSERT, UPDATE ON TABLE public.user_preferences TO authenticated;

-- Inherited privileges cannot be removed by revoking direct grants. Abort the
-- transaction instead of silently reporting success if an inherited path remains.
DO $$
DECLARE
  table_name text;
  relation_oid oid;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['profiles','user_preferences','subscriptions','billing_customers'] LOOP
    relation_oid := ('public.' || table_name)::pg_catalog.regclass;
    IF pg_catalog.has_table_privilege('anon', relation_oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
      OR pg_catalog.has_any_column_privilege('anon', relation_oid, 'SELECT,INSERT,UPDATE,REFERENCES')
      OR pg_catalog.has_table_privilege('authenticated', relation_oid, 'DELETE,TRUNCATE,REFERENCES,TRIGGER')
      OR pg_catalog.has_any_column_privilege('authenticated', relation_oid, 'REFERENCES') THEN
      RAISE EXCEPTION 'Unexpected inherited client privileges on public.%: owner review required', table_name;
    END IF;
    IF table_name <> 'user_preferences' AND
      pg_catalog.has_any_column_privilege('authenticated', relation_oid, 'INSERT') THEN
      RAISE EXCEPTION 'Unexpected inherited client INSERT on public.%', table_name;
    END IF;
    IF table_name IN ('subscriptions','billing_customers') AND
      pg_catalog.has_any_column_privilege('authenticated', relation_oid, 'UPDATE') THEN
      RAISE EXCEPTION 'Unexpected inherited billing UPDATE on public.%', table_name;
    END IF;
    IF table_name = 'profiles' AND EXISTS (
      SELECT FROM pg_catalog.pg_attribute a WHERE a.attrelid = relation_oid
        AND a.attnum > 0 AND NOT a.attisdropped AND a.attname <> 'display_name'
        AND pg_catalog.has_column_privilege('authenticated', relation_oid, a.attnum, 'UPDATE')
    ) THEN
      RAISE EXCEPTION 'Unexpected inherited profile UPDATE: owner review required';
    END IF;
  END LOOP;
END $$;
COMMIT;
