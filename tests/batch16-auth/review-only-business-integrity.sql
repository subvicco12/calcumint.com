-- REVIEW ONLY: no app activation, deployment identity or hosted equivalence implied.
-- Requires the reviewed full repository model; compatibility/data audit gates remain open.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $proposal_guard$ BEGIN RAISE EXCEPTION 'UNAPPLIED_BATCH16_BUSINESS_INTEGRITY'; END $proposal_guard$;
CREATE OR REPLACE FUNCTION public.accept_business_invitation(invite_token_hash text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE inv public.organization_invitations%rowtype; member_count integer;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 SELECT * INTO inv FROM public.organization_invitations WHERE token_hash=invite_token_hash;
 IF inv.id IS NULL THEN RAISE EXCEPTION 'Invitation is invalid or expired'; END IF;
 -- Shared organization lock serializes admissions across distinct invitation rows.
 PERFORM 1 FROM public.organizations WHERE id=inv.organization_id FOR UPDATE;
 SELECT * INTO inv FROM public.organization_invitations WHERE id=inv.id AND accepted_at IS NULL AND expires_at>now() FOR UPDATE;
 IF inv.id IS NULL THEN RAISE EXCEPTION 'Invitation is invalid or expired'; END IF;
 IF lower(inv.email)<>lower(coalesce((SELECT email FROM auth.users WHERE id=auth.uid()),'')) THEN RAISE EXCEPTION 'Invitation email does not match signed-in account'; END IF;
 SELECT count(*) INTO member_count FROM public.organization_members WHERE organization_id=inv.organization_id;
 IF member_count>=5 THEN RAISE EXCEPTION 'Included Business seat limit reached'; END IF;
 INSERT INTO public.organization_members(organization_id,user_id,role) VALUES(inv.organization_id,auth.uid(),inv.role)
 ON CONFLICT(organization_id,user_id) DO UPDATE SET role=excluded.role;
 UPDATE public.organization_invitations SET accepted_at=now() WHERE id=inv.id;
 INSERT INTO public.organization_audit_log(organization_id,actor_user_id,action,entity_type,entity_id) VALUES(inv.organization_id,auth.uid(),'member.joined','user',auth.uid()::text);
 RETURN inv.organization_id;
END $$;
REVOKE ALL ON FUNCTION public.accept_business_invitation(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.accept_business_invitation(text) TO authenticated;
CREATE UNIQUE INDEX batch16_projects_tenant_identity ON public.business_projects(id,organization_id);
CREATE UNIQUE INDEX batch16_clients_tenant_identity ON public.client_workspaces(id,organization_id);
ALTER TABLE public.client_workspaces ADD CONSTRAINT batch16_client_project_tenant FOREIGN KEY(project_id,organization_id) REFERENCES public.business_projects(id,organization_id) ON DELETE SET NULL(project_id);
ALTER TABLE public.shared_calculations ADD CONSTRAINT batch16_shared_project_tenant FOREIGN KEY(project_id,organization_id) REFERENCES public.business_projects(id,organization_id) ON DELETE SET NULL(project_id);
ALTER TABLE public.shared_calculations ADD CONSTRAINT batch16_shared_client_tenant FOREIGN KEY(client_workspace_id,organization_id) REFERENCES public.client_workspaces(id,organization_id) ON DELETE SET NULL(client_workspace_id);
COMMIT;
