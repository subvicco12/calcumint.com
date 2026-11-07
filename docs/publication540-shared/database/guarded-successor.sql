-- NONPRODUCTION proposal. No adoption, certification or publication authority.
BEGIN;
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_PUBLICATION540_DATABASE'; END $hold$;
CREATE FUNCTION public.publish_calculator_batch_with_audit_v1(p_items jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,public AS $$
DECLARE item jsonb; row_data jsonb; sources jsonb; qa jsonb; n integer;
BEGIN
 IF current_user <> 'authenticated' OR auth.uid() IS NULL OR auth.role() IS DISTINCT FROM 'authenticated' THEN RAISE EXCEPTION 'Authenticated owner/admin required'; END IF;
 IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'READ COMMITTED required'; END IF;
 -- Explicit technical resource bound; conveys no product entitlement or policy.
 IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Array required'; END IF;
 n:=jsonb_array_length(p_items);
 IF n<1 OR n>100 THEN RAISE EXCEPTION 'Technical batch bound 1..100'; END IF;
 IF EXISTS(SELECT FROM jsonb_array_elements(p_items) x WHERE jsonb_typeof(x) IS DISTINCT FROM 'object' OR NOT x ?& ARRAY['id','calculator_key','slug','version','expected_catalog','expected_metadata','expected_sources','expected_qa'] OR jsonb_typeof(x->'expected_catalog') IS DISTINCT FROM 'object' OR jsonb_typeof(x->'expected_metadata') IS DISTINCT FROM 'object' OR jsonb_typeof(x->'expected_sources') IS DISTINCT FROM 'array' OR jsonb_typeof(x->'expected_qa') IS DISTINCT FROM 'array' OR x->>'id' IS NULL OR x->>'calculator_key' IS NULL OR x->>'slug' IS NULL OR x->>'version' IS NULL) THEN RAISE EXCEPTION 'Incomplete immutable binding'; END IF;
 IF EXISTS(SELECT FROM jsonb_array_elements(p_items) x WHERE (SELECT count(*) FROM jsonb_object_keys(x))<>8 OR jsonb_typeof(x->'id') IS DISTINCT FROM 'string' OR jsonb_typeof(x->'calculator_key') IS DISTINCT FROM 'string' OR jsonb_typeof(x->'slug') IS DISTINCT FROM 'string' OR jsonb_typeof(x->'version') IS DISTINCT FROM 'number' OR (x->>'version') !~ '^[1-9][0-9]*$' OR EXISTS(SELECT FROM jsonb_array_elements(x->'expected_sources') e WHERE jsonb_typeof(e) IS DISTINCT FROM 'object') OR EXISTS(SELECT FROM jsonb_array_elements(x->'expected_qa') e WHERE jsonb_typeof(e) IS DISTINCT FROM 'object')) THEN RAISE EXCEPTION 'Strict immutable item schema required'; END IF;
 IF (SELECT count(DISTINCT (x->>'id')::uuid) FROM jsonb_array_elements(p_items) x)<>n OR (SELECT count(DISTINCT x->>'calculator_key') FROM jsonb_array_elements(p_items) x)<>n OR (SELECT count(DISTINCT x->>'slug') FROM jsonb_array_elements(p_items) x)<>n THEN RAISE EXCEPTION 'Duplicate batch identity'; END IF;
 -- Same global order for every caller, before parent locks. Blocks evidence and
 -- reviewer authority writers; no new RLS bypass, policy, or grants on tables.
 LOCK TABLE public.calculator_qa_checks,public.calculator_source_evidence,public.platform_admins IN SHARE ROW EXCLUSIVE MODE;
 IF NOT EXISTS(SELECT FROM public.platform_admins WHERE user_id=auth.uid() AND active AND role IN ('owner','admin')) THEN RAISE EXCEPTION 'Active owner/admin required'; END IF;
 PERFORM c.id FROM public.calculator_catalog_admin c WHERE c.id IN(SELECT (x->>'id')::uuid FROM jsonb_array_elements(p_items) x) ORDER BY c.id FOR UPDATE;
 FOR item IN SELECT x FROM jsonb_array_elements(p_items) x ORDER BY (x->>'id')::uuid LOOP
  SELECT to_jsonb(c) INTO row_data FROM public.calculator_catalog_admin c WHERE id=(item->>'id')::uuid;
  SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY s.id),'[]'::jsonb) INTO sources FROM public.calculator_source_evidence s WHERE calculator_id=(item->>'id')::uuid;
  SELECT coalesce(jsonb_agg(to_jsonb(q) ORDER BY q.id),'[]'::jsonb) INTO qa FROM public.calculator_qa_checks q WHERE calculator_id=(item->>'id')::uuid;
  IF row_data IS NULL OR row_data IS DISTINCT FROM item->'expected_catalog' OR row_data->>'lifecycle' IS DISTINCT FROM 'certified' OR row_data->>'calculator_key' IS DISTINCT FROM item->>'calculator_key' OR row_data->>'slug' IS DISTINCT FROM item->>'slug' OR (row_data->>'version')::integer IS DISTINCT FROM (item->>'version')::integer OR row_data->'metadata' IS DISTINCT FROM item->'expected_metadata' OR sources IS DISTINCT FROM item->'expected_sources' OR qa IS DISTINCT FROM item->'expected_qa' THEN RAISE EXCEPTION 'Immutable publication binding mismatch'; END IF;
 END LOOP;
 -- No exception swallowing: every transition and its audit share one statement.
 FOR item IN SELECT x FROM jsonb_array_elements(p_items) x ORDER BY (x->>'id')::uuid LOOP
  PERFORM public.transition_calculator_with_audit((item->>'id')::uuid,'certified','published');
 END LOOP;
 RETURN n;
END $$;
REVOKE ALL ON FUNCTION public.publish_calculator_batch_with_audit_v1(jsonb) FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION public.publish_calculator_batch_with_audit_v1(jsonb) TO authenticated;
COMMIT;
