-- Rollback-only regulatory official-source URL validation.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin
set metadata=jsonb_build_object('rulePackRequired',true,'ruleMetadata',jsonb_build_array(
 jsonb_build_object('jurisdiction',jsonb_build_object('country','IN'),
 'ruleVersion','2026-test','effectiveFrom','2026-01-01',
 'lastVerifiedAt','2026-10-09',
 'officialSources',jsonb_build_array(jsonb_build_object('label','Synthetic official source','url','')))))
where calculator_key='matrix-test';
do $missing_source_url$
declare v_failures text[];
begin
 select failures into v_failures from public.validate_calculator_publish_gate(
 '50000000-0000-0000-0000-000000000001');
 if not ('Regulatory official sources require labels and URLs' = any(v_failures)) then
  raise exception 'Missing regulatory official-source URL was not rejected: %',v_failures;
 end if;
end
$missing_source_url$;
rollback;
