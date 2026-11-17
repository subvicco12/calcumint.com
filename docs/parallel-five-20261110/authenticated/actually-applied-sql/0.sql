-- REVIEW ONLY. No production activation authority. No new quota policy/rates.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_NATIVE_QUOTA_READINESS'; END $hold$;
CREATE FUNCTION public.consume_native_business_api_quota_v1(p_api_key_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $$
BEGIN
 IF encode(sha256(convert_to(pg_get_functiondef('public.consume_business_api_quota(uuid)'::regprocedure),'UTF8')),'hex')
   IS DISTINCT FROM '51d70f9e682f87017cccd782b9cf944da4bf2790c8472c322472122b4e1f9a69' THEN
  RAISE EXCEPTION 'NATIVE_QUOTA_ADOPTION_REQUIRED';
 END IF;
 RETURN public.consume_business_api_quota(p_api_key_id);
END $$;
REVOKE ALL ON FUNCTION public.consume_native_business_api_quota_v1(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.consume_native_business_api_quota_v1(uuid) TO service_role;
COMMIT;
