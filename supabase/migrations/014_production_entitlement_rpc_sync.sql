-- Sync production SECURITY DEFINER RPCs with the repository's current entitlement guards.
-- This is intentionally additive: existing signatures and authenticated grants are preserved.

create or replace function public.create_business_organization(org_name text, org_slug text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists(select 1 from public.profiles where id = auth.uid() and plan = 'business') then raise exception 'Business plan required'; end if;
  if exists(select 1 from public.organization_members where user_id=auth.uid() and role='owner') then raise exception 'Business account already owns an organization'; end if;
  insert into public.organizations(name, slug, owner_user_id) values (trim(org_name), lower(trim(org_slug)), auth.uid()) returning id into new_id;
  insert into public.organization_members(organization_id, user_id, role) values (new_id, auth.uid(), 'owner');
  insert into public.organization_audit_log(organization_id, actor_user_id, action, entity_type, entity_id) values (new_id, auth.uid(), 'organization.created', 'organization', new_id::text);
  return new_id;
end;
$$;

create or replace function public.create_custom_calculator(p_organization_id uuid,p_name text,p_slug text,p_description text,p_definition jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; declare v_visibility text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists(select 1 from public.profiles p where p.id=auth.uid() and p.plan='business') then raise exception 'Business plan required'; end if;
  if not public.has_org_role(p_organization_id, array['owner','admin','manager']) then raise exception 'Builder permission required'; end if;
  v_visibility := coalesce(p_definition->>'visibility', 'private');
  if v_visibility not in ('private','workspace','share-link') then raise exception 'Invalid visibility'; end if;
  insert into public.custom_calculators (organization_id,name,slug,description,visibility,created_by) values (p_organization_id,p_name,p_slug,coalesce(p_description,''),v_visibility,auth.uid()) returning id into v_id;
  insert into public.custom_calculator_versions (calculator_id,version,definition,change_note,created_by) values (v_id,1,p_definition,'Initial version',auth.uid());
  insert into public.organization_audit_log (organization_id,actor_user_id,action,entity_type,entity_id,metadata) values (p_organization_id,auth.uid(),'custom_calculator.created','custom_calculator',v_id::text,jsonb_build_object('name',p_name));
  return v_id;
end;
$$;

create or replace function public.consume_ai_quota(p_feature text)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); declare v_plan text; declare v_limit integer; declare v_count bigint; declare v_org uuid; declare v_id bigint;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_feature not in ('finder','explain','scenario','builder') then raise exception 'Unknown AI feature'; end if;
  select plan into v_plan from public.profiles where id = v_user; v_plan := coalesce(v_plan, 'free');
  if p_feature = 'builder' and v_plan <> 'business' then raise exception 'Business plan required'; end if;
  if p_feature in ('explain','scenario') and v_plan not in ('pro','business') then raise exception 'Pro or Business plan required'; end if;
  v_limit := case v_plan when 'business' then 1000 when 'pro' then 200 else 10 end;
  select count(*) into v_count from public.ai_usage_events where user_id = v_user and created_at >= date_trunc('month', now());
  if v_count >= v_limit then raise exception 'Monthly AI request limit reached'; end if;
  if p_feature='builder' and not exists(select 1 from public.organization_members m where m.user_id=v_user and public.has_org_role(m.organization_id,array['owner','admin','manager'])) then raise exception 'Builder permission required'; end if;
  if exists(select 1 from public.ai_usage_events where user_id = v_user and created_at >= now() - interval '1 minute' having count(*) >= 10) then raise exception 'AI request rate limit reached'; end if;
  select organization_id into v_org from public.organization_members where user_id = v_user order by joined_at asc limit 1;
  insert into public.ai_usage_events(user_id,organization_id,feature) values (v_user,v_org,p_feature) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.validate_calculator_publish_gate(p_calculator_id uuid)
returns table(ok boolean, failures text[]) language plpgsql security definer set search_path = public as $$
declare v_calc public.calculator_catalog_admin%rowtype; declare v_failures text[] := '{}'; declare v_required text[] := array['engine-tests','formula-review','sources','methodology','seo-content','accessibility']; declare v_check text; declare v_status text;
begin
  if auth.role() <> 'service_role' and not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
  select * into v_calc from public.calculator_catalog_admin where id = p_calculator_id;
  if v_calc.id is null then return query select false, array['Calculator not found']; return; end if;
  if v_calc.source_count < 1 then v_failures := array_append(v_failures, 'At least one reviewed source is required'); end if;
  if v_calc.risk_class in ('financial','health','tax') then v_required := array_append(v_required, 'ymyl-review'); if v_calc.reviewer_id is null then v_failures := array_append(v_failures, 'YMYL reviewer is required'); end if; end if;
  foreach v_check in array v_required loop select status into v_status from public.calculator_qa_checks where calculator_id=p_calculator_id and check_type=v_check; if coalesce(v_status,'pending') not in ('passed','waived') then v_failures := array_append(v_failures, format('%s must pass',v_check)); end if; end loop;
  return query select cardinality(v_failures)=0, v_failures;
end;
$$;

revoke execute on function public.create_business_organization(text,text) from public, anon;
revoke execute on function public.create_custom_calculator(uuid,text,text,text,jsonb) from public, anon;
revoke execute on function public.consume_ai_quota(text) from public, anon;
revoke execute on function public.validate_calculator_publish_gate(uuid) from public, anon;
grant execute on function public.create_business_organization(text,text) to authenticated;
grant execute on function public.create_custom_calculator(uuid,text,text,text,jsonb) to authenticated;
grant execute on function public.consume_ai_quota(text) to authenticated;
grant execute on function public.validate_calculator_publish_gate(uuid) to authenticated, service_role;
