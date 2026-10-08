-- Disposable PostgreSQL: source_count is enforced independently of catalog RLS.
\set ON_ERROR_STOP on
begin;
reset role;
create function public.test_source_count_fabrication()
returns void language plpgsql security definer set search_path=public as $derived$
declare denied boolean := false; affected integer;
begin
  begin
    update public.calculator_catalog_admin set source_count=42
    where calculator_key='matrix-test';
    get diagnostics affected = row_count;
  exception when others then
    if sqlerrm like '%source_count is derived from calculator_source_evidence%' then
      denied := true;
    else
      raise;
    end if;
  end;
  if not denied then
    raise exception 'Direct source_count fabrication accepted or skipped (% rows)', affected;
  end if;
end
$derived$;
set role authenticated;
set request.jwt.claim.role = 'authenticated';
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
select public.test_source_count_fabrication();
rollback;
