BEGIN; SET LOCAL search_path=pg_catalog; SET LOCAL lock_timeout='3s'; SET LOCAL statement_timeout='30s';
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_ACCOUNT_ADOPTION1530_APPLY: no activation authority'; END $hold$;
DO $owner$ BEGIN IF current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'ACCOUNT_OPERATOR_OR_ISOLATION_MISMATCH'; END IF; END $owner$;
LOCK TABLE public."calculation_history",public."calculation_projects",public."profiles",public."saved_scenarios" IN ACCESS EXCLUSIVE MODE;

DO $exact$ BEGIN IF encode(sha256(convert_to((SELECT jsonb_build_object(
 'major',current_setting('server_version_num')::integer/10000,
 'relations',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||c.relname,'owner',pg_get_userbyid(c.relowner),'kind',c.relkind,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(c.relacl) x),'[]'::jsonb)) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'columns',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',a.attname,'position',a.attnum,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),'identity',a.attidentity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(a.attacl) x),'[]'::jsonb)) ORDER BY c.relname,a.attnum) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_attribute a ON a.attrelid=c.oid LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND a.attnum>0 AND NOT a.attisdropped),'[]'::jsonb),
 'functions',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f' AND (p.proname IN ('atomic_snapshot_valid','atomic_account_plan','guard_atomic_history','guard_atomic_workspace','save_calculation_history_atomic','save_project_scenario_atomic') OR p.oid IN (SELECT t.tgfoid FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND NOT t.tgisinternal))),'[]'::jsonb),
 'triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t.tgname,'table','public.'||c.relname,'definition',pg_get_triggerdef(t.oid),'enabled',t.tgenabled) ORDER BY c.relname,t.tgname) FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND NOT t.tgisinternal),'[]'::jsonb),
 'constraints',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',v.conname,'definition',pg_get_constraintdef(v.oid),'validated',v.convalidated) ORDER BY c.relname,v.conname) FROM pg_constraint v JOIN pg_class c ON c.oid=v.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'indexes',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||ci.relname,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid) ORDER BY ci.relname) FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_class ci ON ci.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'policies',COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.tablename,p.policyname) FROM pg_policies p WHERE p.schemaname='public' AND p.tablename IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'provider',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','auth.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='auth' AND p.proname IN ('uid','role') AND p.prokind='f'),'[]'::jsonb),
 'defaultAcls',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',pg_get_userbyid(d.defaclrole),'schema',COALESCE(n.nspname,''),'objectType',d.defaclobjtype,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(d.defaclacl) x),'[]'::jsonb)) ORDER BY COALESCE(n.nspname,''),d.defaclobjtype) FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace WHERE pg_get_userbyid(d.defaclrole)='postgres' AND (d.defaclnamespace=0 OR n.nspname='public') AND d.defaclobjtype='f'),'[]'::jsonb)
))::text,'UTF8')),'hex') IS DISTINCT FROM 'af413dcb2f0806bcc29680f5c0a07cef138cc5948798f645e7ccc1f79288584a' THEN RAISE EXCEPTION 'ACCOUNT_EXACT_METADATA_MISMATCH'; END IF; END $exact$;
DO $data$ BEGIN IF EXISTS(SELECT 1 FROM public.calculation_history WHERE calculator_slug IS NULL OR btrim(calculator_slug)='' OR calculator_version IS NULL OR calculator_version<1 OR jsonb_typeof(input_data) IS DISTINCT FROM 'object' OR jsonb_typeof(output_data) IS DISTINCT FROM 'object') OR EXISTS(SELECT 1 FROM public.saved_scenarios WHERE jsonb_typeof(input_data) IS DISTINCT FROM 'object' OR jsonb_typeof(output_data) IS DISTINCT FROM 'object') OR EXISTS(SELECT 1 FROM public.profiles WHERE plan IS NULL OR plan NOT IN('free','pro','business')) OR EXISTS(SELECT 1 FROM public.saved_scenarios s WHERE s.project_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.calculation_projects p WHERE p.id=s.project_id AND p.user_id=s.user_id)) THEN RAISE EXCEPTION 'ACCOUNT_LEGACY_DATA_PRECONDITION'; END IF; END $data$;
-- REVIEW PROPOSAL ONLY. Not a migration; never apply to a deployed database.
-- The disposable test removes ONLY this guard. Production ownership, function
-- owners, RLS bypass, platform grants, and authoritative billing writer identities
-- must be audited before an independently reviewed deployment migration exists.


-- p_expected_owner_id is an equality precondition only, never an ownership selector.
-- Existing policies remain authoritative for reads, deletes, project binding.
-- Definer owner must be a trusted migration role with table access/BYPASSRLS;
-- authenticated/anon must NEVER own these functions or have CREATE in public.
CREATE FUNCTION public.atomic_snapshot_valid(slug text, version integer, inputs jsonb, outputs jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path=pg_catalog AS $$
 SELECT coalesce(char_length(slug) BETWEEN 1 AND 160 AND btrim(slug)<>''
 AND version>0 AND jsonb_typeof(inputs)='object' AND jsonb_typeof(outputs)='object'
 AND NOT jsonb_path_exists(inputs, '$.** ? (@.type() == "number" && (@ > 1.7976931348623157e308 || @ < -1.7976931348623157e308))')
 AND NOT jsonb_path_exists(outputs, '$.** ? (@.type() == "number" && (@ > 1.7976931348623157e308 || @ < -1.7976931348623157e308))'),false)
$$;

CREATE FUNCTION public.atomic_account_plan(owner_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE account_plan text;
BEGIN
 IF auth.uid() IS NULL OR owner_id IS DISTINCT FROM auth.uid() THEN
  RAISE EXCEPTION USING ERRCODE='42501', MESSAGE='HISTORY_WRITE_REJECTED';
 END IF;
 SELECT plan INTO account_plan FROM public.profiles WHERE id=owner_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'HISTORY_WRITE_REJECTED'; END IF;
 -- A real row version change makes stale REPEATABLE READ/SERIALIZABLE writers
 -- abort instead of counting an old snapshot after waiting for the profile lock.
 -- All billing downgrades update this same row and therefore share this lock.
 UPDATE public.profiles SET id=id WHERE id=owner_id;
 RETURN account_plan;
END $$;

CREATE FUNCTION public.guard_atomic_history()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE account_plan text; prior public.calculation_history%ROWTYPE;
BEGIN
 IF TG_OP='UPDATE' THEN
  RAISE EXCEPTION 'HISTORY_SNAPSHOT_IMMUTABLE';
 END IF;
 account_plan:=public.atomic_account_plan(NEW.user_id);
 IF NOT public.atomic_snapshot_valid(NEW.calculator_slug,NEW.calculator_version,NEW.input_data,NEW.output_data) THEN
  RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_HISTORY_SNAPSHOT';
 END IF;
 SELECT * INTO prior FROM public.calculation_history WHERE id=NEW.id;
 IF FOUND THEN
  IF prior.user_id<>NEW.user_id THEN RAISE EXCEPTION 'HISTORY_WRITE_REJECTED'; END IF;
  IF ROW(prior.calculator_slug,prior.calculator_version,prior.input_data,prior.output_data)
    IS DISTINCT FROM ROW(NEW.calculator_slug,NEW.calculator_version,NEW.input_data,NEW.output_data) THEN
   RAISE EXCEPTION 'HISTORY_REQUEST_CONFLICT';
  END IF;
  RETURN NULL; -- Legacy exact UUID retries consume no quota and insert no row.
 END IF;
 IF account_plan='free' AND (SELECT count(*) FROM public.calculation_history WHERE user_id=NEW.user_id)>=20 THEN
  RAISE EXCEPTION 'HISTORY_QUOTA_EXCEEDED';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER atomic_history_guard BEFORE INSERT OR UPDATE ON public.calculation_history
FOR EACH ROW EXECUTE FUNCTION public.guard_atomic_history();

CREATE FUNCTION public.save_calculation_history_atomic(p_request_id uuid,p_calculator_slug text,p_calculator_version integer,p_input_data jsonb,p_output_data jsonb,p_expected_owner_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE owner_id uuid:=auth.uid(); prior public.calculation_history%ROWTYPE;
BEGIN
 IF owner_id IS NULL OR owner_id IS DISTINCT FROM p_expected_owner_id THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='HISTORY_WRITE_REJECTED'; END IF;
 PERFORM public.atomic_account_plan(owner_id);
 IF p_request_id IS NULL OR NOT public.atomic_snapshot_valid(p_calculator_slug,p_calculator_version,p_input_data,p_output_data) THEN
  RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_HISTORY_SNAPSHOT';
 END IF;
 SELECT * INTO prior FROM public.calculation_history WHERE id=p_request_id;
 IF FOUND THEN
  IF prior.user_id<>owner_id THEN RAISE EXCEPTION 'HISTORY_WRITE_REJECTED'; END IF;
  IF ROW(prior.calculator_slug,prior.calculator_version,prior.input_data,prior.output_data)
    IS DISTINCT FROM ROW(p_calculator_slug,p_calculator_version,p_input_data,p_output_data) THEN
   RAISE EXCEPTION 'HISTORY_REQUEST_CONFLICT';
  END IF;
  RETURN prior.id;
 END IF;
 BEGIN
  INSERT INTO public.calculation_history(id,user_id,calculator_slug,calculator_version,input_data,output_data)
  VALUES(p_request_id,owner_id,p_calculator_slug,p_calculator_version,p_input_data,p_output_data);
 EXCEPTION WHEN unique_violation THEN
  -- A different owner's concurrent UUID winner must not expose constraint/detail.
  RAISE EXCEPTION 'HISTORY_WRITE_REJECTED';
 END;
 RETURN p_request_id;
END $$;

CREATE FUNCTION public.guard_atomic_workspace()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE account_plan text;
BEGIN
 account_plan:=public.atomic_account_plan(NEW.user_id);
 IF account_plan NOT IN ('pro','business') THEN RAISE EXCEPTION 'SCENARIO_PLAN_REQUIRED'; END IF;
 IF TG_OP='UPDATE' THEN
  IF TG_TABLE_NAME='saved_scenarios' THEN
   IF (to_jsonb(NEW)-'name'-'updated_at') IS DISTINCT FROM (to_jsonb(OLD)-'name'-'updated_at') THEN
    RAISE EXCEPTION 'SCENARIO_SNAPSHOT_IMMUTABLE';
   END IF;
  ELSIF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.id IS DISTINCT FROM OLD.id THEN
   RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED';
  END IF;
 END IF;
 IF TG_TABLE_NAME='saved_scenarios' THEN
  IF NOT public.atomic_snapshot_valid(NEW.calculator_slug,NEW.calculator_version,NEW.input_data,NEW.output_data) THEN
   RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_HISTORY_SNAPSHOT';
  END IF;
  -- Also enforce binding for definer RPC writes, which bypass existing RLS.
  IF NEW.project_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.calculation_projects WHERE id=NEW.project_id AND user_id=NEW.user_id) THEN
   RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED';
  END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER atomic_scenario_guard BEFORE INSERT OR UPDATE ON public.saved_scenarios
FOR EACH ROW EXECUTE FUNCTION public.guard_atomic_workspace();
CREATE TRIGGER atomic_project_guard BEFORE INSERT OR UPDATE ON public.calculation_projects
FOR EACH ROW EXECUTE FUNCTION public.guard_atomic_workspace();

CREATE FUNCTION public.save_project_scenario_atomic(p_request_id uuid,p_project_id uuid,p_history_id uuid,p_name text,p_expected_owner_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE owner_id uuid:=auth.uid(); source public.calculation_history%ROWTYPE; prior public.saved_scenarios%ROWTYPE;
BEGIN
 IF owner_id IS NULL OR owner_id IS DISTINCT FROM p_expected_owner_id THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='SCENARIO_WRITE_REJECTED'; END IF;
 IF public.atomic_account_plan(owner_id) NOT IN ('pro','business') THEN RAISE EXCEPTION 'SCENARIO_PLAN_REQUIRED'; END IF;
 IF p_request_id IS NULL OR p_history_id IS NULL OR p_name IS NULL OR char_length(btrim(p_name)) NOT BETWEEN 1 AND 120 THEN
  RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED';
 END IF;
 SELECT * INTO source FROM public.calculation_history WHERE id=p_history_id AND user_id=owner_id FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED'; END IF;
 IF p_project_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.calculation_projects WHERE id=p_project_id AND user_id=owner_id) THEN
  RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED';
 END IF;
 SELECT * INTO prior FROM public.saved_scenarios WHERE id=p_request_id;
 IF FOUND THEN
  IF prior.user_id<>owner_id THEN RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED'; END IF;
  IF ROW(prior.project_id,prior.name,prior.calculator_slug,prior.calculator_version,prior.input_data,prior.output_data)
   IS DISTINCT FROM ROW(p_project_id,p_name,source.calculator_slug,source.calculator_version,source.input_data,source.output_data) THEN
   RAISE EXCEPTION 'SCENARIO_REQUEST_CONFLICT';
  END IF;
  RETURN prior.id;
 END IF;
 BEGIN
  INSERT INTO public.saved_scenarios(id,user_id,project_id,name,calculator_slug,calculator_version,input_data,output_data)
  VALUES(p_request_id,owner_id,p_project_id,p_name,source.calculator_slug,source.calculator_version,source.input_data,source.output_data);
 EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED'; END;
 RETURN p_request_id;
END $$;

-- Do not broaden table privileges or replace RLS. Only authenticated RPC calls.
REVOKE ALL ON FUNCTION public.atomic_snapshot_valid(text,integer,jsonb,jsonb), public.atomic_account_plan(uuid), public.guard_atomic_history(), public.guard_atomic_workspace(), public.save_calculation_history_atomic(uuid,text,integer,jsonb,jsonb,uuid), public.save_project_scenario_atomic(uuid,uuid,uuid,text,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_calculation_history_atomic(uuid,text,integer,jsonb,jsonb,uuid), public.save_project_scenario_atomic(uuid,uuid,uuid,text,uuid) TO authenticated;
CREATE INDEX calculation_history_user_created_id_idx ON public.calculation_history(user_id,created_at DESC,id DESC);

-- No formula validation, new billing mechanism, numeric paid quota, or global
-- exactly-once guarantee is implied. Deleting a request row removes replay memory.
-- History cursor order: created_at DESC,id DESC; next page tuple strictly less
-- than the last observed tuple, owner filtered, bounded limit. Concurrent deletes
-- may shrink pages and new inserts appear on refresh, not a frozen snapshot.

DO $exact$ BEGIN IF encode(sha256(convert_to((SELECT jsonb_build_object(
 'major',current_setting('server_version_num')::integer/10000,
 'relations',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||c.relname,'owner',pg_get_userbyid(c.relowner),'kind',c.relkind,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(c.relacl) x),'[]'::jsonb)) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'columns',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',a.attname,'position',a.attnum,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),'identity',a.attidentity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(a.attacl) x),'[]'::jsonb)) ORDER BY c.relname,a.attnum) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_attribute a ON a.attrelid=c.oid LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND a.attnum>0 AND NOT a.attisdropped),'[]'::jsonb),
 'functions',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f' AND (p.proname IN ('atomic_snapshot_valid','atomic_account_plan','guard_atomic_history','guard_atomic_workspace','save_calculation_history_atomic','save_project_scenario_atomic') OR p.oid IN (SELECT t.tgfoid FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND NOT t.tgisinternal))),'[]'::jsonb),
 'triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t.tgname,'table','public.'||c.relname,'definition',pg_get_triggerdef(t.oid),'enabled',t.tgenabled) ORDER BY c.relname,t.tgname) FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND NOT t.tgisinternal),'[]'::jsonb),
 'constraints',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',v.conname,'definition',pg_get_constraintdef(v.oid),'validated',v.convalidated) ORDER BY c.relname,v.conname) FROM pg_constraint v JOIN pg_class c ON c.oid=v.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'indexes',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||ci.relname,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid) ORDER BY ci.relname) FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_class ci ON ci.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'policies',COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.tablename,p.policyname) FROM pg_policies p WHERE p.schemaname='public' AND p.tablename IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'provider',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','auth.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='auth' AND p.proname IN ('uid','role') AND p.prokind='f'),'[]'::jsonb),
 'defaultAcls',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',pg_get_userbyid(d.defaclrole),'schema',COALESCE(n.nspname,''),'objectType',d.defaclobjtype,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(d.defaclacl) x),'[]'::jsonb)) ORDER BY COALESCE(n.nspname,''),d.defaclobjtype) FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace WHERE pg_get_userbyid(d.defaclrole)='postgres' AND (d.defaclnamespace=0 OR n.nspname='public') AND d.defaclobjtype='f'),'[]'::jsonb)
))::text,'UTF8')),'hex') IS DISTINCT FROM '1b56153313fd6b8471658ac791834f634eb64d67bdd90bf6163a0d760b387249' THEN RAISE EXCEPTION 'ACCOUNT_EXACT_METADATA_MISMATCH'; END IF; END $exact$;
DO $exact$ BEGIN IF encode(sha256(convert_to((SELECT jsonb_build_object(
 'major',current_setting('server_version_num')::integer/10000,
 'relations',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||c.relname,'owner',pg_get_userbyid(c.relowner),'kind',c.relkind,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(c.relacl) x),'[]'::jsonb)) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'columns',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',a.attname,'position',a.attnum,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),'identity',a.attidentity,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(a.attacl) x),'[]'::jsonb)) ORDER BY c.relname,a.attnum) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_attribute a ON a.attrelid=c.oid LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND a.attnum>0 AND NOT a.attisdropped),'[]'::jsonb),
 'functions',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f' AND (p.proname IN ('atomic_snapshot_valid','atomic_account_plan','guard_atomic_history','guard_atomic_workspace','save_calculation_history_atomic','save_project_scenario_atomic') OR p.oid IN (SELECT t.tgfoid FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND NOT t.tgisinternal))),'[]'::jsonb),
 'triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t.tgname,'table','public.'||c.relname,'definition',pg_get_triggerdef(t.oid),'enabled',t.tgenabled) ORDER BY c.relname,t.tgname) FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios') AND NOT t.tgisinternal),'[]'::jsonb),
 'constraints',COALESCE((SELECT jsonb_agg(jsonb_build_object('table','public.'||c.relname,'name',v.conname,'definition',pg_get_constraintdef(v.oid),'validated',v.convalidated) ORDER BY c.relname,v.conname) FROM pg_constraint v JOIN pg_class c ON c.oid=v.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'indexes',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','public.'||ci.relname,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid) ORDER BY ci.relname) FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_class ci ON ci.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'policies',COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.tablename,p.policyname) FROM pg_policies p WHERE p.schemaname='public' AND p.tablename IN ('profiles','calculation_history','calculation_projects','saved_scenarios')),'[]'::jsonb),
 'provider',COALESCE((SELECT jsonb_agg(jsonb_build_object('id','auth.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY p.proname,oidvectortypes(p.proargtypes)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='auth' AND p.proname IN ('uid','role') AND p.prokind='f'),'[]'::jsonb),
 'defaultAcls',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',pg_get_userbyid(d.defaclrole),'schema',COALESCE(n.nspname,''),'objectType',d.defaclobjtype,'acl',COALESCE((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(d.defaclacl) x),'[]'::jsonb)) ORDER BY COALESCE(n.nspname,''),d.defaclobjtype) FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace WHERE pg_get_userbyid(d.defaclrole)='postgres' AND (d.defaclnamespace=0 OR n.nspname='public') AND d.defaclobjtype='f'),'[]'::jsonb)
))::text,'UTF8')),'hex') IS DISTINCT FROM '1b56153313fd6b8471658ac791834f634eb64d67bdd90bf6163a0d760b387249' THEN RAISE EXCEPTION 'ACCOUNT_EXACT_METADATA_MISMATCH'; END IF; END $exact$;
COMMIT;
