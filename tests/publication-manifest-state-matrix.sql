-- Disposable PostgreSQL: no non-published lifecycle may enter anonymous manifest.
\set ON_ERROR_STOP on
begin;
reset role;
do $matrix$
declare
  v_state text;
  v_id uuid := '50000000-0000-0000-0000-000000000001';
begin
  foreach v_state in array array['draft','review','certified','archived'] loop
    update public.calculator_catalog_admin set lifecycle=v_state where id=v_id;
    if exists (
      select 1 from public.list_published_calculator_manifest()
      where calculator_key='matrix-test'
    ) then
      raise exception 'Nonpublished lifecycle % leaked into manifest', v_state;
    end if;
  end loop;
end
$matrix$;
set role anon;
do $anonymous$
begin
  if exists (select 1 from public.list_published_calculator_manifest()
             where calculator_key='matrix-test') then
    raise exception 'Nonpublished fixture visible to anonymous role';
  end if;
end
$anonymous$;
rollback;
