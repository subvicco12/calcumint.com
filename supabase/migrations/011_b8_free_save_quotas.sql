-- CalcuMint B8: enforce Free account save quotas at the database boundary.
create or replace function public.enforce_calcumint_save_quotas() returns trigger language plpgsql security definer set search_path=public as $$
declare account_plan text; current_count bigint;
begin
 select coalesce(plan,'free') into account_plan from public.profiles where id=new.user_id;
 if account_plan not in ('pro','business') then
  if tg_table_name='favorites' then select count(*) into current_count from public.favorites where user_id=new.user_id; if current_count>=10 then raise exception 'Free accounts can save up to 10 favorites'; end if;
  elsif tg_table_name='calculation_history' then select count(*) into current_count from public.calculation_history where user_id=new.user_id; if current_count>=20 then raise exception 'Free accounts can keep up to 20 calculations'; end if;
  end if;
 end if;
 return new;
end $$;
drop trigger if exists favorites_free_quota on public.favorites;
create trigger favorites_free_quota before insert on public.favorites for each row execute function public.enforce_calcumint_save_quotas();
drop trigger if exists calculation_history_free_quota on public.calculation_history;
create trigger calculation_history_free_quota before insert on public.calculation_history for each row execute function public.enforce_calcumint_save_quotas();
