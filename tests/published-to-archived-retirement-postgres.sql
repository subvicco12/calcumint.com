-- Rollback-only PostgreSQL lifecycle regression for migration 019.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin set lifecycle='review' where calculator_key='matrix-test';
insert into public.calculator_source_evidence(calculator_id,label,url,source_kind,reviewed_by)
values('50000000-0000-0000-0000-000000000001','Synthetic lifecycle source',
'https://example.org/published-draft-denial','official','00000000-0000-0000-0000-000000000001');
insert into public.calculator_qa_checks(calculator_id,check_type,status)
select '50000000-0000-0000-0000-000000000001'::uuid, required.check_type, 'passed'
from unnest(array['engine-tests','formula-review','sources','methodology',
'reverse-solve','visualization-reconciliation','schedule-reconciliation',
'scenario-reconciliation','sensitivity-validation','entitlement-validation',
'ux-responsive','performance','security','seo-content','accessibility']) required(check_type)
on conflict(calculator_id,check_type) do update set status=excluded.status;
update public.calculator_catalog_admin set lifecycle='certified' where calculator_key='matrix-test';
update public.calculator_catalog_admin set lifecycle='published' where calculator_key='matrix-test';
update public.calculator_catalog_admin set lifecycle='archived' where calculator_key='matrix-test';
do $lifecycle$
begin
  if not exists (select 1 from public.calculator_catalog_admin where calculator_key='matrix-test' and lifecycle='archived') then
    raise exception 'Valid published-to-archived retirement transition did not persist';
  end if;
end
$lifecycle$;
rollback;
