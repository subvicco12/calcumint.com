-- Disposable PostgreSQL integration: anonymous publication authority must fail closed.
\set ON_ERROR_STOP on
begin;
reset role;
do $manifest_contract$
declare v_result text;
begin
  select pg_get_function_result(p.oid) into v_result
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='list_published_calculator_manifest'
    and p.pronargs=0;
  if v_result is distinct from 'TABLE(calculator_key text, slug text, version integer)' then
    raise exception 'Publication manifest exposed unexpected output: %', v_result;
  end if;
end
$manifest_contract$;
set role anon;
do $manifest_anon$
begin
  if exists(select 1 from public.list_published_calculator_manifest()
    where calculator_key='matrix-test' or slug='matrix-test') then
    raise exception 'Draft calculator leaked into anonymous publication manifest';
  end if;
end
$manifest_anon$;
rollback;
