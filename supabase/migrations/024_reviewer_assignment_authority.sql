-- Enforce reviewer assignment authority at the database boundary.
-- Mirrors the application rule: only owner/admin may assign an active review-capable reviewer.

create or replace function public.enforce_reviewer_assignment_authority()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role text;
  v_reviewer_valid boolean;
begin
  if tg_op = 'UPDATE' and new.reviewer_id is not distinct from old.reviewer_id then return new; end if;
  if tg_op = 'INSERT' and new.reviewer_id is null then return new; end if;
  if auth.role() <> 'service_role' then
    select role into v_role from public.platform_admins where user_id = auth.uid() and active;
    if v_role not in ('owner','admin') or v_role is null then
      raise exception 'Owner or admin required to assign calculator reviewer';
    end if;
  end if;
  if new.reviewer_id is not null then
    select exists(
      select 1 from public.platform_admins
      where user_id = new.reviewer_id and active and role in ('owner','admin','reviewer')
    ) into v_reviewer_valid;
    if not coalesce(v_reviewer_valid, false) then
      raise exception 'Reviewer must be an active review-capable admin';
    end if;
  end if;
  return new;
end;
$$;

create trigger calculator_reviewer_assignment_authority
before insert or update of reviewer_id on public.calculator_catalog_admin
for each row execute function public.enforce_reviewer_assignment_authority();
