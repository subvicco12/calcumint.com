-- Disposable PostgreSQL: nonpublished rows never appear in anonymous manifest.
\set ON_ERROR_STOP on
begin;
reset role;
-- The baseline fixture is draft. Exercise a second nonpublished fixture
-- without forcing a certification transition lacking evidence.
insert into public.calculator_catalog_admin
 (id, calculator_key, slug, title, category, created_by, lifecycle)
values
 ('50000000-0000-0000-0000-000000000098',
  'matrix-archived-hidden', 'matrix-archived-hidden',
  'Archived Matrix Fixture', 'math',
  '00000000-0000-0000-0000-000000000001', 'archived');
set role anon;
do $anonymous$
begin
  if exists (select 1 from public.list_published_calculator_manifest()
             where calculator_key in ('matrix-test','matrix-archived-hidden')) then
    raise exception 'Draft or archived fixture visible to anonymous role';
  end if;
end
$anonymous$;
rollback;
