-- HELD additive15-to24 sharing model only. No production activation authority.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_FACTORY_NINE_SHARING_SUCCESSOR';END $hold$;
SET LOCAL lock_timeout='3s';SET LOCAL statement_timeout='30s';
DO $role$ BEGIN IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed postgres operator and READ COMMITTED required'; END IF;END $role$;
LOCK TABLE public.technology_next_shared_snapshots IN SHARE ROW EXCLUSIVE MODE;
DO $pre$ BEGIN IF (SELECT encode(sha256(convert_to(metadata::text,'UTF8')),'hex') FROM (SELECT jsonb_build_object(
 'relations',(SELECT jsonb_agg(jsonb_build_object(
  'schema',n.nspname,'name',c.relname,'kind',c.relkind,'owner',pg_get_userbyid(c.relowner),
  'acl',c.relacl::text,'options',c.reloptions,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,
  'columns',(SELECT jsonb_agg(jsonb_build_object('number',a.attnum,'name',a.attname,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'identity',a.attidentity,'generated',a.attgenerated,'acl',a.attacl::text,'default',pg_get_expr(d.adbin,d.adrelid),'collation',co.collname) ORDER BY a.attnum) FROM pg_attribute a LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum LEFT JOIN pg_collation co ON co.oid=a.attcollation WHERE a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped),
  'constraints',(SELECT jsonb_agg(jsonb_build_object('name',k.conname,'type',k.contype,'definition',pg_get_constraintdef(k.oid),'validated',k.convalidated,'deferrable',k.condeferrable,'deferred',k.condeferred) ORDER BY k.conname) FROM pg_constraint k WHERE k.conrelid=c.oid),
  'indexes',(SELECT jsonb_agg(jsonb_build_object('name',ic.relname,'owner',pg_get_userbyid(ic.relowner),'acl',ic.relacl::text,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid,'ready',i.indisready,'live',i.indislive,'unique',i.indisunique,'primary',i.indisprimary,'replicaIdentity',i.indisreplident) ORDER BY ic.relname) FROM pg_index i JOIN pg_class ic ON ic.oid=i.indexrelid WHERE i.indrelid=c.oid),
  'policies',(SELECT jsonb_agg(jsonb_build_object('name',p.polname,'permissive',p.polpermissive,'command',p.polcmd,'roles',(SELECT jsonb_agg(CASE WHEN role_oid=0 THEN 'PUBLIC' ELSE pg_get_userbyid(role_oid) END ORDER BY role_oid::regrole::text) FROM unnest(p.polroles) AS role_oid),'using',pg_get_expr(p.polqual,p.polrelid),'check',pg_get_expr(p.polwithcheck,p.polrelid)) ORDER BY p.polname) FROM pg_policy p WHERE p.polrelid=c.oid),
  'triggers',(SELECT jsonb_agg(jsonb_build_object('name',t.tgname,'enabled',t.tgenabled,'definition',pg_get_triggerdef(t.oid),'function',format('%I.%I(%s)',tn.nspname,tp.proname,pg_get_function_identity_arguments(tp.oid))) ORDER BY t.tgname) FROM pg_trigger t JOIN pg_proc tp ON tp.oid=t.tgfoid JOIN pg_namespace tn ON tn.oid=tp.pronamespace WHERE t.tgrelid=c.oid AND NOT t.tgisinternal)
 ) ORDER BY n.nspname,c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname LIKE 'technology_next_shared%'),
 'functions',(SELECT jsonb_agg(jsonb_build_object('schema',n.nspname,'name',p.proname,'arguments',pg_get_function_identity_arguments(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',p.proacl::text,'securityDefiner',p.prosecdef,'config',p.proconfig,'volatile',p.provolatile,'strict',p.proisstrict,'leakproof',p.proleakproof,'parallel',p.proparallel,'definition',pg_get_functiondef(p.oid)) ORDER BY n.nspname,p.proname,pg_get_function_identity_arguments(p.oid)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE (n.nspname='public' AND (p.proname LIKE 'technology_next_shar%' OR p.proname LIKE 'share_technology_next%' OR p.proname LIKE 'factory_nine_shar%' OR p.proname LIKE 'share_factory_nine%')) OR (n.nspname='auth' AND p.proname='uid'))
) AS metadata) scoped) IS DISTINCT FROM '7183b5b50dcd9bc2c4d0d85f8cb048424700cc993351b0d7cc5861240154d647' THEN RAISE EXCEPTION 'Exact sharing scoped metadata preimage differs';END IF;
IF encode(sha256(convert_to(pg_get_functiondef('public.technology_next_sharing_capability(uuid)'::regprocedure),'UTF8')),'hex') IS DISTINCT FROM '7f60890dd0da98146aab9ba623847fa8968c11fc33eed4bec387760269916f2a' THEN RAISE EXCEPTION 'Exact sharing predecessor definition differs';END IF;
IF encode(sha256(convert_to(pg_get_functiondef('public.share_technology_next_snapshot(uuid,jsonb)'::regprocedure),'UTF8')),'hex') IS DISTINCT FROM 'aa0f50d76a63928b9e05bf99b574afaf9b50bf6bf487afecb765359d6f966a81' THEN RAISE EXCEPTION 'Exact sharing predecessor definition differs';END IF;
IF to_regprocedure('public.factory_nine_sharing_capability(uuid)') IS NOT NULL OR to_regprocedure('public.share_factory_nine_snapshot(uuid,jsonb)') IS NOT NULL THEN RAISE EXCEPTION 'Factory sharing functions already exist';END IF;
END $pre$;
ALTER TABLE public.technology_next_shared_snapshots DROP CONSTRAINT technology_next_shared_snapshots_calculator_slug_check;
ALTER TABLE public.technology_next_shared_snapshots ADD CONSTRAINT technology_next_shared_snapshots_calculator_slug_check CHECK(calculator_slug IN('storage-conversion-calculator','aspect-ratio-calculator','resolution-calculator','dpi-calculator','power-supply-calculator','website-bandwidth-calculator','cloud-storage-cost-calculator','cloud-data-transfer-cost-calculator','cidr-calculator','raid-capacity-calculator','battery-runtime-calculator','ups-runtime-calculator','password-entropy-calculator','ip-subnet-calculator','screen-ppi-calculator','square-calculator','cube-calculator','square-root-calculator','length-converter','energy-converter','power-converter','time-converter','force-converter','frequency-converter'));
CREATE FUNCTION public.factory_nine_sharing_capability(target_org uuid) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'pg_catalog','public' AS $function$
 SELECT CASE WHEN public.technology_next_sharing_capability(target_org)='technology-next-sharing-private-3' THEN 'factory-nine-sharing-private-1' ELSE NULL END;
$function$;
REVOKE ALL ON FUNCTION public.factory_nine_sharing_capability(uuid) FROM PUBLIC,anon,service_role;
GRANT EXECUTE ON FUNCTION public.factory_nine_sharing_capability(uuid) TO authenticated;
CREATE FUNCTION public.share_factory_nine_snapshot(actor_id uuid, request_payload jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE org uuid; project uuid; client uuid; req uuid; item jsonb; existing public.technology_next_shared_snapshots%rowtype; result uuid; role_name text;
BEGIN
 IF current_user<>'service_role' THEN RAISE EXCEPTION 'Server verified sharing required'; END IF;
 IF jsonb_typeof(request_payload) IS DISTINCT FROM 'object' OR octet_length(request_payload::text)>65536
 OR (SELECT count(*) FROM jsonb_object_keys(request_payload))<>6
 OR NOT request_payload ?& ARRAY['organizationId','projectId','clientWorkspaceId','requestId','title','snapshot'] THEN RAISE EXCEPTION 'Invalid sharing request'; END IF;
 IF jsonb_typeof(request_payload->'title') IS DISTINCT FROM 'string'
 OR jsonb_typeof(request_payload->'clientWorkspaceId') NOT IN('string','null') THEN RAISE EXCEPTION 'Invalid sharing request'; END IF;
 org:=(request_payload->>'organizationId')::uuid;project:=(request_payload->>'projectId')::uuid;
 client:=(request_payload->>'clientWorkspaceId')::uuid;req:=(request_payload->>'requestId')::uuid;item:=request_payload->'snapshot';
 IF actor_id IS NULL OR org IS NULL OR project IS NULL OR req IS NULL THEN RAISE EXCEPTION 'Sharing identity required'; END IF;
 PERFORM 1 FROM public.organizations WHERE id=org FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Organization unavailable'; END IF;
 SELECT m.role INTO role_name FROM public.organization_members m WHERE m.organization_id=org AND m.user_id=actor_id FOR SHARE;
 IF role_name IS NULL OR role_name NOT IN('owner','admin','manager','member') THEN RAISE EXCEPTION 'Sharing role required'; END IF;
 PERFORM 1 FROM public.profiles p WHERE p.id=actor_id AND p.plan='business' FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Business plan required'; END IF;
 PERFORM 1 FROM public.profiles p JOIN public.organizations o ON o.owner_user_id=p.id WHERE o.id=org AND p.plan='business' FOR SHARE OF p;
 IF NOT FOUND THEN RAISE EXCEPTION 'Business organization required'; END IF;
 PERFORM 1 FROM public.business_projects WHERE id=project AND organization_id=org AND status='active' FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Project unavailable'; END IF;
 IF client IS NOT NULL THEN
  PERFORM 1 FROM public.client_workspaces WHERE id=client AND organization_id=org AND (project_id IS NULL OR project_id=project) FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Client workspace unavailable'; END IF;
 END IF;
 IF jsonb_typeof(item) IS DISTINCT FROM 'object' OR (SELECT count(*) FROM jsonb_object_keys(item))<>4
 OR NOT item ?& ARRAY['calculatorSlug','calculatorVersion','input','output'] OR jsonb_typeof(item->'calculatorVersion') IS DISTINCT FROM 'number'
 OR item->'calculatorVersion' IS DISTINCT FROM '1'::jsonb
 OR jsonb_typeof(item->'calculatorSlug') IS DISTINCT FROM 'string'
 OR item->>'calculatorSlug' NOT IN('square-calculator','cube-calculator','square-root-calculator','length-converter','energy-converter','power-converter','time-converter','force-converter','frequency-converter')
 OR jsonb_typeof(item->'input') IS DISTINCT FROM 'object' OR jsonb_typeof(item->'output') IS DISTINCT FROM 'object'
 OR (SELECT count(*) FROM jsonb_object_keys(item->'output'))<>1 OR jsonb_typeof(item->'output'->'result') IS DISTINCT FROM 'number'
 OR char_length(request_payload->>'title') NOT BETWEEN 1 AND 240 THEN RAISE EXCEPTION 'Unsupported shared snapshot'; END IF;
 SELECT * INTO existing FROM public.technology_next_shared_snapshots s
 WHERE s.organization_id=org AND s.created_by=actor_id AND s.request_id=req;
 IF FOUND THEN
  IF existing.request_payload IS DISTINCT FROM request_payload THEN RAISE EXCEPTION 'Sharing request conflicts with original snapshot'; END IF;
  RETURN existing.id;
 END IF;
 INSERT INTO public.technology_next_shared_snapshots(organization_id,project_id,client_workspace_id,created_by,request_id,title,calculator_slug,calculator_version,input_data,output_data,request_payload)
 VALUES(org,project,client,actor_id,req,request_payload->>'title',item->>'calculatorSlug',(item->>'calculatorVersion')::integer,item->'input',item->'output',request_payload) RETURNING id INTO result;
 INSERT INTO public.organization_audit_log(organization_id,actor_user_id,action,entity_type,entity_id,metadata)
 VALUES(org,actor_id,'factory-nine.snapshot.shared','factory-nine-shared-snapshot',result::text,jsonb_build_object('calculatorSlug',item->>'calculatorSlug','calculatorVersion',(item->>'calculatorVersion')::integer,'projectId',project,'clientWorkspaceId',client));
 RETURN result;
END $function$;
REVOKE ALL ON FUNCTION public.share_factory_nine_snapshot(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.share_factory_nine_snapshot(uuid,jsonb) TO service_role;
COMMIT;
