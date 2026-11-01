-- REVIEW ONLY; inert until the explicit guard is removed in a disposable fixture.
BEGIN;
SET LOCAL lock_timeout='3s';
DO $proposal_guard$ BEGIN RAISE EXCEPTION 'UNAPPLIED_OWNER_P0_MEMBERSHIP'; END $proposal_guard$;
DO $source_guard$ BEGIN IF encode(sha256(convert_to(pg_get_functiondef('public.accept_business_invitation(text)'::regprocedure),'UTF8')),'hex') <> '821394b78bacc681a73e19db068cbca9e08c7563adef322116c1fe7129a810c2' THEN RAISE EXCEPTION 'CAPTURED_ACCEPTANCE_SOURCE_MISMATCH'; END IF; END $source_guard$;
DO $schema_guard$ BEGIN
IF (SELECT string_agg(attname||':'||format_type(atttypid,atttypmod)||':'||attnotnull::text,'|' ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.organizations'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM 'id:uuid:true|name:text:true|slug:text:true|owner_user_id:uuid:true|created_at:timestamp with time zone:true|updated_at:timestamp with time zone:true' THEN RAISE EXCEPTION 'CAPTURED_SCHEMA_MISMATCH:organizations'; END IF;
IF (SELECT string_agg(attname||':'||format_type(atttypid,atttypmod)||':'||attnotnull::text,'|' ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.organization_members'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM 'organization_id:uuid:true|user_id:uuid:true|role:text:true|joined_at:timestamp with time zone:true' THEN RAISE EXCEPTION 'CAPTURED_SCHEMA_MISMATCH:organization_members'; END IF;
IF (SELECT string_agg(attname||':'||format_type(atttypid,atttypmod)||':'||attnotnull::text,'|' ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.organization_invitations'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM 'id:uuid:true|organization_id:uuid:true|email:text:true|role:text:true|token_hash:text:true|invited_by:uuid:true|expires_at:timestamp with time zone:true|accepted_at:timestamp with time zone:false|created_at:timestamp with time zone:true' THEN RAISE EXCEPTION 'CAPTURED_SCHEMA_MISMATCH:organization_invitations'; END IF;
IF (SELECT string_agg(attname||':'||format_type(atttypid,atttypmod)||':'||attnotnull::text,'|' ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.organization_audit_log'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM 'id:bigint:true|organization_id:uuid:true|actor_user_id:uuid:false|action:text:true|entity_type:text:true|entity_id:text:false|metadata:jsonb:true|created_at:timestamp with time zone:true' THEN RAISE EXCEPTION 'CAPTURED_SCHEMA_MISMATCH:organization_audit_log'; END IF;
END $schema_guard$;

-- DDL admission audit is protected against participating table writers.
LOCK TABLE public.organizations,public.organization_members,public.organization_invitations IN SHARE ROW EXCLUSIVE MODE;
DO $data_guard$ BEGIN
 IF EXISTS(SELECT 1 FROM public.organizations o WHERE
  (SELECT count(DISTINCT user_id) FROM public.organization_members WHERE organization_id=o.id)
  +(SELECT count(DISTINCT lower(i.email)) FROM public.organization_invitations i WHERE i.organization_id=o.id AND i.accepted_at IS NULL AND i.expires_at>clock_timestamp()
    AND NOT EXISTS(SELECT 1 FROM public.organization_members m JOIN auth.users u ON u.id=m.user_id WHERE m.organization_id=o.id AND lower(u.email)=lower(i.email)))>5)
 THEN RAISE EXCEPTION 'EXISTING_CAPACITY_REQUIRES_SEPARATE_REMEDIATION'; END IF;
END $data_guard$;
CREATE FUNCTION public.owner_p0_truncate_fence() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
BEGIN
 RAISE EXCEPTION 'Membership and audit TRUNCATE outside approved contract';
END $$;
REVOKE ALL ON FUNCTION public.owner_p0_truncate_fence() FROM PUBLIC,anon,authenticated,service_role;
CREATE TRIGGER owner_p0_truncate_fence BEFORE TRUNCATE ON public.organizations FOR EACH STATEMENT EXECUTE FUNCTION public.owner_p0_truncate_fence();
CREATE TRIGGER owner_p0_truncate_fence BEFORE TRUNCATE ON public.organization_members FOR EACH STATEMENT EXECUTE FUNCTION public.owner_p0_truncate_fence();
CREATE TRIGGER owner_p0_truncate_fence BEFORE TRUNCATE ON public.organization_invitations FOR EACH STATEMENT EXECUTE FUNCTION public.owner_p0_truncate_fence();
CREATE TRIGGER owner_p0_truncate_fence BEFORE TRUNCATE ON public.organization_audit_log FOR EACH STATEMENT EXECUTE FUNCTION public.owner_p0_truncate_fence();
CREATE FUNCTION public.owner_p0_occupied(p_org uuid) RETURNS bigint
LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path=pg_catalog,public AS $$
 SELECT (SELECT count(DISTINCT user_id) FROM public.organization_members WHERE organization_id=p_org)
 + (SELECT count(DISTINCT lower(i.email)) FROM public.organization_invitations i
 WHERE i.organization_id=p_org AND i.accepted_at IS NULL AND i.expires_at>clock_timestamp()
 AND NOT EXISTS(SELECT 1 FROM public.organization_members m JOIN auth.users u ON u.id=m.user_id
 WHERE m.organization_id=p_org AND lower(u.email)=lower(i.email)))
$$;
REVOKE ALL ON FUNCTION public.owner_p0_occupied(uuid) FROM PUBLIC,anon,authenticated,service_role;
CREATE FUNCTION public.owner_p0_writer_fence() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE org uuid;
BEGIN
 IF current_setting('role',true)='service_role' THEN RAISE EXCEPTION 'Service-role membership writer not authorized'; END IF;
 IF current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Membership requires read committed'; END IF;
 IF TG_OP='DELETE' THEN org:=OLD.organization_id; ELSE org:=NEW.organization_id; END IF;
 IF TG_OP='UPDATE' THEN
  IF NEW.organization_id IS DISTINCT FROM OLD.organization_id THEN RAISE EXCEPTION 'Organization identity rewrite forbidden'; END IF;
  IF TG_TABLE_NAME='organization_members' THEN
   IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN RAISE EXCEPTION 'User identity rewrite forbidden'; END IF;
   IF OLD.role='owner' AND NEW.role IS DISTINCT FROM OLD.role THEN RAISE EXCEPTION 'Implicit owner demotion forbidden'; END IF;
   IF OLD.role<>'owner' AND NEW.role='owner' THEN RAISE EXCEPTION 'Ownership transfer outside approved contract'; END IF;
  ELSE
   IF (NEW.id,NEW.email,NEW.token_hash,NEW.invited_by,NEW.role) IS DISTINCT FROM (OLD.id,OLD.email,OLD.token_hash,OLD.invited_by,OLD.role) THEN RAISE EXCEPTION 'Invitation identity rewrite forbidden'; END IF;
  END IF;
 END IF;
 IF TG_TABLE_NAME='organization_members' AND TG_OP='DELETE' AND OLD.role='owner' THEN RAISE EXCEPTION 'Owner removal outside approved contract'; END IF;
 PERFORM 1 FROM public.organizations WHERE id=org FOR UPDATE;
 IF TG_TABLE_NAME='organization_invitations' AND TG_OP='INSERT' THEN
  IF auth.uid() IS NULL OR NEW.invited_by IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Invitation actor identity required'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND plan='business') THEN RAISE EXCEPTION 'Business plan required'; END IF;
  NEW.email:=lower(btrim(NEW.email));
  IF NEW.email IS NULL OR position('@' in NEW.email)=0 OR NEW.role IS NULL OR NEW.role NOT IN ('admin','manager','member','viewer')
   OR NEW.token_hash IS NULL OR NEW.token_hash !~ '^[0-9a-f]{64}$' THEN RAISE EXCEPTION 'Invalid invitation details'; END IF;
  IF EXISTS(SELECT 1 FROM public.organization_members m JOIN auth.users u ON u.id=m.user_id WHERE m.organization_id=org AND lower(u.email)=NEW.email) THEN RAISE EXCEPTION 'Already an active member'; END IF;
 END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $$;
CREATE FUNCTION public.owner_p0_organization_fence() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
BEGIN
 IF NEW.id IS DISTINCT FROM OLD.id OR NEW.owner_user_id IS DISTINCT FROM OLD.owner_user_id THEN
  RAISE EXCEPTION 'Organization owner or identity rewrite outside approved contract';
 END IF;
 -- UPDATE already holds this organization's row lock, the shared writer fence.
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.owner_p0_organization_fence() FROM PUBLIC,anon,authenticated,service_role;
CREATE TRIGGER owner_p0_organization_fence BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.owner_p0_organization_fence();
CREATE FUNCTION public.owner_p0_capacity_check() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
BEGIN
 IF public.owner_p0_occupied(NEW.organization_id)>5 THEN RAISE EXCEPTION 'Included five Business seats allocated or pending'; END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.owner_p0_writer_fence(),public.owner_p0_capacity_check() FROM PUBLIC,anon,authenticated,service_role;
CREATE TRIGGER owner_p0_writer_fence BEFORE INSERT OR UPDATE OR DELETE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION public.owner_p0_writer_fence();
CREATE TRIGGER owner_p0_writer_fence BEFORE INSERT OR UPDATE OR DELETE ON public.organization_invitations FOR EACH ROW EXECUTE FUNCTION public.owner_p0_writer_fence();
CREATE TRIGGER owner_p0_capacity_check AFTER INSERT OR UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION public.owner_p0_capacity_check();
CREATE TRIGGER owner_p0_capacity_check AFTER INSERT OR UPDATE ON public.organization_invitations FOR EACH ROW EXECUTE FUNCTION public.owner_p0_capacity_check();
CREATE OR REPLACE FUNCTION public.accept_business_invitation(invite_token_hash text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE inv public.organization_invitations%rowtype;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 SELECT * INTO inv FROM public.organization_invitations WHERE token_hash=invite_token_hash;
 IF inv.id IS NULL THEN RAISE EXCEPTION 'Invitation invalid or expired'; END IF;
 PERFORM 1 FROM public.organizations WHERE id=inv.organization_id FOR UPDATE;
 SELECT * INTO inv FROM public.organization_invitations WHERE id=inv.id AND token_hash=invite_token_hash FOR UPDATE;
 IF inv.id IS NULL OR inv.accepted_at IS NOT NULL OR inv.expires_at<=clock_timestamp() THEN RAISE EXCEPTION 'Invitation invalid or expired'; END IF;
 IF lower(inv.email)<>lower(coalesce((SELECT email FROM auth.users WHERE id=auth.uid()),'')) THEN RAISE EXCEPTION 'Invitation email mismatch'; END IF;
 IF EXISTS(SELECT 1 FROM public.organization_members WHERE organization_id=inv.organization_id AND user_id=auth.uid()) THEN RAISE EXCEPTION 'Already an active member'; END IF;
 -- Consume reservation BEFORE insertion; rollback restores both on any later error.
 UPDATE public.organization_invitations SET accepted_at=clock_timestamp() WHERE id=inv.id;
 INSERT INTO public.organization_members(organization_id,user_id,role) VALUES(inv.organization_id,auth.uid(),inv.role);
 INSERT INTO public.organization_audit_log(organization_id,actor_user_id,action,entity_type,entity_id) VALUES(inv.organization_id,auth.uid(),'member.joined','user',auth.uid()::text);
 RETURN inv.organization_id;
END $$;
REVOKE ALL ON FUNCTION public.accept_business_invitation(text) FROM PUBLIC,anon,service_role;
GRANT EXECUTE ON FUNCTION public.accept_business_invitation(text) TO authenticated;
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
 IF EXISTS(SELECT 1 FROM public.organization_members m JOIN auth.users u ON u.id=m.user_id WHERE m.organization_id=p_organization_id AND lower(u.email)=normalized_email) THEN RAISE EXCEPTION 'Already an active member'; END IF;
 DELETE FROM public.organization_invitations WHERE organization_id=p_organization_id AND lower(email)=normalized_email AND accepted_at IS NULL AND expires_at<=issuance_time;
 SELECT public.owner_p0_occupied(p_organization_id) INTO occupied;
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

CREATE FUNCTION public.revoke_business_invitation(p_invitation_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE org uuid;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 SELECT organization_id INTO org FROM public.organization_invitations WHERE id=p_invitation_id;
 PERFORM 1 FROM public.organizations WHERE id=org FOR UPDATE;
 IF NOT public.has_org_role(org,ARRAY['owner','admin']) THEN RAISE EXCEPTION 'Organization permission required'; END IF;
 DELETE FROM public.organization_invitations WHERE id=p_invitation_id AND accepted_at IS NULL;
 IF NOT FOUND THEN RAISE EXCEPTION 'Invitation unavailable'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.revoke_business_invitation(uuid) FROM PUBLIC,anon,service_role;
GRANT EXECUTE ON FUNCTION public.revoke_business_invitation(uuid) TO authenticated;
COMMIT;
