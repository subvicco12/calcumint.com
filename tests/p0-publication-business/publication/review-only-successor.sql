-- NONPRODUCTION REVIEW ONLY. Preserves captured and prior proposal SQL.
BEGIN;
DO $unapplied$ BEGIN RAISE EXCEPTION 'UNAPPLIED_P0_PUBLICATION: review only'; END $unapplied$;
DO $precondition$ BEGIN
 IF current_setting('server_version_num')::integer / 10000 <> 17 THEN RAISE EXCEPTION 'PostgreSQL17 required'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.enforce_calculator_publish_gate()'::regprocedure),'UTF8')),'hex') <> 'a34469bd029214c7bae7d180174a02716dc072d7f7e40d40f98a24ef43958329' THEN RAISE EXCEPTION 'Lifecycle source mismatch'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.validate_calculator_publish_gate(uuid)'::regprocedure),'UTF8')),'hex') <> 'ce53551431824e8560af44a235ebb312372e0c67641c196f3d8db1287c05709a' THEN RAISE EXCEPTION 'Predicate source mismatch'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.enforce_calculator_publish_gate_final_row()'::regprocedure),'UTF8')),'hex') <> '3d456f8b31a3fd4f9586569beab9ce1e5bafbfc1cc67e28b56eaa39bbb7c3751' THEN RAISE EXCEPTION 'Prior final-row source mismatch'; END IF;
 IF to_regprocedure('public.p0_publication_insert_guard()') IS NOT NULL OR to_regprocedure('public.p0_publication_qa_old_parent()') IS NOT NULL OR to_regprocedure('public.p0_publication_reviewer_delete()') IS NOT NULL OR to_regprocedure('public.p0_publication_reviewer_lock()') IS NOT NULL OR to_regprocedure('public.p0_publication_qa_parent_lock()') IS NOT NULL THEN RAISE EXCEPTION 'Successor already exists'; END IF;
 IF EXISTS(SELECT FROM pg_trigger WHERE tgname IN ('p0_publication_insert_guard','p0_publication_qa_old_parent','p0_publication_reviewer_delete','p0_publication_reviewer_lock','p0_publication_qa_parent_lock')) THEN RAISE EXCEPTION 'Successor trigger already exists'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.enforce_qa_evidence_certification()'::regprocedure),'UTF8')),'hex') <> 'f81afb4f7e3f13417dfd75e480cd0b32c283da7ba5696c911ec30fd0f05d8642' THEN RAISE EXCEPTION 'Dependency source mismatch'; END IF;
 IF encode(sha256(convert_to(pg_get_functiondef('public.protect_active_ymyl_reviewer_authority()'::regprocedure),'UTF8')),'hex') <> '38f168b3648c9bca78e976989c1155a62fe7feafbc4a8125f9e35e9596b8ab50' THEN RAISE EXCEPTION 'Dependency source mismatch'; END IF;
 IF NOT EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculator_catalog_admin'::regclass AND tgname='calculator_publish_gate_final_row' AND NOT tgisinternal AND tgenabled='O' AND tgdeferrable AND NOT tginitdeferred AND pg_get_triggerdef(oid)='CREATE CONSTRAINT TRIGGER calculator_publish_gate_final_row AFTER UPDATE ON public.calculator_catalog_admin DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE FUNCTION enforce_calculator_publish_gate_final_row()') THEN RAISE EXCEPTION 'Prior final-row trigger mismatch'; END IF;
 IF NOT EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculator_qa_checks'::regclass AND tgname='calculator_qa_certification_after_write' AND tgfoid='public.enforce_qa_evidence_certification()'::regprocedure AND tgenabled='O' AND tgtype=29 AND tgdeferrable AND tginitdeferred AND NOT tgisinternal) THEN RAISE EXCEPTION 'QA certification trigger mismatch'; END IF;
END $precondition$;
CREATE FUNCTION public.p0_publication_insert_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN IF NEW.lifecycle <> 'draft' THEN RAISE EXCEPTION 'Initial lifecycle must be draft'; END IF; RETURN NEW; END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_insert_guard() FROM PUBLIC;
CREATE TRIGGER p0_publication_insert_guard BEFORE INSERT ON public.calculator_catalog_admin FOR EACH ROW EXECUTE FUNCTION public.p0_publication_insert_guard();
CREATE FUNCTION public.p0_publication_qa_old_parent() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_ok boolean; v_failures text[];
BEGIN
 IF OLD.calculator_id IS DISTINCT FROM NEW.calculator_id AND EXISTS(SELECT FROM public.calculator_catalog_admin WHERE id=OLD.calculator_id AND lifecycle IN ('certified','published')) THEN
 SELECT ok,failures INTO v_ok,v_failures FROM public.validate_calculator_publish_gate(OLD.calculator_id);
 IF v_ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'Old parent publishing gate failed: %',array_to_string(v_failures,'; '); END IF;
 END IF;
 RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_qa_old_parent() FROM PUBLIC;
CREATE CONSTRAINT TRIGGER p0_publication_qa_old_parent AFTER UPDATE ON public.calculator_qa_checks DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION public.p0_publication_qa_old_parent();
CREATE FUNCTION public.p0_publication_reviewer_delete() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'Reviewer authority mutation requires READ COMMITTED'; END IF;
 IF (TG_OP='DELETE' OR NEW.user_id IS DISTINCT FROM OLD.user_id OR NOT NEW.active OR NEW.role NOT IN ('owner','admin','reviewer')) AND EXISTS(SELECT FROM public.calculator_catalog_admin WHERE reviewer_id=OLD.user_id AND risk_class IN ('financial','health','tax') AND lifecycle IN ('certified','published')) THEN RAISE EXCEPTION 'Reassign or decertify governed YMYL calculators before deleting reviewer authority'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_reviewer_delete() FROM PUBLIC;
CREATE TRIGGER p0_publication_reviewer_delete BEFORE DELETE OR UPDATE OF active, role, user_id ON public.platform_admins FOR EACH ROW EXECUTE FUNCTION public.p0_publication_reviewer_delete();
-- READ COMMITTED is required so the post-lock predicate observes a committed
-- reviewer deletion/demotion that finished while this statement was waiting.
CREATE FUNCTION public.p0_publication_reviewer_lock() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_calc public.calculator_catalog_admin%rowtype; v_ok boolean; v_failures text[];
BEGIN
 SELECT * INTO v_calc FROM public.calculator_catalog_admin WHERE id=NEW.id;
 IF v_calc.lifecycle IN ('certified','published') THEN
  IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'Final publication validation requires READ COMMITTED'; END IF;
  IF v_calc.risk_class IN ('financial','health','tax') THEN PERFORM 1 FROM public.platform_admins WHERE user_id=v_calc.reviewer_id FOR SHARE; END IF;
  SELECT ok,failures INTO v_ok,v_failures FROM public.validate_calculator_publish_gate(v_calc.id);
  IF v_ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'Locked reviewer publishing gate failed: %',array_to_string(v_failures,'; '); END IF;
 END IF;
 RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_reviewer_lock() FROM PUBLIC;
CREATE CONSTRAINT TRIGGER p0_publication_reviewer_lock AFTER UPDATE ON public.calculator_catalog_admin DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE FUNCTION public.p0_publication_reviewer_lock();
-- Coordinate required QA mutation with lifecycle/risk/reviewer catalog UPDATE.
-- Stable parent order includes OLD and NEW identities for a reparenting write.
CREATE FUNCTION public.p0_publication_qa_parent_lock() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE v_parents uuid[];
BEGIN
 IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'QA parent coordination requires READ COMMITTED'; END IF;
 IF TG_OP='INSERT' THEN v_parents:=ARRAY[NEW.calculator_id];
 ELSIF TG_OP='DELETE' THEN v_parents:=ARRAY[OLD.calculator_id];
 ELSE v_parents:=ARRAY[OLD.calculator_id,NEW.calculator_id]; END IF;
 PERFORM c.id FROM public.calculator_catalog_admin c WHERE c.id=ANY(v_parents) ORDER BY c.id FOR SHARE;
 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.p0_publication_qa_parent_lock() FROM PUBLIC;
CREATE TRIGGER p0_publication_qa_parent_lock BEFORE INSERT OR UPDATE OR DELETE ON public.calculator_qa_checks FOR EACH ROW EXECUTE FUNCTION public.p0_publication_qa_parent_lock();
COMMIT;
