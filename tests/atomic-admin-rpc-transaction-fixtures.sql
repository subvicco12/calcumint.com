-- ISOLATED TEST DATABASE ONLY, after migrations 032-035.
-- Runs inside a transaction and rolls back all fixtures. Requires a disposable
-- auth.users fixture and an active platform_admin owner; never use production.
begin;
do $$
declare
  v_actor uuid := gen_random_uuid();
  v_calc uuid;
  v_count integer;
begin
  insert into auth.users (id, aud, role, email, encrypted_password, created_at, updated_at)
  values (v_actor, 'authenticated', 'authenticated',
          'atomic-test-' || replace(v_actor::text,'-','') || '@example.invalid',
          '', now(), now());
  insert into public.platform_admins (user_id, role, active)
  values (v_actor, 'owner', true);
  perform set_config('request.jwt.claim.sub', v_actor::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  execute 'set local role authenticated';

  -- Unauthorized/invalid risk must not create any catalog row.
  begin
    perform public.create_catalog_calculator_with_audit(
      'atomic-rollback-' || v_actor::text,
      'atomic-rollback-' || replace(v_actor::text, '-', ''),
      'Atomic rollback fixture', 'Testing', 'invalid', '{}'::jsonb
    );
    raise exception 'Invalid risk unexpectedly accepted';
  exception when others then
    if sqlerrm = 'Invalid risk unexpectedly accepted' then raise; end if;
  end;

  -- Successful call must create exactly the 15 baseline pending QA checks
  -- and one creation audit. The outer transaction rolls all of this back.
  v_calc := public.create_catalog_calculator_with_audit(
    'atomic-rollback-' || v_actor::text,
    'atomic-rollback-' || replace(v_actor::text, '-', ''),
    'Atomic rollback fixture', 'Testing', 'standard', '{}'::jsonb
  );
  select count(*) into v_count from public.calculator_qa_checks
    where calculator_id = v_calc and status = 'pending';
  if v_count <> 15 then
    raise exception 'Expected 15 pending QA checks, found %', v_count;
  end if;
  select count(*) into v_count from public.calculator_review_events
    where calculator_id = v_calc and event_type = 'created' and to_state = 'draft';
  if v_count <> 1 then
    raise exception 'Expected one creation audit, found %', v_count;
  end if;
end
$$;
rollback;
