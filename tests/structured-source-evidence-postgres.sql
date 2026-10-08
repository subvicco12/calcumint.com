-- Disposable PostgreSQL: legacy source_count cannot replace reviewed evidence.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin
set source_count = 1 where calculator_key = 'matrix-test';
do $sources$
declare v_ok boolean; v_failures text[];
begin
 select ok, failures into v_ok, v_failures
 from public.validate_calculator_publish_gate('50000000-0000-0000-0000-000000000001');
 if v_ok then
   raise exception 'Missing QA evidence unexpectedly allowed certification';
 end if;
 if not ('engine-tests must pass' = any(v_failures)) then
   raise exception 'Missing engine QA not rejected: %', v_failures;
 end if;
end
$sources$;
rollback;
