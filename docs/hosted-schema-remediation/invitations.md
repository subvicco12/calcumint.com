# Captured invitation acceptance

Status: **hosted remediation and policy decisions BLOCKED**. This focused successor includes a sanitized scoped catalog fixture, source-bound to the private authorized descriptor; full capture and test receipts stay outside Git. It does not change production, application calls, historical migrations, or guarded proposals.

Run from the repository with the exact installed dependencies and a Docker-capable Node runtime:

```sh
INVITATION_ARTIFACTS=/absolute/private/invitation-receipts \
node tests/hosted-schema-remediation/invitations/acceptance.mjs
```

The initializer reconstructs captured profiles, preferences, organizations, memberships, invitations and audit tables, column identity/defaults, constraints, captured indexes (including pending-email uniqueness), RLS policies, effective table grants, invitation/helper function definitions and execute grants, and applicable triggers. Pinned PostgreSQL17.6, GoTrue2.197.0 and PostgREST12.2.3 run on an internal disposable Docker network with no published ports. Real local signup JWTs exercise the original captured RPC and policies. Local GoTrue supplies auth internals; this is scoped hosted-shaped acceptance, not whole-schema, hosted-gateway or production acceptance.

The acceptance targets include:

- Captured partial pending-email uniqueness rejects case-insensitive same-organization duplicates, including expired unaccepted rows; accepted-row email reuse succeeds. The runtime index definition matches the captured scoped definition.
- Two direct authenticated issuers both reserve the final available seat; captured RLS has no quota reservation protocol.
- Two distinct redemptions both pass the final-seat read and produce six members; two redemptions of one token both succeed and append two audit records. Test-only BEFORE INSERT advisory barriers prove both requests reached the write after reading state before release.
- Existing owner redemption can replace the owner membership role. At five members, even an existing-member invitation fails before updating its role. These characterize captured behavior; approving either contract remains a policy decision.
- Deleted invitations cannot subsequently redeem. An injected audit failure rolls back membership and acceptance timestamp together.
- Privileged SQL writers bypass the reservation limit.
- The unchanged Batch17 issuance guard rejects execution. An in-memory unguarded copy is installed only in the disposable fixture: full quota rejects, available capacity accepts, and authenticated direct insertion still bypasses quota. Original captured redemption remains installed, so no complete shared locking protocol is claimed.

The artifact directory uses the existing Batch17 path guard, including canonical ancestor/symlink checks, before starting Docker. The external receipt records check names, descriptor hash, fixture provenance, proposal hash and test-source hashes. The committed scoped fixture includes only the six required tables and six helper/RPC definitions with their scoped metadata; it contains no account identifiers, tokens or application rows. Set HOSTED_DESCRIPTOR optionally to verify the full private source hash and exact selected rows against the committed fixture. The runner always validates the scoped fixture hash. The earlier Batch16 and Batch17 QA suites are reused as fixture/proposal sources, not rerun.

Adoption requires explicit decisions on existing-member changes and owner roles, participation or fencing of every direct and privileged writer, and production rollout/rollback authority. Successful local characterization does not unblock these decisions.
