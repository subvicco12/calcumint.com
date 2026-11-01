-- REVIEW ONLY: narrow captured-schema successor. Owner/existing-member behavior is preserved, not approved.
-- Privileged/direct writers remain outside the fence; global seat invariant BLOCKED.
-- REVIEW ONLY: no app activation, deployment identity or hosted equivalence implied.
-- Requires the reviewed full repository model; compatibility/data audit gates remain open.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $proposal_guard$ BEGIN RAISE EXCEPTION 'UNAPPLIED_P0_INVITATION_ACCEPTANCE'; END $proposal_guard$;
DO $source_guard$ BEGIN IF encode(sha256(convert_to(pg_get_functiondef('public.accept_business_invitation(text)'::regprocedure),'UTF8')),'hex') <> '821394b78bacc681a73e19db068cbca9e08c7563adef322116c1fe7129a810c2' THEN RAISE EXCEPTION 'CAPTURED_ACCEPTANCE_SOURCE_MISMATCH'; END IF; END $source_guard$;
DO $schema_guard$ BEGIN
IF (SELECT string_agg(attname||':'||format_type(atttypid,atttypmod)||':'||attnotnull::text,'|' ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.organizations'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM 'id:uuid:true|name:text:true|slug:text:true|owner_user_id:uuid:true|created_at:timestamp with time zone:true|updated_at:timestamp with time zone:true' THEN RAISE EXCEPTION 'CAPTURED_SCHEMA_MISMATCH:organizations'; END IF;
IF (SELECT string_agg(attname||':'||format_type(atttypid,atttypmod)||':'||attnotnull::text,'|' ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.organization_members'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM 'organization_id:uuid:true|user_id:uuid:true|role:text:true|joined_at:timestamp with time zone:true' THEN RAISE EXCEPTION 'CAPTURED_SCHEMA_MISMATCH:organization_members'; END IF;
IF (SELECT string_agg(attname||':'||format_type(atttypid,atttypmod)||':'||attnotnull::text,'|' ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.organization_invitations'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM 'id:uuid:true|organization_id:uuid:true|email:text:true|role:text:true|token_hash:text:true|invited_by:uuid:true|expires_at:timestamp with time zone:true|accepted_at:timestamp with time zone:false|created_at:timestamp with time zone:true' THEN RAISE EXCEPTION 'CAPTURED_SCHEMA_MISMATCH:organization_invitations'; END IF;
IF (SELECT string_agg(attname||':'||format_type(atttypid,atttypmod)||':'||attnotnull::text,'|' ORDER BY attnum) FROM pg_attribute WHERE attrelid='public.organization_audit_log'::regclass AND attnum>0 AND NOT attisdropped) IS DISTINCT FROM 'id:bigint:true|organization_id:uuid:true|actor_user_id:uuid:false|action:text:true|entity_type:text:true|entity_id:text:false|metadata:jsonb:true|created_at:timestamp with time zone:true' THEN RAISE EXCEPTION 'CAPTURED_SCHEMA_MISMATCH:organization_audit_log'; END IF;
END $schema_guard$;
CREATE OR REPLACE FUNCTION public.accept_business_invitation(invite_token_hash text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE inv public.organization_invitations%rowtype; member_count integer;
BEGIN
 IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'Acceptance requires read committed isolation'; END IF;
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 SELECT * INTO inv FROM public.organization_invitations WHERE token_hash=invite_token_hash;
 IF inv.id IS NULL THEN RAISE EXCEPTION 'Invitation is invalid or expired'; END IF;
 -- Shared organization lock serializes admissions across distinct invitation rows.
 PERFORM 1 FROM public.organizations WHERE id=inv.organization_id FOR UPDATE;
 SELECT * INTO inv FROM public.organization_invitations WHERE id=inv.id AND organization_id=inv.organization_id AND token_hash=invite_token_hash FOR UPDATE;
 IF inv.id IS NULL OR inv.accepted_at IS NOT NULL OR inv.expires_at<=clock_timestamp() THEN RAISE EXCEPTION 'Invitation is invalid or expired'; END IF;
 IF lower(inv.email)<>lower(coalesce((SELECT email FROM auth.users WHERE id=auth.uid()),'')) THEN RAISE EXCEPTION 'Invitation email does not match signed-in account'; END IF;
 SELECT count(*) INTO member_count FROM public.organization_members WHERE organization_id=inv.organization_id;
 IF member_count>=5 THEN RAISE EXCEPTION 'Included Business seat limit reached'; END IF;
 INSERT INTO public.organization_members(organization_id,user_id,role) VALUES(inv.organization_id,auth.uid(),inv.role)
 ON CONFLICT(organization_id,user_id) DO UPDATE SET role=excluded.role;
 UPDATE public.organization_invitations SET accepted_at=clock_timestamp() WHERE id=inv.id;
 INSERT INTO public.organization_audit_log(organization_id,actor_user_id,action,entity_type,entity_id) VALUES(inv.organization_id,auth.uid(),'member.joined','user',auth.uid()::text);
 RETURN inv.organization_id;
END $$;
REVOKE ALL ON FUNCTION public.accept_business_invitation(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.accept_business_invitation(text) TO authenticated;
COMMIT;
