-- HELD ADDITIVE EXACT-COHORT SUCCESSOR. No SQL activation, certification or publication authority.
-- Requires the unchanged original five candidate plus its corrective integrity successor.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_NEXT_COHORT_NATIVE_CONTRACT'; END $hold$;
SET LOCAL lock_timeout='3s';SET LOCAL statement_timeout='30s';
DO $pre$ DECLARE expected record; BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed operator and READ COMMITTED required';END IF;
 FOR expected IN SELECT * FROM(VALUES
  ('public.technology_five_embed_identity_v1()','6dfac5f2e4978fe8c51adfe16a4a2c5996e37e04027cf914a0b30f1ceffd4ff9'),
  ('public.consume_native_business_api_quota_v1(uuid)','4cc6f6a10adafd43e3e064301d4a0631d80bed09bec54f80b1a94c7b556fe9b9'),
  ('public.technology_five_evidence_identity_v1()','0a3a80e3b951cbeaa11c6d52f00e2dff329415ba55b4580833ae0c924000121e'),
  ('public.technology_five_publication_snapshot_v1(text,text,integer)','de15d8bfdc9361003e9a630a9c422fe5477fdda9ebc2cc68fd1c9c04dae459d0'),
  ('public.technology_five_require_publication_v1(integer,integer)','80b2e085d6b4e68fff9705eff10bea1c730fe4101c5d8894eddc87df5e01003a'),
  ('public.technology_five_key_authority_v1(uuid,text,uuid)','d8b14f92eb95729b60e23302445828325db0528d34b4e4c41ce55d3acd5bd158'),
  ('public.technology_five_job_snapshot_v1(public.technology_five_jobs)','8224cf87336fe78d8bf2538145bda1f0e59d79c1ff1a58b742d982355235a28a'),
  ('public.read_technology_five_job_v1(uuid,text,uuid,uuid)','45ff585b3c2eae04be88d98901efc56fb112cff3772a3116a7199d3f8872cffb'),
  ('public.submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid)','a9d4c24c493897155d514c371356556557c5948925c251bb631e8c1f022aba36'),
  ('public.check_technology_five_dispatch_v1(uuid,uuid)','6bcf5a65c5f5936633cc6675c6e9137c181c2a7bf27ad133155fe2452a63cedf'),
  ('public.claim_technology_five_webhook_v1(uuid)','d0dc9e30ba1b9c6a9025fb636f317d0a8a6164e27765af014c72dad2437af127'),
  ('public.finish_technology_five_webhook_v1(uuid,uuid,boolean,integer,text)','2c3c808c1a8ede50062097c779219824e9d02b76c27046d7abf75efd2f7f40b1'),
  ('public.technology_five_embed_debit_core_v1(uuid,uuid,text,text)','85397a93c3483a3124fff8c00cf1a2369e9c5f69d1324d558e17b2faa172ce25'),
  ('public.consume_technology_five_embed_v1(uuid,uuid,text,text)','d500274dc55b8a040bc96916bad7044f48f4da5098740719108a4b3340dea19f')
 )v(signature,sha256) LOOP
  IF to_regprocedure(expected.signature) IS NULL OR encode(sha256(convert_to(pg_get_functiondef(to_regprocedure(expected.signature)),'UTF8')),'hex') IS DISTINCT FROM expected.sha256 THEN RAISE EXCEPTION 'Exact native predecessor source differs: %',expected.signature;END IF;
 END LOOP;
 IF (SELECT encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex') FROM pg_constraint WHERE conrelid='public.technology_five_embed_grants'::regclass AND conname='technology_five_embed_grants_technical_version_check') IS DISTINCT FROM '6f8a255b30ddf6269bc72e63a5e7281f07c71aa28a0593cb7be7e3fff21f4812' THEN RAISE EXCEPTION 'Exact native predecessor constraint differs: technology_five_embed_grants_technical_version_check';END IF;
 IF (SELECT encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex') FROM pg_constraint WHERE conrelid='public.technology_five_embed_grants'::regclass AND conname='technology_five_embed_grants_check') IS DISTINCT FROM 'c7be0fa5cf28c44932ca1e563d367bd5027e5a0937e1043e7aaf3eea3c6ea214' THEN RAISE EXCEPTION 'Exact native predecessor constraint differs: technology_five_embed_grants_check';END IF;
 IF (SELECT encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex') FROM pg_constraint WHERE conrelid='public.technology_five_embed_usage'::regclass AND conname='technology_five_embed_usage_technical_version_check') IS DISTINCT FROM '6f8a255b30ddf6269bc72e63a5e7281f07c71aa28a0593cb7be7e3fff21f4812' THEN RAISE EXCEPTION 'Exact native predecessor constraint differs: technology_five_embed_usage_technical_version_check';END IF;
 IF (SELECT encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex') FROM pg_constraint WHERE conrelid='public.technology_five_embed_usage'::regclass AND conname='technology_five_embed_usage_check') IS DISTINCT FROM 'c7be0fa5cf28c44932ca1e563d367bd5027e5a0937e1043e7aaf3eea3c6ea214' THEN RAISE EXCEPTION 'Exact native predecessor constraint differs: technology_five_embed_usage_check';END IF;
 IF (SELECT encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex') FROM pg_constraint WHERE conrelid='public.technology_five_jobs'::regclass AND conname='technology_five_jobs_technical_version_check') IS DISTINCT FROM '6f8a255b30ddf6269bc72e63a5e7281f07c71aa28a0593cb7be7e3fff21f4812' THEN RAISE EXCEPTION 'Exact native predecessor constraint differs: technology_five_jobs_technical_version_check';END IF;
 IF (SELECT encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex') FROM pg_constraint WHERE conrelid='public.technology_five_jobs'::regclass AND conname='technology_five_jobs_check') IS DISTINCT FROM 'c7be0fa5cf28c44932ca1e563d367bd5027e5a0937e1043e7aaf3eea3c6ea214' THEN RAISE EXCEPTION 'Exact native predecessor constraint differs: technology_five_jobs_check';END IF;
END $pre$;
LOCK TABLE public.technology_five_embed_grants,public.technology_five_embed_usage,public.technology_five_jobs IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE public.technology_five_embed_grants DROP CONSTRAINT technology_five_embed_grants_technical_version_check, DROP CONSTRAINT technology_five_embed_grants_check;
ALTER TABLE public.technology_five_embed_grants ADD CONSTRAINT technology_five_embed_grants_exact_native_tuple_check CHECK ((catalog_id,engine_id,technical_version) IN ((370,'technology.bandwidth',1),(371,'technology.download-time',1),(372,'technology.upload-time',1),(373,'technology.data-transfer',1),(386,'technology.base64-size',1),(374,'technology.storage-conversion',1),(377,'technology.aspect-ratio',1),(378,'technology.resolution',1),(379,'technology.dpi',1),(382,'technology.power-supply',1),(383,'technology.website-bandwidth',2),(384,'technology.cloud-storage-cost',1),(385,'technology.cloud-data-transfer-cost',1)));
ALTER TABLE public.technology_five_embed_usage DROP CONSTRAINT technology_five_embed_usage_technical_version_check, DROP CONSTRAINT technology_five_embed_usage_check;
ALTER TABLE public.technology_five_embed_usage ADD CONSTRAINT technology_five_embed_usage_exact_native_tuple_check CHECK ((catalog_id,engine_id,technical_version) IN ((370,'technology.bandwidth',1),(371,'technology.download-time',1),(372,'technology.upload-time',1),(373,'technology.data-transfer',1),(386,'technology.base64-size',1),(374,'technology.storage-conversion',1),(377,'technology.aspect-ratio',1),(378,'technology.resolution',1),(379,'technology.dpi',1),(382,'technology.power-supply',1),(383,'technology.website-bandwidth',2),(384,'technology.cloud-storage-cost',1),(385,'technology.cloud-data-transfer-cost',1)));
ALTER TABLE public.technology_five_jobs DROP CONSTRAINT technology_five_jobs_technical_version_check, DROP CONSTRAINT technology_five_jobs_check;
ALTER TABLE public.technology_five_jobs ADD CONSTRAINT technology_five_jobs_exact_native_tuple_check CHECK ((catalog_id,engine_id,technical_version) IN ((370,'technology.bandwidth',1),(371,'technology.download-time',1),(372,'technology.upload-time',1),(373,'technology.data-transfer',1),(386,'technology.base64-size',1),(374,'technology.storage-conversion',1),(377,'technology.aspect-ratio',1),(378,'technology.resolution',1),(379,'technology.dpi',1),(382,'technology.power-supply',1),(383,'technology.website-bandwidth',2),(384,'technology.cloud-storage-cost',1),(385,'technology.cloud-data-transfer-cost',1)));
CREATE OR REPLACE FUNCTION public.technology_five_require_publication_v1(p_catalog integer,p_version integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE engine text;slug text;
BEGIN
 SELECT t.engine,t.slug INTO engine,slug FROM (VALUES(370,'technology.bandwidth','bandwidth-calculator',1),(371,'technology.download-time','download-time-calculator',1),(372,'technology.upload-time','upload-time-calculator',1),(373,'technology.data-transfer','data-transfer-calculator',1),(386,'technology.base64-size','base64-size-calculator',1),(374,'technology.storage-conversion','storage-conversion-calculator',1),(377,'technology.aspect-ratio','aspect-ratio-calculator',1),(378,'technology.resolution','resolution-calculator',1),(379,'technology.dpi','dpi-calculator',1),(382,'technology.power-supply','power-supply-calculator',1),(383,'technology.website-bandwidth','website-bandwidth-calculator',2),(384,'technology.cloud-storage-cost','cloud-storage-cost-calculator',1),(385,'technology.cloud-data-transfer-cost','cloud-data-transfer-cost-calculator',1))t(catalog,engine,slug,version) WHERE t.catalog=p_catalog AND t.version=p_version;
 IF NOT FOUND OR NOT public.technology_five_publication_snapshot_v1(engine,slug,p_version) THEN RAISE EXCEPTION 'Exact publication unavailable' USING ERRCODE='PT404';END IF;
END $$;
CREATE OR REPLACE FUNCTION public.submit_technology_five_job_v1(p_api_key_id uuid,p_key_hash text,p_organization_id uuid,p_request_id uuid,p_catalog_id integer,p_version integer,p_input_rows jsonb,p_output_rows jsonb,p_endpoint_id uuid DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
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
  SELECT t.engine INTO engine FROM(VALUES(370,'technology.bandwidth'),(371,'technology.download-time'),(372,'technology.upload-time'),(373,'technology.data-transfer'),(386,'technology.base64-size'),(374,'technology.storage-conversion'),(377,'technology.aspect-ratio'),(378,'technology.resolution'),(379,'technology.dpi'),(382,'technology.power-supply'),(383,'technology.website-bandwidth'),(384,'technology.cloud-storage-cost'),(385,'technology.cloud-data-transfer-cost'))t(id,engine) WHERE t.id=p_catalog_id;
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
-- Existing private helper ownership/ACLs, table privileges and integrity triggers remain unchanged.
COMMIT;
