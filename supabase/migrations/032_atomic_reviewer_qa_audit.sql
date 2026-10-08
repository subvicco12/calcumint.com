-- Atomically record reviewer QA decisions and their audit trail.
-- Invoker permissions, RLS and existing QA certification/authority triggers remain enforced.
create or replace function public.record_calculator_qa_decision(
  p_calculator_id uuid, p_check_type text, p_status text, p_details text
) returns void
language plpgsql security invoker set search_path = public
as $$
declare
  v_role text;
  v_risk text;
  v_metadata jsonb;
  v_required text[] := array[
    'engine-tests','formula-review','sources','methodology','reverse-solve',
    'visualization-reconciliation','schedule-reconciliation','scenario-reconciliation',
    'sensitivity-validation','entitlement-validation','ux-responsive','performance',
    'security','seo-content','accessibility'
  ];
begin
  select role into v_role from public.platform_admins
    where user_id = (select auth.uid()) and active;
  if v_role is null or v_role not in ('owner','admin','reviewer') then
    raise exception 'Reviewer permission required';
  end if;
  if p_status is null or p_status not in ('pending','passed','failed','waived') then
    raise exception 'Invalid QA decision status';
  end if;
  if p_status = 'waived' and v_role not in ('owner','admin') then
    raise exception 'Owner or admin permission required to waive QA evidence';
  end if;
  if p_check_type is null then raise exception 'Invalid QA check type'; end if;
  select risk_class, metadata into v_risk, v_metadata
  from public.calculator_catalog_admin where id = p_calculator_id;
  if not found then raise exception 'Calculator lookup failed'; end if;
  if coalesce(v_metadata ->> 'rulePackRequired', '') = 'true' then
    v_required := array_append(v_required, 'rule-pack-validation');
  end if;
  if v_risk in ('financial','health','tax') then
    v_required := array_append(v_required, 'ymyl-review');
  end if;
  if not (p_check_type = any(v_required)) then
    raise exception 'QA check is not applicable to this calculator';
  end if;
  if char_length(coalesce(p_details, '')) > 2000 then
    raise exception 'QA details exceed maximum length';
  end if;
  insert into public.calculator_qa_checks
    (calculator_id, check_type, status, details, checked_by, checked_at)
  values (p_calculator_id, p_check_type, p_status, coalesce(p_details, ''), auth.uid(), now())
  on conflict (calculator_id, check_type) do update
    set status = excluded.status, details = excluded.details,
        checked_by = excluded.checked_by, checked_at = excluded.checked_at;
  insert into public.calculator_review_events
    (calculator_id, actor_id, event_type, notes)
  values (p_calculator_id, auth.uid(), 'qa-check', p_check_type || ': ' || p_status);
  -- Any error aborts the entire function statement, rolling back both writes.
end;
$$;
revoke all on function public.record_calculator_qa_decision(uuid,text,text,text) from public, anon;
grant execute on function public.record_calculator_qa_decision(uuid,text,text,text) to authenticated;
