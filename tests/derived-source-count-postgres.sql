-- Disposable PostgreSQL: direct authenticated source_count fabrication is denied.
\set ON_ERROR_STOP on
begin;
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
do $derived$
declare denied boolean := false;
begin
  begin
    update public.calculator_catalog_admin set source_count=42
    where calculator_key='matrix-test';
  exception when others then
    if sqlerrm like '%source_count is derived from calculator_source_evidence%' then
      denied := true;
    else
      raise;
    end if;
  end;
  if not denied then
    raise exception 'Direct source_count fabrication was accepted';
  end if;
end
$derived$;
rollback;
