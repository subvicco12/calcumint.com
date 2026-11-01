CREATE OR REPLACE FUNCTION public.enforce_calculator_publish_gate()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;
CREATE TRIGGER calculator_publish_gate_before_update BEFORE UPDATE ON public.calculator_catalog_admin FOR EACH ROW EXECUTE FUNCTION public.enforce_calculator_publish_gate();
