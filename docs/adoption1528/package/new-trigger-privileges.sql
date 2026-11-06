-- Review only. Preserve migration027's trigger-only function client-execution contract.
-- PostgreSQL target default function grants include anon/authenticated/service_role.
-- Revoke client EXECUTE only on the six newly introduced trigger-only functions.
BEGIN;
DO $unapplied$ BEGIN RAISE EXCEPTION 'UNAPPLIED_ADOPTION1528_TRIGGER_PRIVILEGES: review only'; END $unapplied$;
REVOKE EXECUTE ON FUNCTION public.enforce_calculator_publish_gate_final_row(), public.p0_publication_insert_guard(), public.p0_publication_qa_old_parent(), public.p0_publication_reviewer_delete(), public.p0_publication_reviewer_lock(), public.p0_publication_qa_parent_lock() FROM PUBLIC, anon, authenticated;
COMMIT;
