-- ISOLATED ENGINEERING PROPOSAL ONLY. No active migration or production authority.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_TECHNOLOGY_FIVE_EMBED_METERING'; END $hold$;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
-- Run only after separately reviewed quota readiness adoption. No limits are invented.
DO $pre$ BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed operator and READ COMMITTED required'; END IF;
 IF to_regprocedure('public.consume_native_business_api_quota_v1(uuid)') IS NULL THEN RAISE EXCEPTION 'Quota readiness predecessor required'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.consume_native_business_api_quota_v1(uuid)'::regprocedure),'UTF8')),'hex')<>'4cc6f6a10adafd43e3e064301d4a0631d80bed09bec54f80b1a94c7b556fe9b9' THEN RAISE EXCEPTION 'Quota predecessor source drift'; END IF;
 IF to_regclass('public.technology_five_embed_grants') IS NOT NULL OR to_regclass('public.technology_five_embed_usage') IS NOT NULL OR to_regclass('public.technology_five_embed_attempts') IS NOT NULL THEN RAISE EXCEPTION 'Unexpected embed successor objects'; END IF;
END $pre$;
LOCK TABLE public.business_api_keys,public.organizations,public.organization_members,public.profiles,public.api_usage_events IN SHARE ROW EXCLUSIVE MODE;
CREATE TABLE public.technology_five_embed_grants (
 id uuid PRIMARY KEY, organization_id uuid NOT NULL REFERENCES public.organizations(id),
 issuer_id uuid NOT NULL REFERENCES public.profiles(id), api_key_id uuid NOT NULL REFERENCES public.business_api_keys(id),
 token_hash text NOT NULL CHECK(token_hash ~ '^[a-f0-9]{64}$'), allowed_origin text NOT NULL,
 catalog_id integer NOT NULL, engine_id text NOT NULL,
 technical_version integer NOT NULL CHECK(technical_version=1), CHECK((catalog_id,engine_id) IN ((370,'technology.bandwidth'),(371,'technology.download-time'),(372,'technology.upload-time'),(373,'technology.data-transfer'),(386,'technology.base64-size'))), issued_at timestamptz NOT NULL, expires_at timestamptz NOT NULL,
 revoked_at timestamptz, CHECK(expires_at>issued_at AND expires_at<=issued_at+interval '1 hour')
);
CREATE TABLE public.technology_five_embed_usage (
 grant_id uuid NOT NULL REFERENCES public.technology_five_embed_grants(id), request_id uuid NOT NULL,
 organization_id uuid NOT NULL REFERENCES public.organizations(id), issuer_id uuid NOT NULL REFERENCES public.profiles(id),
 api_key_id uuid NOT NULL REFERENCES public.business_api_keys(id), catalog_id integer NOT NULL,
 engine_id text NOT NULL, technical_version integer NOT NULL CHECK(technical_version=1), CHECK((catalog_id,engine_id) IN ((370,'technology.bandwidth'),(371,'technology.download-time'),(372,'technology.upload-time'),(373,'technology.data-transfer'),(386,'technology.base64-size'))),
 request_hash text NOT NULL CHECK(request_hash ~ '^[a-f0-9]{64}$'), result_hash text NOT NULL CHECK(result_hash ~ '^[a-f0-9]{64}$'),
 created_at timestamptz NOT NULL DEFAULT now(), units integer NOT NULL DEFAULT 1 CHECK(units=1),
 PRIMARY KEY(grant_id,request_id)
);
-- A separate technical attempt window bounds retries too, using the selected
-- key's existing configured per-minute value. No monthly retry debit or new limit.
CREATE TABLE public.technology_five_embed_attempts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), grant_id uuid NOT NULL REFERENCES public.technology_five_embed_grants(id),
 organization_id uuid NOT NULL, issuer_id uuid NOT NULL, api_key_id uuid NOT NULL, request_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX technology_five_embed_attempts_key_window ON public.technology_five_embed_attempts(api_key_id,created_at);
ALTER TABLE public.technology_five_embed_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.technology_five_embed_attempts FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT,INSERT ON public.technology_five_embed_attempts TO service_role;
ALTER TABLE public.technology_five_embed_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_five_embed_usage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.technology_five_embed_grants,public.technology_five_embed_usage FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT,INSERT,UPDATE ON public.technology_five_embed_grants TO service_role;
GRANT SELECT,INSERT ON public.technology_five_embed_usage TO service_role;
CREATE FUNCTION public.consume_technology_five_embed_v1(p_grant_id uuid,p_request_id uuid,p_request_hash text,p_result_hash text)
RETURNS text LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,public AS $$
DECLARE g public.technology_five_embed_grants%ROWTYPE; k public.business_api_keys%ROWTYPE; prior public.technology_five_embed_usage%ROWTYPE;
 attempt_count bigint; owner_id uuid; issuer_role text; owner_plan text; issuer_plan text;
BEGIN
 IF current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'READ COMMITTED required'; END IF;
 IF p_request_id IS NULL OR p_request_hash !~ '^[a-f0-9]{64}$' OR p_result_hash !~ '^[a-f0-9]{64}$' OR p_request_hash IS NULL OR p_result_hash IS NULL THEN RETURN 'invalid'; END IF;
 -- Every redemption/retry rechecks current persisted authority, even if already metered.
 SELECT * INTO g FROM public.technology_five_embed_grants WHERE id=p_grant_id FOR UPDATE;
 IF NOT FOUND OR g.revoked_at IS NOT NULL OR g.expires_at<=clock_timestamp() OR g.issued_at>clock_timestamp() THEN RETURN 'denied'; END IF;
 SELECT * INTO k FROM public.business_api_keys WHERE id=g.api_key_id FOR UPDATE;
 IF NOT FOUND OR k.status<>'active' OR k.organization_id<>g.organization_id OR k.created_by<>g.issuer_id OR NOT (k.scopes ? 'calculations:run') THEN RETURN 'denied'; END IF;
 SELECT owner_user_id INTO owner_id FROM public.organizations WHERE id=g.organization_id FOR SHARE;
 IF NOT FOUND THEN RETURN 'denied'; END IF;
 SELECT role INTO issuer_role FROM public.organization_members WHERE organization_id=g.organization_id AND user_id=g.issuer_id FOR SHARE;
 IF NOT FOUND OR issuer_role NOT IN ('owner','admin') OR (issuer_role='owner' AND owner_id<>g.issuer_id) THEN RETURN 'denied'; END IF;
 -- Match quota key->profile lock order; Business authority is fenced through debit/audit commit.
 SELECT plan INTO issuer_plan FROM public.profiles WHERE id=g.issuer_id FOR SHARE;
 SELECT plan INTO owner_plan FROM public.profiles WHERE id=owner_id FOR SHARE;
 IF issuer_plan IS DISTINCT FROM 'business' OR owner_plan IS DISTINCT FROM 'business' THEN RETURN 'denied'; END IF;
 SELECT count(*) INTO attempt_count FROM public.technology_five_embed_attempts WHERE api_key_id=g.api_key_id AND created_at>=clock_timestamp()-interval '1 minute';
 IF attempt_count>=k.rate_limit_per_minute THEN RETURN 'limited'; END IF;
 INSERT INTO public.technology_five_embed_attempts(grant_id,organization_id,issuer_id,api_key_id,request_id) VALUES(g.id,g.organization_id,g.issuer_id,g.api_key_id,p_request_id);
 SELECT * INTO prior FROM public.technology_five_embed_usage WHERE grant_id=g.id AND request_id=p_request_id;
 IF FOUND THEN
  IF prior.request_hash=p_request_hash AND prior.result_hash=p_result_hash THEN RETURN 'replayed'; END IF;
  RETURN 'conflict';
 END IF;
 IF NOT public.consume_native_business_api_quota_v1(g.api_key_id) THEN RETURN 'limited'; END IF;
 INSERT INTO public.technology_five_embed_usage(grant_id,request_id,organization_id,issuer_id,api_key_id,catalog_id,engine_id,technical_version,request_hash,result_hash)
 VALUES(g.id,p_request_id,g.organization_id,g.issuer_id,g.api_key_id,g.catalog_id,g.engine_id,g.technical_version,p_request_hash,p_result_hash);
 RETURN 'accepted';
END $$;
REVOKE ALL ON FUNCTION public.consume_technology_five_embed_v1(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.consume_technology_five_embed_v1(uuid,uuid,text,text) TO service_role;
COMMIT;
