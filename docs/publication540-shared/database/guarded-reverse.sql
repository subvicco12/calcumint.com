BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_PUBLICATION540_DATABASE_REVERSE'; END $hold$;
-- Technical removal only: retains all catalog, QA, source and audit rows.
DROP FUNCTION public.publish_calculator_batch_with_audit_v1(jsonb);
COMMIT;
