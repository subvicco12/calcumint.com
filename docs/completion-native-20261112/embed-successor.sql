-- HELD engineering successor. No active migration, publication adoption or production authority.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_FACTORY_NINE_NATIVE_EMBED'; END $hold$;
SET LOCAL lock_timeout='3s';SET LOCAL statement_timeout='30s';
DO $pre$ BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed postgres operator and READ COMMITTED required';END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.consume_native_embed_v1(uuid,uuid,text,text)'::regprocedure),'UTF8')),'hex')<>'33edec8eeba2e57626ce21537576e9ccffc8d4a4186aa70a827a629bcde55dcd' THEN RAISE EXCEPTION 'Exact original native embed metering required';END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.consume_native_business_api_quota_v1(uuid)'::regprocedure),'UTF8')),'hex')<>'4cc6f6a10adafd43e3e064301d4a0631d80bed09bec54f80b1a94c7b556fe9b9' THEN RAISE EXCEPTION 'Exact governed quota predecessor required';END IF;
 IF (SELECT array_agg(attname::text ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.native_embed_grants'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM ARRAY['id','organization_id','issuer_id','api_key_id','token_hash','allowed_origin','catalog_id','engine_id','technical_version','issued_at','expires_at','revoked_at'] THEN RAISE EXCEPTION 'Unexpected grant preimage';END IF;
 IF (SELECT array_agg(attname::text ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.native_embed_usage'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM ARRAY['grant_id','request_id','organization_id','issuer_id','api_key_id','catalog_id','engine_id','technical_version','request_hash','result_hash','created_at','units'] THEN RAISE EXCEPTION 'Unexpected usage preimage';END IF;
 IF (SELECT array_agg(attname::text ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.native_embed_attempts'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM ARRAY['id','grant_id','organization_id','issuer_id','api_key_id','request_id','created_at'] THEN RAISE EXCEPTION 'Unexpected attempt preimage';END IF;
 IF EXISTS(SELECT FROM pg_class WHERE oid IN('public.native_embed_grants'::regclass,'public.native_embed_usage'::regclass,'public.native_embed_attempts'::regclass) AND NOT relrowsecurity) THEN RAISE EXCEPTION 'RLS preimage required';END IF;
 IF EXISTS(SELECT FROM pg_class c CROSS JOIN LATERAL aclexplode(coalesce(c.relacl,acldefault('r',c.relowner)))a WHERE c.oid IN('public.native_embed_grants'::regclass,'public.native_embed_usage'::regclass,'public.native_embed_attempts'::regclass) AND a.grantee NOT IN(c.relowner,'service_role'::regrole::oid)) THEN RAISE EXCEPTION 'Unexpected native embed table grantee';END IF;
 IF EXISTS(SELECT FROM pg_trigger WHERE tgrelid IN('public.native_embed_grants'::regclass,'public.native_embed_usage'::regclass,'public.native_embed_attempts'::regclass) AND NOT tgisinternal) OR EXISTS(SELECT FROM pg_policy WHERE polrelid IN('public.native_embed_grants'::regclass,'public.native_embed_usage'::regclass,'public.native_embed_attempts'::regclass)) THEN RAISE EXCEPTION 'Unexpected native embed triggers or policies';END IF;
END $pre$;
LOCK TABLE public.native_embed_grants,public.native_embed_usage,public.native_embed_attempts IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE public.native_embed_grants DROP CONSTRAINT native_embed_grants_catalog_id_check,DROP CONSTRAINT native_embed_grants_engine_id_check;
ALTER TABLE public.native_embed_usage DROP CONSTRAINT native_embed_usage_catalog_id_check,DROP CONSTRAINT native_embed_usage_engine_id_check;
ALTER TABLE public.native_embed_grants ADD CONSTRAINT native_embed_grant_exact_tuple CHECK((catalog_id,engine_id,technical_version) IN((218,'launch-square-calculator',1),(219,'launch-cube-calculator',1),(220,'launch-square-root-calculator',1),(423,'conversion.length',1),(430,'conversion.energy',1),(431,'conversion.power',1),(432,'conversion.time',1),(438,'conversion.force',1),(440,'conversion.frequency',1)));
ALTER TABLE public.native_embed_usage ADD CONSTRAINT native_embed_usage_exact_tuple CHECK((catalog_id,engine_id,technical_version) IN((218,'launch-square-calculator',1),(219,'launch-cube-calculator',1),(220,'launch-square-root-calculator',1),(423,'conversion.length',1),(430,'conversion.energy',1),(431,'conversion.power',1),(432,'conversion.time',1),(438,'conversion.force',1),(440,'conversion.frequency',1)));
ALTER TABLE public.native_embed_grants ADD CONSTRAINT native_embed_grant_attribution UNIQUE(id,organization_id,issuer_id,api_key_id,catalog_id,engine_id,technical_version);
ALTER TABLE public.native_embed_usage ADD CONSTRAINT native_embed_usage_attribution FOREIGN KEY(grant_id,organization_id,issuer_id,api_key_id,catalog_id,engine_id,technical_version) REFERENCES public.native_embed_grants(id,organization_id,issuer_id,api_key_id,catalog_id,engine_id,technical_version);
CREATE FUNCTION public.factory_native_embed_identity_v1() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog AS $$
BEGIN
 IF TG_TABLE_NAME<>'native_embed_grants' OR TG_OP='DELETE' THEN RAISE EXCEPTION 'Immutable native embed audit';END IF;
 IF (to_jsonb(NEW)-'revoked_at') IS DISTINCT FROM (to_jsonb(OLD)-'revoked_at') THEN RAISE EXCEPTION 'Immutable native grant identity';END IF;
 IF OLD.revoked_at IS NOT NULL AND NEW.revoked_at IS DISTINCT FROM OLD.revoked_at THEN RAISE EXCEPTION 'Native revocation is monotonic';END IF;RETURN NEW;
END $$;
CREATE TRIGGER native_embed_grant_identity BEFORE UPDATE OR DELETE ON public.native_embed_grants FOR EACH ROW EXECUTE FUNCTION public.factory_native_embed_identity_v1();
CREATE TRIGGER native_embed_usage_identity BEFORE UPDATE OR DELETE ON public.native_embed_usage FOR EACH ROW EXECUTE FUNCTION public.factory_native_embed_identity_v1();
CREATE TRIGGER native_embed_attempt_identity BEFORE UPDATE OR DELETE ON public.native_embed_attempts FOR EACH ROW EXECUTE FUNCTION public.factory_native_embed_identity_v1();
REVOKE ALL ON FUNCTION public.factory_native_embed_identity_v1() FROM PUBLIC,anon,authenticated,service_role;
CREATE FUNCTION public.factory_native_embed_publication_snapshot_v1(p_engine text,p_slug text,p_version integer) RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $$
BEGIN
 PERFORM id FROM public.calculator_catalog_admin WHERE calculator_key=p_engine AND slug=p_slug AND version=p_version AND lifecycle='published' FOR SHARE;
 RETURN FOUND;
END $$;
REVOKE ALL ON FUNCTION public.factory_native_embed_publication_snapshot_v1(text,text,integer) FROM PUBLIC,anon,authenticated,service_role;
CREATE FUNCTION public.factory_native_embed_publication_v1(p_catalog integer,p_version integer) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $$
DECLARE engine text;expected_slug text;
BEGIN
 SELECT t.engine,t.slug INTO engine,expected_slug FROM (VALUES(218,'launch-square-calculator','square-calculator'),(219,'launch-cube-calculator','cube-calculator'),(220,'launch-square-root-calculator','square-root-calculator'),(423,'conversion.length','length-converter'),(430,'conversion.energy','energy-converter'),(431,'conversion.power','power-converter'),(432,'conversion.time','time-converter'),(438,'conversion.force','force-converter'),(440,'conversion.frequency','frequency-converter'))t(catalog,engine,slug) WHERE t.catalog=p_catalog;
 IF NOT FOUND OR p_version IS DISTINCT FROM 1 THEN RAISE EXCEPTION 'Exact publication unavailable' USING ERRCODE='PT404';END IF;
 IF NOT public.factory_native_embed_publication_snapshot_v1(engine,expected_slug,p_version) THEN RAISE EXCEPTION 'Exact publication unavailable' USING ERRCODE='PT404';END IF;
END $$;
REVOKE ALL ON FUNCTION public.factory_native_embed_publication_v1(integer,integer) FROM PUBLIC,anon,authenticated,service_role;
REVOKE ALL ON public.native_embed_grants,public.native_embed_usage,public.native_embed_attempts FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT,INSERT ON public.native_embed_grants TO service_role;GRANT UPDATE(revoked_at) ON public.native_embed_grants TO service_role;
REVOKE ALL ON FUNCTION public.consume_native_embed_v1(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated,service_role;
ALTER FUNCTION public.consume_native_embed_v1(uuid,uuid,text,text) RENAME TO factory_native_embed_debit_core_v1;
CREATE FUNCTION public.consume_native_embed_v1(p_grant_id uuid,p_request_id uuid,p_request_hash text,p_result_hash text) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE g public.native_embed_grants%ROWTYPE;k public.business_api_keys%ROWTYPE;
BEGIN
 IF current_setting('role',true) IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Trusted service caller required' USING ERRCODE='PT403';END IF;
 SELECT * INTO g FROM public.native_embed_grants WHERE id=p_grant_id FOR UPDATE;IF NOT FOUND THEN RETURN 'denied';END IF;
 SELECT * INTO k FROM public.business_api_keys WHERE id=g.api_key_id FOR UPDATE;IF NOT FOUND OR jsonb_typeof(k.scopes) IS DISTINCT FROM 'array' THEN RETURN 'denied';END IF;
 PERFORM public.factory_native_embed_publication_v1(g.catalog_id,g.technical_version);
 RETURN public.factory_native_embed_debit_core_v1(p_grant_id,p_request_id,p_request_hash,p_result_hash);
EXCEPTION WHEN SQLSTATE 'PT404' THEN RETURN 'denied';
END $$;
REVOKE ALL ON FUNCTION public.consume_native_embed_v1(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION public.consume_native_embed_v1(uuid,uuid,text,text) TO service_role;
COMMIT;
