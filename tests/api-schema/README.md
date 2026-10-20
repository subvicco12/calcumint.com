# Repository schema fidelity acceptance

Run from repository root:

```
node tests/api-batch/atomic-postgres.mjs --http
node tests/api-embed/atomic-postgres.mjs
```

Both lanes now load whole, unchanged repository migrations 001, 003, 004,
005, 006, 029 and 032_business_builder. They share actual profiles, auth-user
trigger, organizations, membership/role helpers, calculator versions/runs,
foreign keys, checks and RLS policies. There are two organizations and three
users: owner, member with a different UUID from its organization, and outsider
who owns the other organization. This replaces the former org UUID = user UUID
helper shortcuts and incomplete table definitions. Existing acceptance cases
and real PostgREST/route cases run against this dependency graph.

Additional native checks cover actual member and outsider reads, membership
removal, consent join RLS, profile plan update denial, effective service/client
RPC grants, definer owner/search path, committed concurrent plan downgrade
(batch), and committed concurrent calculator tenant transfer (both). Owner
mutation transactions reach a server-observed PgSleep barrier before the RPC
starts; the RPC must wait for the row lock and reject the changed authority.
All proposals retain their guards and are applied only inside disposable
containers. No proposal SQL change was needed.

| Evidence | State | Limit |
| --- | --- | --- |
| Named repository dependency migrations and constraints | VERIFIED (repository isolated) | Whole files, not entire migration history |
| Membership helpers and RLS on profiles, builder, leads/consents, batch jobs | VERIFIED (repository isolated) | Auth claim interpretation modeled below |
| RPC grants and SECURITY DEFINER behavior, retry/conflict/rollback, row lock changes | VERIFIED (repository isolated) | Synthetic data; service role has BYPASSRLS |
| PostgREST 12 transport and real Next route handlers | VERIFIED (repository isolated) | Pinned fixture images and synthetic signing keys |
| Live project migrations and effective ACLs/role inheritance/default ACLs | UNKNOWN (production) | No live project accessed |
| Supabase auth.users DDL, auth.uid(), platform role setup and table grants | UNKNOWN (production) | Explicit fixture model, not copied from live catalog |
| Later bounded policy/grant compatibility | VERIFIED (repository isolated) | Dedicated privileges.postgres.mjs loads whole 002/007/008/008b/013/035_split/038; entire history remains UNKNOWN |
| Production readiness / deployment | BLOCKED | Owner-reviewed catalog, policy, role, auth and deployed route attestations remain required |

Platform-only fixture assumptions are deliberately visible in bootstrap.mjs:
auth.users has only the columns used by these migrations, auth.uid() accepts
legacy and JSON JWT sub claims, anon/authenticated have no inherited roles,
service_role has BYPASSRLS, and authenticated gets a table SELECT allowlist to
exercise actual RLS. Repository profile column UPDATE permission is preserved.
Existing route fixtures grant their own explicit service SELECT allowlists.
These grants describe the test environment, not production. The definer owner
is local postgres; no hosted owner or configuration equivalence is claimed.
The batch authority remains the key creator's Business profile per existing
contract; this lane does not invent a new organization-owner requirement.

Docker runs use pinned PostgreSQL 16 and PostgREST 12 images, internal networks,
no published host ports, tmpfs database storage, synthetic credentials and
finally cleanup. No production URL or API is involved. This is not an
exactly-once or production-equivalence claim.

## Sanitized owner attestation helper

`catalog.sql` is a single read-only SELECT over system catalogs, scoped to the
API/builder dependency allowlist. It returns sorted JSON with table RLS flags,
PK/FK/unique/check definitions, policy expressions, effective role table and column grants,
all public-schema function signatures/results/definer/configuration, EXECUTE grants and
role flags/membership edges. It excludes table rows, full function bodies,
passwords, JWT values, connection details and role settings. Review organization
policy expressions before sharing a snapshot if names are sensitive.

An authorized owner can later run it through their approved read-only database
workflow and provide its JSON output. No connection to any external project is
made by this test lane. Validate an existing JSON file locally with:

```
node tests/api-schema/validate.mjs /path/to/sanitized-catalog.json batch
node tests/api-schema/validate.mjs /path/to/sanitized-catalog.json embed
```

The optional lane defaults to `both` (both proposals must exist). The validator
checks bounded required tables, PK/FK presence, RLS/policy presence, anonymous
read denial, role superuser/BYPASSRLS flags, and exact RPC parameter names/types,
result type, fixed search path, nonempty owner name outside the three observed roles and effective EXECUTE
allowlist. Native fixtures validate real catalog output and reject deliberate
mutations: disabled RLS, missing PK/FK, missing policy, unsafe search path,
anonymous RPC grant, changed RPC signature, incomplete/duplicate grants or roles,
nonboolean grant values, missing/empty owner names and missing configuration. It intentionally does not assert
exact full catalog equality, owner identity equivalence, default ACLs,
policy semantic equivalence, non-API function authorization or external quota writers.
Passing this validator proves only this bounded contract, never environment
provenance, authorization to apply SQL, or production readiness.

Required evidence is fail-closed: the three observed roles and every table/RPC
role-grant array must contain exactly one row each for anon, authenticated and
service_role, with boolean privilege values. Duplicate table names and missing
required evidence are rejected. A nonempty owner name outside those three roles
is only an owner-category check; it does not establish that an arbitrary named
role is trusted, approved, or equivalent to the production owner. The standalone
regressions run with `node --test tests/api-schema/validate.test.mjs`; the same
tamper checks also run mandatorily inside both native fixture workflows.

## Additional isolated privilege fidelity lane

Run `node tests/api-schema/privileges.postgres.mjs`. This dedicated pinned PG16
fixture retains the original batch/embed native HTTP suites unchanged; it does
not rerun their 26 batch and 37 embed HTTP cases. It loads the baseline whole
files and whole 002_b4_billing, 007_b9_ai, 008_b10_admin_factory,
008b_b10_alert_automation, 013_production_rpc_privilege_hardening_v2,
035_split_overlapping_write_policies and the unapplied 038 proposal. No policy
fragments, stub admin helpers or invented billing tables substitute for those
files. Other history, including the distinct 035_atomic_catalog_creation, is
not attested. These dependencies sufficed; no whole-file dependency was blocked.

A real inherited authenticated TRUNCATE bypasses table RLS (transaction rolled
back); whole 038 aborts on that inherited path. After removing the inheritance,
038 clears direct table and column ACLs, preserves own display_name UPDATE,
and rejects profile plan UPDATE and TRUNCATE. All three API proposals retain
and exercise their refusal guards before isolated installation after 038.
The follow-up executes real service batch submit/recovery/duplicate charging
(one job/receipt, two quota events), embed capture/duplicate (one lead/consent/receipt),
all three client RPC denials, cross-organization embed rejection and late receipt
fault rollback for both APIs. This remains bounded native behavior coverage,
not another full HTTP run or any deployed grant change.

Whole 013 exposes a real unresolved client dependency: revoking PUBLIC helper
EXECUTE also removes authenticated access to is_org_member/has_org_role because
the baseline whole files never grant it explicitly. The native test first
reproduces authenticated owner RLS SELECT denial. It then adds explicitly
fixture-only authenticated helper EXECUTE grants to verify owner/outsider job,
lead and consent isolation. Unmodified whole-history client compatibility is
therefore BLOCKED on helper ACL review; no repository SQL fix or hosted grant
is inferred. Service RPC checks run before this fixture-only ACL restoration.

Catalog version 2 additionally reports effective TRUNCATE/TRIGGER/REFERENCES,
owner-role access, all physical column SELECT/INSERT/UPDATE/REFERENCES grants,
public schema USAGE/CREATE and EXECUTE for every public-schema function.
The validator rejects missing memberships, any observed role inheritance,
client owner access, dangerous client privileges, anonymous column access,
client schema CREATE and incomplete column grants. The native lane grants
TRUNCATE/TRIGGER/REFERENCES and schema CREATE individually and verifies catalog
rejection. The service role retains its explicitly modeled powers. Unknown
snapshots fail validation; a pass never implies owner approval. All public RPC
ACLs are collected, but only the three API RPCs have an enforced execute
allowlist; helper/admin/other RPC ACL semantics remain owner-review evidence.
Role-specific search_path/default ACLs and arbitrary owner trust remain UNKNOWN.
Production 038 application and resulting privileges remain UNKNOWN; RELEASE HOLD.
