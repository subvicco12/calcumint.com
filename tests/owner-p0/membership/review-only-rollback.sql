-- REVIEW ONLY: restores captured acceptance; deletes only this candidate's new objects.
BEGIN;
DO $proposal_guard$ BEGIN RAISE EXCEPTION 'UNAPPLIED_OWNER_P0_ROLLBACK'; END $proposal_guard$;
DO $source_guard$ BEGIN
IF encode(sha256(convert_to((SELECT prosrc FROM pg_proc WHERE oid='public.owner_p0_occupied(uuid)'::regprocedure),'UTF8')),'hex') <> '9f492e279060062c58f1016f8ad46a63867ff1866e31181387251e1edcfc4d9e' THEN RAISE EXCEPTION 'SUCCESSOR_SOURCE_MISMATCH:owner_p0_occupied'; END IF;
IF encode(sha256(convert_to((SELECT prosrc FROM pg_proc WHERE oid='public.owner_p0_writer_fence()'::regprocedure),'UTF8')),'hex') <> '1c79d8de557bcf4797042d4493405f663cfddc056be1ef0d5c771e7cd4d5cb0a' THEN RAISE EXCEPTION 'SUCCESSOR_SOURCE_MISMATCH:owner_p0_writer_fence'; END IF;
IF encode(sha256(convert_to((SELECT prosrc FROM pg_proc WHERE oid='public.owner_p0_capacity_check()'::regprocedure),'UTF8')),'hex') <> 'fcf20115d84e8cbdda0e9ffe7af6895e6008448d7b2708efde6d405368fa3f3c' THEN RAISE EXCEPTION 'SUCCESSOR_SOURCE_MISMATCH:owner_p0_capacity_check'; END IF;
IF encode(sha256(convert_to((SELECT prosrc FROM pg_proc WHERE oid='public.accept_business_invitation(text)'::regprocedure),'UTF8')),'hex') <> '6c7fa7f4bbe201f84b8bf25ca9b67ce1eac311f08357ddb20ad93bd8e52880ad' THEN RAISE EXCEPTION 'SUCCESSOR_SOURCE_MISMATCH:accept_business_invitation'; END IF;
IF encode(sha256(convert_to((SELECT prosrc FROM pg_proc WHERE oid='public.reserve_business_invitation(uuid,text,text,text)'::regprocedure),'UTF8')),'hex') <> 'ec964743ae84b63fba7c333cb97de52c67924a04cbd7dfb27441dd4270465942' THEN RAISE EXCEPTION 'SUCCESSOR_SOURCE_MISMATCH:reserve_business_invitation'; END IF;
IF encode(sha256(convert_to((SELECT prosrc FROM pg_proc WHERE oid='public.revoke_business_invitation(uuid)'::regprocedure),'UTF8')),'hex') <> 'd16035e8f258a1baf32fa8f85aaf028098561ab095ad3fa4006cb86bc3e91c06' THEN RAISE EXCEPTION 'SUCCESSOR_SOURCE_MISMATCH:revoke_business_invitation'; END IF;
IF encode(sha256(convert_to((SELECT prosrc FROM pg_proc WHERE oid='public.owner_p0_organization_fence()'::regprocedure),'UTF8')),'hex') <> 'add65840e9232803e7bd88230d8debef25dfb997b5400557cbe17acc43244468' THEN RAISE EXCEPTION 'SUCCESSOR_SOURCE_MISMATCH:owner_p0_organization_fence'; END IF;
IF encode(sha256(convert_to((SELECT prosrc FROM pg_proc WHERE oid='public.owner_p0_truncate_fence()'::regprocedure),'UTF8')),'hex') <> 'bbe64e024e42366ff9df605323c594fe98fe5039b86a0011ffaae62e867e707f' THEN RAISE EXCEPTION 'SUCCESSOR_SOURCE_MISMATCH:owner_p0_truncate_fence'; END IF;
END $source_guard$;
DROP TRIGGER owner_p0_truncate_fence ON public.organizations;
DROP TRIGGER owner_p0_truncate_fence ON public.organization_members;
DROP TRIGGER owner_p0_truncate_fence ON public.organization_invitations;
DROP TRIGGER owner_p0_truncate_fence ON public.organization_audit_log;
DROP TRIGGER owner_p0_organization_fence ON public.organizations;
DROP TRIGGER owner_p0_writer_fence ON public.organization_members;
DROP TRIGGER owner_p0_writer_fence ON public.organization_invitations;
DROP TRIGGER owner_p0_capacity_check ON public.organization_members;
DROP TRIGGER owner_p0_capacity_check ON public.organization_invitations;
DROP FUNCTION public.owner_p0_truncate_fence(),public.owner_p0_organization_fence(),public.owner_p0_writer_fence(),public.owner_p0_capacity_check(),public.owner_p0_occupied(uuid),public.reserve_business_invitation(uuid,text,text,text),public.revoke_business_invitation(uuid);
CREATE OR REPLACE FUNCTION public.accept_business_invitation(invite_token_hash text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare inv public.organization_invitations%rowtype;
declare member_count integer;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  select * into inv from public.organization_invitations
  where token_hash = invite_token_hash and accepted_at is null and expires_at > now()
  limit 1;
  if inv.id is null then raise exception 'Invitation is invalid or expired'; end if;
  if lower(inv.email) <> lower(coalesce((select email from auth.users where id = auth.uid()), '')) then
    raise exception 'Invitation email does not match signed-in account';
  end if;

  select count(*) into member_count from public.organization_members where organization_id = inv.organization_id;
  if member_count >= 5 then raise exception 'Included Business seat limit reached'; end if;

  insert into public.organization_members(organization_id, user_id, role)
  values (inv.organization_id, auth.uid(), inv.role)
  on conflict (organization_id, user_id) do update set role = excluded.role;

  update public.organization_invitations set accepted_at = now() where id = inv.id;
  insert into public.organization_audit_log(organization_id, actor_user_id, action, entity_type, entity_id)
  values (inv.organization_id, auth.uid(), 'member.joined', 'user', auth.uid()::text);
  return inv.organization_id;
end;
$function$
;
REVOKE ALL ON FUNCTION public.accept_business_invitation(text) FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION public.accept_business_invitation(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_business_invitation(text) TO service_role;
COMMIT;
