-- Record lifecycle transition and audit event atomically.
-- Security invoker retains catalog RLS and authoritative lifecycle/QA gate triggers.
create or replace function public.transition_calculator_with_audit(
  p_calculator_id uuid, p_expected_lifecycle text, p_target_lifecycle text
) returns void
language plpgsql security invoker set search_path = public
as $$
declare
  v_role text;
  v_updated_id uuid;
begin
  select role into v_role from public.platform_admins where user_id = auth.uid() and active;
  if v_role is null then raise exception 'Platform admin required'; end if;
  if p_target_lifecycle is null or p_target_lifecycle not in ('draft','review','certified','published','archived') then
    raise exception 'Invalid target lifecycle';
  end if;
  if p_expected_lifecycle is null or p_expected_lifecycle not in ('draft','review','certified','published','archived') then
    raise exception 'Invalid expected lifecycle';
  end if;
  if not (
    (p_expected_lifecycle = 'draft' and p_target_lifecycle in ('review','archived')) or
    (p_expected_lifecycle = 'review' and p_target_lifecycle in ('draft','certified','archived')) or
    (p_expected_lifecycle = 'certified' and p_target_lifecycle in ('review','published','archived')) or
    (p_expected_lifecycle = 'published' and p_target_lifecycle in ('review','archived')) or
    (p_expected_lifecycle = 'archived' and p_target_lifecycle = 'draft')
  ) then raise exception 'Invalid lifecycle transition'; end if;
  if v_role = 'editor' and p_target_lifecycle not in ('draft','review') then
    raise exception 'Editor cannot perform this lifecycle transition';
  end if;
  if v_role = 'reviewer' and p_target_lifecycle = 'published' then
    raise exception 'Reviewer cannot publish calculators';
  end if;
  update public.calculator_catalog_admin
    set lifecycle = p_target_lifecycle,
        last_reviewed_at = case when p_target_lifecycle = 'certified' then now() else last_reviewed_at end
    where id = p_calculator_id and lifecycle = p_expected_lifecycle
    returning id into v_updated_id;
  if v_updated_id is null then raise exception 'Calculator lifecycle changed concurrently or was not found'; end if;
  insert into public.calculator_review_events
    (calculator_id, actor_id, event_type, from_state, to_state)
    values (p_calculator_id, auth.uid(), 'lifecycle-transition', p_expected_lifecycle, p_target_lifecycle);
end;
$$;
revoke all on function public.transition_calculator_with_audit(uuid,text,text) from public, anon;
grant execute on function public.transition_calculator_with_audit(uuid,text,text) to authenticated;
