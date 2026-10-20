# Client-role privilege hardening proposal

Baseline: draft #1439, `e2bf2cdd57f73151c5ea6071bd5817e5e236d705`; main `caffafe639350ca0c2c2cf33ae1f099294f5af54`. RELEASE HOLD. Migration 038 is a reviewable proposal, not an applied production change.

## Evidence and minimum matrix

Production findings below are supplied by the owner, not re-queried by this task. Fixture grants deliberately reproduce a broad ACL superset; they are not a production ACL export. RLS alone does not authorize or prevent TRUNCATE.

| Table | Supplied before evidence | Proposed anon | Proposed authenticated |
| --- | --- | --- | --- |
| profiles | Broad anon privileges; both roles TRUNCATE/TRIGGER/REFERENCES; authenticated display_name editable, plan not editable | None | SELECT; UPDATE(display_name) only |
| subscriptions | Broad anon grants; unnecessary authenticated writes; both roles TRUNCATE/TRIGGER/REFERENCES | None | SELECT only |
| billing_customers | Broad anon grants; unnecessary authenticated writes; both roles TRUNCATE/TRIGGER/REFERENCES | None | SELECT only |
| user_preferences | Broad anon grants; both roles TRUNCATE/TRIGGER/REFERENCES | None | SELECT, INSERT, UPDATE |
| billing_webhook_events | Client privileges already denied | Unchanged: none | Unchanged: none |

Migration clears direct table and column grants from PUBLIC, anon and authenticated, then restores the allowlist. It leaves owners, service_role grants, policies, functions and other tables unchanged. Effective-privilege assertions abort the whole transaction if inherited grants defeat the allowlist; the migration does not revoke unrelated role memberships. Future default privileges are outside this four-table change and require owner review.

## Application dependencies

- Account, pricing, Business, AI and plan consumers read authenticated profiles/subscriptions; SELECT remains, constrained by existing owner RLS.
- Profile display_name UPDATE remains. No profile INSERT/DELETE or plan UPDATE is granted to clients. Account bootstrap uses the existing SECURITY DEFINER trigger (postgres-owned in the fixture), not a client insert; the deployed trigger owner still requires attestation.
- `src/app/account/actions.ts` preferences upsert supplies user_id, locale, currency, unit_system, country_code and updated_at. INSERT/UPDATE/SELECT preserve its ON CONFLICT path. Existing WITH CHECK prevents moving a row to another owner. Preferences DELETE is not used and is not granted.
- Checkout/portal read billing rows and interact with the provider; they do not need client billing DML. Subscription webhook uses server-only atomic RPC; non-subscription receipt insertion remains server-only. Existing service_role explicit privileges are preserved.
- Favorites, history, projects, scenarios, sequences, calculator definitions, formulas and identities are untouched.

## Disposable PostgreSQL evidence

The existing harness creates a separate synthetic database, applies real migrations 001/002/009, reproduces broad table/PUBLIC/column grants and performs a successful anon TRUNCATE inside a rolled-back transaction. A no-op migration fails the new privilege assertion. Migration 038 then passes twice (idempotent).

Verified: 37 actual denied statements across anon/authenticated TRUNCATE, TRIGGER creation, foreign-key REFERENCES, profile plan/INSERT/DELETE, billing INSERT/UPDATE/DELETE, invalid-owner preferences and preferences DELETE. Tests check residual column ACLs, all seven service_role table privileges individually, owner-only profile/customer/subscription reads, cross-owner update isolation, legitimate display-name edit, preferences upsert and real account bootstrap. Policies remain byte-identical in the catalog. Proposed atomic RPC successfully grants the configured Pro state in this isolated database after hardening. An inherited billing UPDATE grant makes migration 038 abort; earlier revokes roll back with it.

All existing 54 PostgreSQL billing cases passed in the same harness, alongside the new privilege suite. The 49 focused unit tests, typecheck, affected lint and one `next build --webpack` passed locally. Fixture state is disposable; no production connection is used. The scoped CI watches migration 038 and its real prerequisite migrations. Mandatory CI and npm ci/build scripts are unchanged.

## Owner actions and safe adoption

1. Database/security owner exports current direct/column/PUBLIC/inherited ACLs, roles, schema rights, RLS and trigger owners; verify no undocumented anon/account client dependency. Review explicit service_role grants rather than relying on PUBLIC access.
2. Review migration 038 against the exact deployed schema and migration ordering. Existing duplicate historical migration numbers are unchanged; confirm the deployment runner's ordering without renaming history.
3. Obtain authorized change approval and retain an ACL-only backup. This task neither authorizes nor performs application. Test the reviewed production-shaped schema and real gateway claims offline first.
4. A separately authorized operator applies this transaction and verifies effective privileges and legitimate account operations. If assertions fail, the transaction rolls back; resolve the inherited role path with the owner rather than weakening assertions.
5. Prefer a narrow forward grant for a demonstrated legitimate dependency. Do not restore broad anon writes or TRUNCATE/TRIGGER/REFERENCES as a blanket rollback. Account data is not mutated by this migration.

Production application/verification, external privileged writers, default privileges, provider consistency and full atomic RPC adoption remain BLOCKED/UNKNOWN. Fence/completion objects and RPCs remain absent per supplied production evidence. All 1,636 external authority decisions remain UNKNOWN; Mortgage/BMI dependencies remain blocked. No certification, publication, production writes, live payments, merges or deployments.
