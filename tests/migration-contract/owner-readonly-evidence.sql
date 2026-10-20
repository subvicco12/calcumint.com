-- Optional OWNER-RUN evidence collection, never executed against production by
-- this task. Metadata/digests only: no app rows, function bodies, passwords,
-- JWTs, provider payloads, reviewer identities or role settings are exported.
-- Missing permissions/ledger objects must remain UNKNOWN, not an empty approval.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout='5s';

SELECT version,name,
 cardinality(statements) AS statement_count,
 encode(sha256(convert_to(array_to_string(statements,E'\n'),'UTF8')),'hex') AS joined_statements_sha256,
 'sha256(array_to_string(statements,LF)); not necessarily repository byte format' AS digest_contract
FROM supabase_migrations.schema_migrations ORDER BY version;

WITH roles AS (
 SELECT oid,rolname,rolsuper,rolinherit,rolbypassrls FROM pg_catalog.pg_roles
 WHERE rolname=ANY(ARRAY['anon','authenticated','service_role'])
), relations AS (
 SELECT c.oid,c.relname,c.relowner,c.relrowsecurity,c.relforcerowsecurity
 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relkind='r' AND c.relname=ANY(ARRAY[
 'profiles','user_preferences','platform_admins','subscriptions','billing_customers',
 'billing_webhook_events','billing_account_fences','billing_atomic_completions',
 'calculation_history','calculation_projects','saved_scenarios','organizations',
 'organization_members','custom_calculators','custom_calculator_versions',
 'business_api_keys','api_usage_events','batch_calculation_jobs','batch_request_receipts',
 'embed_configs','embed_leads','lead_consents','embed_lead_receipts'])
), functions AS (
 SELECT p.*,n.nspname FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid=p.pronamespace
 WHERE (n.nspname='auth' AND p.proname='uid') OR (n.nspname='public' AND p.proname=ANY(ARRAY[
 'enforce_calcumint_save_quotas','enforce_free_history_limit','is_org_member','has_org_role','org_role',
 'read_billing_fence_v1','read_verified_billing_completion_v1','apply_verified_billing_event_v1',
 'atomic_account_plan','guard_atomic_history','guard_atomic_workspace','atomic_snapshot_valid',
 'save_calculation_history_atomic','save_project_scenario_atomic','consume_business_api_quota',
 'read_verified_batch_job_v1','submit_verified_batch_job_v1','capture_verified_embed_lead_v1',
 'membership_identity_fence_v1','organization_owner_fence_v1']))
)
SELECT jsonb_build_object(
 'schema_version',1,'evidence_kind','OWNER_READONLY_METADATA_NOT_APPROVAL',
 'roles',(SELECT coalesce(jsonb_agg(jsonb_build_object('name',rolname,'super',rolsuper,'inherit',rolinherit,'bypass_rls',rolbypassrls) ORDER BY rolname),'[]') FROM roles),
 'role_memberships',(SELECT coalesce(jsonb_agg(jsonb_build_object('member',m.rolname,'parent',p.rolname,'admin_option',a.admin_option) ORDER BY m.rolname,p.rolname),'[]') FROM pg_catalog.pg_auth_members a JOIN pg_catalog.pg_roles m ON m.oid=a.member JOIN pg_catalog.pg_roles p ON p.oid=a.roleid WHERE m.oid IN (SELECT oid FROM roles)),
 'schema_grants',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'usage',has_schema_privilege(oid,'public','USAGE'),'create',has_schema_privilege(oid,'public','CREATE')) ORDER BY rolname) FROM roles),
 'tables',(SELECT coalesce(jsonb_agg(jsonb_build_object(
  'name',r.relname,'owner',pg_get_userbyid(r.relowner),'rls',r.relrowsecurity,'force_rls',r.relforcerowsecurity,
  'columns',(SELECT jsonb_agg(jsonb_build_object('name',a.attname,'type',format_type(a.atttypid,a.atttypmod),'not_null',a.attnotnull,
   'grants',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'select',has_column_privilege(oid,r.oid,a.attnum,'SELECT'),'insert',has_column_privilege(oid,r.oid,a.attnum,'INSERT'),'update',has_column_privilege(oid,r.oid,a.attnum,'UPDATE'),'references',has_column_privilege(oid,r.oid,a.attnum,'REFERENCES')) ORDER BY rolname) FROM roles)) ORDER BY a.attnum) FROM pg_catalog.pg_attribute a WHERE a.attrelid=r.oid AND a.attnum>0 AND NOT a.attisdropped),
  'policies',(SELECT coalesce(jsonb_agg(jsonb_build_object('name',policyname,'command',cmd,'roles',roles,'using_sha256',encode(sha256(convert_to(qual,'UTF8')),'hex'),'check_sha256',encode(sha256(convert_to(with_check,'UTF8')),'hex')) ORDER BY policyname),'[]') FROM pg_catalog.pg_policies WHERE schemaname='public' AND tablename=r.relname),
  'triggers',(SELECT coalesce(jsonb_agg(jsonb_build_object('name',t.tgname,'enabled',t.tgenabled,'definition_sha256',encode(sha256(convert_to(pg_get_triggerdef(t.oid),'UTF8')),'hex')) ORDER BY t.tgname),'[]') FROM pg_catalog.pg_trigger t WHERE t.tgrelid=r.oid AND NOT t.tgisinternal),
  'constraints',(SELECT coalesce(jsonb_agg(jsonb_build_object('name',c.conname,'type',c.contype,'definition_sha256',encode(sha256(convert_to(pg_get_constraintdef(c.oid),'UTF8')),'hex')) ORDER BY c.conname),'[]') FROM pg_catalog.pg_constraint c WHERE c.conrelid=r.oid),
  'grants',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'owner_access',pg_has_role(oid,r.relowner,'USAGE'),'select',has_table_privilege(oid,r.oid,'SELECT'),'insert',has_table_privilege(oid,r.oid,'INSERT'),'update',has_table_privilege(oid,r.oid,'UPDATE'),'delete',has_table_privilege(oid,r.oid,'DELETE'),'truncate',has_table_privilege(oid,r.oid,'TRUNCATE'),'trigger',has_table_privilege(oid,r.oid,'TRIGGER'),'references',has_table_privilege(oid,r.oid,'REFERENCES')) ORDER BY rolname) FROM roles)
 ) ORDER BY r.relname),'[]') FROM relations r),
 'functions',(SELECT coalesce(jsonb_agg(jsonb_build_object('schema',p.nspname,'name',p.proname,'arguments',pg_get_function_identity_arguments(p.oid),'result',pg_get_function_result(p.oid),'owner',pg_get_userbyid(p.proowner),'definer',p.prosecdef,
  'search_paths',(SELECT coalesce(jsonb_agg(setting),'[]') FROM unnest(p.proconfig) setting WHERE setting LIKE 'search_path=%'),
  'definition_sha256',encode(sha256(convert_to(pg_get_functiondef(p.oid),'UTF8')),'hex'),
  'execute',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'allowed',has_function_privilege(oid,p.oid,'EXECUTE')) ORDER BY rolname) FROM roles)
 ) ORDER BY p.proname,pg_get_function_identity_arguments(p.oid)),'[]') FROM functions p)
) AS release_contract;
COMMIT;
