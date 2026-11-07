-- Review-only adoption1535: constituent assertions retained verbatim.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_ADOPTION1535_APPLY: no activation authority'; END $hold$;
-- FIRST CONSTITUENT

SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
SET LOCAL search_path=pg_catalog;
-- constituent hold replaced by unconditional composition hold
DO $isolation$ BEGIN IF current_user <> 'postgres' THEN RAISE EXCEPTION 'Package requires captured postgres owner'; END IF; IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'Correction bundle requires READ COMMITTED'; END IF; END $isolation$;
LOCK TABLE public."admin_alerts",public."calculator_bulk_jobs",public."calculator_catalog_admin",public."calculator_qa_checks",public."calculator_review_events",public."calculator_source_evidence",public."platform_admins" IN ACCESS EXCLUSIVE MODE;
DO $metadata$ BEGIN IF encode(sha256(convert_to((SELECT jsonb_build_object(
 'major',current_setting('server_version_num')::integer/10000,
 'relations',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||c.relname,'owner',pg_get_userbyid(c.relowner),'kind',c.relkind,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(c.relacl) x),'[]'::jsonb)) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'columns',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',a.attname,'position',a.attnum,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),'identity',a.attidentity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(a.attacl) x),'[]'::jsonb)) ORDER BY c.relname,a.attnum) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_attribute a ON a.attrelid=c.oid LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND a.attnum>0 AND NOT a.attisdropped),'[]'::jsonb),
 'functions',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f' AND (p.proname IN ('is_platform_admin','has_platform_role','validate_calculator_publish_gate','enforce_calculator_publish_gate','enforce_derived_source_count','enforce_qa_evidence_authority','enforce_qa_evidence_certification','enforce_reviewer_assignment_authority','enforce_source_evidence_certification','protect_active_ymyl_reviewer_authority','stamp_source_evidence_review','sync_source_evidence_count','record_calculator_qa_decision','is_active_review_capable_admin','assign_calculator_reviewer','transition_calculator_with_audit','create_catalog_calculator_with_audit','prepare_catalog_inventory_drafts','enforce_calculator_publish_gate_final_row','p0_publication_insert_guard','p0_publication_qa_old_parent','p0_publication_reviewer_delete','p0_publication_reviewer_lock','p0_publication_qa_parent_lock','list_published_calculator_manifest') OR p.oid IN (SELECT t.tgfoid FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND NOT t.tgisinternal))),'[]'::jsonb),
 'triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t.tgname,'table','public.'||c.relname,'definition',pg_get_triggerdef(t.oid),'enabled',t.tgenabled) ORDER BY c.relname,t.tgname) FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND NOT t.tgisinternal),'[]'::jsonb),
 'constraints',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',v.conname,'definition',pg_get_constraintdef(v.oid),'validated',v.convalidated) ORDER BY c.relname,v.conname) FROM pg_constraint v JOIN pg_class c ON c.oid=v.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'indexes',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||ci.relname,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid) ORDER BY ci.relname) FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_class ci ON ci.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'policies',COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.tablename,p.policyname) FROM pg_policies p WHERE p.schemaname='public' AND p.tablename IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'provider',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','auth.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='auth' AND p.proname IN ('uid','role') AND p.prokind='f'),'[]'::jsonb),
 'defaultAcls',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',pg_get_userbyid(d.defaclrole),'schema',COALESCE(n.nspname,''),'objectType',d.defaclobjtype,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(d.defaclacl) x),'[]'::jsonb)) ORDER BY COALESCE(n.nspname,''),d.defaclobjtype) FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace WHERE pg_get_userbyid(d.defaclrole)='postgres' AND (d.defaclnamespace=0 OR n.nspname='public') AND d.defaclobjtype='f'),'[]'::jsonb)
))::text,'UTF8')),'hex') IS DISTINCT FROM '56b55a34c29d2c0dc60863da60df510d5a70d962edbc6582591ba025a756c3f1' THEN RAISE EXCEPTION 'EXACT_METADATA_PRECONDITION_MISMATCH'; END IF; END $metadata$;
SET LOCAL search_path=public;
-- Exact source supabase/migrations/032_atomic_reviewer_qa_audit.sql SHA256 b548046cb0a3aa91dd2838a824a5a1155b7b4c317d65cc644b6c9673a26418f1
-- Atomically record reviewer QA decisions and their audit trail.
-- Invoker permissions, RLS and existing QA certification/authority triggers remain enforced.
create function public.record_calculator_qa_decision(
  p_calculator_id uuid, p_check_type text, p_status text, p_details text
) returns void
language plpgsql security invoker set search_path = public
as $$
declare
  v_role text;
  v_risk text;
  v_metadata jsonb;
  v_required text[] := array[
    'engine-tests','formula-review','sources','methodology','reverse-solve',
    'visualization-reconciliation','schedule-reconciliation','scenario-reconciliation',
    'sensitivity-validation','entitlement-validation','ux-responsive','performance',
    'security','seo-content','accessibility'
  ];
begin
  select role into v_role from public.platform_admins
    where user_id = (select auth.uid()) and active;
  if v_role is null or v_role not in ('owner','admin','reviewer') then
    raise exception 'Reviewer permission required';
  end if;
  if p_status is null or p_status not in ('pending','passed','failed','waived') then
    raise exception 'Invalid QA decision status';
  end if;
  if p_status = 'waived' and v_role not in ('owner','admin') then
    raise exception 'Owner or admin permission required to waive QA evidence';
  end if;
  if p_check_type is null then raise exception 'Invalid QA check type'; end if;
  select risk_class, metadata into v_risk, v_metadata
  from public.calculator_catalog_admin where id = p_calculator_id;
  if not found then raise exception 'Calculator lookup failed'; end if;
  if coalesce(v_metadata ->> 'rulePackRequired', '') = 'true' then
    v_required := array_append(v_required, 'rule-pack-validation');
  end if;
  if v_risk in ('financial','health','tax') then
    v_required := array_append(v_required, 'ymyl-review');
  end if;
  if not (p_check_type = any(v_required)) then
    raise exception 'QA check is not applicable to this calculator';
  end if;
  if char_length(coalesce(p_details, '')) > 2000 then
    raise exception 'QA details exceed maximum length';
  end if;
  insert into public.calculator_qa_checks
    (calculator_id, check_type, status, details, checked_by, checked_at)
  values (p_calculator_id, p_check_type, p_status, coalesce(p_details, ''), auth.uid(), now())
  on conflict (calculator_id, check_type) do update
    set status = excluded.status, details = excluded.details,
        checked_by = excluded.checked_by, checked_at = excluded.checked_at;
  insert into public.calculator_review_events
    (calculator_id, actor_id, event_type, notes)
  values (p_calculator_id, auth.uid(), 'qa-check', p_check_type || ': ' || p_status);
  -- Any error aborts the entire function statement, rolling back both writes.
end;
$$;
revoke all on function public.record_calculator_qa_decision(uuid,text,text,text) from public, anon;
grant execute on function public.record_calculator_qa_decision(uuid,text,text,text) to authenticated;

-- Exact source supabase/migrations/033_atomic_reviewer_assignment_audit.sql SHA256 74ce0f947c3922c4c7992880abd108a2900a6ce14933bd45c3a5762617f2fcd8
-- Assign a reviewer and record the audit event in the same transaction.
-- Target reviewer identity is checked through a tightly scoped definer helper:
-- platform_admins RLS intentionally exposes only the caller's own row.
create function public.is_active_review_capable_admin(p_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $review_target$
  select public.has_platform_role(array['owner','admin']) and exists (
    select 1 from public.platform_admins
    where user_id = p_user_id and active and role in ('owner','admin','reviewer')
  )
$review_target$;
revoke all on function public.is_active_review_capable_admin(uuid) from public, anon;
grant execute on function public.is_active_review_capable_admin(uuid) to authenticated;

-- SECURITY INVOKER preserves existing RLS, role policies and catalog gate triggers.
create function public.assign_calculator_reviewer(
  p_calculator_id uuid, p_reviewer_id uuid
) returns void
language plpgsql security invoker set search_path = public
as $$
declare
  v_role text;
  v_updated_id uuid;
begin
  select role into v_role from public.platform_admins
    where user_id = auth.uid() and active;
  if v_role is null or v_role not in ('owner','admin') then
    raise exception 'Admin permission required';
  end if;
  if not public.is_active_review_capable_admin(p_reviewer_id) then
    raise exception 'Reviewer must be an active review-capable admin';
  end if;
  update public.calculator_catalog_admin
    set reviewer_id = p_reviewer_id
    where id = p_calculator_id
    returning id into v_updated_id;
  if v_updated_id is null then
    raise exception 'Reviewer assignment did not update the calculator';
  end if;
  insert into public.calculator_review_events
    (calculator_id, actor_id, event_type, metadata)
    values (p_calculator_id, auth.uid(), 'reviewer-assigned',
      jsonb_build_object('reviewerId', p_reviewer_id));
end;
$$;
revoke all on function public.assign_calculator_reviewer(uuid,uuid) from public, anon;
grant execute on function public.assign_calculator_reviewer(uuid,uuid) to authenticated;

-- Exact source supabase/migrations/034_atomic_lifecycle_transition_audit.sql SHA256 745efcbcb731821dd82727e91a6fe46093413890122818eb0560fd05a3414c90
-- Record lifecycle transition and audit event atomically.
-- Security invoker retains catalog RLS and authoritative lifecycle/QA gate triggers.
create function public.transition_calculator_with_audit(
  p_calculator_id uuid, p_expected_lifecycle text, p_target_lifecycle text
) returns void
language plpgsql security invoker set search_path = public
as $$
declare
  v_role text;
  v_updated_id uuid;
begin
  select role into v_role from public.platform_admins where user_id = auth.uid() and active;
  if v_role is null then raise exception 'Platform admin required'; end if;
  if p_target_lifecycle is null or p_target_lifecycle not in ('draft','review','certified','published','archived') then
    raise exception 'Invalid target lifecycle';
  end if;
  if p_expected_lifecycle is null or p_expected_lifecycle not in ('draft','review','certified','published','archived') then
    raise exception 'Invalid expected lifecycle';
  end if;
  if not (
    (p_expected_lifecycle = 'draft' and p_target_lifecycle in ('review','archived')) or
    (p_expected_lifecycle = 'review' and p_target_lifecycle in ('draft','certified','archived')) or
    (p_expected_lifecycle = 'certified' and p_target_lifecycle in ('review','published','archived')) or
    (p_expected_lifecycle = 'published' and p_target_lifecycle in ('review','archived')) or
    (p_expected_lifecycle = 'archived' and p_target_lifecycle = 'draft')
  ) then raise exception 'Invalid lifecycle transition'; end if;
  if v_role = 'editor' and p_target_lifecycle not in ('draft','review') then
    raise exception 'Editor cannot perform this lifecycle transition';
  end if;
  if v_role = 'reviewer' and p_target_lifecycle = 'published' then
    raise exception 'Reviewer cannot publish calculators';
  end if;
  update public.calculator_catalog_admin
    set lifecycle = p_target_lifecycle,
        last_reviewed_at = case when p_target_lifecycle = 'certified' then now() else last_reviewed_at end
    where id = p_calculator_id and lifecycle = p_expected_lifecycle
    returning id into v_updated_id;
  if v_updated_id is null then raise exception 'Calculator lifecycle changed concurrently or was not found'; end if;
  insert into public.calculator_review_events
    (calculator_id, actor_id, event_type, from_state, to_state)
    values (p_calculator_id, auth.uid(), 'lifecycle-transition', p_expected_lifecycle, p_target_lifecycle);
end;
$$;
revoke all on function public.transition_calculator_with_audit(uuid,text,text) from public, anon;
grant execute on function public.transition_calculator_with_audit(uuid,text,text) to authenticated;

-- Exact source supabase/migrations/035_atomic_catalog_creation.sql SHA256 426de9383b1ca63f504adbdb9e515c239c8d2c4bd37f518a6b900667d2f30b47
-- Create catalog entry, required pending QA checks, and creation audit as one transaction.
-- SECURITY INVOKER preserves table RLS and certification triggers.
create function public.create_catalog_calculator_with_audit(
  p_calculator_key text, p_slug text, p_title text, p_category text,
  p_risk_class text, p_metadata jsonb
) returns uuid
language plpgsql security invoker set search_path = public
as $$
declare
  v_id uuid;
  v_role text;
  v_checks text[] := array[
    'engine-tests','formula-review','sources','methodology','reverse-solve',
    'visualization-reconciliation','schedule-reconciliation','scenario-reconciliation',
    'sensitivity-validation','entitlement-validation','ux-responsive','performance',
    'security','seo-content','accessibility'
  ];
  v_check text;
begin
  select role into v_role from public.platform_admins
    where user_id = auth.uid() and active;
  if v_role is null or v_role not in ('owner','admin','reviewer') then
    raise exception 'Platform admin permission required';
  end if;
  if p_risk_class is null or p_risk_class not in ('standard','financial','health','tax') then
    raise exception 'Invalid calculator risk class';
  end if;
  if p_metadata is null or jsonb_typeof(p_metadata) <> 'object' then
    raise exception 'Invalid calculator metadata';
  end if;
  if p_metadata ->> 'rulePackRequired' = 'true' then
    v_checks := array_append(v_checks, 'rule-pack-validation');
  end if;
  if p_risk_class in ('financial','health','tax') then
    v_checks := array_append(v_checks, 'ymyl-review');
  end if;
  insert into public.calculator_catalog_admin
    (calculator_key, slug, title, category, risk_class, metadata, created_by)
  values (p_calculator_key, p_slug, p_title, p_category, p_risk_class, p_metadata, auth.uid())
  returning id into v_id;
  foreach v_check in array v_checks loop
    insert into public.calculator_qa_checks (calculator_id, check_type)
    values (v_id, v_check);
  end loop;
  insert into public.calculator_review_events
    (calculator_id, actor_id, event_type, to_state)
  values (v_id, auth.uid(), 'created', 'draft');
  return v_id;
end;
$$;
revoke all on function public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb) from public, anon;
grant execute on function public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb) to authenticated;

-- Exact source docs/sprint20-publication/guarded/prepare-catalog-inventory-drafts.sql SHA256 1bf012895fe18526908edfb620c130fb25b51de69da41e3e033a873d3aa95a63
-- PROPOSAL ONLY. Outside active migrations; version-one draft provisioning only.

-- constituent hold replaced by unconditional outer hold
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

-- Exact source tests/hosted-schema-remediation/publication/review-only-correction.sql SHA256 5caec753de00a9550c215bfd5d4c8db96124dce19dcffbedfd4edf8a28fe6fb6
-- Unactivated proposal. Only three date-pattern literals and the optional-date NULL check change. ACL/owner preserved.

-- constituent hold replaced by unconditional outer hold
DO $precondition$ BEGIN
 IF current_setting('server_version_num')::integer / 10000 <> 17 THEN RAISE EXCEPTION 'PostgreSQL17 required'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.validate_calculator_publish_gate(uuid)'::regprocedure),'UTF8')),'hex') IS DISTINCT FROM '18ed27d139a24b73176838618ac99469418053d85b4020d1a4a1481cd3e6334c' THEN RAISE EXCEPTION 'Hosted function source hash mismatch'; END IF;
END $precondition$;
CREATE OR REPLACE FUNCTION public.validate_calculator_publish_gate(p_calculator_id uuid)
 RETURNS TABLE(ok boolean, failures text[])
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
           or coalesce(v_rule ->> 'effectiveFrom', '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
           or coalesce(v_rule ->> 'lastVerifiedAt', '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
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
            if v_date is null or v_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
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
$function$
;
DO $postcondition$ BEGIN
 IF encode(sha256(convert_to(pg_get_functiondef('public.validate_calculator_publish_gate(uuid)'::regprocedure),'UTF8')),'hex') IS DISTINCT FROM 'ce53551431824e8560af44a235ebb312372e0c67641c196f3d8db1287c05709a' THEN RAISE EXCEPTION 'Corrected function hash mismatch'; END IF;
END $postcondition$;

-- Exact source tests/hosted-remediation-closure/publication/review-only-deferred-gate.sql SHA256 e84da335aba10aaac784197711915bb2858de9b5e717734053b757cfc517530c
-- Nonproduction review proposal. No authorization to install on hosted database.

-- constituent hold replaced by unconditional outer hold
DO $precondition$ BEGIN
 IF current_setting('server_version_num')::integer / 10000 <> 17 THEN RAISE EXCEPTION 'PostgreSQL17 required'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.enforce_calculator_publish_gate()'::regprocedure),'UTF8')),'hex') IS DISTINCT FROM 'a34469bd029214c7bae7d180174a02716dc072d7f7e40d40f98a24ef43958329' THEN RAISE EXCEPTION 'Lifecycle source hash mismatch'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.validate_calculator_publish_gate(uuid)'::regprocedure),'UTF8')),'hex') IS DISTINCT FROM 'ce53551431824e8560af44a235ebb312372e0c67641c196f3d8db1287c05709a' THEN RAISE EXCEPTION 'Predicate source hash mismatch'; END IF;
 IF NOT EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculator_catalog_admin'::regclass AND tgname='calculator_publish_gate_before_update' AND NOT tgisinternal AND tgenabled='O' AND pg_get_triggerdef(oid)='CREATE TRIGGER calculator_publish_gate_before_update BEFORE UPDATE ON public.calculator_catalog_admin FOR EACH ROW EXECUTE FUNCTION enforce_calculator_publish_gate()') THEN RAISE EXCEPTION 'Lifecycle trigger mismatch'; END IF;
 IF to_regprocedure('public.enforce_calculator_publish_gate_final_row()') IS NOT NULL OR EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculator_catalog_admin'::regclass AND tgname='calculator_publish_gate_final_row') THEN RAISE EXCEPTION 'Successor object already exists'; END IF;
END $precondition$;
CREATE FUNCTION public.enforce_calculator_publish_gate_final_row() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE v_lifecycle text; v_ok boolean; v_failures text[];
BEGIN
 SELECT lifecycle INTO v_lifecycle FROM public.calculator_catalog_admin WHERE id=NEW.id;
 IF v_lifecycle IN ('certified','published') THEN
  SELECT ok,failures INTO v_ok,v_failures FROM public.validate_calculator_publish_gate(NEW.id);
  IF v_ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'Final row publishing gate failed: %',array_to_string(v_failures,'; '); END IF;
 END IF;
 RETURN NULL;
END;
$function$;
REVOKE ALL ON FUNCTION public.enforce_calculator_publish_gate_final_row() FROM PUBLIC;
CREATE CONSTRAINT TRIGGER calculator_publish_gate_final_row AFTER UPDATE ON public.calculator_catalog_admin DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE FUNCTION public.enforce_calculator_publish_gate_final_row();

-- Exact source tests/p0-publication-business/publication/review-only-successor.sql SHA256 7163e4949dd1bbfb7679621309e6a20eaad99f2b81b99184727868711ee1bcc0
-- NONPRODUCTION REVIEW ONLY. Preserves captured and prior proposal SQL.

-- constituent hold replaced by unconditional outer hold
DO $precondition$ BEGIN
 IF current_setting('server_version_num')::integer / 10000 <> 17 THEN RAISE EXCEPTION 'PostgreSQL17 required'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.enforce_calculator_publish_gate()'::regprocedure),'UTF8')),'hex') <> 'a34469bd029214c7bae7d180174a02716dc072d7f7e40d40f98a24ef43958329' THEN RAISE EXCEPTION 'Lifecycle source mismatch'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.validate_calculator_publish_gate(uuid)'::regprocedure),'UTF8')),'hex') <> 'ce53551431824e8560af44a235ebb312372e0c67641c196f3d8db1287c05709a' THEN RAISE EXCEPTION 'Predicate source mismatch'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.enforce_calculator_publish_gate_final_row()'::regprocedure),'UTF8')),'hex') <> '3d456f8b31a3fd4f9586569beab9ce1e5bafbfc1cc67e28b56eaa39bbb7c3751' THEN RAISE EXCEPTION 'Prior final-row source mismatch'; END IF;
 IF to_regprocedure('public.p0_publication_insert_guard()') IS NOT NULL OR to_regprocedure('public.p0_publication_qa_old_parent()') IS NOT NULL OR to_regprocedure('public.p0_publication_reviewer_delete()') IS NOT NULL OR to_regprocedure('public.p0_publication_reviewer_lock()') IS NOT NULL OR to_regprocedure('public.p0_publication_qa_parent_lock()') IS NOT NULL THEN RAISE EXCEPTION 'Successor already exists'; END IF;
 IF EXISTS(SELECT FROM pg_trigger WHERE tgname IN ('p0_publication_insert_guard','p0_publication_qa_old_parent','p0_publication_reviewer_delete','p0_publication_reviewer_lock','p0_publication_qa_parent_lock')) THEN RAISE EXCEPTION 'Successor trigger already exists'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.enforce_qa_evidence_certification()'::regprocedure),'UTF8')),'hex') <> 'f81afb4f7e3f13417dfd75e480cd0b32c283da7ba5696c911ec30fd0f05d8642' THEN RAISE EXCEPTION 'Dependency source mismatch'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.protect_active_ymyl_reviewer_authority()'::regprocedure),'UTF8')),'hex') <> '38f168b3648c9bca78e976989c1155a62fe7feafbc4a8125f9e35e9596b8ab50' THEN RAISE EXCEPTION 'Dependency source mismatch'; END IF;
 IF NOT EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculator_catalog_admin'::regclass AND tgname='calculator_publish_gate_final_row' AND NOT tgisinternal AND tgenabled='O' AND tgdeferrable AND NOT tginitdeferred AND pg_get_triggerdef(oid)='CREATE CONSTRAINT TRIGGER calculator_publish_gate_final_row AFTER UPDATE ON public.calculator_catalog_admin DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE FUNCTION enforce_calculator_publish_gate_final_row()') THEN RAISE EXCEPTION 'Prior final-row trigger mismatch'; END IF;
 IF NOT EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculator_qa_checks'::regclass AND tgname='calculator_qa_certification_after_write' AND tgfoid='public.enforce_qa_evidence_certification()'::regprocedure AND tgenabled='O' AND tgtype=29 AND tgdeferrable AND tginitdeferred AND NOT tgisinternal) THEN RAISE EXCEPTION 'QA certification trigger mismatch'; END IF;
END $precondition$;
CREATE FUNCTION public.p0_publication_insert_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN IF NEW.lifecycle <> 'draft' THEN RAISE EXCEPTION 'Initial lifecycle must be draft'; END IF; RETURN NEW; END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_insert_guard() FROM PUBLIC;
CREATE TRIGGER p0_publication_insert_guard BEFORE INSERT ON public.calculator_catalog_admin FOR EACH ROW EXECUTE FUNCTION public.p0_publication_insert_guard();
CREATE FUNCTION public.p0_publication_qa_old_parent() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_ok boolean; v_failures text[];
BEGIN
 IF OLD.calculator_id IS DISTINCT FROM NEW.calculator_id AND EXISTS(SELECT FROM public.calculator_catalog_admin WHERE id=OLD.calculator_id AND lifecycle IN ('certified','published')) THEN
 SELECT ok,failures INTO v_ok,v_failures FROM public.validate_calculator_publish_gate(OLD.calculator_id);
 IF v_ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'Old parent publishing gate failed: %',array_to_string(v_failures,'; '); END IF;
 END IF;
 RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_qa_old_parent() FROM PUBLIC;
CREATE CONSTRAINT TRIGGER p0_publication_qa_old_parent AFTER UPDATE ON public.calculator_qa_checks DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION public.p0_publication_qa_old_parent();
CREATE FUNCTION public.p0_publication_reviewer_delete() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'Reviewer authority mutation requires READ COMMITTED'; END IF;
 IF (TG_OP='DELETE' OR NEW.user_id IS DISTINCT FROM OLD.user_id OR NOT NEW.active OR NEW.role NOT IN ('owner','admin','reviewer')) AND EXISTS(SELECT FROM public.calculator_catalog_admin WHERE reviewer_id=OLD.user_id AND risk_class IN ('financial','health','tax') AND lifecycle IN ('certified','published')) THEN RAISE EXCEPTION 'Reassign or decertify governed YMYL calculators before deleting reviewer authority'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_reviewer_delete() FROM PUBLIC;
CREATE TRIGGER p0_publication_reviewer_delete BEFORE DELETE OR UPDATE OF active, role, user_id ON public.platform_admins FOR EACH ROW EXECUTE FUNCTION public.p0_publication_reviewer_delete();
-- READ COMMITTED is required so the post-lock predicate observes a committed
-- reviewer deletion/demotion that finished while this statement was waiting.
CREATE FUNCTION public.p0_publication_reviewer_lock() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_calc public.calculator_catalog_admin%rowtype; v_ok boolean; v_failures text[];
BEGIN
 SELECT * INTO v_calc FROM public.calculator_catalog_admin WHERE id=NEW.id;
 IF v_calc.lifecycle IN ('certified','published') THEN
  IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'Final publication validation requires READ COMMITTED'; END IF;
  IF v_calc.risk_class IN ('financial','health','tax') THEN PERFORM 1 FROM public.platform_admins WHERE user_id=v_calc.reviewer_id FOR SHARE; END IF;
  SELECT ok,failures INTO v_ok,v_failures FROM public.validate_calculator_publish_gate(v_calc.id);
  IF v_ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'Locked reviewer publishing gate failed: %',array_to_string(v_failures,'; '); END IF;
 END IF;
 RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_reviewer_lock() FROM PUBLIC;
CREATE CONSTRAINT TRIGGER p0_publication_reviewer_lock AFTER UPDATE ON public.calculator_catalog_admin DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE FUNCTION public.p0_publication_reviewer_lock();
-- Coordinate required QA mutation with lifecycle/risk/reviewer catalog UPDATE.
-- Stable parent order includes OLD and NEW identities for a reparenting write.
CREATE FUNCTION public.p0_publication_qa_parent_lock() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE v_parents uuid[];
BEGIN
 IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'QA parent coordination requires READ COMMITTED'; END IF;
 IF TG_OP='INSERT' THEN v_parents:=ARRAY[NEW.calculator_id];
 ELSIF TG_OP='DELETE' THEN v_parents:=ARRAY[OLD.calculator_id];
 ELSE v_parents:=ARRAY[OLD.calculator_id,NEW.calculator_id]; END IF;
 PERFORM c.id FROM public.calculator_catalog_admin c WHERE c.id=ANY(v_parents) ORDER BY c.id FOR SHARE;
 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_qa_parent_lock() FROM PUBLIC;
CREATE TRIGGER p0_publication_qa_parent_lock BEFORE INSERT OR UPDATE OR DELETE ON public.calculator_qa_checks FOR EACH ROW EXECUTE FUNCTION public.p0_publication_qa_parent_lock();

-- Exact source docs/adoption1528/package/new-trigger-privileges.sql SHA256 19979dc8bed722b9b8ed05994201c554c5c17882f8f666bce4d3e74b667620c4
-- Review only. Preserve migration027's trigger-only function client-execution contract.
-- PostgreSQL target default function grants include anon/authenticated/service_role.
-- Revoke client EXECUTE only on the six newly introduced trigger-only functions.

-- constituent hold replaced by unconditional outer hold
REVOKE EXECUTE ON FUNCTION public.enforce_calculator_publish_gate_final_row(), public.p0_publication_insert_guard(), public.p0_publication_qa_old_parent(), public.p0_publication_reviewer_delete(), public.p0_publication_reviewer_lock(), public.p0_publication_qa_parent_lock() FROM PUBLIC, anon, authenticated;

SET LOCAL search_path=pg_catalog;
DO $metadata$ BEGIN IF encode(sha256(convert_to((SELECT jsonb_build_object(
 'major',current_setting('server_version_num')::integer/10000,
 'relations',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||c.relname,'owner',pg_get_userbyid(c.relowner),'kind',c.relkind,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(c.relacl) x),'[]'::jsonb)) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'columns',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',a.attname,'position',a.attnum,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),'identity',a.attidentity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(a.attacl) x),'[]'::jsonb)) ORDER BY c.relname,a.attnum) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_attribute a ON a.attrelid=c.oid LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND a.attnum>0 AND NOT a.attisdropped),'[]'::jsonb),
 'functions',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f' AND (p.proname IN ('is_platform_admin','has_platform_role','validate_calculator_publish_gate','enforce_calculator_publish_gate','enforce_derived_source_count','enforce_qa_evidence_authority','enforce_qa_evidence_certification','enforce_reviewer_assignment_authority','enforce_source_evidence_certification','protect_active_ymyl_reviewer_authority','stamp_source_evidence_review','sync_source_evidence_count','record_calculator_qa_decision','is_active_review_capable_admin','assign_calculator_reviewer','transition_calculator_with_audit','create_catalog_calculator_with_audit','prepare_catalog_inventory_drafts','enforce_calculator_publish_gate_final_row','p0_publication_insert_guard','p0_publication_qa_old_parent','p0_publication_reviewer_delete','p0_publication_reviewer_lock','p0_publication_qa_parent_lock','list_published_calculator_manifest') OR p.oid IN (SELECT t.tgfoid FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND NOT t.tgisinternal))),'[]'::jsonb),
 'triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t.tgname,'table','public.'||c.relname,'definition',pg_get_triggerdef(t.oid),'enabled',t.tgenabled) ORDER BY c.relname,t.tgname) FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND NOT t.tgisinternal),'[]'::jsonb),
 'constraints',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',v.conname,'definition',pg_get_constraintdef(v.oid),'validated',v.convalidated) ORDER BY c.relname,v.conname) FROM pg_constraint v JOIN pg_class c ON c.oid=v.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'indexes',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||ci.relname,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid) ORDER BY ci.relname) FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_class ci ON ci.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'policies',COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.tablename,p.policyname) FROM pg_policies p WHERE p.schemaname='public' AND p.tablename IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'provider',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','auth.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='auth' AND p.proname IN ('uid','role') AND p.prokind='f'),'[]'::jsonb),
 'defaultAcls',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',pg_get_userbyid(d.defaclrole),'schema',COALESCE(n.nspname,''),'objectType',d.defaclobjtype,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(d.defaclacl) x),'[]'::jsonb)) ORDER BY COALESCE(n.nspname,''),d.defaclobjtype) FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace WHERE pg_get_userbyid(d.defaclrole)='postgres' AND (d.defaclnamespace=0 OR n.nspname='public') AND d.defaclobjtype='f'),'[]'::jsonb)
))::text,'UTF8')),'hex') IS DISTINCT FROM '4a56b22ab359c2990cb70a58b024b6a67009c9177c7b3dc2b8c7701d90c72951' THEN RAISE EXCEPTION 'EXACT_METADATA_PRECONDITION_MISMATCH'; END IF; END $metadata$;


-- SECOND CONSTITUENT

SET LOCAL search_path=pg_catalog;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
-- constituent hold replaced by unconditional composition hold
DO $actor$ BEGIN IF current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'PUBLICATION540_OPERATOR_OR_ISOLATION'; END IF; END $actor$;
LOCK TABLE public.admin_alerts,public.calculator_bulk_jobs,public.calculator_catalog_admin,public.calculator_qa_checks,public.calculator_review_events,public.calculator_source_evidence,public.platform_admins IN ACCESS EXCLUSIVE MODE;
DO $exact$ BEGIN IF encode(sha256(convert_to((SELECT jsonb_build_object('base',(SELECT jsonb_build_object(
 'major',current_setting('server_version_num')::integer/10000,
 'relations',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||c.relname,'owner',pg_get_userbyid(c.relowner),'kind',c.relkind,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(c.relacl) x),'[]'::jsonb)) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'columns',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',a.attname,'position',a.attnum,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),'identity',a.attidentity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(a.attacl) x),'[]'::jsonb)) ORDER BY c.relname,a.attnum) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_attribute a ON a.attrelid=c.oid LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND a.attnum>0 AND NOT a.attisdropped),'[]'::jsonb),
 'functions',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f' AND (p.proname IN ('is_platform_admin','has_platform_role','validate_calculator_publish_gate','enforce_calculator_publish_gate','enforce_derived_source_count','enforce_qa_evidence_authority','enforce_qa_evidence_certification','enforce_reviewer_assignment_authority','enforce_source_evidence_certification','protect_active_ymyl_reviewer_authority','stamp_source_evidence_review','sync_source_evidence_count','record_calculator_qa_decision','is_active_review_capable_admin','assign_calculator_reviewer','transition_calculator_with_audit','create_catalog_calculator_with_audit','prepare_catalog_inventory_drafts','enforce_calculator_publish_gate_final_row','p0_publication_insert_guard','p0_publication_qa_old_parent','p0_publication_reviewer_delete','p0_publication_reviewer_lock','p0_publication_qa_parent_lock','list_published_calculator_manifest') OR p.oid IN (SELECT t.tgfoid FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND NOT t.tgisinternal))),'[]'::jsonb),
 'triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t.tgname,'table','public.'||c.relname,'definition',pg_get_triggerdef(t.oid),'enabled',t.tgenabled) ORDER BY c.relname,t.tgname) FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND NOT t.tgisinternal),'[]'::jsonb),
 'constraints',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',v.conname,'definition',pg_get_constraintdef(v.oid),'validated',v.convalidated) ORDER BY c.relname,v.conname) FROM pg_constraint v JOIN pg_class c ON c.oid=v.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'indexes',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||ci.relname,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid) ORDER BY ci.relname) FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_class ci ON ci.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'policies',COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.tablename,p.policyname) FROM pg_policies p WHERE p.schemaname='public' AND p.tablename IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'provider',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','auth.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='auth' AND p.proname IN ('uid','role') AND p.prokind='f'),'[]'::jsonb),
 'defaultAcls',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',pg_get_userbyid(d.defaclrole),'schema',COALESCE(n.nspname,''),'objectType',d.defaclobjtype,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(d.defaclacl) x),'[]'::jsonb)) ORDER BY COALESCE(n.nspname,''),d.defaclobjtype) FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace WHERE pg_get_userbyid(d.defaclrole)='postgres' AND (d.defaclnamespace=0 OR n.nspname='public') AND d.defaclobjtype='f'),'[]'::jsonb)
)),'addon',(SELECT coalesce(jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',coalesce((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY oidvectortypes(p.proargtypes)),'[]'::jsonb) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='publish_calculator_batch_with_audit_v1')))::text,'UTF8')),'hex') IS DISTINCT FROM 'eebfc0554185341b14cfe4a563d4210730b326549f20576513c57ca512b13361' THEN RAISE EXCEPTION 'PUBLICATION540_EXACT_METADATA'; END IF; END $exact$;
-- Successor source SHA256 ff64fee9c2196752a5dc7c9875b6210e05d04714037dbb00cc87ab9b7dae0233
-- NONPRODUCTION proposal. No adoption, certification or publication authority.

-- constituent hold replaced by outer hold
CREATE FUNCTION public.publish_calculator_batch_with_audit_v1(p_items jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,public AS $$
DECLARE item jsonb; row_data jsonb; sources jsonb; qa jsonb; n integer;
BEGIN
 IF current_user <> 'authenticated' OR auth.uid() IS NULL OR auth.role() IS DISTINCT FROM 'authenticated' THEN RAISE EXCEPTION 'Authenticated owner/admin required'; END IF;
 IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'READ COMMITTED required'; END IF;
 -- Explicit technical resource bound; conveys no product entitlement or policy.
 IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Array required'; END IF;
 n:=jsonb_array_length(p_items);
 IF n<1 OR n>100 THEN RAISE EXCEPTION 'Technical batch bound 1..100'; END IF;
 IF EXISTS(SELECT FROM jsonb_array_elements(p_items) x WHERE jsonb_typeof(x) IS DISTINCT FROM 'object' OR NOT x ?& ARRAY['id','calculator_key','slug','version','expected_catalog','expected_metadata','expected_sources','expected_qa'] OR jsonb_typeof(x->'expected_catalog') IS DISTINCT FROM 'object' OR jsonb_typeof(x->'expected_metadata') IS DISTINCT FROM 'object' OR jsonb_typeof(x->'expected_sources') IS DISTINCT FROM 'array' OR jsonb_typeof(x->'expected_qa') IS DISTINCT FROM 'array' OR x->>'id' IS NULL OR x->>'calculator_key' IS NULL OR x->>'slug' IS NULL OR x->>'version' IS NULL) THEN RAISE EXCEPTION 'Incomplete immutable binding'; END IF;
 IF EXISTS(SELECT FROM jsonb_array_elements(p_items) x WHERE (SELECT count(*) FROM jsonb_object_keys(x))<>8 OR jsonb_typeof(x->'id') IS DISTINCT FROM 'string' OR jsonb_typeof(x->'calculator_key') IS DISTINCT FROM 'string' OR jsonb_typeof(x->'slug') IS DISTINCT FROM 'string' OR jsonb_typeof(x->'version') IS DISTINCT FROM 'number' OR (x->>'version') !~ '^[1-9][0-9]*$' OR EXISTS(SELECT FROM jsonb_array_elements(x->'expected_sources') e WHERE jsonb_typeof(e) IS DISTINCT FROM 'object') OR EXISTS(SELECT FROM jsonb_array_elements(x->'expected_qa') e WHERE jsonb_typeof(e) IS DISTINCT FROM 'object')) THEN RAISE EXCEPTION 'Strict immutable item schema required'; END IF;
 IF (SELECT count(DISTINCT (x->>'id')::uuid) FROM jsonb_array_elements(p_items) x)<>n OR (SELECT count(DISTINCT x->>'calculator_key') FROM jsonb_array_elements(p_items) x)<>n OR (SELECT count(DISTINCT x->>'slug') FROM jsonb_array_elements(p_items) x)<>n THEN RAISE EXCEPTION 'Duplicate batch identity'; END IF;
 -- Same global order for every caller, before parent locks. Blocks evidence and
 -- reviewer authority writers; no new RLS bypass, policy, or grants on tables.
 LOCK TABLE public.calculator_qa_checks,public.calculator_source_evidence,public.platform_admins IN SHARE ROW EXCLUSIVE MODE;
 IF NOT EXISTS(SELECT FROM public.platform_admins WHERE user_id=auth.uid() AND active AND role IN ('owner','admin')) THEN RAISE EXCEPTION 'Active owner/admin required'; END IF;
 PERFORM c.id FROM public.calculator_catalog_admin c WHERE c.id IN(SELECT (x->>'id')::uuid FROM jsonb_array_elements(p_items) x) ORDER BY c.id FOR UPDATE;
 FOR item IN SELECT x FROM jsonb_array_elements(p_items) x ORDER BY (x->>'id')::uuid LOOP
  SELECT to_jsonb(c) INTO row_data FROM public.calculator_catalog_admin c WHERE id=(item->>'id')::uuid;
  SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY s.id),'[]'::jsonb) INTO sources FROM public.calculator_source_evidence s WHERE calculator_id=(item->>'id')::uuid;
  SELECT coalesce(jsonb_agg(to_jsonb(q) ORDER BY q.id),'[]'::jsonb) INTO qa FROM public.calculator_qa_checks q WHERE calculator_id=(item->>'id')::uuid;
  IF row_data IS NULL OR row_data IS DISTINCT FROM item->'expected_catalog' OR row_data->>'lifecycle' IS DISTINCT FROM 'certified' OR row_data->>'calculator_key' IS DISTINCT FROM item->>'calculator_key' OR row_data->>'slug' IS DISTINCT FROM item->>'slug' OR (row_data->>'version')::integer IS DISTINCT FROM (item->>'version')::integer OR row_data->'metadata' IS DISTINCT FROM item->'expected_metadata' OR sources IS DISTINCT FROM item->'expected_sources' OR qa IS DISTINCT FROM item->'expected_qa' THEN RAISE EXCEPTION 'Immutable publication binding mismatch'; END IF;
 END LOOP;
 -- No exception swallowing: every transition and its audit share one statement.
 FOR item IN SELECT x FROM jsonb_array_elements(p_items) x ORDER BY (x->>'id')::uuid LOOP
  PERFORM public.transition_calculator_with_audit((item->>'id')::uuid,'certified','published');
 END LOOP;
 RETURN n;
END $$;
REVOKE ALL ON FUNCTION public.publish_calculator_batch_with_audit_v1(jsonb) FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION public.publish_calculator_batch_with_audit_v1(jsonb) TO authenticated;


DO $exact$ BEGIN IF encode(sha256(convert_to((SELECT jsonb_build_object('base',(SELECT jsonb_build_object(
 'major',current_setting('server_version_num')::integer/10000,
 'relations',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||c.relname,'owner',pg_get_userbyid(c.relowner),'kind',c.relkind,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(c.relacl) x),'[]'::jsonb)) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'columns',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',a.attname,'position',a.attnum,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),'identity',a.attidentity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(a.attacl) x),'[]'::jsonb)) ORDER BY c.relname,a.attnum) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_attribute a ON a.attrelid=c.oid LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND a.attnum>0 AND NOT a.attisdropped),'[]'::jsonb),
 'functions',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f' AND (p.proname IN ('is_platform_admin','has_platform_role','validate_calculator_publish_gate','enforce_calculator_publish_gate','enforce_derived_source_count','enforce_qa_evidence_authority','enforce_qa_evidence_certification','enforce_reviewer_assignment_authority','enforce_source_evidence_certification','protect_active_ymyl_reviewer_authority','stamp_source_evidence_review','sync_source_evidence_count','record_calculator_qa_decision','is_active_review_capable_admin','assign_calculator_reviewer','transition_calculator_with_audit','create_catalog_calculator_with_audit','prepare_catalog_inventory_drafts','enforce_calculator_publish_gate_final_row','p0_publication_insert_guard','p0_publication_qa_old_parent','p0_publication_reviewer_delete','p0_publication_reviewer_lock','p0_publication_qa_parent_lock','list_published_calculator_manifest') OR p.oid IN (SELECT t.tgfoid FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND NOT t.tgisinternal))),'[]'::jsonb),
 'triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t.tgname,'table','public.'||c.relname,'definition',pg_get_triggerdef(t.oid),'enabled',t.tgenabled) ORDER BY c.relname,t.tgname) FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts') AND NOT t.tgisinternal),'[]'::jsonb),
 'constraints',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',v.conname,'definition',pg_get_constraintdef(v.oid),'validated',v.convalidated) ORDER BY c.relname,v.conname) FROM pg_constraint v JOIN pg_class c ON c.oid=v.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'indexes',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||ci.relname,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid) ORDER BY ci.relname) FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_class ci ON ci.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'policies',COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.tablename,p.policyname) FROM pg_policies p WHERE p.schemaname='public' AND p.tablename IN ('platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts')),'[]'::jsonb),
 'provider',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','auth.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='auth' AND p.proname IN ('uid','role') AND p.prokind='f'),'[]'::jsonb),
 'defaultAcls',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',pg_get_userbyid(d.defaclrole),'schema',COALESCE(n.nspname,''),'objectType',d.defaclobjtype,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(d.defaclacl) x),'[]'::jsonb)) ORDER BY COALESCE(n.nspname,''),d.defaclobjtype) FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace WHERE pg_get_userbyid(d.defaclrole)='postgres' AND (d.defaclnamespace=0 OR n.nspname='public') AND d.defaclobjtype='f'),'[]'::jsonb)
)),'addon',(SELECT coalesce(jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',coalesce((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY oidvectortypes(p.proargtypes)),'[]'::jsonb) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='publish_calculator_batch_with_audit_v1')))::text,'UTF8')),'hex') IS DISTINCT FROM 'e3464ae49077a732c00f0ed7a9466c3e2157ec0d3057c88d7035c4e269803538' THEN RAISE EXCEPTION 'PUBLICATION540_EXACT_METADATA'; END IF; END $exact$;


COMMIT;
