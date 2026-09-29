-- Keep custom calculator publication behind the same Business entitlement as creation.
-- Existing organization role and version checks are preserved.

create or replace function public.publish_custom_calculator(p_calculator_id uuid, p_version integer)
returns void
language plpgsql
security definer set search_path = public
as $$
declare v_org uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select organization_id into v_org from public.custom_calculators where id = p_calculator_id;
  if v_org is null then raise exception 'Calculator not found'; end if;
  if not exists(select 1 from public.profiles p where p.id=auth.uid() and p.plan='business') then raise exception 'Business plan required'; end if;
  if not public.has_org_role(v_org, array['owner','admin','manager']) then raise exception 'Builder permission required'; end if;
  if not exists (select 1 from public.custom_calculator_versions where calculator_id = p_calculator_id and version = p_version) then raise exception 'Version not found'; end if;

  update public.custom_calculators set status = 'published', published_version = p_version, updated_at = now() where id = p_calculator_id;
  insert into public.organization_audit_log (organization_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (v_org, auth.uid(), 'custom_calculator.published', 'custom_calculator', p_calculator_id::text, jsonb_build_object('version', p_version));
end;
$$;

revoke execute on function public.publish_custom_calculator(uuid,integer) from public, anon;
grant execute on function public.publish_custom_calculator(uuid,integer) to authenticated;
