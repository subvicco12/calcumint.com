-- Harden reviewer validity and QA evidence attribution at the database boundary.
-- Waivers are exceptional certification evidence and are restricted to owner/admin.

create or replace function public.enforce_qa_evidence_authority()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role text;
begin
  if auth.role() = 'service_role' then
    return case when tg_op = 'DELETE' then old else new end;
  end if;

  select role into v_role
  from public.platform_admins
  where user_id = auth.uid() and active;

  if v_role not in ('owner','admin','reviewer') or v_role is null then
    raise exception 'Review-capable platform admin required';
  end if;

  if tg_op in ('INSERT','UPDATE') and new.status <> 'pending' then
    if new.checked_by is distinct from auth.uid() then
      raise exception 'QA evidence checked_by must match the authenticated reviewer';
    end if;
    if new.status = 'waived' and v_role not in ('owner','admin') then
      raise exception 'Owner or admin required to waive QA evidence';
    end if;
  end if;

  if tg_op = 'DELETE' and v_role not in ('owner','admin') then
    raise exception 'Owner or admin required to delete QA evidence';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists calculator_qa_evidence_authority_before_write on public.calculator_qa_checks;
create trigger calculator_qa_evidence_authority_before_write
before insert or update or delete on public.calculator_qa_checks
for each row execute function public.enforce_qa_evidence_authority();

create or replace function public.validate_calculator_publish_gate(p_calculator_id uuid)
returns table(ok boolean, failures text[])
language plpgsql security definer set search_path = public
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
  v_rule jsonb;
  v_source jsonb;
  v_date text;
  v_reviewer_valid boolean;
begin
  if auth.role() <> 'service_role' and not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
  select * into v_calc from public.calculator_catalog_admin where id = p_calculator_id;
  if v_calc.id is null then return query select false, array['Calculator not found']; return; end if;
  if v_calc.source_count < 1 then v_failures := array_append(v_failures, 'At least one reviewed source is required'); end if;

  if lower(trim(coalesce(v_calc.metadata ->> 'rulePackRequired', ''))) = 'true' then
    v_required := array_append(v_required, 'rule-pack-validation');
    if coalesce(jsonb_typeof(v_calc.metadata -> 'ruleMetadata'), '') <> 'array'
       or coalesce(jsonb_array_length(v_calc.metadata -> 'ruleMetadata'), 0) = 0 then
      v_failures := array_append(v_failures, 'Complete regulatory rule metadata is required');
    else
      for v_rule in select value from jsonb_array_elements(v_calc.metadata -> 'ruleMetadata') loop
        if trim(coalesce(v_rule #>> '{jurisdiction,country}', '')) = ''
           or trim(coalesce(v_rule ->> 'ruleVersion', '')) = ''
           or coalesce(v_rule ->> 'effectiveFrom', '') !~ '^\\d{4}-\\d{2}-\\d{2}$'
           or coalesce(v_rule ->> 'lastVerifiedAt', '') !~ '^\\d{4}-\\d{2}-\\d{2}$'
           or coalesce(jsonb_typeof(v_rule -> 'officialSources'), '') <> 'array'
           or coalesce(jsonb_array_length(v_rule -> 'officialSources'), 0) = 0 then
          v_failures := array_append(v_failures, 'Regulatory rule metadata is incomplete');
          exit;
        end if;
        foreach v_date in array array[v_rule ->> 'effectiveFrom', v_rule ->> 'lastVerifiedAt'] loop
          begin
            if to_char(v_date::date, 'YYYY-MM-DD') <> v_date then raise exception 'invalid date'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid date');
            exit;
          end;
        end loop;
        if array_position(v_failures, 'Regulatory rule metadata contains an invalid date') is not null then exit; end if;
        if v_rule ? 'effectiveTo' then
          v_date := v_rule ->> 'effectiveTo';
          begin
            if v_date !~ '^\\d{4}-\\d{2}-\\d{2}$' or to_char(v_date::date, 'YYYY-MM-DD') <> v_date
               or v_date::date < (v_rule ->> 'effectiveFrom')::date then raise exception 'invalid effective period'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid effective period');
            exit;
          end;
        end if;
        for v_source in select value from jsonb_array_elements(v_rule -> 'officialSources') loop
          if jsonb_typeof(v_source) <> 'object'
             or trim(coalesce(v_source ->> 'label', '')) = ''
             or trim(coalesce(v_source ->> 'url', '')) = '' then
            v_failures := array_append(v_failures, 'Regulatory official sources require labels and URLs');
            exit;
          end if;
        end loop;
        if array_position(v_failures, 'Regulatory official sources require labels and URLs') is not null then exit; end if;
      end loop;
    end if;
  end if;

  if v_calc.risk_class in ('financial','health','tax') then
    v_required := array_append(v_required, 'ymyl-review');
    select exists(
      select 1 from public.platform_admins
      where user_id = v_calc.reviewer_id
        and active
        and role in ('owner','admin','reviewer')
    ) into v_reviewer_valid;
    if not coalesce(v_reviewer_valid, false) then
      v_failures := array_append(v_failures, 'Active review-capable YMYL reviewer is required');
    end if;
  end if;

  foreach v_check in array v_required loop
    select status into v_status from public.calculator_qa_checks where calculator_id = p_calculator_id and check_type = v_check;
    if coalesce(v_status, 'pending') not in ('passed','waived') then v_failures := array_append(v_failures, format('%s must pass', v_check)); end if;
  end loop;
  return query select cardinality(v_failures) = 0, v_failures;
end;
$$;

revoke execute on function public.validate_calculator_publish_gate(uuid) from public, anon;
grant execute on function public.validate_calculator_publish_gate(uuid) to authenticated, service_role;


-- Prevent authority changes from silently invalidating already certified/published YMYL records.
-- This does not demote or unpublish calculators; the authority change itself must wait until
-- affected records are reassigned or moved out of a certified/published lifecycle.
create or replace function public.protect_active_ymyl_reviewer_authority()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.active and old.role in ('owner','admin','reviewer')
     and (not new.active or new.role not in ('owner','admin','reviewer')) then
    if exists(
      select 1 from public.calculator_catalog_admin c
      where c.reviewer_id = old.user_id
        and c.risk_class in ('financial','health','tax')
        and c.lifecycle in ('certified','published')
    ) then
      raise exception 'Reassign or decertify governed YMYL calculators before removing reviewer authority';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_active_ymyl_reviewer_authority_before_update on public.platform_admins;
create trigger protect_active_ymyl_reviewer_authority_before_update
before update of active, role on public.platform_admins
for each row execute function public.protect_active_ymyl_reviewer_authority();
