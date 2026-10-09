-- Rollback-only: rule effectiveTo must be a real calendar date.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin
set metadata=jsonb_build_object('rulePackRequired',true,'ruleMetadata',jsonb_build_array(
 jsonb_build_object('jurisdiction',jsonb_build_object('country','IN'),
 'ruleVersion','2026-test','effectiveFrom','2026-09-01',
 'effectiveTo','2026-02-30','lastVerifiedAt','2026-10-09',
 'officialSources',jsonb_build_array(jsonb_build_object('label','Synthetic rule','url','https://example.org/rule')))))
where calculator_key='matrix-test';
do $invalid_period$
declare v_failures text[];
begin
 select failures into v_failures from public.validate_calculator_publish_gate(
 '50000000-0000-0000-0000-000000000001');
 if not ('Regulatory rule metadata contains an invalid effective period' = any(v_failures)) then
  raise exception 'Invalid-calendar regulatory effectiveTo not rejected: %',v_failures;
 end if;
end
$invalid_period$;
rollback;
