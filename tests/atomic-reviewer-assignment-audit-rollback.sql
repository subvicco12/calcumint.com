-- Disposable isolated PostgreSQL database ONLY; migrations 032-035 required.
-- A test harness must configure request.jwt.claim.sub to an active owner/admin,
-- and provide an existing draft calculator and active reviewer fixture.
-- Set session test.calculator_id and test.reviewer_id to fixture UUIDs.
-- This script installs a transaction-local trigger and always rolls back.
\set ON_ERROR_STOP on
begin;
create or replace function pg_temp.reject_reviewer_assignment_audit()
returns trigger language plpgsql as $$
begin
  if new.event_type = 'reviewer-assigned' then
    raise exception 'Injected reviewer assignment audit failure';
  end if;
  return new;
end;
$$;
create trigger atomic_reviewer_assignment_failure_test
before insert on public.calculator_review_events
for each row execute function pg_temp.reject_reviewer_assignment_audit();

do $$
declare
  v_calc uuid := nullif(current_setting('test.calculator_id', true), '')::uuid;
  v_reviewer uuid := nullif(current_setting('test.reviewer_id', true), '')::uuid;
  v_previous uuid;
  v_current uuid;
begin
  select reviewer_id into v_previous
    from public.calculator_catalog_admin where id = v_calc;
  if not found then raise exception 'Missing isolated calculator fixture'; end if;
  if not exists (select 1 from public.platform_admins
    where user_id = v_reviewer and active and role in ('owner','admin','reviewer')) then
    raise exception 'Missing active reviewer fixture';
  end if;
  begin
    perform public.assign_calculator_reviewer(v_calc, v_reviewer);
    raise exception 'Expected injected assignment audit failure was not raised';
  exception when others then
    if sqlerrm <> 'Injected reviewer assignment audit failure' then
      raise exception 'Unexpected assignment error: %', sqlerrm;
    end if;
  end;
  select reviewer_id into v_current
    from public.calculator_catalog_admin where id = v_calc;
  if v_current is distinct from v_previous then
    raise exception 'Reviewer assignment persisted despite failed audit';
  end if;
end
$$;
rollback;
