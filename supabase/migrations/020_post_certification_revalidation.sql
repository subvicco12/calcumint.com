-- Revalidate certification after gate-sensitive catalog or QA evidence mutations.
-- Certified/published calculators must never retain that state when their current evidence fails the authoritative gate.

create or replace function public.enforce_calculator_publish_gate()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_ok boolean;
  v_failures text[];
  v_role text;
  v_gate_sensitive_change boolean;
begin
  if new.publish_at is distinct from old.publish_at and auth.role() <> 'service_role' then
    select role into v_role from public.platform_admins where user_id = auth.uid() and active;
    if v_role not in ('owner','admin') or v_role is null then
      raise exception 'Owner or admin required to schedule publication';
    end if;
  end if;

  if new.lifecycle is distinct from old.lifecycle then
    if not (
      (old.lifecycle = 'draft' and new.lifecycle in ('review','archived')) or
      (old.lifecycle = 'review' and new.lifecycle in ('draft','certified','archived')) or
      (old.lifecycle = 'certified' and new.lifecycle in ('review','published','archived')) or
      (old.lifecycle = 'published' and new.lifecycle in ('review','archived')) or
      (old.lifecycle = 'archived' and new.lifecycle = 'draft')
    ) then
      raise exception 'Invalid lifecycle transition: % -> %', old.lifecycle, new.lifecycle;
    end if;

    if auth.role() <> 'service_role' then
      select role into v_role from public.platform_admins where user_id = auth.uid() and active;
      if v_role is null then raise exception 'Platform admin required'; end if;
      if v_role = 'editor' and new.lifecycle not in ('draft','review') then
        raise exception 'Editor cannot transition calculator to %', new.lifecycle;
      end if;
      if v_role = 'reviewer' and new.lifecycle = 'published' then
        raise exception 'Reviewer cannot publish calculators';
      end if;
    end if;
  end if;

  v_gate_sensitive_change :=
    new.lifecycle is distinct from old.lifecycle or
    new.risk_class is distinct from old.risk_class or
    new.source_count is distinct from old.source_count or
    new.reviewer_id is distinct from old.reviewer_id or
    new.metadata is distinct from old.metadata;

  if new.lifecycle in ('certified','published') and v_gate_sensitive_change then
    select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(new.id);
    if not v_ok then raise exception 'Publishing gate failed: %', array_to_string(v_failures, '; '); end if;
  end if;

  if new.lifecycle = 'published' and new.published_at is null then new.published_at := now(); end if;
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.enforce_qa_evidence_certification()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_calculator_id uuid;
  v_lifecycle text;
  v_ok boolean;
  v_failures text[];
begin
  v_calculator_id := coalesce(new.calculator_id, old.calculator_id);
  select lifecycle into v_lifecycle from public.calculator_catalog_admin where id = v_calculator_id;

  if v_lifecycle in ('certified','published') then
    select ok, failures into v_ok, v_failures from public.validate_calculator_publish_gate(v_calculator_id);
    if not v_ok then
      raise exception 'Certified calculator evidence cannot become invalid: %', array_to_string(v_failures, '; ');
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists calculator_qa_certification_after_write on public.calculator_qa_checks;
create constraint trigger calculator_qa_certification_after_write
after insert or update or delete on public.calculator_qa_checks
deferrable initially deferred
for each row execute function public.enforce_qa_evidence_certification();
