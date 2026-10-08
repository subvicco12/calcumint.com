-- Assign a reviewer and record the audit event in the same transaction.
-- SECURITY INVOKER preserves existing RLS, role policies and catalog gate triggers.
create or replace function public.assign_calculator_reviewer(
  p_calculator_id uuid, p_reviewer_id uuid
) returns void
language plpgsql security invoker set search_path = public
as $$
declare
  v_role text;
  v_reviewer_role text;
  v_updated_id uuid;
begin
  select role into v_role from public.platform_admins
    where user_id = auth.uid() and active;
  if v_role is null or v_role not in ('owner','admin') then
    raise exception 'Admin permission required';
  end if;
  select role into v_reviewer_role from public.platform_admins
    where user_id = p_reviewer_id and active;
  if v_reviewer_role is null or v_reviewer_role not in ('owner','admin','reviewer') then
    raise exception 'Reviewer must be an active review-capable admin';
  end if;
  update public.calculator_catalog_admin
    set reviewer_id = p_reviewer_id
    where id = p_calculator_id
    returning id into v_updated_id;
  if v_updated_id is null then
    raise exception 'Reviewer assignment did not update the calculator';
  end if;
  insert into public.calculator_review_events
    (calculator_id, actor_id, event_type, metadata)
    values (p_calculator_id, auth.uid(), 'reviewer-assigned',
      jsonb_build_object('reviewerId', p_reviewer_id));
end;
$$;
revoke all on function public.assign_calculator_reviewer(uuid,uuid) from public, anon;
grant execute on function public.assign_calculator_reviewer(uuid,uuid) to authenticated;
