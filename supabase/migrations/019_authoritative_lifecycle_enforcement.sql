-- Make calculator lifecycle sequencing and role permissions authoritative at the database boundary.
-- The application already enforces these rules; this trigger closes direct authenticated API/update bypasses.

create or replace function public.enforce_calculator_publish_gate()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_ok boolean;
  v_failures text[];
  v_role text;
begin
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
      select role into v_role
      from public.platform_admins
      where user_id = auth.uid() and active;

      if v_role is null then
        raise exception 'Platform admin required';
      end if;

      if v_role = 'editor' and new.lifecycle not in ('draft','review') then
        raise exception 'Editor cannot transition calculator to %', new.lifecycle;
      end if;

      if v_role = 'reviewer' and new.lifecycle = 'published' then
        raise exception 'Reviewer cannot publish calculators';
      end if;
    end if;

    if new.lifecycle in ('certified','published') then
      select ok, failures into v_ok, v_failures
      from public.validate_calculator_publish_gate(new.id);
      if not v_ok then
        raise exception 'Publishing gate failed: %', array_to_string(v_failures, '; ');
      end if;
    end if;
  end if;

  if new.lifecycle = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  new.updated_at := now();
  return new;
end;
$$;
