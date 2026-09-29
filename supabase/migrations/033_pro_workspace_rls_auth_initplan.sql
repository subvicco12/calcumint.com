-- Optimize auth.uid() evaluation in the existing Pro workspace RLS policies.
-- Preserve commands, ownership checks, plan gates, and scenario project ownership.

alter policy projects_select_own on public.calculation_projects
using ((select auth.uid()) = user_id);

alter policy projects_insert_own on public.calculation_projects
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.plan in ('pro', 'business')
  )
);

alter policy projects_update_own on public.calculation_projects
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.plan in ('pro', 'business')
  )
);

alter policy projects_delete_own on public.calculation_projects
using ((select auth.uid()) = user_id);

alter policy scenarios_select_own on public.saved_scenarios
using ((select auth.uid()) = user_id);

alter policy scenarios_insert_own on public.saved_scenarios
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.profiles profile
    where profile.id = (select auth.uid())
      and profile.plan in ('pro', 'business')
  )
  and (
    project_id is null
    or exists (
      select 1 from public.calculation_projects p
      where p.id = saved_scenarios.project_id
        and p.user_id = (select auth.uid())
    )
  )
);

alter policy scenarios_update_own on public.saved_scenarios
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.profiles profile
    where profile.id = (select auth.uid())
      and profile.plan in ('pro', 'business')
  )
  and (
    project_id is null
    or exists (
      select 1 from public.calculation_projects p
      where p.id = saved_scenarios.project_id
        and p.user_id = (select auth.uid())
    )
  )
);

alter policy scenarios_delete_own on public.saved_scenarios
using ((select auth.uid()) = user_id);
