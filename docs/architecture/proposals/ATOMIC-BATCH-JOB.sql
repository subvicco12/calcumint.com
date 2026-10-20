-- PROPOSAL ONLY. No production application. Database/security/privacy review required.
-- DEPENDENCY: all quota writers must adopt the key-lock contract, including
-- ATOMIC-API-QUOTA.sql. Unlocked legacy writers defeat global quota serialization.
-- One request unit for each accepted POST, including same-job POST retries.
-- GET recovery is read-only; failed/no-job creation rolls back any debit.
BEGIN;
DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated batch acceptance and owner authorization required'; END $$;
CREATE TABLE public.batch_request_receipts (
 api_key_id uuid NOT NULL REFERENCES public.business_api_keys(id),
 request_id uuid NOT NULL,
 organization_id uuid NOT NULL REFERENCES public.organizations(id),
 payload jsonb NOT NULL,
 job_id uuid NOT NULL UNIQUE REFERENCES public.batch_calculation_jobs(id),
 -- Only identity/input/output fields, not timezone-formatted audit timestamps.
 job_snapshot jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(api_key_id,request_id)
);
ALTER TABLE public.batch_request_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.batch_request_receipts FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.read_verified_batch_job_v1(p_api_key_id uuid,p_key_hash text,p_organization_id uuid,p_request_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE k public.business_api_keys%ROWTYPE;receipt public.batch_request_receipts%ROWTYPE;job public.batch_calculation_jobs%ROWTYPE;
BEGIN
 SELECT * INTO k FROM public.business_api_keys WHERE id=p_api_key_id;
 IF NOT FOUND OR k.key_hash IS DISTINCT FROM p_key_hash OR k.organization_id IS DISTINCT FROM p_organization_id OR k.status IS DISTINCT FROM 'active'
  OR jsonb_typeof(k.scopes) IS DISTINCT FROM 'array' OR NOT k.scopes ? 'calculations:batch'
  OR NOT EXISTS(SELECT FROM public.profiles WHERE id=k.created_by AND plan='business') THEN RAISE EXCEPTION 'Batch authority unavailable' USING ERRCODE='PT403';END IF;
 SELECT * INTO receipt FROM public.batch_request_receipts WHERE api_key_id=p_api_key_id AND request_id=p_request_id;
 IF NOT FOUND THEN RETURN jsonb_build_object('status','missing');END IF;
 SELECT * INTO job FROM public.batch_calculation_jobs WHERE id=receipt.job_id AND api_key_id=k.id AND organization_id=k.organization_id;
 IF NOT FOUND OR receipt.organization_id IS DISTINCT FROM k.organization_id OR receipt.payload IS DISTINCT FROM jsonb_build_object('calculator_id',job.calculator_id,'input_rows',job.input_rows) OR jsonb_build_object('id',job.id,'calculator_id',job.calculator_id,'calculator_version',job.calculator_version,'status',job.status,'input_rows',job.input_rows,'output_rows',job.output_rows) IS DISTINCT FROM receipt.job_snapshot THEN RAISE EXCEPTION 'Incomplete or changed batch evidence';END IF;
 RETURN jsonb_build_object('status','completed','request_id',p_request_id,'job',receipt.job_snapshot);
END $$;

CREATE FUNCTION public.submit_verified_batch_job_v1(
 p_api_key_id uuid,p_key_hash text,p_organization_id uuid,p_request_id uuid,
 p_calculator_id uuid,p_input_rows jsonb,p_version integer,p_definition jsonb,p_output_rows jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE
 k public.business_api_keys%ROWTYPE;owner_plan text;receipt public.batch_request_receipts%ROWTYPE;
 job public.batch_calculation_jobs%ROWTYPE;payload jsonb;month_units bigint;minute_units bigint;
 current_version integer;definition jsonb;duplicate boolean:=false;
BEGIN
 IF current_setting('transaction_isolation') IS DISTINCT FROM 'read committed' THEN RAISE EXCEPTION 'Batch contract requires READ COMMITTED';END IF;
 IF p_request_id IS NULL OR p_calculator_id IS NULL OR jsonb_typeof(p_input_rows) IS DISTINCT FROM 'array'
  OR jsonb_array_length(p_input_rows) NOT BETWEEN 1 AND 100
  OR EXISTS(SELECT FROM jsonb_array_elements(p_input_rows) row WHERE jsonb_typeof(row) IS DISTINCT FROM 'object') THEN RAISE EXCEPTION 'Invalid batch request';END IF;
 payload:=jsonb_build_object('calculator_id',p_calculator_id,'input_rows',p_input_rows);
 -- Same key serializes quota and request reconciliation; changed hash/scope/owner
 -- cannot reuse an earlier application's verified principal.
 SELECT * INTO k FROM public.business_api_keys WHERE id=p_api_key_id FOR UPDATE;
 IF NOT FOUND OR k.key_hash IS DISTINCT FROM p_key_hash OR k.organization_id IS DISTINCT FROM p_organization_id OR k.status IS DISTINCT FROM 'active'
  OR jsonb_typeof(k.scopes) IS DISTINCT FROM 'array' OR NOT k.scopes ? 'calculations:batch' THEN RAISE EXCEPTION 'Batch authority unavailable' USING ERRCODE='PT403';END IF;
 SELECT plan INTO owner_plan FROM public.profiles WHERE id=k.created_by FOR SHARE;
 IF NOT FOUND OR owner_plan IS DISTINCT FROM 'business' THEN RAISE EXCEPTION 'Batch authority unavailable' USING ERRCODE='PT403';END IF;
 SELECT * INTO receipt FROM public.batch_request_receipts WHERE api_key_id=k.id AND request_id=p_request_id;
 IF FOUND THEN
  IF receipt.organization_id IS DISTINCT FROM k.organization_id OR receipt.payload IS DISTINCT FROM payload THEN RAISE EXCEPTION 'Conflicting batch request' USING ERRCODE='PT409';END IF;
  SELECT * INTO job FROM public.batch_calculation_jobs WHERE id=receipt.job_id AND api_key_id=k.id AND organization_id=k.organization_id;
  IF NOT FOUND OR receipt.payload IS DISTINCT FROM jsonb_build_object('calculator_id',job.calculator_id,'input_rows',job.input_rows) OR jsonb_build_object('id',job.id,'calculator_id',job.calculator_id,'calculator_version',job.calculator_version,'status',job.status,'input_rows',job.input_rows,'output_rows',job.output_rows) IS DISTINCT FROM receipt.job_snapshot THEN RAISE EXCEPTION 'Incomplete or changed batch evidence';END IF;
  duplicate:=true;
 ELSE
  -- The first POST probe is a read-only missing result, never a quota reservation.
  IF p_version IS NULL AND p_definition IS NULL AND p_output_rows IS NULL THEN RETURN jsonb_build_object('status','missing');END IF;
  IF p_version IS NULL OR p_version<1 OR jsonb_typeof(p_definition) IS DISTINCT FROM 'object'
    OR jsonb_typeof(p_output_rows) IS DISTINCT FROM 'array' OR jsonb_array_length(p_output_rows)<>jsonb_array_length(p_input_rows) THEN RAISE EXCEPTION 'Invalid batch result';END IF;
  IF EXISTS(SELECT FROM jsonb_array_elements(p_output_rows) WITH ORDINALITY result(row,n)
    WHERE jsonb_typeof(result.row) IS DISTINCT FROM 'object'
      OR result.row->'index' IS DISTINCT FROM to_jsonb(result.n-1)
      OR jsonb_typeof(result.row->'ok') IS DISTINCT FROM 'boolean'
      OR (result.row->'ok'='true'::jsonb AND jsonb_typeof(result.row->'output') IS DISTINCT FROM 'object')
      OR (result.row->'ok'='false'::jsonb AND jsonb_typeof(result.row->'error') IS DISTINCT FROM 'string')) THEN
    RAISE EXCEPTION 'Invalid batch result rows';
  END IF;
  SELECT published_version INTO current_version FROM public.custom_calculators
    WHERE id=p_calculator_id AND organization_id=k.organization_id AND status='published' FOR SHARE;
  IF NOT FOUND OR current_version IS DISTINCT FROM p_version THEN RAISE EXCEPTION 'Published batch version changed' USING ERRCODE='PT409';END IF;
  SELECT v.definition INTO definition FROM public.custom_calculator_versions v WHERE v.calculator_id=p_calculator_id AND v.version=p_version FOR SHARE;
  IF NOT FOUND OR definition IS DISTINCT FROM p_definition THEN RAISE EXCEPTION 'Published batch definition changed' USING ERRCODE='PT409';END IF;
 END IF;
 SELECT coalesce(sum(units),0) INTO month_units FROM public.api_usage_events WHERE api_key_id=k.id AND created_at>=date_trunc('month',now());
 SELECT coalesce(sum(units),0) INTO minute_units FROM public.api_usage_events WHERE api_key_id=k.id AND created_at>=now()-interval '1 minute';
 IF month_units>=k.monthly_quota OR minute_units>=k.rate_limit_per_minute THEN RAISE EXCEPTION 'API quota exceeded' USING ERRCODE='PT429';END IF;
 INSERT INTO public.api_usage_events(api_key_id,organization_id,request_kind,units,request_id) VALUES(k.id,k.organization_id,'request',1,p_request_id);
 IF NOT duplicate THEN
  INSERT INTO public.batch_calculation_jobs(organization_id,api_key_id,calculator_id,calculator_version,status,input_rows,output_rows,started_at,completed_at)
    VALUES(k.organization_id,k.id,p_calculator_id,p_version,'completed',p_input_rows,p_output_rows,now(),now()) RETURNING * INTO job;
  INSERT INTO public.batch_request_receipts(api_key_id,request_id,organization_id,payload,job_id,job_snapshot)
    VALUES(k.id,p_request_id,k.organization_id,payload,job.id,jsonb_build_object('id',job.id,'calculator_id',job.calculator_id,'calculator_version',job.calculator_version,'status',job.status,'input_rows',job.input_rows,'output_rows',job.output_rows));
 END IF;
 UPDATE public.business_api_keys SET last_used_at=now() WHERE id=k.id;
 RETURN jsonb_build_object('status','completed','request_id',p_request_id,'duplicate',duplicate,'job',jsonb_build_object('id',job.id,'calculator_id',job.calculator_id,'calculator_version',job.calculator_version,'status',job.status,'input_rows',job.input_rows,'output_rows',job.output_rows));
END $$;
REVOKE ALL ON FUNCTION public.read_verified_batch_job_v1(uuid,text,uuid,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.submit_verified_batch_job_v1(uuid,text,uuid,uuid,uuid,jsonb,integer,jsonb,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.read_verified_batch_job_v1(uuid,text,uuid,uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.submit_verified_batch_job_v1(uuid,text,uuid,uuid,uuid,jsonb,integer,jsonb,jsonb) TO service_role;
COMMIT;
