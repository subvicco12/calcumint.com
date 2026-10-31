-- REVIEW ONLY. Not a migration, active RPC or deployment authorization.
-- Organization lock participates with guarded Batch16 redemption successor only.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $proposal_guard$ BEGIN RAISE EXCEPTION 'UNAPPLIED_BATCH17_ISSUANCE'; END $proposal_guard$;
CREATE FUNCTION public.reserve_business_invitation(
 p_organization_id uuid,p_email text,p_role text,p_token_hash text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE result_id uuid; normalized_email text; occupied bigint; issuance_time timestamptz;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 -- Preserve server-action caller entitlement, not organization owner's entitlement.
 IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND plan='business') THEN
  RAISE EXCEPTION 'Business plan required';
 END IF;
 normalized_email:=lower(btrim(p_email));
 IF p_organization_id IS NULL OR normalized_email IS NULL OR position('@' in normalized_email)=0
  OR p_role IS NULL OR p_role NOT IN ('admin','manager','member','viewer')
  OR p_token_hash IS NULL OR p_token_hash !~ '^[0-9a-f]{64}$' THEN
  RAISE EXCEPTION 'Invalid invitation details';
 END IF;
 -- Lock before authorization/count and retain lock until this RPC transaction ends.
 PERFORM 1 FROM public.organizations WHERE id=p_organization_id FOR UPDATE;
 IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM public.organization_members
  WHERE organization_id=p_organization_id AND user_id=auth.uid() AND role IN ('owner','admin')) THEN
  RAISE EXCEPTION 'Business organization permission required';
 END IF;
 -- Re-read authoritative entitlement after waiting. External plan writers remain a documented gate.
 IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND plan='business') THEN
  RAISE EXCEPTION 'Business plan required';
 END IF;
 issuance_time:=clock_timestamp();
 SELECT (SELECT count(*) FROM public.organization_members WHERE organization_id=p_organization_id)
  +(SELECT count(*) FROM public.organization_invitations WHERE organization_id=p_organization_id
    AND accepted_at IS NULL AND expires_at>issuance_time) INTO occupied;
 IF occupied>=5 THEN RAISE EXCEPTION 'The included five Business seats are already allocated or pending'; END IF;
 -- Authoritative database clock binds the count and exact elapsed lifetime.
 -- Do not infer existing-member eligibility or owner role update policy here.
 INSERT INTO public.organization_invitations(organization_id,email,role,token_hash,invited_by,expires_at)
 VALUES(p_organization_id,normalized_email,p_role,p_token_hash,auth.uid(),issuance_time+interval '604800 seconds')
 RETURNING id INTO result_id;
 RETURN result_id;
END $$;
REVOKE ALL ON FUNCTION public.reserve_business_invitation(uuid,text,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.reserve_business_invitation(uuid,text,text,text) TO authenticated;
COMMIT;
