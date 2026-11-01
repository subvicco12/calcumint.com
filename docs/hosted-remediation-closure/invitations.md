# Invitation and membership writer characterization

This successor characterization runs the **unchanged captured initializer** from `tests/hosted-schema-remediation/invitations/initializer.mjs` in a unique disposable, internally networked Docker fixture with pinned PostgreSQL 17.6, GoTrue v2.197.0 and PostgREST v12.2.3. It does not execute either guarded proposal or change production. These are observations of captured policy, not approved desired behavior or remediation.

Run with Node 24 and the repository's cached dependencies:

```sh
INVITATION_ARTIFACTS=/tmp/calcumint-invitation-closure-unique node tests/hosted-remediation-closure/invitations/acceptance.mjs
```

The artifact directory must be outside Git. Docker images must already be cached; the upstream fixture uses `--pull=never`, an internal network, no published container ports and removes containers/network in `finally`. The suite resolves its own database container by the database container hostname, including when other fixtures run concurrently.

The independently executable suite advances membership and privileged API writer coverage beyond the prior twelve checks:

- Admin demotion of owner membership, while `organizations.owner_user_id` continues pointing to that user; admin promotion to owner is rejected, while owner promotion creates multiple owners.
- Admin replacement of a membership's `user_id` with an existing auth user; unauthorized destination tenant membership move is rejected without moving the row.
- Admin mutation of organization owner reference to a user in another tenant who is not a member of this organization.
- Authenticated direct membership insert rejection, contrasted with successful service-role PostgREST insert/delete of owner membership.
- Service-role PostgREST invitation insertion with another tenant's inviter and membership insertion producing six members.
- Acceptance versus revocation after invitation selection, actual wall-clock expiry while waiting, and a privileged concurrent member insert after the seat count.
- Concurrent auth-user deletion causing a late foreign-key error: no membership/audit is persisted and the invitation's accepted timestamp remains null.

Concurrency uses a persistent psql transaction holding `SHARE ROW EXCLUSIVE` on the membership table. Acceptance must appear in `pg_stat_activity` waiting on a lock before the competing operation or release. The holder can insert a competing member before commit. Expiry is proven with PostgreSQL `clock_timestamp()` crossing the stored expiry while acceptance is blocked. No scheduling sleeps establish ordering. Every case asserts exact persisted roles/counts/references, accepted timestamps and/or audit counts as applicable. The holder rolls back on failure, and the disposable fixture is removed on every exit.

Policy remains blocked: owner identity versus membership authority, owner demotion and multiple owners, membership identity mutability, tenant affiliation of privileged foreign references, privileged-writer seat enforcement, revocation linearization, expiry semantics after waiting, and serialization with concurrent membership changes all need explicit product/security decisions. A late FK error rolling back does not resolve these policy choices. No successor policy is invented, and no migration or proposal is adopted.

Successful receipt `receipt.json` records each assertion, captured provenance, Node version, SHA-256 of this suite, the unchanged initializer, scoped descriptor and upstream runtime fixture, and explicit `policyApproved:false`, `productionWrites:false`, `activation:false`.

Validated 2026-11-01 on Node v24.19.0: all 11 checks passed against the actual disposable GoTrue/PostgREST fixture. Receipt: `/tmp/calcumint-invitations-closure-20261101/receipt.json` (outside Git). The optional full private descriptor was not supplied; scoped descriptor integrity was verified by the unchanged initializer against its manifest. This limitation does not imply whole-hosted equivalence.

| Source | SHA-256 |
| --- | --- |
| New `acceptance.mjs` | `de2b64b819b1c339a58155e7109aae6eb1740567b6564e0bf0fa430a0259a691` |
| Unchanged captured initializer | `92ad60fff0202ecbae696fc10b93b74120a0546456a983d78d066debdf242ff0` |
| Unchanged scoped descriptor | `bc77cb1af8f764ab230c0933dfd5910c07c6c2097f4fb15a4e4c11b1e3a7508e` |
| Unchanged GoTrue fixture | `98265ac37460e7676f6f5dae59a20110e82aefba1e9d567f880e0df6aa768387` |
