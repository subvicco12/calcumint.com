-- CalcuMint B10: quality alert automation

create unique index if not exists admin_alerts_open_unique
on public.admin_alerts(calculator_id, alert_type)
where status = 'open';

create or replace function public.raise_failed_qa_alert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'failed' and old.status is distinct from new.status then
    insert into public.admin_alerts(calculator_id, severity, alert_type, message)
    values (new.calculator_id, case when new.check_type = 'ymyl-review' then 'critical' else 'warning' end, 'qa-failed:' || new.check_type, new.check_type || ' failed its review gate')
    on conflict (calculator_id, alert_type) where status = 'open' do update set severity = excluded.severity, message = excluded.message, created_at = now();
  elsif new.status in ('passed','waived') and old.status = 'failed' then
    update public.admin_alerts set status = 'resolved', resolved_at = now()
    where calculator_id = new.calculator_id and alert_type = 'qa-failed:' || new.check_type and status = 'open';
  end if;
  return new;
end;
$$;

create trigger qa_failed_alert_after_update after update on public.calculator_qa_checks
for each row execute function public.raise_failed_qa_alert();

create or replace function public.refresh_admin_review_alerts()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_count integer;
begin
  if not public.has_platform_role(array['owner','admin','reviewer']) and auth.role() <> 'service_role' then
    raise exception 'Platform reviewer permission required';
  end if;

  insert into public.admin_alerts(calculator_id, severity, alert_type, message)
  select c.id, case when c.risk_class in ('financial','health','tax') then 'critical' else 'warning' end,
    'review-overdue', 'Published calculator is past its required review date'
  from public.calculator_catalog_admin c
  where c.lifecycle = 'published' and c.next_review_due_at is not null and c.next_review_due_at < now()
  on conflict (calculator_id, alert_type) where status = 'open' do nothing;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.refresh_admin_review_alerts() from public;
grant execute on function public.refresh_admin_review_alerts() to authenticated, service_role;
