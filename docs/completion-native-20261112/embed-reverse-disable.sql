-- HELD rollback by disabling entry. Retains all grants, attempts, usage and quota evidence.
-- Drain writers first; revocation of privileges cannot cancel already running transactions.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_FACTORY_NINE_EMBED_DISABLE'; END $hold$;
SET LOCAL lock_timeout='3s';SET LOCAL statement_timeout='30s';
DO $pre$ BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' THEN RAISE EXCEPTION 'Reviewed postgres operator required';END IF;
 IF (SELECT encode(sha256(convert_to(prosrc,'UTF8')),'hex') FROM pg_proc WHERE oid='public.consume_native_embed_v1(uuid,uuid,text,text)'::regprocedure) IS DISTINCT FROM '5832656a9850f92d223825de8e230e508df8f773d089297d82b6d1a7f84a0fcb' THEN RAISE EXCEPTION 'Exact factory embed successor source required';END IF;
 IF (SELECT encode(sha256(convert_to(prosrc,'UTF8')),'hex') FROM pg_proc WHERE oid='public.factory_native_embed_publication_snapshot_v1(text,text,integer)'::regprocedure) IS DISTINCT FROM 'e845fefb606727fc4e78093e91195fae8757b1dc00844f61ba7ad253b80307de' THEN RAISE EXCEPTION 'Exact factory_native_embed_publication_snapshot_v1 source required';END IF;
 IF (SELECT encode(sha256(convert_to(prosrc,'UTF8')),'hex') FROM pg_proc WHERE oid='public.factory_native_embed_publication_v1(integer,integer)'::regprocedure) IS DISTINCT FROM 'a19778a745d36e83b26746eb10200060fa2dbcc016c171f847ee7c323bf64da7' THEN RAISE EXCEPTION 'Exact factory_native_embed_publication_v1 source required';END IF;
END $pre$;
REVOKE ALL ON FUNCTION public.consume_native_embed_v1(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated,service_role;
COMMIT;
