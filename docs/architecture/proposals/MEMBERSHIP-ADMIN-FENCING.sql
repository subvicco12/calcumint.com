-- UNAPPLIED proposal. Requires API-RLS-HELPER-EXECUTE.sql acceptance first.
-- Keeps owner transfer primitives; does not provide an atomic ownership transfer.
BEGIN;
DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated membership acceptance and owner authorization required'; END $$;
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
COMMIT;
