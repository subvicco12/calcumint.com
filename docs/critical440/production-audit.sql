BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SET LOCAL search_path=pg_catalog;
SET LOCAL statement_timeout='20s';
WITH scoped AS (
 SELECT c.oid,c.relname,c.relrowsecurity,c.relforcerowsecurity,c.relowner
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relname=ANY(ARRAY['platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events','calculator_bulk_jobs','calculator_source_evidence','admin_alerts'])
), functions AS (
 SELECT p.*,n.nspname,pg_get_functiondef(p.oid) AS definition
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.prokind='f'
), refs AS (
 SELECT f.* FROM functions f WHERE f.proname IN ('refresh_admin_review_alerts','save_calculation_history_atomic','save_project_scenario_atomic')
 OR EXISTS(SELECT 1 FROM scoped s WHERE f.definition ILIKE '%'||s.relname||'%')
)
SELECT jsonb_build_object(
 'observedAt',clock_timestamp(),'readOnly',current_setting('transaction_read_only'),'actor',current_user,
 'monitoringVisibility',jsonb_build_object('pgMonitor',pg_has_role(current_user,'pg_monitor','MEMBER'),'pgReadAllStats',pg_has_role(current_user,'pg_read_all_stats','MEMBER')),
 'gateDefinitionSHA256',(SELECT encode(sha256(convert_to(definition,'UTF8')),'hex') FROM functions WHERE proname='validate_calculator_publish_gate'),
 'relationRLS',(SELECT jsonb_agg(jsonb_build_object('table',relname,'owner',pg_get_userbyid(relowner),'enabled',relrowsecurity,'forced',relforcerowsecurity) ORDER BY relname) FROM scoped),
 'effectiveTablePrivileges',(SELECT jsonb_agg(jsonb_build_object('table',s.relname,'role',r.rolname,'privilege',p.privilege,'allowed',has_table_privilege(r.rolname,s.oid,p.privilege)) ORDER BY s.relname,r.rolname,p.privilege) FROM scoped s CROSS JOIN pg_roles r CROSS JOIN (VALUES('SELECT'),('INSERT'),('UPDATE'),('DELETE'),('TRUNCATE'),('REFERENCES'),('TRIGGER')) p(privilege) WHERE r.rolname IN ('anon','authenticated','service_role')),
 'schemaPrivileges',(SELECT jsonb_agg(jsonb_build_object('schema',n.nspname,'role',r.rolname,'create',has_schema_privilege(r.rolname,n.oid,'CREATE'),'usage',has_schema_privilege(r.rolname,n.oid,'USAGE')) ORDER BY n.nspname,r.rolname) FROM pg_namespace n CROSS JOIN pg_roles r WHERE n.nspname IN ('public','auth') AND r.rolname IN ('anon','authenticated','service_role','postgres')),
 'functionReferenceCandidates',(SELECT jsonb_agg(jsonb_build_object('signature',oid::regprocedure::text,'owner',pg_get_userbyid(proowner),'securityDefiner',prosecdef,'settings',proconfig,'definitionSHA256',encode(sha256(convert_to(definition,'UTF8')),'hex'),'anonExecute',has_function_privilege('anon',oid,'EXECUTE'),'authenticatedExecute',has_function_privilege('authenticated',oid,'EXECUTE'),'serviceExecute',has_function_privilege('service_role',oid,'EXECUTE')) ORDER BY proname,oidvectortypes(proargtypes)) FROM refs),
 'roles',(SELECT jsonb_agg(jsonb_build_object('role',rolname,'superuser',rolsuper,'inherit',rolinherit,'createRole',rolcreaterole,'createDb',rolcreatedb,'login',rolcanlogin,'replication',rolreplication,'bypassRLS',rolbypassrls) ORDER BY rolname) FROM pg_roles WHERE rolname IN ('postgres','anon','authenticated','service_role','authenticator','supabase_admin','supabase_auth_admin') OR rolsuper OR rolbypassrls),
 'roleMemberships',(SELECT jsonb_agg(jsonb_build_object('grantedRole',p.rolname,'member',m.rolname,'adminOption',a.admin_option) ORDER BY p.rolname,m.rolname) FROM pg_auth_members a JOIN pg_roles p ON p.oid=a.roleid JOIN pg_roles m ON m.oid=a.member WHERE p.rolname IN ('postgres','anon','authenticated','service_role','authenticator') OR m.rolname IN ('postgres','anon','authenticated','service_role','authenticator')),
 'incomingForeignKeys',(SELECT jsonb_agg(jsonb_build_object('table',c.conrelid::regclass::text,'name',c.conname,'target',c.confrelid::regclass::text,'definition',pg_get_constraintdef(c.oid)) ORDER BY c.conrelid::regclass::text,c.conname) FROM pg_constraint c WHERE c.contype='f' AND c.confrelid IN(SELECT oid FROM scoped)),
 'eventTriggers',(SELECT jsonb_agg(jsonb_build_object('name',e.evtname,'event',e.evtevent,'enabled',e.evtenabled,'owner',pg_get_userbyid(e.evtowner),'tags',e.evttags,'function',e.evtfoid::regprocedure::text,'definitionSHA256',encode(sha256(convert_to(pg_get_functiondef(e.evtfoid),'UTF8')),'hex')) ORDER BY e.evtname) FROM pg_event_trigger e),
 'activity',(SELECT jsonb_agg(to_jsonb(s) ORDER BY s.backend_type,s.usename,s.application_name,s.state) FROM (SELECT backend_type,usename,application_name,state,wait_event_type,wait_event,count(*) AS sessions,min(xact_start) AS oldest_xact_start,min(query_start) AS oldest_query_start FROM pg_stat_activity WHERE datname=current_database() AND pid<>pg_backend_pid() GROUP BY backend_type,usename,application_name,state,wait_event_type,wait_event) s),
 'scopedLocks',(SELECT jsonb_agg(to_jsonb(s) ORDER BY s.relation,s.mode) FROM (SELECT l.locktype,l.relation::regclass::text AS relation,l.mode,l.granted,a.usename,a.application_name,a.backend_type,a.state,count(*) AS locks FROM pg_locks l LEFT JOIN pg_stat_activity a ON a.pid=l.pid WHERE l.relation IN(SELECT oid FROM scoped) AND l.pid IS DISTINCT FROM pg_backend_pid() GROUP BY l.locktype,l.relation,l.mode,l.granted,a.usename,a.application_name,a.backend_type,a.state) s),
 'preparedTransactions',(SELECT jsonb_build_object('count',count(*),'oldest',min(prepared)) FROM pg_prepared_xacts WHERE database=current_database()),
 'cronExtension',(SELECT extversion FROM pg_extension WHERE extname='pg_cron'),
 'cronJobRelation',to_regclass('cron.job')::text,
 'cronRunRelation',to_regclass('cron.job_run_details')::text
) AS evidence;
COMMIT;
