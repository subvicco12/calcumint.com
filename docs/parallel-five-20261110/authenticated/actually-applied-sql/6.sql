-- REVIEW ONLY. Requires explicit schema/data/ACL/deployment review. Never auto-apply.
-- Metadata: src/lib/native-delivery/technology-next-catalog.ts (closed eight identities).
-- Trusted service/server owns exactmath and new-capture verification; SQL does not duplicate math.
-- The server must exact-verify supported registered snapshots before its privileged RPC.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $sharing_guard$ BEGIN RAISE EXCEPTION 'UNAPPLIED_TECHNOLOGY_NEXT_SHARING_PRIVATE_1'; END $sharing_guard$;
CREATE UNIQUE INDEX technology_next_project_tenant_identity ON public.business_projects(id,organization_id);
CREATE UNIQUE INDEX technology_next_client_tenant_identity ON public.client_workspaces(id,organization_id);
CREATE TABLE public.technology_next_shared_snapshots(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
 project_id uuid NOT NULL,
 client_workspace_id uuid,
 created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
 request_id uuid NOT NULL,
 title text NOT NULL CHECK(char_length(title) BETWEEN 1 AND 240),
 calculator_slug text NOT NULL CHECK(calculator_slug IN('storage-conversion-calculator','aspect-ratio-calculator','resolution-calculator','dpi-calculator','power-supply-calculator','website-bandwidth-calculator','cloud-storage-cost-calculator','cloud-data-transfer-cost-calculator')),
 calculator_version integer NOT NULL,
 CONSTRAINT technology_next_identity CHECK ((calculator_slug='website-bandwidth-calculator' AND calculator_version=2) OR (calculator_slug<>'website-bandwidth-calculator' AND calculator_version=1)),
 input_data jsonb NOT NULL CHECK(jsonb_typeof(input_data)='object'),
 output_data jsonb NOT NULL CHECK(jsonb_typeof(output_data)='object'),
 request_payload jsonb NOT NULL CHECK(octet_length(request_payload::text)<=65536),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(organization_id,created_by,request_id),
 FOREIGN KEY(project_id,organization_id) REFERENCES public.business_projects(id,organization_id) ON DELETE RESTRICT,
 FOREIGN KEY(client_workspace_id,organization_id) REFERENCES public.client_workspaces(id,organization_id) ON DELETE RESTRICT
);
ALTER TABLE public.technology_next_shared_snapshots ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.technology_next_shared_snapshots FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT ON public.technology_next_shared_snapshots TO authenticated;
GRANT SELECT,INSERT ON public.technology_next_shared_snapshots TO service_role;
CREATE FUNCTION public.technology_next_sharing_capability(target_org uuid) RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,public AS $$
 SELECT CASE WHEN auth.uid() IS NOT NULL AND EXISTS(
  SELECT 1 FROM public.organization_members m JOIN public.organizations o ON o.id=m.organization_id
  JOIN public.profiles owner_plan ON owner_plan.id=o.owner_user_id
  JOIN public.profiles actor_plan ON actor_plan.id=m.user_id
  WHERE m.organization_id=target_org AND m.user_id=auth.uid()
  AND m.role IN('owner','admin','manager','member','viewer') AND owner_plan.plan='business' AND actor_plan.plan='business'
 ) THEN 'technology-next-sharing-private-1' ELSE NULL END;
$$;
REVOKE ALL ON FUNCTION public.technology_next_sharing_capability(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.technology_next_sharing_capability(uuid) TO authenticated,service_role;
CREATE POLICY technology_next_shared_member_read ON public.technology_next_shared_snapshots FOR SELECT TO authenticated
USING(public.technology_next_sharing_capability(organization_id)='technology-next-sharing-private-1');
CREATE FUNCTION public.technology_next_shared_immutable() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
BEGIN RAISE EXCEPTION 'Shared snapshots are immutable; capture a new request'; END $$;
REVOKE ALL ON FUNCTION public.technology_next_shared_immutable() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER technology_next_shared_immutable BEFORE UPDATE OR DELETE ON public.technology_next_shared_snapshots
FOR EACH ROW EXECUTE FUNCTION public.technology_next_shared_immutable();
CREATE FUNCTION public.share_technology_next_snapshot(actor_id uuid,request_payload jsonb) RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,public AS $$
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
END $$;
REVOKE ALL ON FUNCTION public.share_technology_next_snapshot(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.share_technology_next_snapshot(uuid,jsonb) TO service_role;
NOTIFY pgrst, 'reload schema';
COMMIT;
