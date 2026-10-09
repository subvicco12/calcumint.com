-- Rollback-only structured-source evidence must be present for certification.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
do $source_gate$
declare v_ok boolean; v_failures text[];
begin
  select ok, failures into v_ok, v_failures
  from public.validate_calculator_publish_gate('50000000-0000-0000-0000-000000000001');
  if v_ok or not ('At least one reviewed source evidence record is required' = any(v_failures)) then
    raise exception 'Structured source evidence gate failed: %', v_failures;
  end if;
end
$source_gate$;
insert into public.calculator_source_evidence
(calculator_id,label,url,source_kind,reviewed_by)
values ('50000000-0000-0000-0000-000000000001',
'Synthetic official reference','https://example.org/official-calculator-source',
'official','00000000-0000-0000-0000-000000000001');
do $source_positive$
declare v_ok boolean; v_failures text[];
begin
  select ok, failures into v_ok, v_failures
  from public.validate_calculator_publish_gate('50000000-0000-0000-0000-000000000001');
  if 'At least one reviewed source evidence record is required' = any(v_failures) then
    raise exception 'Reviewed source evidence did not satisfy source requirement: %',v_failures;
  end if;
end
$source_positive$;
rollback;
