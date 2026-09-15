-- CalcuMint production hardening: restrict SECURITY DEFINER RPC execution.
-- Trigger functions remain executable by the database trigger mechanism without API grants.

revoke execute on all functions in schema public from public, anon, authenticated;

-- Authenticated application RPCs.
grant execute on function public.accept_business_invitation(text) to authenticated;
grant execute on function public.consume_ai_quota(text) to authenticated;
grant execute on function public.create_business_organization(text, text) to authenticated;
grant execute on function public.create_custom_calculator(uuid, text, text, text, jsonb) to authenticated;
grant execute on function public.finish_ai_usage(bigint, text, text, integer, integer, boolean) to authenticated;
grant execute on function public.publish_custom_calculator(uuid, integer) to authenticated;
grant execute on function public.refresh_admin_review_alerts() to authenticated;
grant execute on function public.validate_calculator_publish_gate(uuid) to authenticated;

-- Helper functions used by authenticated RLS policies.
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.org_role(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, text[]) to authenticated;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.has_platform_role(text[]) to authenticated;

-- Backend-only operations and application RPCs.
grant execute on all functions in schema public to service_role;
