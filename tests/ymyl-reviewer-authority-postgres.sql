-- Disposable PostgreSQL: financial/health/tax certification requires reviewer evidence.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin
set risk_class = 'financial'
where calculator_key = 'matrix-test';
do $ymyl$
declare v_ok boolean; v_failures text[];
begin
 select ok, failures into v_ok, v_failures
 from public.validate_calculator_publish_gate('50000000-0000-0000-0000-000000000001');
 if v_ok or not ('YMYL reviewer is required' = any(v_failures))
    or not ('ymyl-review must pass' = any(v_failures)) then
   raise exception 'Financial calculator bypassed mandatory YMYL evidence: %', v_failures;
 end if;
end
$ymyl$;
rollback;
