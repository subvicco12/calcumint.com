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
 WHERE n.nspname='public'
)
SELECT jsonb_build_object(
 'version',2,
 'schemas',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'usage',has_schema_privilege(rolname,'public','USAGE'),'create',has_schema_privilege(rolname,'public','CREATE')) ORDER BY rolname) FROM roles),
 'roles',(SELECT jsonb_agg(to_jsonb(r) ORDER BY rolname) FROM roles r),
 'memberships',(SELECT coalesce(jsonb_agg(jsonb_build_object('member',m.rolname,'role',r.rolname) ORDER BY m.rolname,r.rolname),'[]') FROM pg_auth_members a JOIN pg_roles m ON m.oid=a.member JOIN pg_roles r ON r.oid=a.roleid WHERE m.rolname=ANY(ARRAY['anon','authenticated','service_role'])),
 'tables',(SELECT jsonb_agg(jsonb_build_object('name',r.relname,'rls',r.relrowsecurity,'force_rls',r.relforcerowsecurity,'owner',r.owner,
 'columns',(SELECT jsonb_agg(jsonb_build_object('name',a.attname,'grants',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'select',has_column_privilege(rolname,r.oid,a.attnum,'SELECT'),'insert',has_column_privilege(rolname,r.oid,a.attnum,'INSERT'),'update',has_column_privilege(rolname,r.oid,a.attnum,'UPDATE'),'references',has_column_privilege(rolname,r.oid,a.attnum,'REFERENCES')) ORDER BY rolname) FROM roles)) ORDER BY a.attnum) FROM pg_attribute a WHERE a.attrelid=r.oid AND a.attnum>0 AND NOT a.attisdropped),
 'constraints',(SELECT coalesce(jsonb_agg(jsonb_build_object('name',conname,'type',contype,'definition',pg_get_constraintdef(oid)) ORDER BY conname),'[]') FROM pg_constraint WHERE conrelid=r.oid AND contype IN ('p','f','u','c')),
 'policies',(SELECT coalesce(jsonb_agg(jsonb_build_object('name',policyname,'command',cmd,'roles',roles,'using',qual,'check',with_check) ORDER BY policyname),'[]') FROM pg_policies WHERE schemaname='public' AND tablename=r.relname),
 'grants',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'owner_access',pg_has_role(rolname,r.owner,'USAGE'),'select',has_table_privilege(rolname,r.oid,'SELECT'),'insert',has_table_privilege(rolname,r.oid,'INSERT'),'update',has_table_privilege(rolname,r.oid,'UPDATE'),'delete',has_table_privilege(rolname,r.oid,'DELETE'),'truncate',has_table_privilege(rolname,r.oid,'TRUNCATE'),'trigger',has_table_privilege(rolname,r.oid,'TRIGGER'),'references',has_table_privilege(rolname,r.oid,'REFERENCES')) ORDER BY rolname) FROM roles)
 ) ORDER BY r.relname) FROM relations r),
 'functions',(SELECT jsonb_agg(jsonb_build_object('name',f.proname,'arguments',f.arguments,'result',f.result,'definer',f.prosecdef,'config',f.proconfig,'owner',f.owner,
 'grants',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'execute',has_function_privilege(rolname,f.oid,'EXECUTE')) ORDER BY rolname) FROM roles)) ORDER BY f.proname) FROM functions f)
);
