-- Optimize direct authenticated-user identity checks in platform administration RLS.
-- Existing platform role/admin predicates remain unchanged.

alter policy "admins_read_self" on public.platform_admins
  using (user_id = (select auth.uid()) and active);

alter policy "catalog_editor_insert" on public.calculator_catalog_admin
  with check (
    public.has_platform_role(array['owner','admin','reviewer','editor'])
    and created_by = (select auth.uid())
  );

alter policy "events_admin_insert" on public.calculator_review_events
  with check (
    public.is_platform_admin()
    and actor_id = (select auth.uid())
  );

alter policy "jobs_admin_insert" on public.calculator_bulk_jobs
  with check (
    public.has_platform_role(array['owner','admin'])
    and requested_by = (select auth.uid())
  );

alter policy "source_evidence_reviewer_insert" on public.calculator_source_evidence
  with check (
    public.has_platform_role(array['owner','admin','reviewer'])
    and reviewed_by = (select auth.uid())
  );

alter policy "source_evidence_reviewer_update" on public.calculator_source_evidence
  using (public.has_platform_role(array['owner','admin','reviewer']))
  with check (
    public.has_platform_role(array['owner','admin','reviewer'])
    and reviewed_by = (select auth.uid())
  );
