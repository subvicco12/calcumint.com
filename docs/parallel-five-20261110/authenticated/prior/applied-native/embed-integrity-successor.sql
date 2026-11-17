-- HELD CORRECTIVE SUCCESSOR. Original embed proposal and PG9 evidence remain unchanged.
-- Requires the exact original candidate and the exact new job publication gate.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_TECHNOLOGY_FIVE_EMBED_INTEGRITY'; END $hold$;
SET LOCAL lock_timeout='3s';SET LOCAL statement_timeout='30s';
DO $pre$ BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed operator and READ COMMITTED required';END IF;
 IF to_regprocedure('public.consume_technology_five_embed_v1(uuid,uuid,text,text)') IS NULL OR encode(sha256(convert_to(pg_get_functiondef('public.consume_technology_five_embed_v1(uuid,uuid,text,text)'::regprocedure),'UTF8')),'hex')<>'4509d20ece8f0930201ce2a07429e6744670da0d389a165b7f2380146a95e5fd' THEN RAISE EXCEPTION 'Exact original five embed source required';END IF;
 IF to_regprocedure('public.technology_five_require_publication_v1(integer,integer)') IS NULL OR encode(sha256(convert_to(pg_get_functiondef('public.technology_five_require_publication_v1(integer,integer)'::regprocedure),'UTF8')),'hex')<>'80b2e085d6b4e68fff9705eff10bea1c730fe4101c5d8894eddc87df5e01003a' THEN RAISE EXCEPTION 'Exact five publication gate successor required';END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.consume_native_business_api_quota_v1(uuid)'::regprocedure),'UTF8')),'hex')<>'4cc6f6a10adafd43e3e064301d4a0631d80bed09bec54f80b1a94c7b556fe9b9' THEN RAISE EXCEPTION 'Exact quota predecessor required';END IF;
 IF (SELECT array_agg(attname::text ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.technology_five_embed_grants'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM ARRAY['id','organization_id','issuer_id','api_key_id','token_hash','allowed_origin','catalog_id','engine_id','technical_version','issued_at','expires_at','revoked_at'] THEN RAISE EXCEPTION 'Unexpected grant shape';END IF;
 IF (SELECT array_agg(attname::text ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.technology_five_embed_usage'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM ARRAY['grant_id','request_id','organization_id','issuer_id','api_key_id','catalog_id','engine_id','technical_version','request_hash','result_hash','created_at','units'] THEN RAISE EXCEPTION 'Unexpected usage shape';END IF;
 IF (SELECT array_agg(attname::text ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.technology_five_embed_attempts'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM ARRAY['id','grant_id','organization_id','issuer_id','api_key_id','request_id','created_at'] THEN RAISE EXCEPTION 'Unexpected attempt shape';END IF;
 IF EXISTS(SELECT FROM pg_policy WHERE polrelid IN('public.technology_five_embed_grants'::regclass,'public.technology_five_embed_usage'::regclass,'public.technology_five_embed_attempts'::regclass)) THEN RAISE EXCEPTION 'Unexpected candidate policies';END IF;
 IF EXISTS(SELECT FROM pg_class c CROSS JOIN LATERAL aclexplode(coalesce(c.relacl,acldefault('r',c.relowner)))a WHERE c.oid IN('public.technology_five_embed_grants'::regclass,'public.technology_five_embed_usage'::regclass,'public.technology_five_embed_attempts'::regclass) AND a.grantee NOT IN(c.relowner,'service_role'::regrole::oid)) THEN RAISE EXCEPTION 'Unexpected candidate grantee';END IF;
END $pre$;
LOCK TABLE public.technology_five_embed_grants,public.technology_five_embed_usage,public.technology_five_embed_attempts IN SHARE ROW EXCLUSIVE MODE;
CREATE FUNCTION public.technology_five_embed_identity_v1() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog AS $$
BEGIN
 IF TG_TABLE_NAME<>'technology_five_embed_grants' OR TG_OP='DELETE' THEN RAISE EXCEPTION 'Immutable native embed audit';END IF;
 IF (to_jsonb(NEW)-'revoked_at') IS DISTINCT FROM (to_jsonb(OLD)-'revoked_at') THEN RAISE EXCEPTION 'Immutable native grant identity';END IF;
 IF OLD.revoked_at IS NOT NULL AND NEW.revoked_at IS DISTINCT FROM OLD.revoked_at THEN RAISE EXCEPTION 'Native grant revocation is monotonic';END IF;RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.technology_five_embed_identity_v1() FROM PUBLIC,anon,authenticated,service_role;
CREATE TRIGGER technology_five_grant_identity BEFORE UPDATE OR DELETE ON public.technology_five_embed_grants FOR EACH ROW EXECUTE FUNCTION public.technology_five_embed_identity_v1();
CREATE TRIGGER technology_five_usage_immutable BEFORE UPDATE OR DELETE ON public.technology_five_embed_usage FOR EACH ROW EXECUTE FUNCTION public.technology_five_embed_identity_v1();
CREATE TRIGGER technology_five_attempt_immutable BEFORE UPDATE OR DELETE ON public.technology_five_embed_attempts FOR EACH ROW EXECUTE FUNCTION public.technology_five_embed_identity_v1();
REVOKE ALL ON public.technology_five_embed_grants,public.technology_five_embed_usage,public.technology_five_embed_attempts FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT,INSERT ON public.technology_five_embed_grants TO service_role;
GRANT UPDATE(revoked_at) ON public.technology_five_embed_grants TO service_role;
REVOKE ALL ON FUNCTION public.consume_technology_five_embed_v1(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated,service_role;
ALTER FUNCTION public.consume_technology_five_embed_v1(uuid,uuid,text,text) RENAME TO technology_five_embed_debit_core_v1;
-- The original reviewed body is preserved as a private core. A narrow owner
-- wrapper permits RPC-only audit writes without giving the service table writes.
CREATE FUNCTION public.consume_technology_five_embed_v1(p_grant_id uuid,p_request_id uuid,p_request_hash text,p_result_hash text) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE g public.technology_five_embed_grants%ROWTYPE;k public.business_api_keys%ROWTYPE;
BEGIN
 IF current_setting('role',true) IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Trusted service caller required' USING ERRCODE='PT403';END IF;
 SELECT * INTO g FROM public.technology_five_embed_grants WHERE id=p_grant_id FOR UPDATE;IF NOT FOUND THEN RETURN 'denied';END IF;
 SELECT * INTO k FROM public.business_api_keys WHERE id=g.api_key_id FOR UPDATE;IF NOT FOUND OR jsonb_typeof(k.scopes) IS DISTINCT FROM 'array' THEN RETURN 'denied';END IF;
 PERFORM public.technology_five_require_publication_v1(g.catalog_id,g.technical_version);
 RETURN public.technology_five_embed_debit_core_v1(p_grant_id,p_request_id,p_request_hash,p_result_hash);
EXCEPTION WHEN SQLSTATE 'PT404' THEN RETURN 'denied';
END $$;
REVOKE ALL ON FUNCTION public.consume_technology_five_embed_v1(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION public.consume_technology_five_embed_v1(uuid,uuid,text,text) TO service_role;
COMMIT;
