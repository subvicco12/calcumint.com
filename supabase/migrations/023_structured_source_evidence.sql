-- Structured reviewed-source evidence for calculator certification.
-- Legacy source_count values are not converted into evidence: real reviewed records are required.

create table if not exists public.calculator_source_evidence (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references public.calculator_catalog_admin(id) on delete cascade,
  label text not null check (char_length(trim(label)) between 2 and 300),
  url text not null check (char_length(trim(url)) between 8 and 2000 and url ~* '^https?://[^[:space:]]+$'),
  source_kind text not null default 'reference' check (source_kind in ('reference','official','methodology')),
  reviewed_by uuid not null references auth.users(id) on delete restrict,
  reviewed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(calculator_id, url)
);

create index if not exists calculator_source_evidence_calculator_idx
  on public.calculator_source_evidence(calculator_id, reviewed_at desc);

alter table public.calculator_source_evidence enable row level security;

create policy "source_evidence_admin_read" on public.calculator_source_evidence
for select using (public.is_platform_admin());

create policy "source_evidence_reviewer_insert" on public.calculator_source_evidence
for insert with check (
  public.has_platform_role(array['owner','admin','reviewer'])
  and reviewed_by = auth.uid()
);

create policy "source_evidence_reviewer_update" on public.calculator_source_evidence
for update using (public.has_platform_role(array['owner','admin','reviewer']))
with check (
  public.has_platform_role(array['owner','admin','reviewer'])
  and reviewed_by = auth.uid()
);

create policy "source_evidence_admin_delete" on public.calculator_source_evidence
for delete using (public.has_platform_role(array['owner','admin']));

create or replace function public.stamp_source_evidence_review()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := now();
  else
    new.created_at := old.created_at;
  end if;
  if auth.role() <> 'service_role' then
    new.reviewed_by := auth.uid();
    new.reviewed_at := now();
  elsif new.reviewed_at is null then
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

create trigger calculator_source_evidence_stamp_before_write
before insert or update on public.calculator_source_evidence
for each row execute function public.stamp_source_evidence_review();

-- Structured rows are authoritative. source_count is a derived display/cache field only.
create or replace function public.sync_source_evidence_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op in ('UPDATE','DELETE') then
    update public.calculator_catalog_admin
    set source_count = (select count(*)::integer from public.calculator_source_evidence where calculator_id = old.calculator_id)
    where id = old.calculator_id;
  end if;
  if tg_op in ('INSERT','UPDATE') and (tg_op = 'INSERT' or new.calculator_id is distinct from old.calculator_id) then
    update public.calculator_catalog_admin
    set source_count = (select count(*)::integer from public.calculator_source_evidence where calculator_id = new.calculator_id)
    where id = new.calculator_id;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger calculator_source_evidence_sync_count_after_write
after insert or update or delete on public.calculator_source_evidence
for each row execute function public.sync_source_evidence_count();

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
  v_check text; v_status text; v_rule jsonb; v_source jsonb; v_date text;
  v_reviewer_valid boolean; v_source_count integer;
begin
  if auth.role() <> 'service_role' and not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
  select * into v_calc from public.calculator_catalog_admin where id = p_calculator_id;
  if v_calc.id is null then return query select false, array['Calculator not found']; return; end if;

  select count(*)::integer into v_source_count
  from public.calculator_source_evidence where calculator_id = p_calculator_id;
  if v_source_count < 1 then
    v_failures := array_append(v_failures, 'At least one reviewed source evidence record is required');
  end if;

  if lower(trim(coalesce(v_calc.metadata ->> 'rulePackRequired', ''))) = 'true' then
    v_required := array_append(v_required, 'rule-pack-validation');
    if coalesce(jsonb_typeof(v_calc.metadata -> 'ruleMetadata'), '') <> 'array'
       or coalesce(jsonb_array_length(v_calc.metadata -> 'ruleMetadata'), 0) = 0 then
      v_failures := array_append(v_failures, 'Complete regulatory rule metadata is required');
    else
      for v_rule in select value from jsonb_array_elements(v_calc.metadata -> 'ruleMetadata') loop
        if trim(coalesce(v_rule #>> '{jurisdiction,country}', '')) = ''
           or trim(coalesce(v_rule ->> 'ruleVersion', '')) = ''
           or coalesce(v_rule ->> 'effectiveFrom', '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}
           or coalesce(v_rule ->> 'lastVerifiedAt', '') !~ '^\\d{4}-\\d{2}-\\d{2}$'
           or coalesce(jsonb_typeof(v_rule -> 'officialSources'), '') <> 'array'
           or coalesce(jsonb_array_length(v_rule -> 'officialSources'), 0) = 0 then
          v_failures := array_append(v_failures, 'Regulatory rule metadata is incomplete'); exit;
        end if;
        foreach v_date in array array[v_rule ->> 'effectiveFrom', v_rule ->> 'lastVerifiedAt'] loop
          begin
            if to_char(v_date::date, 'YYYY-MM-DD') <> v_date then raise exception 'invalid date'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid date'); exit;
          end;
        end loop;
        if array_position(v_failures, 'Regulatory rule metadata contains an invalid date') is not null then exit; end if;
        if v_rule ? 'effectiveTo' then
          v_date := v_rule ->> 'effectiveTo';
          begin
            if v_date !~ '^\\d{4}-\\d{2}-\\d{2}$'
               or to_char(v_date::date, 'YYYY-MM-DD') <> v_date
               or v_date::date < (v_rule ->> 'effectiveFrom')::date then raise exception 'invalid effective period'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid effective period'); exit;
          end;
        end if;
        for v_source in select value from jsonb_array_elements(v_rule -> 'officialSources') loop
          if jsonb_typeof(v_source) <> 'object'
             or trim(coalesce(v_source ->> 'label', '')) = ''
             or trim(coalesce(v_source ->> 'url', '')) = '' then
            v_failures := array_append(v_failures, 'Regulatory official sources require labels and URLs'); exit;
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
      where user_id = v_calc.reviewer_id and active and role in ('owner','admin','reviewer')
    ) into v_reviewer_valid;
    if not coalesce(v_reviewer_valid, false) then
      v_failures := array_append(v_failures, 'Active review-capable YMYL reviewer is required');
    end if;
  end if;

  foreach v_check in array v_required loop
    select status into v_status from public.calculator_qa_checks
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

create or replace function public.enforce_source_evidence_certification()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_calculator_id uuid; v_lifecycle text; v_ok boolean; v_failures text[];
begin
  v_calculator_id := coalesce(new.calculator_id, old.calculator_id);
  select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = v_calculator_id;
  if v_lifecycle in ('certified','published') then
    select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(v_calculator_id);
    if not v_ok then
      raise exception 'Certified calculator source evidence cannot become invalid: %', array_to_string(v_failures, '; ');
    end if;
  end if;
  if tg_op = 'UPDATE' and new.calculator_id is distinct from old.calculator_id then
    select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = old.calculator_id;
    if v_lifecycle in ('certified','published') then
      select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(old.calculator_id);
      if not v_ok then
        raise exception 'Certified calculator source evidence cannot become invalid: %', array_to_string(v_failures, '; ');
      end if;
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create constraint trigger calculator_source_evidence_certification_after_write
after insert or update or delete on public.calculator_source_evidence
deferrable initially deferred
for each row execute function public.enforce_source_evidence_certification();

-- Explicitly invalidate legacy certifications under the stronger source-evidence model.
-- No evidence rows are invented from historical source_count values.
update public.calculator_catalog_admin
set lifecycle = 'review', publish_at = null, updated_at = now()
where lifecycle in ('certified','published')
  and not exists (
    select 1 from public.calculator_source_evidence s
    where s.calculator_id = calculator_catalog_admin.id
  );

           or coalesce(v_rule ->> 'lastVerifiedAt', '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}
           or coalesce(jsonb_typeof(v_rule -> 'officialSources'), '') <> 'array'
           or coalesce(jsonb_array_length(v_rule -> 'officialSources'), 0) = 0 then
          v_failures := array_append(v_failures, 'Regulatory rule metadata is incomplete'); exit;
        end if;
        foreach v_date in array array[v_rule ->> 'effectiveFrom', v_rule ->> 'lastVerifiedAt'] loop
          begin
            if to_char(v_date::date, 'YYYY-MM-DD') <> v_date then raise exception 'invalid date'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid date'); exit;
          end;
        end loop;
        if array_position(v_failures, 'Regulatory rule metadata contains an invalid date') is not null then exit; end if;
        if v_rule ? 'effectiveTo' then
          v_date := v_rule ->> 'effectiveTo';
          begin
            if v_date !~ '^\\d{4}-\\d{2}-\\d{2}$'
               or to_char(v_date::date, 'YYYY-MM-DD') <> v_date
               or v_date::date < (v_rule ->> 'effectiveFrom')::date then raise exception 'invalid effective period'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid effective period'); exit;
          end;
        end if;
        for v_source in select value from jsonb_array_elements(v_rule -> 'officialSources') loop
          if jsonb_typeof(v_source) <> 'object'
             or trim(coalesce(v_source ->> 'label', '')) = ''
             or trim(coalesce(v_source ->> 'url', '')) = '' then
            v_failures := array_append(v_failures, 'Regulatory official sources require labels and URLs'); exit;
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
      where user_id = v_calc.reviewer_id and active and role in ('owner','admin','reviewer')
    ) into v_reviewer_valid;
    if not coalesce(v_reviewer_valid, false) then
      v_failures := array_append(v_failures, 'Active review-capable YMYL reviewer is required');
    end if;
  end if;

  foreach v_check in array v_required loop
    select status into v_status from public.calculator_qa_checks
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

create or replace function public.enforce_source_evidence_certification()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_calculator_id uuid; v_lifecycle text; v_ok boolean; v_failures text[];
begin
  v_calculator_id := coalesce(new.calculator_id, old.calculator_id);
  select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = v_calculator_id;
  if v_lifecycle in ('certified','published') then
    select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(v_calculator_id);
    if not v_ok then
      raise exception 'Certified calculator source evidence cannot become invalid: %', array_to_string(v_failures, '; ');
    end if;
  end if;
  if tg_op = 'UPDATE' and new.calculator_id is distinct from old.calculator_id then
    select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = old.calculator_id;
    if v_lifecycle in ('certified','published') then
      select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(old.calculator_id);
      if not v_ok then
        raise exception 'Certified calculator source evidence cannot become invalid: %', array_to_string(v_failures, '; ');
      end if;
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create constraint trigger calculator_source_evidence_certification_after_write
after insert or update or delete on public.calculator_source_evidence
deferrable initially deferred
for each row execute function public.enforce_source_evidence_certification();

-- Explicitly invalidate legacy certifications under the stronger source-evidence model.
-- No evidence rows are invented from historical source_count values.
update public.calculator_catalog_admin
set lifecycle = 'review', publish_at = null, updated_at = now()
where lifecycle in ('certified','published')
  and not exists (
    select 1 from public.calculator_source_evidence s
    where s.calculator_id = calculator_catalog_admin.id
  );

           or coalesce(jsonb_typeof(v_rule -> 'officialSources'), '') <> 'array'
           or coalesce(jsonb_array_length(v_rule -> 'officialSources'), 0) = 0 then
          v_failures := array_append(v_failures, 'Regulatory rule metadata is incomplete'); exit;
        end if;
        foreach v_date in array array[v_rule ->> 'effectiveFrom', v_rule ->> 'lastVerifiedAt'] loop
          begin
            if to_char(v_date::date, 'YYYY-MM-DD') <> v_date then raise exception 'invalid date'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid date'); exit;
          end;
        end loop;
        if array_position(v_failures, 'Regulatory rule metadata contains an invalid date') is not null then exit; end if;
        if v_rule ? 'effectiveTo' then
          v_date := v_rule ->> 'effectiveTo';
          begin
            if v_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}
               or to_char(v_date::date, 'YYYY-MM-DD') <> v_date
               or v_date::date < (v_rule ->> 'effectiveFrom')::date then raise exception 'invalid effective period'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid effective period'); exit;
          end;
        end if;
        for v_source in select value from jsonb_array_elements(v_rule -> 'officialSources') loop
          if jsonb_typeof(v_source) <> 'object'
             or trim(coalesce(v_source ->> 'label', '')) = ''
             or trim(coalesce(v_source ->> 'url', '')) = '' then
            v_failures := array_append(v_failures, 'Regulatory official sources require labels and URLs'); exit;
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
      where user_id = v_calc.reviewer_id and active and role in ('owner','admin','reviewer')
    ) into v_reviewer_valid;
    if not coalesce(v_reviewer_valid, false) then
      v_failures := array_append(v_failures, 'Active review-capable YMYL reviewer is required');
    end if;
  end if;

  foreach v_check in array v_required loop
    select status into v_status from public.calculator_qa_checks
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

create or replace function public.enforce_source_evidence_certification()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_calculator_id uuid; v_lifecycle text; v_ok boolean; v_failures text[];
begin
  v_calculator_id := coalesce(new.calculator_id, old.calculator_id);
  select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = v_calculator_id;
  if v_lifecycle in ('certified','published') then
    select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(v_calculator_id);
    if not v_ok then
      raise exception 'Certified calculator source evidence cannot become invalid: %', array_to_string(v_failures, '; ');
    end if;
  end if;
  if tg_op = 'UPDATE' and new.calculator_id is distinct from old.calculator_id then
    select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = old.calculator_id;
    if v_lifecycle in ('certified','published') then
      select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(old.calculator_id);
      if not v_ok then
        raise exception 'Certified calculator source evidence cannot become invalid: %', array_to_string(v_failures, '; ');
      end if;
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create constraint trigger calculator_source_evidence_certification_after_write
after insert or update or delete on public.calculator_source_evidence
deferrable initially deferred
for each row execute function public.enforce_source_evidence_certification();

-- Explicitly invalidate legacy certifications under the stronger source-evidence model.
-- No evidence rows are invented from historical source_count values.
update public.calculator_catalog_admin
set lifecycle = 'review', publish_at = null, updated_at = now()
where lifecycle in ('certified','published')
  and not exists (
    select 1 from public.calculator_source_evidence s
    where s.calculator_id = calculator_catalog_admin.id
  );

               or to_char(v_date::date, 'YYYY-MM-DD') <> v_date
               or v_date::date < (v_rule ->> 'effectiveFrom')::date then raise exception 'invalid effective period'; end if;
          exception when others then
            v_failures := array_append(v_failures, 'Regulatory rule metadata contains an invalid effective period'); exit;
          end;
        end if;
        for v_source in select value from jsonb_array_elements(v_rule -> 'officialSources') loop
          if jsonb_typeof(v_source) <> 'object'
             or trim(coalesce(v_source ->> 'label', '')) = ''
             or trim(coalesce(v_source ->> 'url', '')) = '' then
            v_failures := array_append(v_failures, 'Regulatory official sources require labels and URLs'); exit;
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
      where user_id = v_calc.reviewer_id and active and role in ('owner','admin','reviewer')
    ) into v_reviewer_valid;
    if not coalesce(v_reviewer_valid, false) then
      v_failures := array_append(v_failures, 'Active review-capable YMYL reviewer is required');
    end if;
  end if;

  foreach v_check in array v_required loop
    select status into v_status from public.calculator_qa_checks
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

create or replace function public.enforce_source_evidence_certification()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_calculator_id uuid; v_lifecycle text; v_ok boolean; v_failures text[];
begin
  v_calculator_id := coalesce(new.calculator_id, old.calculator_id);
  select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = v_calculator_id;
  if v_lifecycle in ('certified','published') then
    select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(v_calculator_id);
    if not v_ok then
      raise exception 'Certified calculator source evidence cannot become invalid: %', array_to_string(v_failures, '; ');
    end if;
  end if;
  if tg_op = 'UPDATE' and new.calculator_id is distinct from old.calculator_id then
    select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = old.calculator_id;
    if v_lifecycle in ('certified','published') then
      select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(old.calculator_id);
      if not v_ok then
        raise exception 'Certified calculator source evidence cannot become invalid: %', array_to_string(v_failures, '; ');
      end if;
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create constraint trigger calculator_source_evidence_certification_after_write
after insert or update or delete on public.calculator_source_evidence
deferrable initially deferred
for each row execute function public.enforce_source_evidence_certification();

-- Explicitly invalidate legacy certifications under the stronger source-evidence model.
-- No evidence rows are invented from historical source_count values.
update public.calculator_catalog_admin
set lifecycle = 'review', publish_at = null, updated_at = now()
where lifecycle in ('certified','published')
  and not exists (
    select 1 from public.calculator_source_evidence s
    where s.calculator_id = calculator_catalog_admin.id
  );
