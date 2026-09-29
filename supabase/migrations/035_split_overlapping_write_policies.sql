-- Remove SELECT overlap from write-capable RLS policies without changing authorization semantics.
-- Existing read policies remain authoritative for SELECT. Write predicates are preserved.

drop policy "embed_configs_admin_write" on public.embed_configs;
create policy "embed_configs_admin_insert" on public.embed_configs
for insert with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));
create policy "embed_configs_admin_update" on public.embed_configs
for update using (public.has_org_role(organization_id, array['owner','admin','manager']))
with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));
create policy "embed_configs_admin_delete" on public.embed_configs
for delete using (public.has_org_role(organization_id, array['owner','admin','manager']));

drop policy "share_links_builder_write" on public.share_links;
create policy "share_links_builder_insert" on public.share_links
for insert with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));
create policy "share_links_builder_update" on public.share_links
for update using (public.has_org_role(organization_id, array['owner','admin','manager']))
with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = (select auth.uid()));
create policy "share_links_builder_delete" on public.share_links
for delete using (public.has_org_role(organization_id, array['owner','admin','manager']));

drop policy "qa_reviewer_write" on public.calculator_qa_checks;
create policy "qa_reviewer_insert" on public.calculator_qa_checks
for insert with check (public.has_platform_role(array['owner','admin','reviewer']));
create policy "qa_reviewer_update" on public.calculator_qa_checks
for update using (public.has_platform_role(array['owner','admin','reviewer']))
with check (public.has_platform_role(array['owner','admin','reviewer']));
create policy "qa_reviewer_delete" on public.calculator_qa_checks
for delete using (public.has_platform_role(array['owner','admin','reviewer']));
