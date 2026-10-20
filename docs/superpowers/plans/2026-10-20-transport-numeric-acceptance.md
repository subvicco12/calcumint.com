# Transport and numerical acceptance implementation plan

**Goal:** Verify cumulative API/embed transactions through actual isolated HTTP/PostgREST and investigate SIP cancellation without inventing compatibility authority.
**Architecture:** Reuse #1445's guarded RPCs and synthetic schema prerequisites, add real PostgREST transport tests, fix only reproduced defects. Separate batch/embed/math worktrees have exclusive ownership; parent integrates and owns workflows and acceptance ledger.
**Spec:** User's autonomous continuation request and existing `tests/api-batch/ACCEPTANCE.md`, `docs/audits/EMBED-PRIVACY-RECOVERY-2026-10-20.md`, `docs/audits/IDENTITY-SIP-EVIDENCE-2026-10-20.md`.

## Constraints

RELEASE HOLD. SQL remains guarded/unapplied outside disposable fixtures. No production calls/writes, payments, merges, deployments, certification/publication or inferred approval. Preserve formulas pending numerical compatibility, Slope v1, immutable history, RLS and `next build --webpack`. Reuse installed dependencies and passing baseline CI; one final changed-head CI checkpoint.

## Tasks and exclusive files

- [x] Batch lane: `tests/api-batch/**`, batch RPC proposal and route/tests only. Test UUID/request/output transport, client-role denial, duplicate/conflicting/concurrent requests, quota competition, rollback and lost acknowledgements. Reproduce before minimal correction; do not alter charging policy. Output native HTTP harness and exact evidence.
- [x] Embed lane: `tests/api-embed/**`, embed RPC proposal and lead route/behavior tests only. Test real role permissions, duplicate/conflict concurrency, tenant and consent/privacy boundaries, rollback and lost acknowledgements. Output native HTTP harness and exact evidence.
- [x] SIP lane: new verification fixtures/tests and compatibility evidence only; engine reads. Independently derive arithmetic boundary expectations and demonstrate cancellation; classify safe guarding versus governed algorithm/version decisions. No wrong-result golden or fabricated specialist approval.
- [x] Integration owner: review lane commits and interfaces; wire scoped native HTTP checks, update consolidated acceptance ledger and identity review next actions without asserting approvals. Run focused regressions, certification checks, typecheck, affected lint, webpack once; inspect one fresh code review and resolve important verified findings before final draft push.

## Review focus

1. Lost HTTP acknowledgement must not imply rollback or permit blind resubmission.
2. Client role/tenant/config mismatch cannot gain privileges or acknowledge another capture.
3. Exact numeric JSON values and immutable receipt/job identity must survive serialization.
4. Native tests prove only isolated proposal behavior, not deployed Supabase/full-schema fidelity.
5. SIP mathematical-equivalent evaluation can still change immutable historical rounding; do not infer compatibility from a few vectors.

## Rulings

User explicitly authorizes parallel execution without routine confirmation; design/plan approval pauses and repeated full local test runs are superseded. Full mandatory suite runs through automatic exact-head CI. No dependency installs or production audit are needed. Parent owns shared workflows/ledger; source drafts #1441–#1445 remain unchanged.

Execution: all three lane commits integrated; fresh review evidence gaps resolved with actual UI tests and dependency path filters. No architectural or authority change. Remaining rollout/numerical decisions are in the consolidated acceptance ledger.
