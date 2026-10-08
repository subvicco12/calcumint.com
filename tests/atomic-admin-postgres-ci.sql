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
