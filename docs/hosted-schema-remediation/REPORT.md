# Hosted-schema-bound remediation engineering

Baseline: PR #1507 `cab705d4f13e17a5ec0bb3450df704c9c226e817`, followed by authenticated reconciliation `1a0b2265e9658a48227549efdac7f2d180d6b4dd`. Exact PR ref verified remotely; baseline CI #41241865527 is completed SUCCESS. Successor branch: `engineering/hosted-schema-remediation-20261101`. Original reconciliation files remain unchanged.

## Publication predicate correction prepared and independently exercised

The exact captured `validate_calculator_publish_gate(uuid)` rejects valid ISO dates because its standard-conforming SQL literals contain double backslashes. A sanitized PostgreSQL **17.6** fixture installs the byte-exact captured definition, reproduces rejection, and tests a narrowly scoped successor. It changes only three regex literals to explicit ASCII digits and adds one optional-date NULL check. That additional boundary defect was demonstrated by a failing test: after regex correction alone, explicit `effectiveTo:null` passed through SQL three-valued logic. The assertion was retained and the predicate corrected.

The proposal in `tests/hosted-schema-remediation/publication/review-only-correction.sql` remains **unactivated**, outside migrations. Its unconditional abort guard is inside the transaction, so a SQL client continuing after errors still cannot install it. The fixture verifies that case. After the guard is removed only in a disposable test copy, SQL requires PostgreSQL17 and exact SHA-256 of `pg_get_functiondef` before replacement; it checks the resulting source hash before COMMIT. CREATE OR REPLACE preserves owner, ACL, SECURITY DEFINER and search_path, independently compared before/after. No RLS or publication lifecycle code changes.

- Required predecessor definition: `18ed27d139a24b73176838618ac99469418053d85b4020d1a4a1481cd3e6334c`
- Corrected definition: `ce53551431824e8560af44a235ebb312372e0c67641c196f3d8db1287c05709a`
- Thirteen actual PostgreSQL checks cover leap days, null/malformed/impossible/non-ASCII dates, equal/later/reversed periods, hash mismatch/reapplication, source/metadata/reviewer/QA and nonadmin denial.

Synthetic complete QA rows prove only the fixture predicate's positive branch. They are not real approvals; no lifecycle transition, certification or publication is performed. The fixture uses explicit auth stubs and minimal dependency tables, not genuine hosted authentication. Invocation:

```sh
PUBLICATION_ARTIFACTS=/absolute/outside/repository/publication node tests/hosted-schema-remediation/publication/acceptance.mjs
```

## Invitation characterization and unresolved policy

[invitations.md](invitations.md) documents the scoped fixture reconstructed from authenticated metadata. It uses real isolated GoTrue/PostgREST authentication with PostgreSQL17.6, not production credentials. The committed sanitized metadata is source-bound to the original private descriptor; optional full-source comparison verifies exact selected rows. Captured standalone indexes, including pending-email uniqueness, are retained.

Deterministic barriers demonstrate last-seat over-issuance, distinct-redemption seat overflow and duplicate token audit behavior in the original captured contract. Tests characterize existing-owner role demotion, existing-member rejection at capacity, deleted-invitation denial, late audit failure rollback, privileged-writer bypass and the conditional issuance proposal's direct-table bypass. They do not approve owner demotion or choose new seat policy. Review added direct case-insensitive pending-email index acceptance and strengthened artifact isolation. No old proposal is modified; its guard is verified, and an unguarded copy is used only in the disposable fixture.

Still required: owner/existing-member semantics, reservation/revocation rules, shared serialization across issuance/acceptance/membership, and participating privileged-writer inventory. Deletion before redemption is tested; a complete revocation/acceptance race protocol is not claimed. Do not activate the Batch16/17 successors merely because these tests characterize defects.

## Actual migration effects and privilege preparation

[effects-privileges.md](effects-privileges.md) and its JSON establish:

- `009`: country preference column absent, despite account read/upsert requirements.
- Atomic `032`–`035`: five required function signatures absent, despite admin application callers.
- `038`: observed privileges contradict its postconditions; anonymous permissions remain on the four scoped account/billing tables.
- Hosted-only `20260915105311`: authenticated read-only capture of actual hardening statements independently matches the recorded `md5(array_to_json(statements)::text)` fingerprint. Current grants are measured separately; historical bytes do not prove durable current effects.

Confirmed common-row effective grant differences: 113 table, 188 column, 63 sequence, 16 function. Model grants are not approval authority. The four-table least-privilege draft retains reviewed application requirements and remains transaction-guarded. Display-name UPDATE and billing-customer SELECT retain explicit owner-review conditions. No blanket function/sequence revokes or provider-owned auth changes are proposed. Its exact historical source and capture hashes are recorded; runtime source-hash enforcement is a future adoption prerequisite, not falsely claimed for that draft.

## Verification and review

Full unit suite: **6,603 passed, four skipped** across 832 passed/two skipped files. Focused reconciliation/capture/privilege suite: **21 passed**. Certification: **15 passed**. Existing workflow guards: **three passed**. Typecheck passes. Lint has zero errors and 29 warnings, including an existing reconciliation unused-variable warning; no application behavior is changed. Actual publication and invitation receipts, source hashes and independent review disposition are in [validation.json](validation.json). CI gains a bounded three-minute self-contained isolated acceptance step without removing existing checks.

No application UI or engine changed, so browser campaigns and production webpack build were not repeated. Existing build command and publication/security gates remain intact. Review required correcting the guard-order test after transaction hardening, replaying a captured standalone invitation index, and testing its actual uniqueness behavior; assertions were strengthened rather than weakened. Initial publication fixture socket readiness was corrected to container loopback; the optional-null red test remains recorded in external evidence.

## Delivery limits

This prepares tested corrections and demonstrates missing effects; it is not schema-adoption approval. No production SQL, permissions, migrations, deployments or payments changed. No canonical acceptance, certification or publication is promoted. All 540 identities, 424 acceptance records, original 14 DRAFTs, historical engines and 43 authority blockers remain unchanged. All guarded model-only proposals remain unactivated. **RELEASE HOLD remains active.** The exact delivered SHA and one bounded hosted CI observation accompany the draft PR; a pending successor run must not be reported as success.
