-- Scope: shared technology namespace, all originalfive + approvedeight. Native440 untouched.
-- Per-ID publication withdrawal is the separate scoped availability control.
-- HELD SOURCE-BOUND JOB/EMBED DISABLE. Not a whole-platform/API publication change.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_NEXT_COHORT_NATIVE_DISABLE'; END $hold$;
SET LOCAL lock_timeout='3s';SET LOCAL statement_timeout='30s';
DO $pre$ BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed operator and READ COMMITTED required';END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid)'::regprocedure),'UTF8')),'hex')<>'dc0c9bd3e4dace38d855bc5cfc6b064bd0656e6b246e51cd0557b361f13f85bc' THEN RAISE EXCEPTION 'Exact native delivery predecessor required';END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.claim_technology_five_webhook_v1(uuid)'::regprocedure),'UTF8')),'hex')<>'d0dc9e30ba1b9c6a9025fb636f317d0a8a6164e27765af014c72dad2437af127' THEN RAISE EXCEPTION 'Exact native delivery predecessor required';END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.consume_technology_five_embed_v1(uuid,uuid,text,text)'::regprocedure),'UTF8')),'hex')<>'d500274dc55b8a040bc96916bad7044f48f4da5098740719108a4b3340dea19f' THEN RAISE EXCEPTION 'Exact native delivery predecessor required';END IF;
END $pre$;
LOCK TABLE public.technology_five_embed_grants,public.technology_five_webhook_outbox,public.technology_five_webhook_attempts IN SHARE ROW EXCLUSIVE MODE;
REVOKE INSERT ON public.technology_five_embed_grants FROM service_role;
REVOKE ALL ON FUNCTION public.read_technology_five_job_v1(uuid,text,uuid,uuid),public.submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid),public.check_technology_five_dispatch_v1(uuid,uuid),public.claim_technology_five_webhook_v1(uuid),public.finish_technology_five_webhook_v1(uuid,uuid,boolean,integer,text),public.consume_technology_five_embed_v1(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated,service_role;
UPDATE public.technology_five_embed_grants SET revoked_at=coalesce(revoked_at,clock_timestamp());
UPDATE public.technology_five_webhook_attempts SET outcome='failed',finished_at=clock_timestamp(),error='Disabled by reviewed operator' WHERE outcome='leased';
UPDATE public.technology_five_webhook_outbox SET status='cancelled',lease_token=NULL,lease_until=NULL,last_error='Disabled by reviewed operator' WHERE status IN('queued','failed','leased');
-- No job, event, input/output, grant identity or audit row is deleted.
COMMIT;
