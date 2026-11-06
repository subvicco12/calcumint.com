-- PROPOSAL ONLY. Outside active migrations; version-one draft provisioning only.
BEGIN;
DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated acceptance and explicit activation authorization required'; END $$;
DO $prerequisites$
begin
 if exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='prepare_catalog_inventory_drafts') then raise exception 'Draft inventory RPC must be absent before installation'; end if;
 if not exists(select 1 from pg_proc where oid=to_regprocedure('public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb)') and not prosecdef and encode(sha256(convert_to(pg_get_functiondef(oid),'UTF8')),'hex')='d2d7a27c14c06c02b8682a7ab755bbd64612044780c500db5bfe5b7267bbd28b') then
  raise exception 'Predecessor source/security mismatch';
 end if;
 if exists(select 1 from (values ('calculator_catalog_admin'),('calculator_qa_checks'),('calculator_review_events'),('calculator_bulk_jobs'),('platform_admins')) t(name) where not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname=t.name and c.relrowsecurity)) then raise exception 'Required RLS table unavailable'; end if;
 -- Parse required columns now instead of deferring schema failures to the first caller.
 perform c.id,c.calculator_key,c.slug,c.title,c.category,c.risk_class,c.lifecycle,c.metadata,c.version,c.created_by from public.calculator_catalog_admin c limit 0;
 perform q.calculator_id,q.check_type,q.status from public.calculator_qa_checks q limit 0;
 perform e.calculator_id,e.actor_id,e.event_type,e.to_state from public.calculator_review_events e limit 0;
 perform j.job_type,j.requested_by,j.status,j.payload,j.result,j.started_at,j.completed_at from public.calculator_bulk_jobs j limit 0;
 if not exists(select 1 from pg_constraint where conrelid='public.calculator_qa_checks'::regclass and contype='u' and pg_get_constraintdef(oid)='UNIQUE (calculator_id, check_type)') then raise exception 'QA identity uniqueness required'; end if;
 if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='calculator_catalog_admin' and column_name='version' and column_default='1') then raise exception 'Version-one default required'; end if;
end $prerequisites$;
create function public.prepare_catalog_inventory_drafts(p_items jsonb)
returns jsonb language plpgsql security invoker set search_path=public as $function$
declare
 item jsonb; existing public.calculator_catalog_admin%rowtype; calc uuid; actor uuid:=auth.uid();
 inserted integer:=0; reused integer:=0; healed integer:=0; affected integer; job uuid; lock_key text;
 checks text[]; check_name text;
begin
 if actor is null or not public.has_platform_role(array['owner','admin']) then raise exception 'Owner or admin permission required' using errcode='42501'; end if;
 if p_items is null or jsonb_typeof(p_items)<>'array' then raise exception 'Inventory must be an array'; end if;
 if jsonb_array_length(p_items) not between 1 and 250 then raise exception 'Inventory size must be 1 through 250'; end if;
 for item in select value from jsonb_array_elements(p_items) loop
  if jsonb_typeof(item)<>'object' or not item ?& array['calculator_key','slug','title','category','risk_class','metadata','version'] or (select count(*) from jsonb_object_keys(item))<>7 then raise exception 'Exact inventory fields required'; end if;
  if exists(select 1 from unnest(array['calculator_key','slug','title','category','risk_class']) f where jsonb_typeof(item->f)<>'string') or char_length(item->>'calculator_key') not between 2 and 160 or char_length(item->>'slug') not between 1 and 160 or item->>'slug' !~ '^[a-z0-9-]+$' or char_length(item->>'title') not between 2 and 160 or char_length(item->>'category') not between 2 and 100 or item->>'risk_class' not in ('standard','financial','health','tax') then raise exception 'Invalid inventory identity'; end if;
  if item->'version' is distinct from '1'::jsonb then raise exception 'Only engine version 1 is supported'; end if;
  if jsonb_typeof(item->'metadata')<>'object' or jsonb_typeof(item->'metadata'->'rulePackRequired') is distinct from 'boolean' then raise exception 'Explicit rulePackRequired metadata required'; end if;
 end loop;
 if (select count(distinct value->>'calculator_key') from jsonb_array_elements(p_items))<>jsonb_array_length(p_items) or (select count(distinct value->>'slug') from jsonb_array_elements(p_items))<>jsonb_array_length(p_items) then raise exception 'Duplicate inventory identity'; end if;
 -- Acquire both identity namespaces in one global order, before touching rows.
 for lock_key in select key from (select 'key:'||(value->>'calculator_key') key from jsonb_array_elements(p_items) union select 'slug:'||(value->>'slug') from jsonb_array_elements(p_items)) keys order by key loop
  perform pg_advisory_xact_lock(hashtextextended('prepare_catalog_inventory_drafts:'||lock_key,0));
 end loop;
 for item in select value from jsonb_array_elements(p_items) order by value->>'calculator_key' loop
  select * into existing from public.calculator_catalog_admin where calculator_key=item->>'calculator_key' for update;
  if found then
   if existing.slug is distinct from item->>'slug' or existing.title is distinct from item->>'title' or existing.category is distinct from item->>'category' or existing.risk_class is distinct from item->>'risk_class' or existing.version<>1 or (existing.metadata ? 'engineBinding' and existing.metadata->'engineBinding' is distinct from item->'metadata'->'engineBinding') or coalesce(existing.metadata->'rulePackRequired','false'::jsonb) is distinct from item->'metadata'->'rulePackRequired' or existing.metadata->'ruleMetadata' is distinct from item->'metadata'->'ruleMetadata' then raise exception 'Conflicting existing catalog identity'; end if;
   calc:=existing.id; reused:=reused+1;
   if existing.lifecycle='draft' then
    checks:=array['engine-tests','formula-review','sources','methodology','reverse-solve','visualization-reconciliation','schedule-reconciliation','scenario-reconciliation','sensitivity-validation','entitlement-validation','ux-responsive','performance','security','seo-content','accessibility'];
    if item->'metadata'->>'rulePackRequired'='true' then checks:=array_append(checks,'rule-pack-validation'); end if;
    if existing.risk_class in ('financial','health','tax') then checks:=array_append(checks,'ymyl-review'); end if;
    foreach check_name in array checks loop
     insert into public.calculator_qa_checks(calculator_id,check_type) values(calc,check_name) on conflict(calculator_id,check_type) do nothing;
     get diagnostics affected=row_count; healed:=healed+affected;
    end loop;
   end if;
  else
   if exists(select 1 from public.calculator_catalog_admin where slug=item->>'slug') then raise exception 'Conflicting existing catalog slug'; end if;
   calc:=public.create_catalog_calculator_with_audit(item->>'calculator_key',item->>'slug',item->>'title',item->>'category',item->>'risk_class',item->'metadata');
   inserted:=inserted+1;
  end if;
 end loop;
 insert into public.calculator_bulk_jobs(job_type,requested_by,status,payload,result,started_at,completed_at)
 values('inventory-import',actor,'completed',jsonb_build_object('count',jsonb_array_length(p_items)),jsonb_build_object('received',jsonb_array_length(p_items),'inserted',inserted,'existing',reused,'healedQa',healed),now(),now()) returning id into job;
 return jsonb_build_object('received',jsonb_array_length(p_items),'inserted',inserted,'existing',reused,'healedQa',healed,'jobId',job);
end $function$;
revoke all on function public.prepare_catalog_inventory_drafts(jsonb) from public,anon;
grant execute on function public.prepare_catalog_inventory_drafts(jsonb) to authenticated;
COMMIT;
