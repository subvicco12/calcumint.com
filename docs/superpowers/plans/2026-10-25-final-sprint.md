# Final sprint implementation plan

> **For agentic workers:** Use superpowers:executing-plans for integration and independent worktrees for the two bounded implementation lanes.

**Goal:** Close demonstrated account-boundary defects and reopen owned immutable saved work from the cumulative PR #1470 baseline.

**Architecture:** Reuse fresh Supabase account verification, existing account boundaries and persisted snapshot validation. A new read-only account route shows the stored version, inputs and outputs without executing an engine or attaching current-version semantics. Existing DRAFT readers remain separate. Rendered owner bindings deny stale requests; they never authenticate a user.

**Tech stack:** Existing Next.js, React, Supabase SDK, Zod and Vitest; no new dependencies.

**Spec:** Owner's 30-hour execution directive and existing ledger BP-0129-0130, BP-0323-0326, BP-0552-0552, BP-0768-0771 and BP-0842-0845. Existing DRAFT acceptance evidence explicitly records search-only generic history links. The attached Blueprint is represented by existing ledger wording; no new source authenticity claim.

## Constraints and review focus

- Preserve frozen PRs #1467–#1470, all historical mathematical contracts, fourteen unpublished DRAFTs and all 424 ledger identities/statuses.
- No production access/writes, migrations, merges, deployment, live payments, certification or publication.
- Cross-owner submissions, missing bindings, expired authentication, unknown/corrupt records and historical Slope v1 must fail safely or retain original values.
- Account reads work after downgrade; paid mutation entitlements remain unchanged.
- Provider and physical-device acceptance remain external gates, not invented product defects.

## Task 1 — stale billing and preferences

- [ ] Demonstrate stale/missing rendered-owner mutations with failing tests.
- [ ] Bind billing portal requests and preferences forms to the rendered owner, verify on server before mutation, preserve accessible retry.
- [ ] Run focused regression tests and commit independently.

## Task 2 — immutable saved-work reader

- [ ] Add failing account-link and reader tests for historical/current records, explicit ownership, invalid data, outage and all-plan owned reads.
- [ ] Add `/account/saved` read-only reader and generic account links, preserving private DRAFT links and version identity.
- [ ] Run focused tests; commit independently and integrate without changing mathematical code or ledger statuses.

## Task 3 — integrated candidate

- [ ] Review both lane diffs; run full unit, security, transport, runtime, certification guards, lint, typecheck and webpack build serializing resource-heavy checks.
- [ ] Obtain independent integration review; correct only demonstrated findings.
- [ ] Push only the new engineering branch, open separate draft against PR #1470's branch, inspect exact-head hosted CI.
- [ ] Report completed scope and remaining evidence-bound queue; do not claim complete external acceptance.
