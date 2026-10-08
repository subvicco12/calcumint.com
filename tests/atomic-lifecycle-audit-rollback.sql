-- Disposable isolated PostgreSQL ONLY; migrations 032-035 must be applied.
-- Configure test.calculator_id and request.jwt.claim.sub for an authorized
-- owner/admin fixture whose calculator starts in draft lifecycle.
-- Never execute on production or shared databases.
\set ON_ERROR_STOP on
begin;
create or replace function pg_temp.reject_lifecycle_audit()
returns trigger language plpgsql as $$
begin
  if new.event_type = 'lifecycle-transition' then
    raise exception 'Injected lifecycle audit failure';
  end if;
  return new;
end;
$$;
create trigger atomic_lifecycle_audit_failure_test
before insert on public.calculator_review_events
for each row execute function pg_temp.reject_lifecycle_audit();

do $$
declare
  v_calc uuid := nullif(current_setting('test.calculator_id', true), '')::uuid;
  v_before text;
  v_after text;
begin
  select lifecycle into v_before from public.calculator_catalog_admin where id = v_calc;
  if not found or v_before <> 'draft' then
    raise exception 'Isolated draft calculator fixture required';
  end if;
  begin
    perform public.transition_calculator_with_audit(v_calc, 'draft', 'review');
    raise exception 'Expected injected lifecycle audit failure was not raised';
  exception when others then
    if sqlerrm <> 'Injected lifecycle audit failure' then
      raise exception 'Unexpected lifecycle transition error: %', sqlerrm;
    end if;
  end;
  select lifecycle into v_after from public.calculator_catalog_admin where id = v_calc;
  if v_after is distinct from v_before then
    raise exception 'Lifecycle transition persisted despite failed audit';
  end if;
end
$$;
rollback;
