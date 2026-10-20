# Production migration reconciliation — read-only evidence (2026-10-19)

Status: **BLOCKED / RELEASE HOLD**. No production migrations or changes authorized.

## Evidence
- Repository contains `supabase/migrations/009_country_preferences.sql`, which adds `public.user_preferences.country_code` with allowed codes IN, US, GB, CA, AU or NULL.
- Production `information_schema.columns` confirms `country_code` absent while `profiles.display_name` exists.
- Production `supabase_migrations.schema_migrations` returns 37 recorded rows, from `20260915105204 b3_accounts` to `20260929174204 builder_publish_business_entitlement`. None is named `country_preferences`.
- Repository numeric prefixes 032, 033, 034, 035 are duplicated across different migration names; `008b` also requires explicit ordering.
- The repository B12 production-hardening guide says apply migrations in numeric order. It does not establish a timestamp mapping or deployment executor.
- Existing isolated tests apply Migration 009, which differs from production.

## Required reconciliation before any production proposal
1. Obtain the authoritative historical migration deployment manifest, including file content hashes and corresponding Supabase timestamp versions. Do not infer a match from numeric prefix alone.
2. Compare each repository SQL file to the deployed migration body or independently verified schema effect. Flag missing, divergent, reordered and intentionally unapplied migrations separately.
3. Review Migration 009's DDL, table ownership, dependencies, application `updatePreferences` compatibility, check constraint and rollback/restore plan on a disposable production-shaped database.
4. Confirm which system actually applies SQL migrations and whether duplicate numeric prefixes are supported. Do not rename historical migrations without a separate plan.
5. Record explicit owner approval and required release evidence before any production SQL execution.
6. Re-run the privilege-hardening preflight and billing tests against the reconciled production-shaped schema before considering Migration 038.

## Acceptance
- `country_code` present in a verified intended schema; deployment history is recorded or an equivalent application is independently evidenced.
- No release readiness claim solely from fixture tests or matching migration names.
- All production SQL and migration ledger writes remain forbidden until separately approved.

## Content fingerprint results (read-only, 2026-10-19)
- `001_b3_accounts.sql`: **EXACT_MATCH** against production ledger SHA-256.
- `002_b4_billing.sql`: **EXACT_MATCH** against production ledger SHA-256.
- `034_billing_webhook_event_privileges.sql`: **COMMENT_STRIPPED_MATCH** after removing full-line comments and trimming boundary whitespace; its one executable REVOKE statement matches.
- `029_account_rls_auth_initplan.sql`: **UNRESOLVED_DIFFERENCE** after the same normalization. Production ledger metadata contains 11 ALTER POLICY clauses, 5 WITH CHECK clauses, and 13 auth.uid() references. Repository file visually contains 11 ALTER POLICY statements. Compare normalized executable SQL and current pg_policies before inferring equivalence.
- Source of classifications: exact-head successful Atomic billing PostgreSQL proposal workflow #39266788267, commit `9fcf6cbb7aa3c1011a3a25e14ca5b54cc9ee70c2`. General CI #39266788296 also passed.
- Fingerprints establish content comparison only; they do not substitute for deployment authorization or verify current schema effects. Migration 009 remains unrecorded and its `country_code` column absent in production.
