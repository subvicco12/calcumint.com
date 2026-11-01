-- Nonproduction review proposal. No authorization to install on hosted database.
BEGIN;
DO $unapplied$ BEGIN RAISE EXCEPTION 'UNAPPLIED_PUBLICATION_CLOSURE: review only'; END $unapplied$;
DO $precondition$ BEGIN
 IF current_setting('server_version_num')::integer / 10000 <> 17 THEN RAISE EXCEPTION 'PostgreSQL17 required'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.enforce_calculator_publish_gate()'::regprocedure),'UTF8')),'hex') IS DISTINCT FROM 'a34469bd029214c7bae7d180174a02716dc072d7f7e40d40f98a24ef43958329' THEN RAISE EXCEPTION 'Lifecycle source hash mismatch'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.validate_calculator_publish_gate(uuid)'::regprocedure),'UTF8')),'hex') IS DISTINCT FROM 'ce53551431824e8560af44a235ebb312372e0c67641c196f3d8db1287c05709a' THEN RAISE EXCEPTION 'Predicate source hash mismatch'; END IF;
 IF NOT EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculator_catalog_admin'::regclass AND tgname='calculator_publish_gate_before_update' AND NOT tgisinternal AND tgenabled='O' AND pg_get_triggerdef(oid)='CREATE TRIGGER calculator_publish_gate_before_update BEFORE UPDATE ON public.calculator_catalog_admin FOR EACH ROW EXECUTE FUNCTION enforce_calculator_publish_gate()') THEN RAISE EXCEPTION 'Lifecycle trigger mismatch'; END IF;
 IF to_regprocedure('public.enforce_calculator_publish_gate_final_row()') IS NOT NULL OR EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculator_catalog_admin'::regclass AND tgname='calculator_publish_gate_final_row') THEN RAISE EXCEPTION 'Successor object already exists'; END IF;
END $precondition$;
CREATE FUNCTION public.enforce_calculator_publish_gate_final_row() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE v_lifecycle text; v_ok boolean; v_failures text[];
BEGIN
 SELECT lifecycle INTO v_lifecycle FROM public.calculator_catalog_admin WHERE id=NEW.id;
 IF v_lifecycle IN ('certified','published') THEN
  SELECT ok,failures INTO v_ok,v_failures FROM public.validate_calculator_publish_gate(NEW.id);
  IF v_ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'Final row publishing gate failed: %',array_to_string(v_failures,'; '); END IF;
 END IF;
 RETURN NULL;
END;
$function$;
REVOKE ALL ON FUNCTION public.enforce_calculator_publish_gate_final_row() FROM PUBLIC;
CREATE CONSTRAINT TRIGGER calculator_publish_gate_final_row AFTER UPDATE ON public.calculator_catalog_admin DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE FUNCTION public.enforce_calculator_publish_gate_final_row();
COMMIT;
