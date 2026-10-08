-- Disposable PostgreSQL: owner cannot certify with incomplete QA/source evidence.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
do $gate$
declare
  v_ok boolean;
  v_failures text[];
  v_id uuid := '50000000-0000-0000-0000-000000000001';
begin
  select ok, failures into v_ok, v_failures
  from public.validate_calculator_publish_gate(v_id);
  if v_ok or cardinality(v_failures) = 0 then
    raise exception 'Incomplete draft unexpectedly passed certification gate';
  end if;
  if not ('engine-tests must pass' = any(v_failures)) then
    raise exception 'Missing engine test evidence was not rejected: %', v_failures;
  end if;
  if not ('At least one reviewed source is required' = any(v_failures)) then
    raise exception 'Missing reviewed source was not rejected: %', v_failures;
  end if;
end
$gate$;
rollback;
