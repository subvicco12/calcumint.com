-- Rollback-only PostgreSQL positive lifecycle regression.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin set lifecycle='review' where calculator_key='matrix-test';
do $lifecycle$
begin
  if not exists (select 1 from public.calculator_catalog_admin where calculator_key='matrix-test' and lifecycle='review') then
    raise exception 'Valid draft-to-review transition did not persist';
  end if;
end
$lifecycle$;
rollback;
