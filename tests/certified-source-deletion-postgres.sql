-- Rollback-only: removing the last reviewed source from certified calculator must fail.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin set lifecycle='review' where calculator_key='matrix-test';
insert into public.calculator_source_evidence(calculator_id,label,url,source_kind,reviewed_by)
values('50000000-0000-0000-0000-000000000001', 'Synthetic reviewed source',
'https://example.org/certified-source-deletion', 'official',
'00000000-0000-0000-0000-000000000001');
insert into public.calculator_qa_checks(calculator_id,check_type,status)
select '50000000-0000-0000-0000-000000000001'::uuid, required.check_type, 'passed'
from unnest(array['engine-tests','formula-review','sources','methodology',
'reverse-solve','visualization-reconciliation','schedule-reconciliation',
'scenario-reconciliation','sensitivity-validation','entitlement-validation',
'ux-responsive','performance','security','seo-content','accessibility']) required(check_type)
on conflict(calculator_id,check_type) do update set status=excluded.status;
update public.calculator_catalog_admin set lifecycle='certified' where calculator_key='matrix-test';
do $source_delete$
declare denied boolean:=false;
begin
  begin
    delete from public.calculator_source_evidence
    where calculator_id='50000000-0000-0000-0000-000000000001';
    set constraints calculator_source_evidence_certification_after_write immediate;
  exception when others then
    if sqlerrm like 'Certified calculator source evidence cannot become invalid:%' then denied:=true;
    else raise; end if;
  end;
  if not denied then raise exception 'Certified calculator lost its reviewed source'; end if;
end
$source_delete$;
rollback;
