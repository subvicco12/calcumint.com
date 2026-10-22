-- REVIEW ONLY. Versioned additive proposal; no production adoption authorized.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $proposal_guard$ BEGIN RAISE EXCEPTION 'UNAPPLIED_AUTHENTIC_SCHEMA_V1'; END $proposal_guard$;
-- Restore the existing intended internal helper boundary BEFORE membership prerequisites.
-- is_org_member/has_org_role are SECURITY DEFINER owner calls; no application org_role RPC caller exists.
REVOKE EXECUTE ON FUNCTION public.org_role(uuid) FROM PUBLIC, anon, authenticated, service_role;
-- SOURCE docs/architecture/proposals/API-RLS-HELPER-EXECUTE.sql
-- UNAPPLIED PROPOSAL: restore the two authenticated RLS entry points after 013.
-- Both SECURITY DEFINER helpers constrain membership to auth.uid(); org_role
-- remains owner-internal and receives no direct client EXECUTE grant.
-- Review hosted definitions, ownership, search paths and effective ACLs before adoption.

-- original review guard replaced by composed proposal guard
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid),
  public.has_org_role(uuid,text[]) TO authenticated;

-- SOURCE docs/architecture/proposals/MEMBERSHIP-ADMIN-FENCING.sql
-- UNAPPLIED proposal. Requires API-RLS-HELPER-EXECUTE.sql acceptance first.
-- Keeps owner transfer primitives; does not provide an atomic ownership transfer.

-- original review guard replaced by composed proposal guard
DO $$ BEGIN
 IF NOT has_function_privilege('authenticated','public.has_org_role(uuid,text[])','EXECUTE')
 OR has_function_privilege('authenticated','public.org_role(uuid)','EXECUTE') THEN
  RAISE EXCEPTION 'Membership helper prerequisite mismatch';
 END IF;
 IF NOT EXISTS (SELECT FROM pg_policy WHERE polrelid='public.organization_members'::regclass AND polname='members_admin_update') THEN
  RAISE EXCEPTION 'Expected membership policy missing';
 END IF;
END $$;
-- OLD owner rows require owner authority too; the old policy fenced only NEW roles.
ALTER POLICY members_admin_update ON public.organization_members
 USING (public.has_org_role(organization_id,ARRAY['owner','admin'])
   AND (role <> 'owner' OR public.has_org_role(organization_id,ARRAY['owner'])))
 WITH CHECK (public.has_org_role(organization_id,ARRAY['owner','admin'])
   AND (role <> 'owner' OR public.has_org_role(organization_id,ARRAY['owner'])));
-- RLS cannot compare OLD and NEW identities. Trigger runs with caller privileges.
CREATE OR REPLACE FUNCTION public.membership_identity_fence_v1()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
BEGIN
 IF NEW.organization_id IS DISTINCT FROM OLD.organization_id
 OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
  RAISE EXCEPTION 'membership identity is immutable';
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.membership_identity_fence_v1() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS membership_identity_fence_v1 ON public.organization_members;
CREATE TRIGGER membership_identity_fence_v1 BEFORE UPDATE ON public.organization_members
 FOR EACH ROW EXECUTE FUNCTION public.membership_identity_fence_v1();
CREATE OR REPLACE FUNCTION public.organization_owner_fence_v1()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
BEGIN
 IF NEW.id IS DISTINCT FROM OLD.id THEN RAISE EXCEPTION 'organization identity is immutable'; END IF;
 IF NEW.owner_user_id IS DISTINCT FROM OLD.owner_user_id
 AND NOT public.has_org_role(OLD.id,ARRAY['owner']) THEN
  RAISE EXCEPTION 'organization ownership requires owner';
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.organization_owner_fence_v1() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS organization_owner_fence_v1 ON public.organizations;
CREATE TRIGGER organization_owner_fence_v1 BEFORE UPDATE ON public.organizations
 FOR EACH ROW EXECUTE FUNCTION public.organization_owner_fence_v1();

-- SOURCE supabase/migrations/038_client_account_billing_privileges.sql
-- REVIEW REQUIRED: unapplied client-role least-privilege proposal.
-- Apply only after effective role memberships/grants and dependent clients are reviewed.
-- No RLS policies, service_role grants, table ownership or billing RPCs are changed.

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

-- Exact captured client-TRUNCATE scope. Other table privileges are preserved.
REVOKE TRUNCATE ON TABLE public."admin_alerts",
  public."ai_usage_events",
  public."api_usage_events",
  public."batch_calculation_jobs",
  public."billing_customers",
  public."business_api_keys",
  public."business_projects",
  public."business_webhook_endpoints",
  public."calculation_history",
  public."calculation_projects",
  public."calculator_bulk_jobs",
  public."calculator_catalog_admin",
  public."calculator_qa_checks",
  public."calculator_review_events",
  public."calculator_source_evidence",
  public."client_workspaces",
  public."custom_calculator_runs",
  public."custom_calculator_versions",
  public."custom_calculators",
  public."embed_configs",
  public."embed_events",
  public."embed_leads",
  public."favorites",
  public."lead_consents",
  public."organization_audit_log",
  public."organization_invitations",
  public."organization_members",
  public."organizations",
  public."platform_admins",
  public."profiles",
  public."saved_scenarios",
  public."share_links",
  public."shared_calculations",
  public."subscriptions",
  public."user_preferences",
  public."webhook_deliveries" FROM PUBLIC, anon, authenticated;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['admin_alerts','ai_usage_events','api_usage_events','batch_calculation_jobs','billing_customers','business_api_keys','business_projects','business_webhook_endpoints','calculation_history','calculation_projects','calculator_bulk_jobs','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_source_evidence','client_workspaces','custom_calculator_runs','custom_calculator_versions','custom_calculators','embed_configs','embed_events','embed_leads','favorites','lead_consents','organization_audit_log','organization_invitations','organization_members','organizations','platform_admins','profiles','saved_scenarios','share_links','shared_calculations','subscriptions','user_preferences','webhook_deliveries'] LOOP
  IF has_table_privilege('anon',('public.'||quote_ident(t))::regclass,'TRUNCATE')
    OR has_table_privilege('authenticated',('public.'||quote_ident(t))::regclass,'TRUNCATE') THEN
   RAISE EXCEPTION 'Inherited client TRUNCATE remains on %',t;
  END IF;
 END LOOP;
 IF has_function_privilege('anon','public.org_role(uuid)','EXECUTE') OR
    has_function_privilege('authenticated','public.org_role(uuid)','EXECUTE') OR
    has_function_privilege('service_role','public.org_role(uuid)','EXECUTE') THEN
  RAISE EXCEPTION 'Internal organization helper still client/service callable';
 END IF;
END $$;
COMMIT;
