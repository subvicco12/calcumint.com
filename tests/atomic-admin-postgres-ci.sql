\set ON_ERROR_STOP on
-- Dedicated disposable postgres service. Reuse the already CI-exercised
-- Supabase-compatible auth/RLS bootstrap before loading transactional RPCs.
\ir overlapping-rls.sql
-- The behavioral RLS script ends as authenticated; migrations require DDL owner.
reset role;
reset request.jwt.claim.sub;
create or replace function auth.role() returns text language sql stable as $authrole$
  select nullif(current_setting('request.jwt.claim.role', true), '')
$authrole$;
\ir ../supabase/migrations/016_final_certification_evidence_gate.sql
\ir ../supabase/migrations/017_regulatory_rule_pack_evidence.sql
\ir ../supabase/migrations/026_publication_manifest_authority.sql
\ir ../supabase/migrations/032_atomic_reviewer_qa_audit.sql
\ir ../supabase/migrations/033_atomic_reviewer_assignment_audit.sql
\ir ../supabase/migrations/034_atomic_lifecycle_transition_audit.sql
\ir ../supabase/migrations/035_atomic_catalog_creation.sql
\ir atomic-admin-rpc-db-smoke.sql

-- Use existing isolated fixture identities from overlapping-rls.sql.
-- DDL owner supplies grants, then all RPC calls run under authenticated RLS.
grant usage on schema public to authenticated;
grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;
grant select, insert, update on public.calculator_catalog_admin to authenticated;
grant select, insert, update on public.calculator_qa_checks to authenticated;
grant select, insert, trigger on public.calculator_review_events to authenticated;
grant usage, select on all sequences in schema public to authenticated;
-- The admin self-read policy intentionally hides other reviewers. Use a
-- disposable test-only definer helper for fixture presence assertions.
create or replace function public.atomic_test_reviewer_exists(p_user uuid)
returns boolean language sql stable security definer set search_path = public as $reviewer$
  select exists (
    select 1 from public.platform_admins
    where user_id = p_user and active and role in ('owner','admin','reviewer')
  )
$reviewer$;
revoke all on function public.atomic_test_reviewer_exists(uuid) from public, anon;
grant execute on function public.atomic_test_reviewer_exists(uuid) to authenticated;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
set test.calculator_id = '50000000-0000-0000-0000-000000000001';
set test.reviewer_id = '00000000-0000-0000-0000-000000000006';
\ir atomic-admin-audit-failure-injection.sql
\ir atomic-reviewer-assignment-audit-rollback.sql
\ir atomic-lifecycle-audit-rollback.sql
\ir atomic-qa-audit-rollback.sql
reset role;
reset request.jwt.claim.sub;
\ir atomic-admin-denial-postgres.sql
\ir atomic-admin-role-matrix-postgres.sql
\ir atomic-admin-authorized-postgres.sql
\ir publication-manifest-db-gate.sql
\ir publication-manifest-state-matrix.sql
\ir certification-gate-denials-postgres.sql
\ir ymyl-reviewer-authority-postgres.sql
\ir structured-source-evidence-postgres.sql
\ir ../supabase/migrations/019_authoritative_lifecycle_enforcement.sql
\ir lifecycle-transition-authority-postgres.sql
\ir ../supabase/migrations/023_structured_source_evidence.sql
\ir ../supabase/migrations/025_derived_source_count_authority.sql
\ir derived-source-count-postgres.sql
\ir ../supabase/migrations/024_reviewer_assignment_authority.sql
\ir reviewer-assignment-authority-postgres.sql
\ir ../supabase/migrations/020_post_certification_revalidation.sql
\ir post-certification-revalidation-postgres.sql
\ir certified-source-deletion-postgres.sql
\ir structured-source-gate-postgres.sql
\ir certified-source-relocation-postgres.sql
\ir regulatory-rule-metadata-postgres.sql
\ir regulatory-official-source-postgres.sql
\ir regulatory-effective-period-postgres.sql
\ir regulatory-official-source-url-postgres.sql
\ir regulatory-official-source-shape-postgres.sql
\ir regulatory-effective-to-calendar-postgres.sql
