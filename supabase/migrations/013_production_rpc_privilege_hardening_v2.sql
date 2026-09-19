-- CalcuMint production RPC privilege hardening.
-- Authenticated execute is retained only for RPCs intentionally called by signed-in app users.
revoke execute on function public.refresh_admin_review_alerts() from public, anon, authenticated;
grant execute on function public.refresh_admin_review_alerts() to service_role;
revoke execute on function public.validate_calculator_publish_gate(uuid) from public, anon;
revoke execute on function public.has_platform_role(text[]) from public, anon;
revoke execute on function public.is_platform_admin() from public, anon;
revoke execute on function public.accept_business_invitation(text) from public, anon;
revoke execute on function public.consume_ai_quota(text) from public, anon;
revoke execute on function public.create_business_organization(text,text) from public, anon;
revoke execute on function public.create_custom_calculator(uuid,text,text,text,jsonb) from public, anon;
revoke execute on function public.finish_ai_usage(bigint,text,text,integer,integer,boolean) from public, anon;
revoke execute on function public.has_org_role(uuid,text[]) from public, anon;
revoke execute on function public.is_org_member(uuid) from public, anon;
revoke execute on function public.org_role(uuid) from public, anon;
revoke execute on function public.publish_custom_calculator(uuid,integer) from public, anon;
