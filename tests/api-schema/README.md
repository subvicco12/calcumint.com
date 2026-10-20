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
| Later whole-history policy/grant hardening compatibility | BLOCKED (scope) | 013/035/038 have unrelated dependencies and are not partially extracted or falsely attested |
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
PK/FK/unique/check definitions, policy expressions, effective role CRUD grants,
selected function signatures/results/definer/configuration, EXECUTE grants and
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
read denial, role superuser/BYPASSRLS flags, and exact RPC parameter types,
result type, fixed search path, trusted owner category and effective EXECUTE
allowlist. Native fixtures validate real catalog output and reject six deliberate
mutations: disabled RLS, missing PK/FK, missing policy, unsafe search path,
anonymous RPC grant, changed RPC signature. It intentionally does not assert
exact full catalog equality, owner identity equivalence, all column/default ACLs,
policy semantic equivalence, unlisted functions or external quota writers.
Passing this validator proves only this bounded contract, never environment
provenance, authorization to apply SQL, or production readiness.
