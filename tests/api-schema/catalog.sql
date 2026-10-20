-- Read-only sanitized catalog snapshot. No application rows, function bodies,
-- connection configuration, signing material, passwords or role settings.
WITH relations AS (
 SELECT c.oid,c.relname,c.relrowsecurity,c.relforcerowsecurity,pg_get_userbyid(c.relowner) AS owner
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relkind='r' AND c.relname=ANY(ARRAY[
 'profiles','organizations','organization_members','custom_calculators',
 'custom_calculator_versions','custom_calculator_runs','embed_configs','embed_leads',
 'lead_consents','embed_lead_receipts','business_api_keys','api_usage_events',
 'batch_calculation_jobs','batch_request_receipts'])
), roles AS (
 SELECT rolname,rolsuper,rolinherit,rolbypassrls FROM pg_roles
 WHERE rolname=ANY(ARRAY['anon','authenticated','service_role'])
), functions AS (
 SELECT p.oid,p.proname,pg_get_function_identity_arguments(p.oid) AS arguments,
 pg_get_function_result(p.oid) AS result,p.prosecdef,p.proconfig,pg_get_userbyid(p.proowner) AS owner
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname=ANY(ARRAY['is_org_member','has_org_role',
 'submit_verified_batch_job_v1','read_verified_batch_job_v1','capture_verified_embed_lead_v1'])
)
SELECT jsonb_build_object(
 'version',1,
 'roles',(SELECT jsonb_agg(to_jsonb(r) ORDER BY rolname) FROM roles r),
 'memberships',(SELECT coalesce(jsonb_agg(jsonb_build_object('member',m.rolname,'role',r.rolname) ORDER BY m.rolname,r.rolname),'[]') FROM pg_auth_members a JOIN pg_roles m ON m.oid=a.member JOIN pg_roles r ON r.oid=a.roleid WHERE m.rolname=ANY(ARRAY['anon','authenticated','service_role'])),
 'tables',(SELECT jsonb_agg(jsonb_build_object('name',r.relname,'rls',r.relrowsecurity,'force_rls',r.relforcerowsecurity,'owner',r.owner,
 'constraints',(SELECT coalesce(jsonb_agg(jsonb_build_object('name',conname,'type',contype,'definition',pg_get_constraintdef(oid)) ORDER BY conname),'[]') FROM pg_constraint WHERE conrelid=r.oid AND contype IN ('p','f','u','c')),
 'policies',(SELECT coalesce(jsonb_agg(jsonb_build_object('name',policyname,'command',cmd,'roles',roles,'using',qual,'check',with_check) ORDER BY policyname),'[]') FROM pg_policies WHERE schemaname='public' AND tablename=r.relname),
 'grants',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'select',has_table_privilege(rolname,r.oid,'SELECT'),'insert',has_table_privilege(rolname,r.oid,'INSERT'),'update',has_table_privilege(rolname,r.oid,'UPDATE'),'delete',has_table_privilege(rolname,r.oid,'DELETE')) ORDER BY rolname) FROM roles)
 ) ORDER BY r.relname) FROM relations r),
 'functions',(SELECT jsonb_agg(jsonb_build_object('name',f.proname,'arguments',f.arguments,'result',f.result,'definer',f.prosecdef,'config',f.proconfig,'owner',f.owner,
 'grants',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'execute',has_function_privilege(rolname,f.oid,'EXECUTE')) ORDER BY rolname) FROM roles)) ORDER BY f.proname) FROM functions f)
);
