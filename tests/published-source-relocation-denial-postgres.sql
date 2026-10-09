-- Rollback-only: removing the last reviewed source from published calculator must fail.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin set lifecycle='review' where calculator_key='matrix-test';
insert into public.calculator_source_evidence(calculator_id,label,url,source_kind,reviewed_by)
values('50000000-0000-0000-0000-000000000001', 'Synthetic reviewed source',
'https://example.org/certified-source-relocation', 'official',
'00000000-0000-0000-0000-000000000001');
insert into public.calculator_qa_checks(calculator_id,check_type,status)
select '50000000-0000-0000-0000-000000000001'::uuid, required.check_type, 'passed'
from unnest(array['engine-tests','formula-review','sources','methodology',
'reverse-solve','visualization-reconciliation','schedule-reconciliation',
'scenario-reconciliation','sensitivity-validation','entitlement-validation',
'ux-responsive','performance','security','seo-content','accessibility']) required(check_type)
on conflict(calculator_id,check_type) do update set status=excluded.status;
update public.calculator_catalog_admin set lifecycle='certified' where calculator_key='matrix-test';
update public.calculator_catalog_admin set lifecycle='published' where calculator_key='matrix-test';
insert into public.calculator_catalog_admin
(id, calculator_key, slug, title, category, created_by, version)
values ('50000000-0000-0000-0000-000000000099',
'matrix-source-relocation-target', 'matrix-source-relocation-target',
'Source Relocation Target', 'math',
'00000000-0000-0000-0000-000000000001', 9);
do $source_delete$
declare denied boolean:=false;
begin
  begin
    update public.calculator_source_evidence
    set calculator_id='50000000-0000-0000-0000-000000000099'
    where calculator_id='50000000-0000-0000-0000-000000000001';
    set constraints calculator_source_evidence_certification_after_write immediate;
  exception when others then
    if sqlerrm like 'Certified calculator source evidence cannot become invalid:%'
       or sqlerrm = 'Publishing gate failed: At least one reviewed source evidence record is required'
    then denied:=true;
    else raise; end if;
  end;
  if not denied then raise exception 'Published calculator source relocated without denial'; end if;
end
$source_delete$;
rollback;
