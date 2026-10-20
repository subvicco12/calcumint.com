# Membership administration: disposable PostgreSQL evidence, 2026-10-20

Status: RELEASE HOLD. Draft engineering evidence only. No production reads or writes, migration application, deployment, publication, or certification occurred. The new SQL remains a guarded UNAPPLIED proposal, outside migrations.

## Scope and authority

The standalone `tests/api-schema/membership.postgres.mjs` creates a disposable PostgreSQL 16 container on an internal network with no host ports and synthetic identities. It applies repository migrations whole and unchanged: bootstrap 001/003/004/005/006/029/032, then 002/007/008/008b/013/014/035. It models Supabase auth and platform table ACLs explicitly; table UPDATE/DELETE grants are fixture prerequisites, not claims about production grants. It does not recreate the complete production schema or attest deployed ACLs.

Repository `permissions.ts` reserves ownership transfer for owners and allows owner/admin member administration. Owners retain the existing low-level promotion/demotion and owner_user_id transfer primitives in the proposal. No atomic transfer workflow or canonical-owner consistency guarantee is introduced. Existing owner membership deletion remains denied by the unchanged DELETE policy.

## Findings and reproductions

1. Migration 013 revokes PUBLIC EXECUTE on `org_role(uuid)`, leaving authenticated denied. Even after the separate helper EXECUTE proposal is accepted in isolation, membership UPDATE still raises `permission denied for function org_role`. The existing UPDATE policy references that helper directly. PostgreSQL does not promise boolean short-circuit order; even a non-owner NEW role can hit this denial.
2. With an explicitly temporary **disposable-only** org_role grant, the old UPDATE policy allows an admin to demote an OLD owner row to member: USING checks only administrator status; CHECK fences only a NEW owner role. The temporary grant is then revoked. This is a latent policy defect, not an assertion that the helper-denied baseline currently permits the update.
3. The organization UPDATE policy allows an admin to change `owner_user_id` to an outsider, contrary to the owner-only ownership capability. This operation already works after the two-helper repair without granting org_role. The test also exercises it during the temporary-grant forensic phase.
4. A proposed cross-org membership move into an organization where the actor is an outsider is **already denied** by actual RLS. The SELECT policy's NEW-row visibility supplies a restriction absent from the UPDATE CHECK text. No cross-org exploit is claimed from reading the policy text alone.

## Narrow proposed repair

`MEMBERSHIP-ADMIN-FENCING.sql` requires an explicit guard removal for isolated acceptance, checks the helper prerequisites and existing membership policy, and runs transactionally. It replaces the direct org_role policy call with the already-reviewed boolean helper, fences OLD owner rows from admins, and retains owner-only promotion. It grants no EXECUTE or table privileges and leaves org_role denied.

Two invoker trigger functions compare OLD/NEW values: membership identity keys cannot be rewritten, and changing organization owner_user_id requires owner authority; organization id is immutable. These are deliberate additional identity invariants, not a claim that every prior identity edit was exploitable. Tests show null-auth postgres ownership mutation is denied by the ownership trigger; service_role with explicit fixture SELECT/UPDATE table grants is denied EXECUTE on has_org_role inside that trigger (013 does not grant that helper to service_role). No service bypass is invented. They also constrain service/maintenance UPDATEs; a future owner-approved migration must explicitly review those workflows. The trigger functions are search-path pinned and their direct client/PUBLIC EXECUTE is revoked. Trigger invocation itself does not require a client EXECUTE grant.

The proposal permits an owner to change owner_user_id or membership roles separately, preserving current owner authority. It does not require a matching canonical owner membership, prevent multiple owners, implement an atomic transfer, serialize seat acceptance, fix invitation replay/acceptance races, or provide an immediate-revocation lock protocol. Those are separate review scopes.

## Verification and concurrency limits

The native test reports **52 explicit role/RLS/ACL matrix checks**, **four real organization-create/invitation RPC checks**, and **four explicit ordinary-admin/promotion-denial/conflicting-UPDATE assertions** across owner/admin/manager/member/viewer/outsider, plus baseline reproductions, guarded refusal, failed-prerequisite rollback with no trigger creation, and safe reapplication. The matrix verifies owner/admin organization editing, owner-row demotion/delete fencing, identity immutability, owner transfer preservation, admin transfer denial, all four ordinary membership roles, owner promotion, outsider isolation and continued org_role EXECUTE denial.

A server-observed barrier holds a real DELETE of the admin membership uncommitted. A simultaneous independent authenticated organization UPDATE still succeeds using committed membership. After the DELETE commits, fresh statements see zero rows and cannot mutate the organization. This documents READ COMMITTED statement/snapshot behavior; it is not transaction-wide revocation, cancellation of an in-flight authorized statement, repeatable-read freshness, or a guarantee that revocation waits on every dependent operation. No application locks are added by the proposal.

An admin can first change the ordinary target to manager and cannot promote it to owner. A separate real row conflict starts an authenticated owner promotion of a distinct target member, holds its transaction, starts an authenticated admin demotion against that same row, and observes the admin backend in a server Lock wait. After the owner commits, the admin UPDATE returns zero rows and the committed target remains owner: PostgreSQL rechecks the changed OLD row under the policy. The test verifies this specific READ COMMITTED conflict; it does not generalize to unrelated rows or long-lived snapshots.

Run: `node tests/api-schema/membership.postgres.mjs`. The mandatory native CI privilege harness invokes the membership test in its own isolated database. Related helper/privilege harness: `node tests/api-schema/privileges.postgres.mjs`. Targeted existing Business tests and ESLint are also run. Parent owns final aggregate validation and release decisions.
