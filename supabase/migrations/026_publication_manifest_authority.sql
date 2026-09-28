-- Minimal anonymous publication manifest for composing repository identity with governed DB publication state.
-- Exposes no admin/reviewer/evidence metadata and does not relax calculator_catalog_admin RLS.

create or replace function public.list_published_calculator_manifest()
returns table(calculator_key text, slug text, version integer)
language sql
stable
security definer
set search_path = public
as $$
  select c.calculator_key, c.slug, c.version
  from public.calculator_catalog_admin c
  where c.lifecycle = 'published'
  order by c.slug;
$$;

revoke all on function public.list_published_calculator_manifest() from public;
grant execute on function public.list_published_calculator_manifest() to anon, authenticated, service_role;
