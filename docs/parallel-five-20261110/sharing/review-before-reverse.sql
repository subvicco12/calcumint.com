-- HELD REVERSE ONLY. Restores exact private-1 sharing definitions only when no new-five records exist.
-- No active migration, production activation, mathematical upgrade or publication authority.
-- Trusted application verifies exact registered snapshots before the service-only invoker RPC.
BEGIN;
SET LOCAL lock_timeout='3s';SET LOCAL statement_timeout='30s';
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_TECHNOLOGY_NEXT_SHARING_REVERSE_2'; END $hold$;
LOCK TABLE public.technology_next_shared_snapshots IN SHARE ROW EXCLUSIVE MODE;
DO $pre$ DECLARE expected record; BEGIN
 IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed operator and READ COMMITTED required';END IF;
 FOR expected IN SELECT * FROM(VALUES
 ('public.technology_next_sharing_capability(uuid)','cc39bebfc898199aeb19c018bc29327d1a012dc18fb81614da3906093b5c5925'),
 ('public.technology_next_shared_immutable()','b4ab3327e7aab84127c562ff6bd7763308e229c24c4142ebc041f7e193443f18'),
 ('public.share_technology_next_snapshot(uuid,jsonb)','1ea9bd69d6ca7f0c04f51b1122846bfff04263056f4c5638f188acb70ebea2af')
 )v(signature,sha256) LOOP
  IF to_regprocedure(expected.signature) IS NULL OR encode(sha256(convert_to(pg_get_functiondef(to_regprocedure(expected.signature)),'UTF8')),'hex') IS DISTINCT FROM expected.sha256 THEN RAISE EXCEPTION 'Exact sharing predecessor source differs: %',expected.signature;END IF;
 END LOOP;
 FOR expected IN SELECT * FROM(VALUES
 ('technology_next_identity','7142fe4f9bbf30a88fc53abb3c805cb936a9b9682d8f1c9f89050813451fbb15'),
 ('technology_next_shared_snapsh_client_workspace_id_organiza_fkey','8d08007fc45dbb5c4c24490572ad4a731198a95c5b9e18fba0a41ee22bbc53d5'),
 ('technology_next_shared_snapsh_organization_id_created_by_re_key','2bd62a375e9346ee8dd58655bf7527be55627b59fd50b10bac266e40fd1343b4'),
 ('technology_next_shared_snapshot_project_id_organization_id_fkey','5d7196983f7f3291f902a88906fee813460006323339413b2b518fce44d986cb'),
 ('technology_next_shared_snapshots_calculator_slug_check','d0a65c22dd6b9dac4c9c8894371fe1aa708970621cf5a8445972d2386f7ecc38'),
 ('technology_next_shared_snapshots_created_by_fkey','449c33b77cecbf758650c7bd90a4155b8c1a300e5d186bc47d2743bc85fa9b8f'),
 ('technology_next_shared_snapshots_input_data_check','9a46309ef6f31ac3376ec060f4948677a15e1b2d54e25d92ff0866e622d6cbc0'),
 ('technology_next_shared_snapshots_organization_id_fkey','2f9addcdd9d1e069954a53471202703fa2d13fd2931d316c9fa9d708ce1cfa10'),
 ('technology_next_shared_snapshots_output_data_check','bb1e357ef76c12b4d88d7c07a3308ca2378389a81f51d7ecc89a0dbcd07f3865'),
 ('technology_next_shared_snapshots_pkey','8c8464f42472e42ee190fc91ca8db79b5351d3a4609040516578d229c56f6fa5'),
 ('technology_next_shared_snapshots_request_payload_check','8916617c7b9ef1b7c428447303e423afaddc98347927e5f06c9084ba7110319b'),
 ('technology_next_shared_snapshots_title_check','dc065b5e20eb4d212aaaba88c0a05f660659b0c414db4f20205886c336417450')
 )v(name,sha256) LOOP
  IF (SELECT encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex') FROM pg_constraint WHERE conrelid='public.technology_next_shared_snapshots'::regclass AND conname=expected.name) IS DISTINCT FROM expected.sha256 THEN RAISE EXCEPTION 'Exact sharing predecessor constraint differs: %',expected.name;END IF;
 END LOOP;
 IF (SELECT count(*) FROM pg_policies WHERE schemaname='public' AND tablename='technology_next_shared_snapshots')<>1
 OR NOT EXISTS(SELECT FROM pg_policies WHERE schemaname='public' AND tablename='technology_next_shared_snapshots' AND policyname='technology_next_shared_member_read' AND permissive='PERMISSIVE' AND roles=ARRAY['authenticated']::name[] AND cmd='SELECT' AND qual=$qual$(technology_next_sharing_capability(organization_id) = 'technology-next-sharing-private-2'::text)$qual$ AND with_check IS NULL)
 OR NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.technology_next_shared_snapshots'::regclass)
 OR has_table_privilege('authenticated','public.technology_next_shared_snapshots','INSERT,UPDATE,DELETE')
 OR NOT has_table_privilege('authenticated','public.technology_next_shared_snapshots','SELECT')
 OR has_table_privilege('anon','public.technology_next_shared_snapshots','SELECT,INSERT,UPDATE,DELETE')
 OR NOT has_table_privilege('service_role','public.technology_next_shared_snapshots','SELECT,INSERT')
 OR has_table_privilege('service_role','public.technology_next_shared_snapshots','UPDATE,DELETE')
 OR has_function_privilege('authenticated','public.share_technology_next_snapshot(uuid,jsonb)','EXECUTE')
 OR has_function_privilege('anon','public.share_technology_next_snapshot(uuid,jsonb)','EXECUTE')
 OR NOT has_function_privilege('service_role','public.share_technology_next_snapshot(uuid,jsonb)','EXECUTE')
 THEN RAISE EXCEPTION 'Exact sharing predecessor RLS/ACL differs';END IF;
END $pre$;
DO $rows$ BEGIN IF EXISTS(SELECT FROM public.technology_next_shared_snapshots WHERE calculator_slug IN('cidr-calculator','raid-capacity-calculator','battery-runtime-calculator','ups-runtime-calculator','password-entropy-calculator')) THEN RAISE EXCEPTION 'Reverse refused: new-five shared snapshots exist; no data is deleted';END IF;END $rows$;
ALTER TABLE public.technology_next_shared_snapshots DROP CONSTRAINT technology_next_shared_snapshots_calculator_slug_check;
ALTER TABLE public.technology_next_shared_snapshots ADD CONSTRAINT technology_next_shared_snapshots_calculator_slug_check CHECK(calculator_slug IN('storage-conversion-calculator','aspect-ratio-calculator','resolution-calculator','dpi-calculator','power-supply-calculator','website-bandwidth-calculator','cloud-storage-cost-calculator','cloud-data-transfer-cost-calculator'));
CREATE OR REPLACE FUNCTION public.technology_next_sharing_capability(target_org uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
 SELECT CASE WHEN auth.uid() IS NOT NULL AND EXISTS(
  SELECT 1 FROM public.organization_members m JOIN public.organizations o ON o.id=m.organization_id
  JOIN public.profiles owner_plan ON owner_plan.id=o.owner_user_id
  JOIN public.profiles actor_plan ON actor_plan.id=m.user_id
  WHERE m.organization_id=target_org AND m.user_id=auth.uid()
  AND m.role IN('owner','admin','manager','member','viewer') AND owner_plan.plan='business' AND actor_plan.plan='business'
 ) THEN 'technology-next-sharing-private-1' ELSE NULL END;
$function$
;
CREATE OR REPLACE FUNCTION public.share_technology_next_snapshot(actor_id uuid, request_payload jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE org uuid; project uuid; client uuid; req uuid; item jsonb; existing public.technology_next_shared_snapshots%rowtype; result uuid; role_name text;
BEGIN
 IF current_user<>'service_role' THEN RAISE EXCEPTION 'Server verified sharing required'; END IF;
 IF jsonb_typeof(request_payload) IS DISTINCT FROM 'object' OR octet_length(request_payload::text)>65536
 OR (SELECT count(*) FROM jsonb_object_keys(request_payload))<>6
 OR NOT request_payload ?& ARRAY['organizationId','projectId','clientWorkspaceId','requestId','title','snapshot'] THEN RAISE EXCEPTION 'Invalid sharing request'; END IF;
 IF jsonb_typeof(request_payload->'title') IS DISTINCT FROM 'string'
 OR jsonb_typeof(request_payload->'clientWorkspaceId') NOT IN('string','null') THEN RAISE EXCEPTION 'Invalid sharing request'; END IF;
 org:=(request_payload->>'organizationId')::uuid;project:=(request_payload->>'projectId')::uuid;
 client:=(request_payload->>'clientWorkspaceId')::uuid;req:=(request_payload->>'requestId')::uuid;item:=request_payload->'snapshot';
 IF actor_id IS NULL OR org IS NULL OR project IS NULL OR req IS NULL THEN RAISE EXCEPTION 'Sharing identity required'; END IF;
 PERFORM 1 FROM public.organizations WHERE id=org FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Organization unavailable'; END IF;
 SELECT m.role INTO role_name FROM public.organization_members m WHERE m.organization_id=org AND m.user_id=actor_id FOR SHARE;
 IF role_name IS NULL OR role_name NOT IN('owner','admin','manager','member') THEN RAISE EXCEPTION 'Sharing role required'; END IF;
 PERFORM 1 FROM public.profiles p WHERE p.id=actor_id AND p.plan='business' FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Business plan required'; END IF;
 PERFORM 1 FROM public.profiles p JOIN public.organizations o ON o.owner_user_id=p.id WHERE o.id=org AND p.plan='business' FOR SHARE OF p;
 IF NOT FOUND THEN RAISE EXCEPTION 'Business organization required'; END IF;
 PERFORM 1 FROM public.business_projects WHERE id=project AND organization_id=org AND status='active' FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Project unavailable'; END IF;
 IF client IS NOT NULL THEN
  PERFORM 1 FROM public.client_workspaces WHERE id=client AND organization_id=org AND (project_id IS NULL OR project_id=project) FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Client workspace unavailable'; END IF;
 END IF;
 IF jsonb_typeof(item) IS DISTINCT FROM 'object' OR (SELECT count(*) FROM jsonb_object_keys(item))<>4
 OR NOT item ?& ARRAY['calculatorSlug','calculatorVersion','input','output'] OR jsonb_typeof(item->'calculatorVersion') IS DISTINCT FROM 'number'
 OR NOT ((item->>'calculatorSlug'='website-bandwidth-calculator' AND item->'calculatorVersion'='2'::jsonb) OR (item->>'calculatorSlug'<>'website-bandwidth-calculator' AND item->'calculatorVersion'='1'::jsonb))
 OR jsonb_typeof(item->'calculatorSlug') IS DISTINCT FROM 'string'
 OR item->>'calculatorSlug' NOT IN('storage-conversion-calculator','aspect-ratio-calculator','resolution-calculator','dpi-calculator','power-supply-calculator','website-bandwidth-calculator','cloud-storage-cost-calculator','cloud-data-transfer-cost-calculator')
 OR jsonb_typeof(item->'input') IS DISTINCT FROM 'object' OR jsonb_typeof(item->'output') IS DISTINCT FROM 'object'
 OR char_length(request_payload->>'title') NOT BETWEEN 1 AND 240 THEN RAISE EXCEPTION 'Unsupported shared snapshot'; END IF;
 SELECT * INTO existing FROM public.technology_next_shared_snapshots s
 WHERE s.organization_id=org AND s.created_by=actor_id AND s.request_id=req;
 IF FOUND THEN
  IF existing.request_payload IS DISTINCT FROM request_payload THEN RAISE EXCEPTION 'Sharing request conflicts with original snapshot'; END IF;
  RETURN existing.id;
 END IF;
 INSERT INTO public.technology_next_shared_snapshots(organization_id,project_id,client_workspace_id,created_by,request_id,title,calculator_slug,calculator_version,input_data,output_data,request_payload)
 VALUES(org,project,client,actor_id,req,request_payload->>'title',item->>'calculatorSlug',(item->>'calculatorVersion')::integer,item->'input',item->'output',request_payload) RETURNING id INTO result;
 INSERT INTO public.organization_audit_log(organization_id,actor_user_id,action,entity_type,entity_id,metadata)
 VALUES(org,actor_id,'technology-next.snapshot.shared','technology-next-shared-snapshot',result::text,jsonb_build_object('calculatorSlug',item->>'calculatorSlug','calculatorVersion',(item->>'calculatorVersion')::integer,'projectId',project,'clientWorkspaceId',client));
 RETURN result;
END $function$
;
ALTER POLICY technology_next_shared_member_read ON public.technology_next_shared_snapshots USING(public.technology_next_sharing_capability(organization_id)='technology-next-sharing-private-1');
NOTIFY pgrst,'reload schema';
COMMIT;
