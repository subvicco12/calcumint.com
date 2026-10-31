# Atomic invitation issuance — prepared, tested, unactivated

BUS-ISSUANCE is implemented as guarded review material in `tests/batch17-issuance/review-only-issuance.sql`. It takes the organization row lock shared by the guarded Batch16 redemption successor, rechecks caller Business entitlement and owner/admin membership, then atomically counts members plus live pending invitations and inserts one reservation. Active application actions, historical migration files and Batch16 artifacts remain unchanged.

Ten genuine local GoTrue/PostgREST acceptance groups cover synchronized distinct and identical requests, last reservation, total quota, expiry exclusion, accepted-row exclusion, pending-to-member conversion, Business admin positive and caller entitlement/role/foreign-tenant/invalid input/anonymous negatives. The race first holds the organization row, starts both genuine RPCs and observes two locked database backends before releasing the blocker. Exactly one distinct request reserves the final seat. The same-request case creates one row and retains existing duplicate rejection; this proposal adds no retry/idempotency policy. A mutation changing the quota threshold from five to six fails the final-seat assertion with `2 !== 1`; the subsequent unchanged proposal passes. The mutation is applied only to the in-memory disposable proposal copy. Test logs are retained next to the receipt.

The database captures authoritative time after acquiring the lock and expires new invitations exactly604800 seconds later. This preserves the seven-day elapsed lifetime while explicitly moving the new proposal's clock source from the active application's JavaScript timestamps to the database. Caller-supplied timestamps are not accepted. Review this clock binding during adoption; the active source remains unchanged. Existing partial unique email index behavior is retained, including duplicate rejection for an expired but still unaccepted same-email row. No existing-member or owner eligibility rule is added.

The campaign proves both unchanged proposal guards reject before in-memory local adoption. It uses PostgreSQL17.6, GoTrue2.197.0, PostgREST12.2.3 and Node22.23.4, pinned by image digests. The fixture uses genuine GoTrue signup/JWTs and PostgreSQL authorization through PostgREST; privileged SQL is limited to entitled-account/model setup, observed barriers, guard proof and explicit test state. Local fixture autoconfirm is not hosted mail/provider acceptance. Every created fixture is closed in `finally`.

The direct authenticated table INSERT remains able to bypass quota after the RPC fills all seats. This is an observed adoption blocker, not an acceptance success for the active product. `issuance-writers.md` enumerates source-visible participating, direct, privileged and cascade writers. Complete hosted writer discovery, authentic current DDL/ACL/history, role/owner/existing-member policy, compatibility and deletion effects, and approved deployment/rollback remain blocked. No production equivalence or product release claim is made.

Reproduce with exact dependencies and Node22:

```sh
node tests/batch17-issuance/acceptance.mjs
node tests/batch17-issuance/verify-receipt.mjs
ISSUANCE_MUTATION=quota-six node tests/batch17-issuance/acceptance.mjs # must fail 2 !== 1
```

The fixture requires the local Docker socket and an isolated SDK-only window when sharing a host with browser acceptance. Do not run Docker container changes alongside Chromium/Next browser campaigns. No builds or full unit suite were requested or run for this bounded review-only SQL task.

The receipt's `baseHead` is the supplied exact green PR1506 commit. `modelProvenance.sourceCommit` is an unchanged historical label emitted by the shared fixture; it is not the current checkout identity. The model's complete source hashes and guarded-bundle manifest identify the exercised inputs; the receipt verifier rehashes those model sources as well as the new issuance inputs.
