-- Assign a reviewer and record the audit event in the same transaction.
-- Target reviewer identity is checked through a tightly scoped definer helper:
-- platform_admins RLS intentionally exposes only the caller's own row.
create or replace function public.is_active_review_capable_admin(p_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $review_target$
  select public.has_platform_role(array['owner','admin']) and exists (
    select 1 from public.platform_admins
    where user_id = p_user_id and active and role in ('owner','admin','reviewer')
  )
$review_target$;
revoke all on function public.is_active_review_capable_admin(uuid) from public, anon;
grant execute on function public.is_active_review_capable_admin(uuid) to authenticated;

-- SECURITY INVOKER preserves existing RLS, role policies and catalog gate triggers.
create or replace function public.assign_calculator_reviewer(
  p_calculator_id uuid, p_reviewer_id uuid
) returns void
language plpgsql security invoker set search_path = public
as $$
declare
  v_role text;
  v_updated_id uuid;
begin
  select role into v_role from public.platform_admins
    where user_id = auth.uid() and active;
  if v_role is null or v_role not in ('owner','admin') then
    raise exception 'Admin permission required';
  end if;
  if not public.is_active_review_capable_admin(p_reviewer_id) then
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
