-- Align the authoritative database publishing gate with the Final Master certification evidence model.
-- Additive migration: existing QA rows remain valid; new evidence rows are created by the admin application.

alter table public.calculator_qa_checks
  drop constraint if exists calculator_qa_checks_check_type_check;

alter table public.calculator_qa_checks
  add constraint calculator_qa_checks_check_type_check
  check (check_type in (
    'engine-tests','formula-review','sources','methodology',
    'reverse-solve','visualization-reconciliation','schedule-reconciliation',
    'scenario-reconciliation','sensitivity-validation','entitlement-validation',
    'ux-responsive','performance','security',
    'seo-content','accessibility','ymyl-review'
  ));

create or replace function public.validate_calculator_publish_gate(p_calculator_id uuid)
returns table(ok boolean, failures text[])
language plpgsql
security definer
set search_path = public
as $$
declare
  v_calc public.calculator_catalog_admin%rowtype;
  v_failures text[] := '{}';
  v_required text[] := array[
    'engine-tests','formula-review','sources','methodology',
    'reverse-solve','visualization-reconciliation','schedule-reconciliation',
    'scenario-reconciliation','sensitivity-validation','entitlement-validation',
    'ux-responsive','performance','security','seo-content','accessibility'
  ];
  v_check text;
  v_status text;
begin
  if auth.role() <> 'service_role' and not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select * into v_calc from public.calculator_catalog_admin where id = p_calculator_id;
  if v_calc.id is null then
    return query select false, array['Calculator not found'];
    return;
  end if;

  if v_calc.source_count < 1 then
    v_failures := array_append(v_failures, 'At least one reviewed source is required');
  end if;

  if v_calc.risk_class in ('financial','health','tax') then
    v_required := array_append(v_required, 'ymyl-review');
    if v_calc.reviewer_id is null then
      v_failures := array_append(v_failures, 'YMYL reviewer is required');
    end if;
  end if;

  foreach v_check in array v_required loop
    select status into v_status
    from public.calculator_qa_checks
    where calculator_id = p_calculator_id and check_type = v_check;

    if coalesce(v_status, 'pending') not in ('passed','waived') then
      v_failures := array_append(v_failures, format('%s must pass', v_check));
    end if;
  end loop;

  return query select cardinality(v_failures) = 0, v_failures;
end;
$$;

revoke execute on function public.validate_calculator_publish_gate(uuid) from public, anon;
grant execute on function public.validate_calculator_publish_gate(uuid) to authenticated, service_role;
