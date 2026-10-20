-- PROPOSAL ONLY: same request-based quota semantics/signature as migration 006.
-- Requires actual schema/roles/owner and provider/application adoption review.
BEGIN;
DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated quota acceptance and owner authorization required'; END $$;
CREATE OR REPLACE FUNCTION public.consume_business_api_quota(p_api_key_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public AS $$
DECLARE
  api_key public.business_api_keys%ROWTYPE;
  owner_plan text;
  month_units bigint;
  minute_units bigint;
BEGIN
  -- Counts must take a fresh statement snapshot after waiting on the key lock.
  IF current_setting('transaction_isolation') IS DISTINCT FROM 'read committed' THEN
    RAISE EXCEPTION 'Quota contract requires READ COMMITTED';
  END IF;
  -- Serialize every debit for this key before inspecting either usage window.
  SELECT * INTO api_key FROM public.business_api_keys WHERE id=p_api_key_id FOR UPDATE;
  IF NOT FOUND OR api_key.status IS DISTINCT FROM 'active' THEN RETURN false; END IF;
  SELECT plan INTO owner_plan FROM public.profiles WHERE id=api_key.created_by FOR SHARE;
  IF NOT FOUND OR owner_plan IS DISTINCT FROM 'business' THEN RETURN false; END IF;
  SELECT coalesce(sum(units),0) INTO month_units FROM public.api_usage_events
    WHERE api_key_id=p_api_key_id AND created_at >= date_trunc('month',now());
  IF month_units >= api_key.monthly_quota THEN RETURN false; END IF;
  SELECT coalesce(sum(units),0) INTO minute_units FROM public.api_usage_events
    WHERE api_key_id=p_api_key_id AND created_at >= now()-interval '1 minute';
  IF minute_units >= api_key.rate_limit_per_minute THEN RETURN false; END IF;
  INSERT INTO public.api_usage_events(api_key_id,organization_id,request_kind,units)
    VALUES(api_key.id,api_key.organization_id,'request',1);
  RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.consume_business_api_quota(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.consume_business_api_quota(uuid) TO service_role;
COMMIT;
