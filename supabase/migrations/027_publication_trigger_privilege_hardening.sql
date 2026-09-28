-- Keep trigger-only SECURITY DEFINER functions out of the exposed RPC surface.
-- These functions are invoked by database triggers; clients must not call them directly.
-- The publication manifest remains intentionally executable by anon/authenticated because it exposes
-- only calculator_key, slug and version for rows already governed as published.

revoke execute on function public.enforce_derived_source_count() from public, anon, authenticated;
revoke execute on function public.enforce_qa_evidence_authority() from public, anon, authenticated;
revoke execute on function public.enforce_qa_evidence_certification() from public, anon, authenticated;
revoke execute on function public.enforce_reviewer_assignment_authority() from public, anon, authenticated;
revoke execute on function public.enforce_source_evidence_certification() from public, anon, authenticated;
revoke execute on function public.protect_active_ymyl_reviewer_authority() from public, anon, authenticated;
revoke execute on function public.stamp_source_evidence_review() from public, anon, authenticated;
revoke execute on function public.sync_source_evidence_count() from public, anon, authenticated;

grant execute on function public.enforce_derived_source_count() to service_role;
grant execute on function public.enforce_qa_evidence_authority() to service_role;
grant execute on function public.enforce_qa_evidence_certification() to service_role;
grant execute on function public.enforce_reviewer_assignment_authority() to service_role;
grant execute on function public.enforce_source_evidence_certification() to service_role;
grant execute on function public.protect_active_ymyl_reviewer_authority() to service_role;
grant execute on function public.stamp_source_evidence_review() to service_role;
grant execute on function public.sync_source_evidence_count() to service_role;
