# Exact-five Business sharing candidate

The application changes add organization/project/client capture of immutable registered version-1 snapshots for #386 Base64 Size, #370 Bandwidth, #371 Download Time, #372 Upload Time and #373 Data Transfer. Existing calculator math, personal history, old shared storage and their policies remain unchanged.

The new server endpoint requires genuine authentication, the existing Business workspace entitlement, current organization role, exact forward-engine verification, normal finite new-capture provenance and same-origin requests. A service-only atomic RPC repeats current role/owner/actor entitlement and project/client tenant checks, serializes request identities, rejects conflicting retries, stores once and audits once. The new table denies authenticated writes and limits service privileges to SELECT/INSERT; immutable row triggers reject updates/deletes. Administrative database owners remain outside any tamper-proof claim.

The new guarded proposal `review-only-sharing.sql` is outside active migrations and refuses execution unchanged. Only disposable candidate-schema tests remove its guard locally. Missing capability/RPC fails closed with HTTP503. Production schema compatibility, adoption, quotas/policy, source applicability and publication are separate decisions. No production deployment, held SQL activation or canonical promotion occurred.

The project UI adds paginated shared history, client categorization, exact verified shared-record templates, separate new-copy capture, and same-calculator/version A/B/C comparison through the existing scenario workspace. Scenario-set/report JSON, CSV and PDF export and strict JSON recovery preserve original organization and personal records. Calculator or project context changes clear incompatible working state. Comparison units remain recorded raw context; no units are inferred.

Evidence has two stages. `authenticated/receipt.json` retains the initial sharing/security source capture, five native captures and seventeen completed files. `workflows/receipt.json` binds the final copied application source: five actual template-link loads and new immutable clones, five A/B comparisons, exact scenario export/recovery and rejected tampering, forty-two completed files, Member/Viewer reads and exports, foreign-owner refusal and membership revocation. Its ten layout witnesses show actual inner/scroll widths360 for all five template pages and320 for all five expanded comparisons, matching the configured emulated widths. A captured pre-fix mobile observation demonstrated that comparing scrollWidth only to an expanded innerWidth would miss overflow.

`source-captures.json` records the original Git source-equivalence refs and copied hashes; every listed application blob was independently checked against its recorded copy. These side-branch refs document source provenance, not required CI fetch targets or proof that production uses this schema. The final integration may append equivalent reachable-main refs without rewriting the original receipts.

Run from the repository root:

```sh
node tests/first-five-full-contract-20261109/sharing-acl.mjs
node tests/first-five-full-contract-20261109/sharing-workflows.mjs
node tests/first-five-full-contract-20261109/sharing-artifacts.mjs
node tests/first-five-full-contract-20261109/sharing-artifacts.mjs --check
```

The artifact verifier performs no browser or math sweep. Default mode generates the deterministic verification report; `--check` writes nothing. It checks all59 files, completed Chromium download events, exact hashes and producer/copy bindings, JSON snapshot data, exact CSV values and full PDF numeric fields/version. Artifact reads reject traversal, symbolic links, non-regular files and size discrepancies before parsing. Failure logs and phase checkpoints are retained separately from successful final receipts.

The scope is authenticated team/client workspace software on an isolated repository model. Both actors and organization owners retain existing Business entitlement checks. There is no external client portal, email delivery, live collaborative editing, push revocation or recall of exported files. Membership is checked on each new read/share. The previously measured unexpired signed-JWT/logout limitation remains; this does not claim immediate all-API token invalidation. These finite engineering witnesses do not supply specialist, source, commercial-policy, canonical, deployment or publication approval.
