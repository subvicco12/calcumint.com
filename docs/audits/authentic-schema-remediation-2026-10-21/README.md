# Authentic schema remediation — RELEASE HOLD

Baseline #1463:d4f929b61a270977410a9dfa77d0c179f7810e16. Owner-supplied Work metadata capture2026-10-21T11:56:50.220368Z, project zpwpstsvztyshcnwdfye, PostgreSQL17.6, transaction_read_only=on. No production call/write is made by this remediation.

## Provenance and coverage

ZIP SHA-256:b11faf45f11deee82251582679282dec08e5eccb5b3508574835196f734a1b09. All35 SHA256SUMS entries match. Independently recomputed37 tables/333 table columns/186 constraints/119 indexes/17 public-table triggers/86 policies/33 public functions/37 ledger rows match the capture manifest. All33 supplied public function DDL hashes match the initial metadata. Sequences add seven relations and21 columns; they are not extra tables. Capture includes role memberships/default ACLs and effective client/service grants. Metadata and raw function DDL stay outside the repository; the fixture is SHA-bound when used locally.

Coverage is the declared public schema, not all hosted auth/platform semantics, sequence options/state, provider/console/external writers, application rows or ledger statement bodies. Supplied provenance and hash consistency are verified; this is not a new independent production query or a claim of cryptographic signer authentication.

## Demonstrated gaps and engineering

- Nineteen proposed functions and four receipt/fence/completion tables are absent at capture. Existing quota RPC has a non-atomic body despite a matching signature. Existing source proposals implement these contracts; the reviewed bundle reuses them plus the four exact missing admin audit migration sources.
- All36 observed client-TRUNCATE tables are covered by the new additive security proposal. It removes only TRUNCATE from the32 tables outside historical038; existing non-TRUNCATE rights there are preserved. Historical038 itself is unchanged and its four-table allowlist is composed into the reviewed transaction. Inherited privileges that defeat denial abort the whole transaction.
- Captured org_role grants cause unchanged membership prerequisites to fail. The composed proposal restores its documented internal boundary for PUBLIC/anon/authenticated/service_role before helper/membership checks. Existing service execution of is_org_member/has_org_role remains unchanged; no application direct org_role caller was found. External consumers still need owner review.
- Captured creation defaults give service_role unintended direct new-table rights and internal function EXECUTE. The explicit object ACL proposal fixes all19 scoped function allowlists and four new tables, preserving service RPCs and authenticated save/admin entry points. Trusted postgres ownership/RLS is asserted; inherited rights abort. Schema-wide default ACLs are deliberately unchanged, so future object creation outside this bundle still requires an owner-reviewed policy.

Files:
- `docs/architecture/proposals/20261021-v1-authentic-account-security.sql`
- `docs/architecture/proposals/20261021-v1-atomic-object-privileges.sql`
- `scripts/build-authentic-upgrade-review.mjs`
- `tests/billing/authentic-security.postgres.mjs`

The builder emits a guarded single-transaction review bundle and exact source/hash manifest, not a database executor. It uses country009 → revised helper/membership/038/36-table security → four admin audit sources → billing → history → API quota → batch → embed → explicit object ACLs → strict account postcondition. Temporary unsafe creation defaults are corrected before COMMIT. Actual deployment IDs remain unassigned. Existing011 function and its two named triggers are prerequisites; no missing-only repair, historical029 replay or historical filename rewrite is included.

## PostgreSQL17.6 validation

Pinned image:postgres:17.6-alpine@sha256:ef257d85f76e48da1c64832459b59fcaba1a4dac97bf5d7450c77753542eee94. Containers have no external network or published ports.

-11 security cases pass on authentic captured public DDL/ACLs with empty data and synthetic auth dependencies. They reproduce original defects, verify whole-bundle and late-stage rollback, all-public client TRUNCATE denial, direct denied role operations, intended helper execution, strict account parity, explicit service/internal ACLs, legitimate profile/preferences, immutable Slope v1 retry and foreign-owner rejection, and inherited-rights abort.
-11 cases pass on the separate repository fresh model. Raw historical011 remains broken; this explicitly modeled fresh path substitutes the existing guarded absent-contract repair and skips009/038/admin sources until the additive bundle. It does not repair the raw historical runner or attest hosted fresh provisioning.
-Nine combined-boundary cases pass on captured public schema plus the new bundle: billing downgrade/history/scenario concurrency; stale paid-event retry; billing failure rollback; API quota/batch shared budget; membership fencing and RLS; embed receipt/consent rollback/duplicate retry; owner/JWT boundaries; function owner/path/EXECUTE matrix; metadata-query read-only behavior. No extra application grants were added to mask captured privilege dependencies. The synthetic empty migration ledger in the last query test is not the authentic37-row ledger.
-Existing HTTP/PostgREST CI evidence is reused, not relabeled a new authentic hosted gateway test. Typecheck, affected lint and webpack build passed. Final-head CI validates the checked-in fresh model; raw production metadata is not published to CI.

The supplied native runner's unsafe text-to-regclass cast could evaluate before schema filtering on native PostgreSQL; the external reproduction uses catalog OIDs instead. The old combined model expected service membership-helper execution to be false; authentic captured grants show true, so the external test expectation was corrected without removing unrelated grants merely to fit the old model.

## Historical reconciliation and owner decisions

009 is absent in actual column/ledger evidence: reviewed additive nullable-text/check adoption is needed.011 function and both named triggers already exist, plus two other legacy quota triggers: skip the absent-only repair for production; preserve/compare all four legacy triggers.029's11 current policy descriptors match candidate effects although historical normalized SQL differs: record effect equivalence, do not call its bytes identical or blindly replay it.

Keep both exact filenames at032–035. Captured ledger has the business/workspace/billing/split-policy identities, but lacks the four atomic audit identities. Ledger comparison:17 byte matches,7 normalized matches,12 unresolved content differences,6 missing exact names; one ledger-only hardening identity. These are identity/effect findings, not authorization to replay every difference.

Before adoption the owner must approve exact current-effect dispositions, remaining historical differences/ledger-only mapping, trusted owners, helper/service dependencies, external writer participation, retention, real immutable deployment versions, write pause, tuned timeouts and verified backup/restore. New admin RPC code is not specialist approval, certification or publication. Other existing PUBLIC/default/internal privileges remain outside this scoped correction and need their explicit owner policy.

## Rollback and remaining gates

Every proposed artifact retains a leading RELEASE HOLD exception. Do not remove it for production based on passing tests. Within the reviewed bundle, failures roll back DDL/grants together. For unknown COMMIT, compare exact schema/ledger/body/result fingerprints before retry. Preserve receipts, fences, request identities, country values and immutable snapshots after committed writes. Do not restore broad anon rights, split REST fallbacks or unlocked quotas, delete receipts, or use destructive CASCADE. Post-commit recovery needs captured definitions/ACLs and owner-reviewed data/dependency/restore evidence.

The authentic metadata-access gap is closed. Current production is NOT remediated. External writer/provider, real isolated auth/gateway/cache, backup restoration, final deployment identity and owner/specialist/lifecycle approvals remain BLOCKED/UNKNOWN. No production writes, migrations, permissions, payments, merges, deployment, certification or publication changes occurred.
