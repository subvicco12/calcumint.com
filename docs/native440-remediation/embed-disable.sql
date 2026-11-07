-- REVERSIBLE FEATURE DISABLE ONLY. Retains durable grants/attempts/audit, all quota objects and data.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_NATIVE_EMBED_DISABLE'; END $hold$;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $pre$ BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed operator and READ COMMITTED required'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.consume_native_embed_v1(uuid,uuid,text,text)'::regprocedure),'UTF8')),'hex')<>'33edec8eeba2e57626ce21537576e9ccffc8d4a4186aa70a827a629bcde55dcd' THEN RAISE EXCEPTION 'Embed function source drift'; END IF;
END $pre$;
-- Do not drop audit history or restore the unmetered application path.
-- Operators must first drain writers/transactions; privileges do not cancel in-flight calls.
REVOKE ALL ON FUNCTION public.consume_native_embed_v1(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated,service_role;
COMMIT;
