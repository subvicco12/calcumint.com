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
  if not has_function_privilege('anon',
      'public.list_published_calculator_manifest()', 'EXECUTE') then
    raise exception 'Anonymous publication manifest EXECUTE permission is missing';
  end if;
  if has_table_privilege('anon','public.calculator_catalog_admin','SELECT') then
    raise exception 'Anonymous role must not receive raw admin catalog SELECT';
  end if;
  if has_function_privilege('anon',
      'public.validate_calculator_publish_gate(uuid)', 'EXECUTE') then
    raise exception 'Anonymous role must not access certification gate';
  end if;
end
$manifest_contract$;

-- The published fixture is synthetic and exists only within this rollback-only
-- transaction. This tests the positive path as well as draft exclusion.
-- Seed synthetic passing evidence inside the disposable rollback-only transaction.
-- Production publishing gate remains active and must approve the transition.
update public.calculator_catalog_admin
set source_count = 1 where calculator_key = 'matrix-test';
update public.calculator_qa_checks
set status = 'passed'
where calculator_id = '50000000-0000-0000-0000-000000000001';
update public.calculator_catalog_admin
set lifecycle = 'published', version = 7
where calculator_key = 'matrix-test';
insert into public.calculator_catalog_admin
 (id, calculator_key, slug, title, category, created_by, version)
values
 ('50000000-0000-0000-0000-000000000099',
  'matrix-draft-hidden', 'matrix-draft-hidden', 'Unpublished Matrix Fixture',
  'math', '00000000-0000-0000-0000-000000000001', 9);

set role anon;
do $manifest_anon$
declare v_count integer;
begin
  select count(*) into v_count
  from public.list_published_calculator_manifest()
  where calculator_key = 'matrix-test' and slug = 'matrix-test' and version = 7;
  if v_count <> 1 then
    raise exception 'Expected exactly one synthetic published row, got %', v_count;
  end if;
  if exists (
    select 1 from public.list_published_calculator_manifest()
    where calculator_key='matrix-draft-hidden' or slug='matrix-draft-hidden'
  ) then
    raise exception 'Draft calculator leaked into anonymous publication manifest';
  end if;
  if (select count(*) from public.list_published_calculator_manifest()) <> 1 then
    raise exception 'Manifest unexpectedly exposed extra calculator rows';
  end if;
end
$manifest_anon$;
rollback;
