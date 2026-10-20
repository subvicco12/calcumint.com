# Migration Contract Reconciliation Implementation Plan

> **For agentic workers:** Use the existing isolated worktree and exclusive file ownership. Execute the user's authorized disposable investigation autonomously; do not apply any proposal outside disposable PostgreSQL.

**Goal:** Produce an exact migration/proposal inventory, combined-contract regression evidence and an owner-reviewable additive rollout/rollback plan.

**Architecture:** Reuse existing inventory/fingerprint helpers and atomic SQL proposals. Add a single disposable PostgreSQL integration harness that distinguishes unchanged historical replay, explicitly modeled repair and production-shaped upgrade. Persist no production data or credentials.

**Tech Stack:** Node, PostgreSQL16, existing digest-pinned Docker image, repository SQL, existing CI.

**Spec:** Current owner request “Migration History & Release Contract Reconciliation”; baseline #1459 and `docs/audits/HISTORY-TRANSPORT-RELEASE-READINESS-2026-10-20.md`.

## Global constraints

- RELEASE HOLD; no production writes, schema application, merges, deployment, payments, certification or publication.
- Historical migrations and immutable calculator versions remain unchanged.
- Production observations must identify provenance/date; synthetic equivalence cannot establish deployment.
- Existing `npm ci` and `next build --webpack` stay unchanged. Reuse passing isolated/HTTP/browser evidence.

## Review focus

- Missing/duplicate migration identities: exact filenames/hashes, never prefix-only execution.
- Failed historical SQL: record raw failure before a labeled candidate repair; never report it as a fresh-install pass.
- Cross-contract profile changes: billing downgrade and history quota/scenario locks must coexist transactionally.
- Security metadata: trusted definer owner, effective EXECUTE and role inheritance remain distinct from function existence.
- Rollback: preserve data/request IDs and prohibit non-atomic application fallbacks.

### Task 1: Canonical identity and evidence inventory

Files: `tests/migration-contract/inventory.mjs`, `inventory.test.mjs`, generated `docs/audits/migration-contract-2026-10-20/inventory.{json,csv}`.

- [x] Reuse migration-name/fingerprint helpers; test deterministic ordering, source hashes, duplicate-prefix detection and missing/changed artifacts.
- [x] Export every migration and SQL proposal with exact filename, digest, evidence class and explicit candidate dependencies.
- [x] Treat legacy ledger hashes and current deployment proof separately; retain UNKNOWN for unavailable protected evidence.

### Task 2: Disposable combined-contract rehearsal

File: `tests/migration-contract/combined.postgres.mjs`.

- [x] Reproduce unchanged fresh-install failure; create explicitly labeled candidate and upgrade models with synthetic auth/grants only.
- [x] Apply existing guard-stripped proposals only to disposable storage, checking guarded rejection and rollback first.
- [x] Test combined billing/history/scenario, embed/consent and membership boundaries, effective roles/RLS/EXECUTE, concurrency and rollback.
- [x] Record exact failures and limits. Prepare additive guarded repair proposals only for reproduced gaps; never rewrite historical SQL.

### Task 3: Evidence, integration and review

Files: scoped CI/package test entry; main acceptance ledger and new release-contract report.

- [x] Audit application writers against required RPCs and record deployment order/blocked behavior.
- [x] Review new evidence independently; run focused tests and necessary lint/typecheck/build once.
- [ ] Commit one substantial draft candidate if executable regressions/proposals warrant it; run automatic exact-head CI once.
- [ ] Report remaining owner decisions, actual runtime and next substantial integration task.
