-- Make source_count a derived cache of structured source evidence.
-- Direct authenticated catalog writes may not fabricate or alter reviewed-source counts.
-- The migration 023 SECURITY DEFINER evidence-sync function remains the authoritative writer.

create or replace function public.enforce_derived_source_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_expected integer;
begin
  select count(*)::integer into v_expected
  from public.calculator_source_evidence
  where calculator_id = new.id;

  if auth.role() <> 'service_role' and new.source_count is distinct from v_expected then
    raise exception 'source_count is derived from calculator_source_evidence';
  end if;

  return new;
end;
$$;

create trigger calculator_catalog_derived_source_count
before insert or update of source_count on public.calculator_catalog_admin
for each row execute function public.enforce_derived_source_count();

-- Normalize the cache without inventing evidence.
update public.calculator_catalog_admin c
set source_count = (
  select count(*)::integer
  from public.calculator_source_evidence e
  where e.calculator_id = c.id
)
where c.source_count is distinct from (
  select count(*)::integer
  from public.calculator_source_evidence e
  where e.calculator_id = c.id
);
