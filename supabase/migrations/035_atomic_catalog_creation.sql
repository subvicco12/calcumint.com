-- Create catalog entry, required pending QA checks, and creation audit as one transaction.
-- SECURITY INVOKER preserves table RLS and certification triggers.
create or replace function public.create_catalog_calculator_with_audit(
  p_calculator_key text, p_slug text, p_title text, p_category text,
  p_risk_class text, p_metadata jsonb
) returns uuid
language plpgsql security invoker set search_path = public
as $$
declare
  v_id uuid;
  v_role text;
  v_checks text[] := array[
    'engine-tests','formula-review','sources','methodology','reverse-solve',
    'visualization-reconciliation','schedule-reconciliation','scenario-reconciliation',
    'sensitivity-validation','entitlement-validation','ux-responsive','performance',
    'security','seo-content','accessibility'
  ];
  v_check text;
begin
  select role into v_role from public.platform_admins
    where user_id = auth.uid() and active;
  if v_role is null or v_role not in ('owner','admin','reviewer') then
    raise exception 'Platform admin permission required';
  end if;
  if p_risk_class is null or p_risk_class not in ('standard','financial','health','tax') then
    raise exception 'Invalid calculator risk class';
  end if;
  if p_metadata is null or jsonb_typeof(p_metadata) <> 'object' then
    raise exception 'Invalid calculator metadata';
  end if;
  if p_metadata ->> 'rulePackRequired' = 'true' then
    v_checks := array_append(v_checks, 'rule-pack-validation');
  end if;
  if p_risk_class in ('financial','health','tax') then
    v_checks := array_append(v_checks, 'ymyl-review');
  end if;
  insert into public.calculator_catalog_admin
    (calculator_key, slug, title, category, risk_class, metadata, created_by)
  values (p_calculator_key, p_slug, p_title, p_category, p_risk_class, p_metadata, auth.uid())
  returning id into v_id;
  foreach v_check in array v_checks loop
    insert into public.calculator_qa_checks (calculator_id, check_type)
    values (v_id, v_check);
  end loop;
  insert into public.calculator_review_events
    (calculator_id, actor_id, event_type, to_state)
  values (v_id, auth.uid(), 'created', 'draft');
  return v_id;
end;
$$;
revoke all on function public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb) from public, anon;
grant execute on function public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb) to authenticated;
