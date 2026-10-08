-- Disposable PostgreSQL integration: anonymous publication authority must fail closed.
\set ON_ERROR_STOP on
begin;
reset role;
do $manifest_contract$
declare v_cols text[];
begin
  select array_agg(a.attname order by a.attnum) into v_cols
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  join pg_type t on t.oid=p.prorettype
  join pg_attribute a on a.attrelid=t.typrelid and a.attnum>0 and not a.attisdropped
  where n.nspname='public' and p.proname='list_published_calculator_manifest';
  if v_cols is distinct from array['calculator_key','slug','version'] then
    raise exception 'Publication manifest exposed unexpected columns: %', v_cols;
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
