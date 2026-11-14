-- HELD ADDITIVE ENGINEERING PROPOSAL. No activation or publication authority.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_TECHNOLOGY_FIVE_JOBS_WEBHOOKS'; END $hold$;
SET LOCAL lock_timeout='3s'; SET LOCAL statement_timeout='30s';
DO $pre$ BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed operator and READ COMMITTED required'; END IF;
 IF to_regprocedure('public.consume_native_business_api_quota_v1(uuid)') IS NULL OR encode(sha256(convert_to(pg_get_functiondef('public.consume_native_business_api_quota_v1(uuid)'::regprocedure),'UTF8')),'hex')<>'4cc6f6a10adafd43e3e064301d4a0631d80bed09bec54f80b1a94c7b556fe9b9' THEN RAISE EXCEPTION 'Exact native quota readiness predecessor required'; END IF;
 IF to_regclass('public.technology_five_jobs') IS NOT NULL OR to_regclass('public.technology_five_webhook_outbox') IS NOT NULL OR to_regclass('public.technology_five_webhook_attempts') IS NOT NULL THEN RAISE EXCEPTION 'Unexpected successor objects'; END IF;
END $pre$;
CREATE TABLE public.technology_five_jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), api_key_id uuid NOT NULL REFERENCES public.business_api_keys(id), organization_id uuid NOT NULL REFERENCES public.organizations(id), issuer_id uuid NOT NULL REFERENCES public.profiles(id), request_id uuid NOT NULL,
 catalog_id integer NOT NULL, engine_id text NOT NULL, technical_version integer NOT NULL CHECK(technical_version=1),
 CHECK((catalog_id,engine_id) IN ((370,'technology.bandwidth'),(371,'technology.download-time'),(372,'technology.upload-time'),(373,'technology.data-transfer'),(386,'technology.base64-size'))),
 payload jsonb NOT NULL, input_rows jsonb NOT NULL CHECK(jsonb_typeof(input_rows)='array' AND jsonb_array_length(input_rows) BETWEEN 1 AND 100), output_rows jsonb NOT NULL, job_snapshot jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(api_key_id,request_id)
);
CREATE TABLE public.technology_five_webhook_outbox (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id uuid NOT NULL UNIQUE REFERENCES public.technology_five_jobs(id), organization_id uuid NOT NULL REFERENCES public.organizations(id), api_key_id uuid NOT NULL REFERENCES public.business_api_keys(id), issuer_id uuid NOT NULL REFERENCES public.profiles(id), endpoint_id uuid NOT NULL REFERENCES public.business_webhook_endpoints(id), endpoint_snapshot jsonb NOT NULL,
 payload jsonb NOT NULL, payload_text text NOT NULL CHECK(payload_text=payload::text),
 status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','leased','failed','delivered','dead_letter','cancelled')), attempt_count integer NOT NULL DEFAULT 0 CHECK(attempt_count BETWEEN 0 AND 8), next_attempt_at timestamptz NOT NULL DEFAULT now(), lease_token uuid, lease_until timestamptz, last_error text, last_http_status integer, delivered_at timestamptz,
 CHECK((status='leased')=(lease_token IS NOT NULL AND lease_until IS NOT NULL))
);
CREATE INDEX technology_five_webhook_due ON public.technology_five_webhook_outbox(status,next_attempt_at);
CREATE TABLE public.technology_five_webhook_attempts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), delivery_id uuid NOT NULL REFERENCES public.technology_five_webhook_outbox(id), attempt integer NOT NULL CHECK(attempt BETWEEN 1 AND 8), lease_token uuid NOT NULL UNIQUE, started_at timestamptz NOT NULL DEFAULT clock_timestamp(), finished_at timestamptz, outcome text NOT NULL DEFAULT 'leased' CHECK(outcome IN ('leased','expired','delivered','failed')), http_status integer, error text, UNIQUE(delivery_id,attempt)
);
ALTER TABLE public.technology_five_jobs ENABLE ROW LEVEL SECURITY; ALTER TABLE public.technology_five_webhook_outbox ENABLE ROW LEVEL SECURITY; ALTER TABLE public.technology_five_webhook_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.technology_five_jobs,public.technology_five_webhook_outbox,public.technology_five_webhook_attempts FROM PUBLIC,anon,authenticated,service_role;
-- All job/event/audit writes are RPC-only; service_role has no direct table grants.

CREATE FUNCTION public.technology_five_evidence_identity_v1() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog AS $$
DECLARE allowed text[];
BEGIN
 IF TG_OP='DELETE' OR TG_TABLE_NAME='technology_five_jobs' THEN RAISE EXCEPTION 'Immutable native job evidence';END IF;
 IF TG_TABLE_NAME='technology_five_webhook_outbox' THEN allowed:=ARRAY['status','attempt_count','next_attempt_at','lease_token','lease_until','last_error','last_http_status','delivered_at'];
 ELSE allowed:=ARRAY['finished_at','outcome','http_status','error'];IF OLD.outcome<>'leased' AND NEW IS DISTINCT FROM OLD THEN RAISE EXCEPTION 'Immutable completed native attempt';END IF;END IF;
 IF (to_jsonb(NEW)-allowed) IS DISTINCT FROM (to_jsonb(OLD)-allowed) THEN RAISE EXCEPTION 'Immutable native evidence identity';END IF;RETURN NEW;
END $$;
CREATE TRIGGER technology_five_job_immutable BEFORE UPDATE OR DELETE ON public.technology_five_jobs FOR EACH ROW EXECUTE FUNCTION public.technology_five_evidence_identity_v1();
CREATE TRIGGER technology_five_outbox_identity BEFORE UPDATE OR DELETE ON public.technology_five_webhook_outbox FOR EACH ROW EXECUTE FUNCTION public.technology_five_evidence_identity_v1();
CREATE TRIGGER technology_five_attempt_identity BEFORE UPDATE OR DELETE ON public.technology_five_webhook_attempts FOR EACH ROW EXECUTE FUNCTION public.technology_five_evidence_identity_v1();
REVOKE ALL ON FUNCTION public.technology_five_evidence_identity_v1() FROM PUBLIC,anon,authenticated,service_role;
-- Lower publication reader is separated for isolated synthetic-reader composition.
-- Production uses the actual governed catalog and row locks, never a client boolean.
CREATE FUNCTION public.technology_five_publication_snapshot_v1(p_engine text,p_slug text,p_version integer) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
BEGIN PERFORM id FROM public.calculator_catalog_admin WHERE calculator_key=p_engine AND slug=p_slug AND version=p_version AND lifecycle='published' FOR SHARE; RETURN FOUND; END $$;
CREATE FUNCTION public.technology_five_require_publication_v1(p_catalog integer,p_version integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE engine text;slug text;
BEGIN
 SELECT t.engine,t.slug INTO engine,slug FROM (VALUES(370,'technology.bandwidth','bandwidth-calculator'),(371,'technology.download-time','download-time-calculator'),(372,'technology.upload-time','upload-time-calculator'),(373,'technology.data-transfer','data-transfer-calculator'),(386,'technology.base64-size','base64-size-calculator'))t(catalog,engine,slug) WHERE t.catalog=p_catalog;
 IF NOT FOUND OR p_version IS DISTINCT FROM 1 OR NOT public.technology_five_publication_snapshot_v1(engine,slug,p_version) THEN RAISE EXCEPTION 'Exact publication unavailable' USING ERRCODE='PT404'; END IF;
END $$;
CREATE FUNCTION public.technology_five_key_authority_v1(p_key uuid,p_hash text,p_org uuid) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE k public.business_api_keys%ROWTYPE;owner_id uuid;member_role text;owner_plan text;issuer_plan text;
BEGIN
 SELECT * INTO k FROM public.business_api_keys WHERE id=p_key FOR UPDATE;
 IF NOT FOUND OR k.key_hash IS DISTINCT FROM p_hash OR k.organization_id IS DISTINCT FROM p_org OR k.status IS DISTINCT FROM 'active' OR jsonb_typeof(k.scopes) IS DISTINCT FROM 'array' OR NOT(k.scopes ? 'calculations:batch') THEN RAISE EXCEPTION 'Batch authority unavailable' USING ERRCODE='PT403'; END IF;
 SELECT owner_user_id INTO owner_id FROM public.organizations WHERE id=p_org FOR SHARE;IF NOT FOUND THEN RAISE EXCEPTION 'Organization unavailable' USING ERRCODE='PT403';END IF;
 SELECT role INTO member_role FROM public.organization_members WHERE organization_id=p_org AND user_id=k.created_by FOR SHARE;
 IF NOT FOUND OR member_role NOT IN ('owner','admin') OR (member_role='owner' AND owner_id<>k.created_by) THEN RAISE EXCEPTION 'Issuer role unavailable' USING ERRCODE='PT403';END IF;
 SELECT plan INTO issuer_plan FROM public.profiles WHERE id=k.created_by FOR SHARE; SELECT plan INTO owner_plan FROM public.profiles WHERE id=owner_id FOR SHARE;
 IF issuer_plan IS DISTINCT FROM 'business' OR owner_plan IS DISTINCT FROM 'business' THEN RAISE EXCEPTION 'Business authority unavailable' USING ERRCODE='PT403';END IF;RETURN k.created_by;
END $$;
CREATE FUNCTION public.technology_five_job_snapshot_v1(j public.technology_five_jobs) RETURNS jsonb LANGUAGE sql IMMUTABLE SECURITY DEFINER SET search_path=pg_catalog AS $$ SELECT jsonb_build_object('id',j.id,'catalog_id',j.catalog_id,'engine_id',j.engine_id,'technical_version',j.technical_version,'status','completed','input_rows',j.input_rows,'output_rows',j.output_rows) $$;
CREATE FUNCTION public.read_technology_five_job_v1(p_api_key_id uuid,p_key_hash text,p_organization_id uuid,p_request_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE j public.technology_five_jobs%ROWTYPE;
BEGIN
 IF current_setting('role',true) IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Trusted service caller required' USING ERRCODE='PT403';END IF;
 PERFORM public.technology_five_key_authority_v1(p_api_key_id,p_key_hash,p_organization_id);
 SELECT * INTO j FROM public.technology_five_jobs WHERE api_key_id=p_api_key_id AND request_id=p_request_id;
 IF NOT FOUND THEN RETURN jsonb_build_object('status','missing');END IF;
 PERFORM public.technology_five_require_publication_v1(j.catalog_id,j.technical_version);
 IF j.organization_id IS DISTINCT FROM p_organization_id OR j.job_snapshot IS DISTINCT FROM public.technology_five_job_snapshot_v1(j) OR j.payload->'rows' IS DISTINCT FROM j.input_rows OR j.payload->'catalogId' IS DISTINCT FROM to_jsonb(j.catalog_id) OR j.payload->'version' IS DISTINCT FROM to_jsonb(j.technical_version) THEN RAISE EXCEPTION 'Immutable batch evidence differs';END IF;
 RETURN jsonb_build_object('status','completed','request_id',p_request_id,'job',j.job_snapshot);
END $$;
CREATE FUNCTION public.submit_technology_five_job_v1(p_api_key_id uuid,p_key_hash text,p_organization_id uuid,p_request_id uuid,p_catalog_id integer,p_version integer,p_input_rows jsonb,p_output_rows jsonb,p_endpoint_id uuid DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
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
  SELECT t.engine INTO engine FROM(VALUES(370,'technology.bandwidth'),(371,'technology.download-time'),(372,'technology.upload-time'),(373,'technology.data-transfer'),(386,'technology.base64-size'))t(id,engine) WHERE t.id=p_catalog_id;
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
END $$;
-- Check current authority, publication and unchanged endpoint under the exact lease.
CREATE FUNCTION public.check_technology_five_dispatch_v1(p_delivery_id uuid,p_lease_token uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE d public.technology_five_webhook_outbox%ROWTYPE;k public.business_api_keys%ROWTYPE;e public.business_webhook_endpoints%ROWTYPE;j public.technology_five_jobs%ROWTYPE;
BEGIN
 IF current_setting('role',true) IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Trusted service caller required' USING ERRCODE='PT403';END IF;
 SELECT * INTO d FROM public.technology_five_webhook_outbox WHERE id=p_delivery_id FOR UPDATE;
 IF NOT FOUND OR d.status<>'leased' OR d.lease_token IS DISTINCT FROM p_lease_token OR d.lease_until<=clock_timestamp() THEN RETURN false;END IF;
 SELECT * INTO k FROM public.business_api_keys WHERE id=d.api_key_id;
 PERFORM public.technology_five_key_authority_v1(k.id,k.key_hash,d.organization_id);SELECT * INTO j FROM public.technology_five_jobs WHERE id=d.event_id;PERFORM public.technology_five_require_publication_v1(j.catalog_id,j.technical_version);
 SELECT * INTO e FROM public.business_webhook_endpoints WHERE id=d.endpoint_id AND organization_id=d.organization_id AND status='active' AND jsonb_typeof(event_types)='array' AND event_types ? 'calculation.completed' FOR SHARE;
 RETURN FOUND AND d.issuer_id=k.created_by AND d.payload=jsonb_build_object('id',j.id,'type','calculation.completed','created_at',to_char(j.created_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),'data',j.job_snapshot) AND j.job_snapshot=public.technology_five_job_snapshot_v1(j) AND d.endpoint_snapshot=jsonb_build_object('url',e.endpoint_url,'secret_ciphertext',e.secret_ciphertext,'created_by',e.created_by);
EXCEPTION WHEN SQLSTATE 'PT403' OR SQLSTATE 'PT404' THEN RETURN false;
END $$;
CREATE FUNCTION public.claim_technology_five_webhook_v1(p_lease_token uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE d public.technology_five_webhook_outbox%ROWTYPE;j public.technology_five_jobs%ROWTYPE;
BEGIN
 IF current_setting('role',true) IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Trusted service caller required' USING ERRCODE='PT403';END IF;
 IF p_lease_token IS NULL THEN RAISE EXCEPTION 'Lease identity required';END IF;
 SELECT * INTO d FROM public.technology_five_webhook_outbox WHERE ((status IN('queued','failed') AND next_attempt_at<=clock_timestamp()) OR (status='leased' AND lease_until<=clock_timestamp())) ORDER BY next_attempt_at,id LIMIT 1 FOR UPDATE SKIP LOCKED;
 IF NOT FOUND THEN RETURN jsonb_build_object('status','missing');END IF;
 IF d.attempt_count>=8 THEN UPDATE public.technology_five_webhook_outbox SET status='dead_letter',lease_token=NULL,lease_until=NULL,last_error='Retry bound reached' WHERE id=d.id;UPDATE public.technology_five_webhook_attempts SET outcome='expired',finished_at=clock_timestamp() WHERE delivery_id=d.id AND outcome='leased';RETURN jsonb_build_object('status','dead_letter');END IF;
 UPDATE public.technology_five_webhook_attempts SET outcome='expired',finished_at=clock_timestamp() WHERE delivery_id=d.id AND outcome='leased';
 UPDATE public.technology_five_webhook_outbox SET status='leased',attempt_count=attempt_count+1,lease_token=p_lease_token,lease_until=clock_timestamp()+interval '1 minute' WHERE id=d.id RETURNING * INTO d;
 IF NOT public.check_technology_five_dispatch_v1(d.id,p_lease_token) THEN UPDATE public.technology_five_webhook_outbox SET status='cancelled',lease_token=NULL,lease_until=NULL,last_error='Current authority, publication or endpoint unavailable' WHERE id=d.id;RETURN jsonb_build_object('status','cancelled');END IF;
 INSERT INTO public.technology_five_webhook_attempts(delivery_id,attempt,lease_token) VALUES(d.id,d.attempt_count,p_lease_token);
 SELECT * INTO j FROM public.technology_five_jobs WHERE id=d.event_id;
 RETURN jsonb_build_object('status','claimed','id',d.id,'eventId',d.event_id,'leaseToken',p_lease_token,'payloadText',d.payload_text,'endpointUrl',d.endpoint_snapshot->>'url','secretCiphertext',d.endpoint_snapshot->>'secret_ciphertext','organizationId',d.organization_id,'issuerId',d.issuer_id,'catalogId',j.catalog_id,'version',j.technical_version);
END $$;
CREATE FUNCTION public.finish_technology_five_webhook_v1(p_delivery_id uuid,p_lease_token uuid,p_delivered boolean,p_http_status integer,p_error text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE d public.technology_five_webhook_outbox%ROWTYPE;
BEGIN
 IF current_setting('role',true) IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Trusted service caller required' USING ERRCODE='PT403';END IF;
 IF p_delivered IS NULL OR (p_http_status IS NOT NULL AND p_http_status NOT BETWEEN 100 AND 599) OR (p_delivered AND (p_http_status IS NULL OR p_http_status NOT BETWEEN 200 AND 299)) THEN RAISE EXCEPTION 'Invalid dispatch result';END IF;
 SELECT * INTO d FROM public.technology_five_webhook_outbox WHERE id=p_delivery_id FOR UPDATE;
 IF NOT FOUND OR d.status<>'leased' OR d.lease_token IS DISTINCT FROM p_lease_token OR d.lease_until<=clock_timestamp() THEN RETURN false;END IF;
 UPDATE public.technology_five_webhook_attempts SET outcome=CASE WHEN p_delivered THEN 'delivered' ELSE 'failed' END,finished_at=clock_timestamp(),http_status=p_http_status,error=left(p_error,500) WHERE delivery_id=d.id AND lease_token=p_lease_token AND outcome='leased';IF NOT FOUND THEN RAISE EXCEPTION 'Durable attempt missing';END IF;
 UPDATE public.technology_five_webhook_outbox SET status=CASE WHEN p_delivered THEN 'delivered' WHEN attempt_count>=8 THEN 'dead_letter' ELSE 'failed' END,lease_token=NULL,lease_until=NULL,last_http_status=p_http_status,last_error=CASE WHEN p_delivered THEN NULL ELSE left(p_error,500) END,delivered_at=CASE WHEN p_delivered THEN clock_timestamp() ELSE NULL END,next_attempt_at=clock_timestamp()+make_interval(mins=>least(power(2,attempt_count-1)::integer,120)) WHERE id=d.id;
 RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.technology_five_publication_snapshot_v1(text,text,integer),public.technology_five_require_publication_v1(integer,integer),public.technology_five_key_authority_v1(uuid,text,uuid),public.technology_five_job_snapshot_v1(public.technology_five_jobs),public.read_technology_five_job_v1(uuid,text,uuid,uuid),public.submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid),public.check_technology_five_dispatch_v1(uuid,uuid),public.claim_technology_five_webhook_v1(uuid),public.finish_technology_five_webhook_v1(uuid,uuid,boolean,integer,text) FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION public.read_technology_five_job_v1(uuid,text,uuid,uuid),public.submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid),public.check_technology_five_dispatch_v1(uuid,uuid),public.claim_technology_five_webhook_v1(uuid),public.finish_technology_five_webhook_v1(uuid,uuid,boolean,integer,text) TO service_role;
COMMIT;
