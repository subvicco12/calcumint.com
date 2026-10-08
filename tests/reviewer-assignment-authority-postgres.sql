-- Disposable PostgreSQL: reviewer assignment must reject a non-review-capable account.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
do $reviewer$
declare denied boolean := false;
begin
  begin
    update public.calculator_catalog_admin
    set reviewer_id='00000000-0000-0000-0000-000000000006'
    where calculator_key='matrix-test';
  exception when others then
    if sqlerrm like '%Reviewer must be an active review-capable admin%' then
      denied := true;
    else
      raise;
    end if;
  end;
  if not denied then
    raise exception 'Invalid reviewer assignment was accepted';
  end if;
end
$reviewer$;
rollback;
