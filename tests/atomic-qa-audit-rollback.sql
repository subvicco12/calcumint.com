-- Disposable isolated PostgreSQL database ONLY; migrations 032-035 required.
-- Configure test.calculator_id for an existing draft calculator, and
-- request.jwt.claim.sub for an active owner/admin/reviewer test identity.
-- This creates a transaction-local audit failure trigger; NEVER use production.
\set ON_ERROR_STOP on
begin;
create or replace function pg_temp.reject_qa_audit()
returns trigger language plpgsql as $$
begin
  if new.event_type = 'qa-check' then
    raise exception 'Injected QA audit failure';
  end if;
  return new;
end;
$$;
create trigger atomic_qa_audit_failure_test
before insert on public.calculator_review_events
for each row execute function pg_temp.reject_qa_audit();

do $$
declare
  v_calc uuid := nullif(current_setting('test.calculator_id', true), '')::uuid;
  v_before_status text;
  v_before_details text;
  v_after_status text;
  v_after_details text;
begin
  select status, details into v_before_status, v_before_details
    from public.calculator_qa_checks
    where calculator_id = v_calc and check_type = 'engine-tests';
  if not found then
    raise exception 'Existing engine-tests QA fixture required';
  end if;
  begin
    perform public.record_calculator_qa_decision(
      v_calc, 'engine-tests', 'failed', 'failure injection'
    );
    raise exception 'Expected injected QA audit failure was not raised';
  exception when others then
    if sqlerrm <> 'Injected QA audit failure' then
      raise exception 'Unexpected QA decision error: %', sqlerrm;
    end if;
  end;
  select status, details into v_after_status, v_after_details
    from public.calculator_qa_checks
    where calculator_id = v_calc and check_type = 'engine-tests';
  if v_after_status is distinct from v_before_status
    or v_after_details is distinct from v_before_details then
    raise exception 'QA decision persisted despite failed audit';
  end if;
end
$$;
rollback;
