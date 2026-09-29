-- Consolidate overlapping permissive AI usage SELECT policies without changing authorization semantics.
-- PostgreSQL permissive SELECT policies are OR-combined. This single policy preserves that exact union:
-- users can read their own events, and organization owners/admins can read events for their organization.
-- Keep auth.uid() scalar-initialized as established by migration 030.

drop policy if exists "ai_usage_user_read" on public.ai_usage_events;
drop policy if exists "ai_usage_org_admin_read" on public.ai_usage_events;

create policy "ai_usage_read" on public.ai_usage_events
  for select
  using (
    user_id = (select auth.uid())
    or (
      organization_id is not null
      and public.has_org_role(organization_id, array['owner','admin'])
    )
  );
