-- Rollback-only: QA evidence must not be invalidated after certification.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
-- Reuse the synthetic published fixture from the preceding manifest gate test
-- only when it exists; this test supplies its own evidence and rollback boundary.
do $revalidation$
declare denied boolean := false;
begin
  -- A draft remains uncertified, so missing evidence must still fail the gate.
  if exists (select 1 from public.calculator_catalog_admin
             where calculator_key='matrix-test' and lifecycle in ('certified','published')) then
    raise exception 'Baseline fixture unexpectedly certified';
  end if;
  begin
    update public.calculator_catalog_admin set lifecycle='certified'
    where calculator_key='matrix-test';
  exception when others then
    if sqlerrm like '%Publishing gate failed:%' or sqlerrm like '%Invalid lifecycle transition:%' then
      denied := true;
    else
      raise;
    end if;
  end;
  if not denied then raise exception 'Incomplete evidence certified'; end if;
end
$revalidation$;
rollback;
