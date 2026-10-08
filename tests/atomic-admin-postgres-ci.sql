\set ON_ERROR_STOP on
-- Dedicated disposable postgres service. Reuse the already CI-exercised
-- Supabase-compatible auth/RLS bootstrap before loading transactional RPCs.
\ir overlapping-rls.sql
-- The behavioral RLS script ends as authenticated; migrations require DDL owner.
reset role;
reset request.jwt.claim.sub;
\ir ../supabase/migrations/032_atomic_reviewer_qa_audit.sql
\ir ../supabase/migrations/033_atomic_reviewer_assignment_audit.sql
\ir ../supabase/migrations/034_atomic_lifecycle_transition_audit.sql
\ir ../supabase/migrations/035_atomic_catalog_creation.sql
\ir atomic-admin-rpc-db-smoke.sql

-- Use existing isolated fixture identities from overlapping-rls.sql.
-- DDL owner supplies grants, then all RPC calls run under authenticated RLS.
grant usage on schema public to authenticated;
grant select, insert, update on public.calculator_catalog_admin to authenticated;
grant select, insert, update on public.calculator_qa_checks to authenticated;
grant select, insert on public.calculator_review_events to authenticated;
grant usage, select on all sequences in schema public to authenticated;
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
