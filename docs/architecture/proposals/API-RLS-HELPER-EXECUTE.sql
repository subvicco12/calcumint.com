-- UNAPPLIED PROPOSAL: restore the two authenticated RLS entry points after 013.
-- Both SECURITY DEFINER helpers constrain membership to auth.uid(); org_role
-- remains owner-internal and receives no direct client EXECUTE grant.
-- Review hosted definitions, ownership, search paths and effective ACLs before adoption.
BEGIN;
DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated helper acceptance and owner authorization required'; END $$;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid),
  public.has_org_role(uuid,text[]) TO authenticated;
COMMIT;
