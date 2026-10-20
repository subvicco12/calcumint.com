-- REVIEW PROPOSAL ONLY. Not a migration; never apply to a deployed database.
-- The disposable test removes ONLY this guard. Production ownership, function
-- owners, RLS bypass, platform grants, and authoritative billing writer identities
-- must be audited before an independently reviewed deployment migration exists.
BEGIN;
DO $proposal_guard$ BEGIN
 RAISE EXCEPTION 'UNAPPLIED_ATOMIC_ACCOUNT_HISTORY_PROPOSAL';
END $proposal_guard$;
-- p_expected_owner_id is an equality precondition only, never an ownership selector.
-- Existing policies remain authoritative for reads, deletes, project binding.
-- Definer owner must be a trusted migration role with table access/BYPASSRLS;
-- authenticated/anon must NEVER own these functions or have CREATE in public.
CREATE FUNCTION public.atomic_snapshot_valid(slug text, version integer, inputs jsonb, outputs jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path=pg_catalog AS $$
 SELECT coalesce(char_length(slug) BETWEEN 1 AND 160 AND btrim(slug)<>''
 AND version>0 AND jsonb_typeof(inputs)='object' AND jsonb_typeof(outputs)='object'
 AND NOT jsonb_path_exists(inputs, '$.** ? (@.type() == "number" && (@ > 1.7976931348623157e308 || @ < -1.7976931348623157e308))')
 AND NOT jsonb_path_exists(outputs, '$.** ? (@.type() == "number" && (@ > 1.7976931348623157e308 || @ < -1.7976931348623157e308))'),false)
$$;

CREATE FUNCTION public.atomic_account_plan(owner_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE account_plan text;
BEGIN
 IF auth.uid() IS NULL OR owner_id IS DISTINCT FROM auth.uid() THEN
  RAISE EXCEPTION USING ERRCODE='42501', MESSAGE='HISTORY_WRITE_REJECTED';
 END IF;
 SELECT plan INTO account_plan FROM public.profiles WHERE id=owner_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'HISTORY_WRITE_REJECTED'; END IF;
 -- A real row version change makes stale REPEATABLE READ/SERIALIZABLE writers
 -- abort instead of counting an old snapshot after waiting for the profile lock.
 -- All billing downgrades update this same row and therefore share this lock.
 UPDATE public.profiles SET id=id WHERE id=owner_id;
 RETURN account_plan;
END $$;

CREATE FUNCTION public.guard_atomic_history()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE account_plan text; prior public.calculation_history%ROWTYPE;
BEGIN
 IF TG_OP='UPDATE' THEN
  RAISE EXCEPTION 'HISTORY_SNAPSHOT_IMMUTABLE';
 END IF;
 account_plan:=public.atomic_account_plan(NEW.user_id);
 IF NOT public.atomic_snapshot_valid(NEW.calculator_slug,NEW.calculator_version,NEW.input_data,NEW.output_data) THEN
  RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_HISTORY_SNAPSHOT';
 END IF;
 SELECT * INTO prior FROM public.calculation_history WHERE id=NEW.id;
 IF FOUND THEN
  IF prior.user_id<>NEW.user_id THEN RAISE EXCEPTION 'HISTORY_WRITE_REJECTED'; END IF;
  IF ROW(prior.calculator_slug,prior.calculator_version,prior.input_data,prior.output_data)
    IS DISTINCT FROM ROW(NEW.calculator_slug,NEW.calculator_version,NEW.input_data,NEW.output_data) THEN
   RAISE EXCEPTION 'HISTORY_REQUEST_CONFLICT';
  END IF;
  RETURN NULL; -- Legacy exact UUID retries consume no quota and insert no row.
 END IF;
 IF account_plan='free' AND (SELECT count(*) FROM public.calculation_history WHERE user_id=NEW.user_id)>=20 THEN
  RAISE EXCEPTION 'HISTORY_QUOTA_EXCEEDED';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER atomic_history_guard BEFORE INSERT OR UPDATE ON public.calculation_history
FOR EACH ROW EXECUTE FUNCTION public.guard_atomic_history();

CREATE FUNCTION public.save_calculation_history_atomic(p_request_id uuid,p_calculator_slug text,p_calculator_version integer,p_input_data jsonb,p_output_data jsonb,p_expected_owner_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE owner_id uuid:=auth.uid(); prior public.calculation_history%ROWTYPE;
BEGIN
 IF owner_id IS NULL OR owner_id IS DISTINCT FROM p_expected_owner_id THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='HISTORY_WRITE_REJECTED'; END IF;
 PERFORM public.atomic_account_plan(owner_id);
 IF p_request_id IS NULL OR NOT public.atomic_snapshot_valid(p_calculator_slug,p_calculator_version,p_input_data,p_output_data) THEN
  RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_HISTORY_SNAPSHOT';
 END IF;
 SELECT * INTO prior FROM public.calculation_history WHERE id=p_request_id;
 IF FOUND THEN
  IF prior.user_id<>owner_id THEN RAISE EXCEPTION 'HISTORY_WRITE_REJECTED'; END IF;
  IF ROW(prior.calculator_slug,prior.calculator_version,prior.input_data,prior.output_data)
    IS DISTINCT FROM ROW(p_calculator_slug,p_calculator_version,p_input_data,p_output_data) THEN
   RAISE EXCEPTION 'HISTORY_REQUEST_CONFLICT';
  END IF;
  RETURN prior.id;
 END IF;
 BEGIN
  INSERT INTO public.calculation_history(id,user_id,calculator_slug,calculator_version,input_data,output_data)
  VALUES(p_request_id,owner_id,p_calculator_slug,p_calculator_version,p_input_data,p_output_data);
 EXCEPTION WHEN unique_violation THEN
  -- A different owner's concurrent UUID winner must not expose constraint/detail.
  RAISE EXCEPTION 'HISTORY_WRITE_REJECTED';
 END;
 RETURN p_request_id;
END $$;

CREATE FUNCTION public.guard_atomic_workspace()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE account_plan text;
BEGIN
 account_plan:=public.atomic_account_plan(NEW.user_id);
 IF account_plan NOT IN ('pro','business') THEN RAISE EXCEPTION 'SCENARIO_PLAN_REQUIRED'; END IF;
 IF TG_OP='UPDATE' THEN
  IF TG_TABLE_NAME='saved_scenarios' THEN
   IF (to_jsonb(NEW)-'name'-'updated_at') IS DISTINCT FROM (to_jsonb(OLD)-'name'-'updated_at') THEN
    RAISE EXCEPTION 'SCENARIO_SNAPSHOT_IMMUTABLE';
   END IF;
  ELSIF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.id IS DISTINCT FROM OLD.id THEN
   RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED';
  END IF;
 END IF;
 IF TG_TABLE_NAME='saved_scenarios' THEN
  IF NOT public.atomic_snapshot_valid(NEW.calculator_slug,NEW.calculator_version,NEW.input_data,NEW.output_data) THEN
   RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_HISTORY_SNAPSHOT';
  END IF;
  -- Also enforce binding for definer RPC writes, which bypass existing RLS.
  IF NEW.project_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.calculation_projects WHERE id=NEW.project_id AND user_id=NEW.user_id) THEN
   RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED';
  END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER atomic_scenario_guard BEFORE INSERT OR UPDATE ON public.saved_scenarios
FOR EACH ROW EXECUTE FUNCTION public.guard_atomic_workspace();
CREATE TRIGGER atomic_project_guard BEFORE INSERT OR UPDATE ON public.calculation_projects
FOR EACH ROW EXECUTE FUNCTION public.guard_atomic_workspace();

CREATE FUNCTION public.save_project_scenario_atomic(p_request_id uuid,p_project_id uuid,p_history_id uuid,p_name text,p_expected_owner_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE owner_id uuid:=auth.uid(); source public.calculation_history%ROWTYPE; prior public.saved_scenarios%ROWTYPE;
BEGIN
 IF owner_id IS NULL OR owner_id IS DISTINCT FROM p_expected_owner_id THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='SCENARIO_WRITE_REJECTED'; END IF;
 IF public.atomic_account_plan(owner_id) NOT IN ('pro','business') THEN RAISE EXCEPTION 'SCENARIO_PLAN_REQUIRED'; END IF;
 IF p_request_id IS NULL OR p_history_id IS NULL OR p_name IS NULL OR char_length(btrim(p_name)) NOT BETWEEN 1 AND 120 THEN
  RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED';
 END IF;
 SELECT * INTO source FROM public.calculation_history WHERE id=p_history_id AND user_id=owner_id FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED'; END IF;
 IF p_project_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.calculation_projects WHERE id=p_project_id AND user_id=owner_id) THEN
  RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED';
 END IF;
 SELECT * INTO prior FROM public.saved_scenarios WHERE id=p_request_id;
 IF FOUND THEN
  IF prior.user_id<>owner_id THEN RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED'; END IF;
  IF ROW(prior.project_id,prior.name,prior.calculator_slug,prior.calculator_version,prior.input_data,prior.output_data)
   IS DISTINCT FROM ROW(p_project_id,p_name,source.calculator_slug,source.calculator_version,source.input_data,source.output_data) THEN
   RAISE EXCEPTION 'SCENARIO_REQUEST_CONFLICT';
  END IF;
  RETURN prior.id;
 END IF;
 BEGIN
  INSERT INTO public.saved_scenarios(id,user_id,project_id,name,calculator_slug,calculator_version,input_data,output_data)
  VALUES(p_request_id,owner_id,p_project_id,p_name,source.calculator_slug,source.calculator_version,source.input_data,source.output_data);
 EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'SCENARIO_WRITE_REJECTED'; END;
 RETURN p_request_id;
END $$;

-- Do not broaden table privileges or replace RLS. Only authenticated RPC calls.
REVOKE ALL ON FUNCTION public.atomic_snapshot_valid(text,integer,jsonb,jsonb), public.atomic_account_plan(uuid), public.guard_atomic_history(), public.guard_atomic_workspace(), public.save_calculation_history_atomic(uuid,text,integer,jsonb,jsonb,uuid), public.save_project_scenario_atomic(uuid,uuid,uuid,text,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_calculation_history_atomic(uuid,text,integer,jsonb,jsonb,uuid), public.save_project_scenario_atomic(uuid,uuid,uuid,text,uuid) TO authenticated;
CREATE INDEX calculation_history_user_created_id_idx ON public.calculation_history(user_id,created_at DESC,id DESC);
COMMIT;
-- No formula validation, new billing mechanism, numeric paid quota, or global
-- exactly-once guarantee is implied. Deleting a request row removes replay memory.
-- History cursor order: created_at DESC,id DESC; next page tuple strictly less
-- than the last observed tuple, owner filtered, bounded limit. Concurrent deletes
-- may shrink pages and new inserts appear on refresh, not a frozen snapshot.
