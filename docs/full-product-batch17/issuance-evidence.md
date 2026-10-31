# Atomic invitation issuance — prepared, tested, unactivated

BUS-ISSUANCE is implemented as guarded review material in `tests/batch17-issuance/review-only-issuance.sql`. It takes the organization row lock shared by the guarded Batch16 redemption successor, rechecks caller Business entitlement and owner/admin membership, then atomically counts members plus live pending invitations and inserts one reservation. Active application actions, historical migration files and Batch16 artifacts remain unchanged.

Ten genuine local GoTrue/PostgREST acceptance groups cover synchronized distinct and identical requests, last reservation, total quota, expiry exclusion, accepted-row exclusion, pending-to-member conversion, Business admin positive and caller entitlement/role/foreign-tenant/invalid input/anonymous negatives. The race first holds the organization row, starts both genuine RPCs and observes two locked database backends before releasing the blocker. Exactly one distinct request reserves the final seat. The same-request case creates one row and retains existing duplicate rejection; this proposal adds no retry/idempotency policy. A mutation changing the quota threshold from five to six fails the final-seat assertion with `2 !== 1`; the subsequent unchanged proposal passes. The mutation is applied only to the in-memory disposable proposal copy. Test logs are retained next to the receipt.

The database captures authoritative time after acquiring the lock and expires new invitations exactly604800 seconds later. This preserves the seven-day elapsed lifetime while explicitly moving the new proposal's clock source from the active application's JavaScript timestamps to the database. Caller-supplied timestamps are not accepted. Review this clock binding during adoption; the active source remains unchanged. Existing partial unique email index behavior is retained, including duplicate rejection for an expired but still unaccepted same-email row. No existing-member or owner eligibility rule is added.

The campaign proves both unchanged proposal guards reject before in-memory local adoption. It uses PostgreSQL17.6, GoTrue2.197.0, PostgREST12.2.3 and Node22.23.4, pinned by image digests. The fixture uses genuine GoTrue signup/JWTs and PostgreSQL authorization through PostgREST; privileged SQL is limited to entitled-account/model setup, observed barriers, guard proof and explicit test state. Local fixture autoconfirm is not hosted mail/provider acceptance. Every created fixture is closed in `finally`.

The direct authenticated table INSERT remains able to bypass quota after the RPC fills all seats. This is an observed adoption blocker, not an acceptance success for the active product. `issuance-writers.md` enumerates source-visible participating, direct, privileged and cascade writers. Complete hosted writer discovery, authentic current DDL/ACL/history, role/owner/existing-member policy, compatibility and deletion effects, and approved deployment/rollback remain blocked. No production equivalence or product release claim is made.

Reproduce with exact dependencies and Node22:

```sh
export ISSUANCE_ARTIFACTS="$(mktemp -d /tmp/issuance-evidence-XXXXXX)"
node tests/batch17-issuance/acceptance.mjs
node tests/batch17-issuance/verify-receipt.mjs "$ISSUANCE_ARTIFACTS/receipt.json"
ISSUANCE_MUTATION=quota-six node tests/batch17-issuance/acceptance.mjs # must fail 2 !== 1
```

The fixture requires the local Docker socket and an isolated SDK-only window when sharing a host with browser acceptance. Do not run Docker container changes alongside Chromium/Next browser campaigns. No builds or full unit suite were requested or run for this bounded review-only SQL task.

The receipt's `baseHead` is the supplied exact green PR1506 commit. `modelProvenance.sourceCommit` is an unchanged historical label emitted by the shared fixture; it is not the current checkout identity. The model's complete source hashes and guarded-bundle manifest identify the exercised inputs; the receipt verifier rehashes those model sources as well as the new issuance inputs.

Fresh campaigns require `ISSUANCE_ARTIFACTS` outside the source checkout and write `receipt.json` there. The verifier accepts an explicit receipt path or that environment directory. The committed `issuance-receipt.json` remains byte-for-byte historical evidence from the original driver; its driver hash deliberately differs after the recorder change and it must not be verified as a current-driver run. Integrated acceptance records current source hashes in a separate fresh receipt.

Verifier follow-up: the original verifier incorrectly accepted empty own/model source arrays. This was reproduced with a modified fresh receipt. It now requires the exact eight driver source paths and the complete model path inventory from unchanged trusted Batch16 provenance, rejects duplicate paths and malformed SHA256 values, and checks all ten acceptance names before reading receipt-derived paths. This proves complete binding to current repository bytes; it does not authenticate who produced an otherwise forgeable JSON receipt. CLI regression coverage uses a supplied genuine fresh receipt:

```sh
ISSUANCE_VALID_RECEIPT=/path/to/fresh/receipt.json node --test tests/batch17-issuance/verify-receipt.test.mjs
```

The hardening follow-up was measured separately: 2026-10-31T20:48:25Z through 2026-10-31T20:49:21Z,56seconds through completed verification, including tests. Positive fresh receipt verification and malformed/omitted/duplicate/hash-shape/path-escape/check-name negatives passed; ESLint and syntax checks passed. No SQL, genuine campaign, Docker, or historical receipt bytes changed. This follow-up is not included in the earlier258-second implementation window.
