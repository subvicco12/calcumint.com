# Membership Security and Domain Contract Readiness Implementation Plan

> **For agentic workers:** Use isolated subagent execution with exclusive ownership. User explicitly authorized autonomous parallel draft engineering; no routine design/plan approval pause is required.

**Goal:** Close reproduced membership authorization and non-YMYL engine-contract defects without fabricating new master identities or release authority.

**Architecture:** Two independent branches start at #1449 `4a9b289ae9594326814b377ae08b4683b82a7ca5`. Security uses whole-migration disposable PostgreSQL and guarded unapplied repair proposals. Calculator changes reconcile existing schema/engine contracts; new engines require positive scope/identity and absence evidence, not merely a missing mapping. Parent integrates evidence, reviews and creates separately reviewable drafts.

**Tech Stack:** TypeScript/Zod/Vitest, PostgreSQL 16, existing Docker harness, Next webpack.

**Spec:** User's parallel security/calculator request; governing attached 1 October blueprint; existing 540-ID crosswalk and master completion ledger.

## Constraints and review focus

- RELEASE HOLD; no production mutations, migrations, payments, merges, deployments, certification/publication changes or inferred approvals.
- No SIP v1 edits or SIP v2 activation; immutable history, Slope v1 and deterministic cross-plan accuracy remain unchanged.
- Distinguish membership statement snapshots from immediate transaction-wide revocation; do not invent owner-transfer policy.
- Preserve successful calculator inputs/results; invalid combinations already rejected by calculate may be rejected earlier by schema.
- Missing linkage is not engine absence. All ten selected missing-linkage titles require scope/alias evidence before implementation.
- Review owner/admin escalation, cross-org moves, stale membership, concurrency/rollback; schema/direct-call parity, boundaries, units and existing golden nonduplication.

## Tasks / ownership

- [x] Verify unchanged main/#1449 and passing CI once; reuse prior evidence and authoritative attachments.
- [x] Security agent: tests/api-schema/membership*.mjs, narrow guarded MEMBERSHIP*.sql proposal if reproduced need, supporting audit. Reproduce with actual roles/RLS; minimal fix; focused PostgreSQL/lint; coherent commit. No historical migration edits.
- [x] Calculator agent: existing targeted Technology definition schemas in catalog-batch-1.ts plus dedicated tests/fixtures/audit. Reproduce schema/direct calculation disagreement; preserve successful paths; independent boundary tests and sources. No shared registry/index changes.
- [x] Integration owner: review diffs/contracts, maintain one acceptance ledger, validate combined compatibility and exact unchanged authority counts. Shared billing/auth/renderer untouched.
- [x] Focused tests, certification checks, typecheck, affected lint, one webpack build at combined TypeScript checkpoint. Final-head automatic CI remains tracked by the final task below.
- [ ] Open separate drafts for independent boundaries; record SHA/CI/runtime, proposed versus deployed guarantees, owner decisions and next batch.
