-- HELD: existing20-to29 durable jobs only. No embed tuple or commercial policy change.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_FACTORY_NINE_AUTOMATION_SUCCESSOR'; END $hold$;
SET LOCAL lock_timeout='3s'; SET LOCAL statement_timeout='30s';
DO $role$ BEGIN IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed postgres operator and READ COMMITTED required'; END IF; END $role$;
LOCK TABLE public.technology_five_embed_grants,public.technology_five_embed_usage,public.technology_five_jobs IN SHARE ROW EXCLUSIVE MODE;
DO $pre$ BEGIN IF (encode(sha256(convert_to((SELECT jsonb_build_object(
'functions',(SELECT jsonb_agg(jsonb_build_object('signature',p.oid::regprocedure::text,'definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',p.proacl::text,'securityDefiner',p.prosecdef,'config',p.proconfig,'volatile',p.provolatile,'strict',p.proisstrict,'leakproof',p.proleakproof,'parallel',p.proparallel) ORDER BY p.proname) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND (p.proname LIKE '%technology_five%' OR p.proname='consume_native_business_api_quota_v1')),
'tables',(SELECT jsonb_agg(jsonb_build_object('name',c.relname,'owner',pg_get_userbyid(c.relowner),'acl',c.relacl::text,'rls',c.relrowsecurity,'forceRls',c.relforcerowsecurity,'options',c.reloptions,'replicaIdentity',c.relreplident,
'columns',(SELECT jsonb_agg(jsonb_build_array(a.attname,format_type(a.atttypid,a.atttypmod),a.attnotnull,pg_get_expr(d.adbin,d.adrelid),a.attacl::text,a.attidentity,a.attgenerated,a.attcollation) ORDER BY a.attnum) FROM pg_attribute a LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum WHERE a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped),
'constraints',(SELECT jsonb_agg(jsonb_build_array(k.conname,pg_get_constraintdef(k.oid),k.convalidated,k.condeferrable,k.condeferred) ORDER BY k.conname) FROM pg_constraint k WHERE k.conrelid=c.oid),
'indexes',(SELECT jsonb_agg(jsonb_build_object('name',ic.relname,'owner',pg_get_userbyid(ic.relowner),'acl',ic.relacl::text,'definition',pg_get_indexdef(i.indexrelid),'valid',i.indisvalid,'ready',i.indisready,'live',i.indislive,'unique',i.indisunique,'primary',i.indisprimary,'replicaIdentity',i.indisreplident) ORDER BY ic.relname) FROM pg_index i JOIN pg_class ic ON ic.oid=i.indexrelid WHERE i.indrelid=c.oid),
'policies',(SELECT jsonb_agg(to_jsonb(pol) ORDER BY policyname) FROM pg_policies pol WHERE schemaname='public' AND tablename=c.relname),
'triggers',(SELECT jsonb_agg(jsonb_build_array(pg_get_triggerdef(t.oid),t.tgenabled,t.tgdeferrable,t.tginitdeferred) ORDER BY t.tgname) FROM pg_trigger t WHERE t.tgrelid=c.oid AND NOT t.tgisinternal)) ORDER BY c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' AND c.relname LIKE 'technology_five_%')))::text,'UTF8')),'hex')) IS DISTINCT FROM '1a371a13355af3b186659076489269a887749f8d45c65e27610fd556628b8d85' THEN RAISE EXCEPTION 'Exact native schema preimage differs'; END IF; END $pre$;
DO $rows$ BEGIN IF EXISTS (SELECT 1 FROM public.technology_five_embed_grants WHERE catalog_id IN (368,376)) OR EXISTS (SELECT 1 FROM public.technology_five_embed_usage WHERE catalog_id IN (368,376)) OR EXISTS (SELECT 1 FROM public.technology_five_jobs WHERE catalog_id IN (368,376)) THEN RAISE EXCEPTION 'New-two durable rows prevent exact reverse; no audit deletion authorized'; END IF; END $rows$;
ALTER TABLE public.technology_five_jobs DROP CONSTRAINT technology_five_jobs_exact_native_tuple_check;
ALTER TABLE public.technology_five_jobs ADD CONSTRAINT technology_five_jobs_exact_native_tuple_check CHECK ((catalog_id,engine_id,technical_version) IN ((370,'technology.bandwidth',1),(371,'technology.download-time',1),(372,'technology.upload-time',1),(373,'technology.data-transfer',1),(386,'technology.base64-size',1),(374,'technology.storage-conversion',1),(377,'technology.aspect-ratio',1),(378,'technology.resolution',1),(379,'technology.dpi',1),(382,'technology.power-supply',1),(383,'technology.website-bandwidth',2),(384,'technology.cloud-storage-cost',1),(385,'technology.cloud-data-transfer-cost',1),(369,'technology.cidr',1),(375,'technology.raid-capacity',1),(380,'technology.battery-runtime',1),(381,'technology.ups-runtime',1),(387,'technology.password-entropy',1),(368,'technology.ip-subnet',1),(376,'technology.screen-ppi',1),(218,'launch-square-calculator',1),(219,'launch-cube-calculator',1),(220,'launch-square-root-calculator',1),(423,'conversion.length',1),(430,'conversion.energy',1),(431,'conversion.power',1),(432,'conversion.time',1),(438,'conversion.force',1),(440,'conversion.frequency',1)));
CREATE OR REPLACE FUNCTION public.technology_five_require_publication_v1(p_catalog integer, p_version integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE engine text;slug text;
BEGIN
 SELECT t.engine,t.slug INTO engine,slug FROM (VALUES(370,'technology.bandwidth','bandwidth-calculator',1),(371,'technology.download-time','download-time-calculator',1),(372,'technology.upload-time','upload-time-calculator',1),(373,'technology.data-transfer','data-transfer-calculator',1),(386,'technology.base64-size','base64-size-calculator',1),(374,'technology.storage-conversion','storage-conversion-calculator',1),(377,'technology.aspect-ratio','aspect-ratio-calculator',1),(378,'technology.resolution','resolution-calculator',1),(379,'technology.dpi','dpi-calculator',1),(382,'technology.power-supply','power-supply-calculator',1),(383,'technology.website-bandwidth','website-bandwidth-calculator',2),(384,'technology.cloud-storage-cost','cloud-storage-cost-calculator',1),(385,'technology.cloud-data-transfer-cost','cloud-data-transfer-cost-calculator',1),(369,'technology.cidr','cidr-calculator',1),(375,'technology.raid-capacity','raid-capacity-calculator',1),(380,'technology.battery-runtime','battery-runtime-calculator',1),(381,'technology.ups-runtime','ups-runtime-calculator',1),(387,'technology.password-entropy','password-entropy-calculator',1),(368,'technology.ip-subnet','ip-subnet-calculator',1),(376,'technology.screen-ppi','screen-ppi-calculator',1),(218,'launch-square-calculator','square-calculator',1),(219,'launch-cube-calculator','cube-calculator',1),(220,'launch-square-root-calculator','square-root-calculator',1),(423,'conversion.length','length-converter',1),(430,'conversion.energy','energy-converter',1),(431,'conversion.power','power-converter',1),(432,'conversion.time','time-converter',1),(438,'conversion.force','force-converter',1),(440,'conversion.frequency','frequency-converter',1))t(catalog,engine,slug,version) WHERE t.catalog=p_catalog AND t.version=p_version;
 IF NOT FOUND OR NOT public.technology_five_publication_snapshot_v1(engine,slug,p_version) THEN RAISE EXCEPTION 'Exact publication unavailable' USING ERRCODE='PT404';END IF;
END $function$;
CREATE OR REPLACE FUNCTION public.submit_technology_five_job_v1(p_api_key_id uuid, p_key_hash text, p_organization_id uuid, p_request_id uuid, p_catalog_id integer, p_version integer, p_input_rows jsonb, p_output_rows jsonb, p_endpoint_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE issuer uuid;prior public.technology_five_jobs%ROWTYPE;j public.technology_five_jobs%ROWTYPE;payload jsonb;engine text;endpoint public.business_webhook_endpoints%ROWTYPE;event jsonb;duplicate boolean:=false;
BEGIN
 IF current_setting('role',true) IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Trusted service caller required' USING ERRCODE='PT403';END IF;
 IF current_setting('transaction_isolation')<>'read committed' OR p_request_id IS NULL OR jsonb_typeof(p_input_rows) IS DISTINCT FROM 'array' OR jsonb_array_length(p_input_rows) NOT BETWEEN 1 AND 100 OR EXISTS(SELECT FROM jsonb_array_elements(p_input_rows)r WHERE jsonb_typeof(r)<>'object') THEN RAISE EXCEPTION 'Invalid bounded batch';END IF;
 issuer:=public.technology_five_key_authority_v1(p_api_key_id,p_key_hash,p_organization_id);PERFORM public.technology_five_require_publication_v1(p_catalog_id,p_version);
 payload:=jsonb_build_object('catalogId',p_catalog_id,'version',p_version,'rows',p_input_rows,'webhookEndpointId',p_endpoint_id);
 SELECT * INTO prior FROM public.technology_five_jobs WHERE api_key_id=p_api_key_id AND request_id=p_request_id;
 IF FOUND THEN
  IF prior.payload IS DISTINCT FROM payload OR prior.organization_id IS DISTINCT FROM p_organization_id OR prior.job_snapshot IS DISTINCT FROM public.technology_five_job_snapshot_v1(prior) THEN RAISE EXCEPTION 'Request identity conflicts with immutable batch' USING ERRCODE='PT409';END IF;j:=prior;duplicate:=true;
 ELSE
  IF p_output_rows IS NULL THEN RETURN jsonb_build_object('status','missing');END IF;
  IF jsonb_typeof(p_output_rows) IS DISTINCT FROM 'array' OR jsonb_array_length(p_output_rows)<>jsonb_array_length(p_input_rows) OR EXISTS(SELECT FROM jsonb_array_elements(p_output_rows) WITH ORDINALITY r(row,n) WHERE jsonb_typeof(row)<>'object' OR row->'index' IS DISTINCT FROM to_jsonb(n-1) OR jsonb_typeof(row->'ok') IS DISTINCT FROM 'boolean' OR (row->'ok'='true'::jsonb AND (jsonb_typeof(row->'result') IS DISTINCT FROM 'object' OR row->'result'->'catalogId' IS DISTINCT FROM to_jsonb(p_catalog_id) OR row->'result'->'version' IS DISTINCT FROM to_jsonb(p_version))) OR (row->'ok'='false'::jsonb AND jsonb_typeof(row->'error') IS DISTINCT FROM 'string')) THEN RAISE EXCEPTION 'Invalid deterministic result rows';END IF;
  SELECT t.engine INTO engine FROM(VALUES(370,'technology.bandwidth'),(371,'technology.download-time'),(372,'technology.upload-time'),(373,'technology.data-transfer'),(386,'technology.base64-size'),(374,'technology.storage-conversion'),(377,'technology.aspect-ratio'),(378,'technology.resolution'),(379,'technology.dpi'),(382,'technology.power-supply'),(383,'technology.website-bandwidth'),(384,'technology.cloud-storage-cost'),(385,'technology.cloud-data-transfer-cost'),(369,'technology.cidr'),(375,'technology.raid-capacity'),(380,'technology.battery-runtime'),(381,'technology.ups-runtime'),(387,'technology.password-entropy'),(368,'technology.ip-subnet'),(376,'technology.screen-ppi'),(218,'launch-square-calculator'),(219,'launch-cube-calculator'),(220,'launch-square-root-calculator'),(423,'conversion.length'),(430,'conversion.energy'),(431,'conversion.power'),(432,'conversion.time'),(438,'conversion.force'),(440,'conversion.frequency'))t(id,engine) WHERE t.id=p_catalog_id;
  IF EXISTS(SELECT FROM jsonb_array_elements(p_output_rows)r WHERE r->'ok'='true'::jsonb AND r->'result'->>'engineId' IS DISTINCT FROM engine) THEN RAISE EXCEPTION 'Exact engine differs';END IF;
  IF p_endpoint_id IS NOT NULL THEN SELECT * INTO endpoint FROM public.business_webhook_endpoints WHERE id=p_endpoint_id AND organization_id=p_organization_id AND status='active' AND jsonb_typeof(event_types)='array' AND event_types ? 'calculation.completed' FOR SHARE;IF NOT FOUND THEN RAISE EXCEPTION 'Webhook endpoint unavailable' USING ERRCODE='PT403';END IF;END IF;
 END IF;
 -- Existing custom batch policy: one request unit per accepted POST, including
 -- duplicate POST; missing probe and GET recovery have no debit.
 IF NOT public.consume_native_business_api_quota_v1(p_api_key_id) THEN RAISE EXCEPTION 'API quota exceeded' USING ERRCODE='PT429';END IF;
 IF NOT duplicate THEN
  j.id:=gen_random_uuid();j.api_key_id:=p_api_key_id;j.organization_id:=p_organization_id;j.issuer_id:=issuer;j.request_id:=p_request_id;j.catalog_id:=p_catalog_id;j.engine_id:=engine;j.technical_version:=p_version;j.payload:=payload;j.input_rows:=p_input_rows;j.output_rows:=p_output_rows;j.created_at:=now();j.job_snapshot:=public.technology_five_job_snapshot_v1(j);
  INSERT INTO public.technology_five_jobs SELECT j.*;
  IF p_endpoint_id IS NOT NULL THEN
   event:=jsonb_build_object('id',j.id,'type','calculation.completed','created_at',to_char(j.created_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),'data',j.job_snapshot);
   INSERT INTO public.technology_five_webhook_outbox(event_id,organization_id,api_key_id,issuer_id,endpoint_id,endpoint_snapshot,payload,payload_text) VALUES(j.id,p_organization_id,p_api_key_id,issuer,p_endpoint_id,jsonb_build_object('url',endpoint.endpoint_url,'secret_ciphertext',endpoint.secret_ciphertext,'created_by',endpoint.created_by),event,event::text);
  END IF;
 END IF;
 RETURN jsonb_build_object('status','completed','request_id',p_request_id,'duplicate',duplicate,'job',j.job_snapshot);
END $function$;
CREATE OR REPLACE FUNCTION public.check_technology_five_dispatch_v1(p_delivery_id uuid,p_lease_token uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE d public.technology_five_webhook_outbox%ROWTYPE;k public.business_api_keys%ROWTYPE;e public.business_webhook_endpoints%ROWTYPE;j public.technology_five_jobs%ROWTYPE;
BEGIN
 IF current_setting('role',true) IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Trusted service caller required' USING ERRCODE='PT403';END IF;
 SELECT * INTO d FROM public.technology_five_webhook_outbox WHERE id=p_delivery_id FOR UPDATE;
 IF NOT FOUND OR d.status<>'leased' OR d.lease_token IS DISTINCT FROM p_lease_token OR d.lease_until<=clock_timestamp() THEN RETURN false;END IF;
 SELECT * INTO k FROM public.business_api_keys WHERE id=d.api_key_id;
 PERFORM public.technology_five_key_authority_v1(k.id,k.key_hash,d.organization_id);SELECT * INTO j FROM public.technology_five_jobs WHERE id=d.event_id;PERFORM public.technology_five_require_publication_v1(j.catalog_id,j.technical_version);
 SELECT * INTO e FROM public.business_webhook_endpoints WHERE id=d.endpoint_id AND organization_id=d.organization_id AND status='active' AND jsonb_typeof(event_types)='array' AND event_types ? 'calculation.completed' FOR SHARE;
 RETURN FOUND AND d.payload_text::jsonb=d.payload AND j.payload->'rows'=j.input_rows AND j.payload->'catalogId'=to_jsonb(j.catalog_id) AND j.payload->'version'=to_jsonb(j.technical_version) AND d.issuer_id=k.created_by AND d.payload=jsonb_build_object('id',j.id,'type','calculation.completed','created_at',to_char(j.created_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),'data',j.job_snapshot) AND j.job_snapshot=public.technology_five_job_snapshot_v1(j) AND d.endpoint_snapshot=jsonb_build_object('url',e.endpoint_url,'secret_ciphertext',e.secret_ciphertext,'created_by',e.created_by);
EXCEPTION WHEN SQLSTATE 'PT403' OR SQLSTATE 'PT404' THEN RETURN false;
END $$;
COMMIT;
