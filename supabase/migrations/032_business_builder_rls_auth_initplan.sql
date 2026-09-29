-- Optimize direct authenticated-user identity checks in Business and custom-builder RLS.
-- Existing organization role predicates and policy commands remain unchanged.

alter policy "invites_admin_insert" on public.organization_invitations
  with check (public.has_org_role(organization_id, array['owner','admin']) and invited_by = (select auth.uid()));

alter policy "projects_manager_insert" on public.business_projects
  with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));

alter policy "clients_manager_insert" on public.client_workspaces
  with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));

alter policy "shared_editor_insert" on public.shared_calculations
  with check (public.has_org_role(organization_id, array['owner','admin','manager','member']) and created_by = (select auth.uid()));

alter policy "custom_calculators_insert_builders" on public.custom_calculators
  with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));

alter policy "custom_versions_insert_builders" on public.custom_calculator_versions
  with check (
    created_by = (select auth.uid()) and exists (
      select 1 from public.custom_calculators c
      where c.id = calculator_id
        and public.has_org_role(c.organization_id, array['owner','admin','manager'])
    )
  );

alter policy "embed_configs_admin_write" on public.embed_configs
  using (public.has_org_role(organization_id, array['owner','admin','manager']))
  with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));

alter policy "share_links_builder_write" on public.share_links
  using (public.has_org_role(organization_id, array['owner','admin','manager']))
  with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));

alter policy "api_keys_admin_insert" on public.business_api_keys
  with check (public.has_org_role(organization_id, array['owner','admin']) and created_by = (select auth.uid()));

alter policy "webhook_admin_insert" on public.business_webhook_endpoints
  with check (public.has_org_role(organization_id, array['owner','admin']) and created_by = (select auth.uid()));
