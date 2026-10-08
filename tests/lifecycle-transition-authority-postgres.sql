-- Rollback-only PostgreSQL lifecycle regression for migration 019.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
do $lifecycle$
declare rejected boolean := false;
begin
  begin
    update public.calculator_catalog_admin
    set lifecycle='published'
    where calculator_key='matrix-test';
  exception when others then
    if sqlerrm like 'Invalid lifecycle transition:%' then
      rejected := true;
    else
      raise;
    end if;
  end;
  if not rejected then
    raise exception 'Invalid direct draft-to-published transition accepted';
  end if;
end
$lifecycle$;
rollback;
