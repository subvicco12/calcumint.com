-- Disposable isolated PostgreSQL database ONLY, with migrations 032-035 applied.
-- This file deliberately installs a temporary failure-injection trigger.
-- Never run against production, staging, or any shared database.
\set ON_ERROR_STOP on
begin;
create or replace function pg_temp.reject_atomic_catalog_creation_audit()
returns trigger language plpgsql as $$
begin
  if new.event_type = 'created' and new.calculator_id in (
    select id from public.calculator_catalog_admin
    where calculator_key like 'atomic-fail-injection-%'
  ) then
    raise exception 'Injected creation audit failure';
  end if;
  return new;
end;
$$;
create trigger atomic_catalog_audit_failure_test
before insert on public.calculator_review_events
for each row execute function pg_temp.reject_atomic_catalog_creation_audit();

-- Run the call under a pre-existing isolated owner/admin test identity.
-- A session-local JWT claim is needed for auth.uid(); the fixture's role must
-- be configured by the test harness. The function is SECURITY INVOKER.
do $$
declare
  v_actor uuid := nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
  v_key text := 'atomic-fail-injection-' || replace(gen_random_uuid()::text, '-', '');
  v_before integer;
  v_after integer;
begin
  if v_actor is null or not exists (
    select 1 from public.platform_admins
    where user_id = v_actor and active and role in ('owner','admin','reviewer')
  ) then
    raise exception 'Isolated owner/admin/reviewer test identity required';
  end if;
  select count(*) into v_before from public.calculator_catalog_admin;
  begin
    perform public.create_catalog_calculator_with_audit(
      v_key, v_key, 'Atomic failure fixture', 'Testing', 'standard', '{}'::jsonb
    );
    raise exception 'Expected injected audit failure was not raised';
  exception when others then
    if sqlerrm <> 'Injected creation audit failure' then
      raise exception 'Unexpected error instead of injected audit failure: %', sqlerrm;
    end if;
  end;
  select count(*) into v_after from public.calculator_catalog_admin;
  if v_after <> v_before then
    raise exception 'Catalog insert was not rolled back after audit failure';
  end if;
  if exists (select 1 from public.calculator_catalog_admin where calculator_key = v_key) then
    raise exception 'Failed catalog creation left a catalog record';
  end if;
  if exists (select 1 from public.calculator_qa_checks q
    join public.calculator_catalog_admin c on c.id = q.calculator_id
    where c.calculator_key = v_key) then
    raise exception 'Failed catalog creation left QA records';
  end if;
end
$$;
rollback;
