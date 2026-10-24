# CIDR First Release Subset Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans after coordinator/owner approval of this concrete subset; obtain fresh independent review after implementation. This document grants no certification or publication authority.

**Goal:** Make the existing master #369 CIDR v1 contract conform to the governing Final renderer and assemble its exact release evidence while retaining reviewed/non-public status and all 209 live identities.

**Architecture:** Preserve `technology.cidr` / `cidr-calculator` / v1. Its input is integer `prefixLength` 0..32 and its result is total IPv4 addresses, `2^(32-prefixLength)`, not usable hosts, an IPv6 tool, routing advice or a network configuration writer. Move only this tool out of the legacy Technology renderer using the established Molecular Weight adapter/presentation pattern.

**Tech Stack:** Existing Next/React, Zod, Vitest and private Vite/Chromium fixtures; Node >=22; next build --webpack; no dependencies.

**Spec:** Owner's full-source goal; `data/catalog/master-catalog-2026.csv` row369; existing `src/calculators/technology-computing/catalog-batch-1.ts` CIDR contract; RFC4632 section3.1; Final renderer lifecycle tests. Source-to-contract mapping is a proposed explicit approval, not inferred from title matching.

## Base and constraints

Planning inspected at 4d3c72260d25fcd965a0ada58caf7d9e99a61a2e. Proposed new isolated engineering branch starts from full-product #1470 head 6dbf723ec6c4d009816dbe3eb1f16cc22bc16a04 after a read-only latest-base/overlap check. The inspected Technology/Engineering/Final-framework modules and private preview server have no delta between these revisions. Do not implement on or merge #1471; it remains an unused opt-in candidate.

Preserve all 209 production identities. No source version, formulas, successful input semantics, goldens, reviewStatus, DB rows, aliases, QA decisions, source approvals or gates change in this engineering batch. No public-only activation, credentials, providers, push, merge or deploy. Save approved plan/spec in repository-standard docs/superpowers locations only on the new engineering branch.

## Review focus

- Prefix0 must show 4294967296; prefix32 must show1. Neither loses reserved-address values through a usable-host subtraction.
- Blank, fractional, negative and >32 input must produce accessible error and recover without stale result/capture.
- Free/Pro/Business receive identical core numbers and source/methodology; entitlement-dependent persistence/export behavior stays existing.
- Reviewed CIDR stays absent from public routes/discovery even if a manifest claims it; unrelated 209 identities remain untouched.
- Migrated CIDR uses only FinalCalculatorRenderer; remaining legacy Technology definitions remain lifecycle-blocked. Renderer migration does not establish certification.

## Task 1 — Isolated CIDR adapter and renderer migration

Create `src/calculators/final-framework/cidr-adapter.ts`, `cidr-presentation.ts`, and `cidr-final-renderer-migration.test.ts`.

Interfaces: `cidrResult(output: {value:number;steps:readonly string[]}): StructuredCalculationResult`; `cidrPresentation satisfies PresentationDefinition` with id `standard.technology-cidr`, domain `technology-computing`, family `simple-scalar`, level `essential`, no visualizations/schedule/goal-solver/scenarios/sensitivity. Primary result id `result`, label `CIDR addresses`, unit `addresses`. Methodology explicitly says total IPv4 address count; sources come from cidrCalculator.sources; steps are preserved as methodology evidence.

- [ ] First add failing adapter/rendering regressions for /0, /24, /31, /32 (4294967296,256,2,1), exact source binding and unchanged v1 reviewed identity. Reuse existing 33-prefix independent integer-oracle test instead of copying expected values from the engine.
- [ ] Implement adapter/presentation and a dedicated `CidrTool` in `src/components/calculator-interactive.tsx`, using runCalculator(cidrCalculator,input), initial prefix24, NumberField label `CIDR prefix`, min0, step1, and blank-input rejection before numeric conversion. Preserve existing CalculatorAccountActions input/output/version and scenario display metadata. Use canonical error feedback and FinalCalculatorRenderer.
- [ ] Dispatch CIDR explicitly before generic Technology routing. Remove only CIDR's kind/config/switch branch from the legacy path; preserve the other19 reviewed and6 draft Technology tools.
- [ ] Update `legacy-final-presentation-lifecycle-boundary.test.ts` to enumerate the remaining25 legacy definitions (19reviewed/6draft) and assert CIDR's separate canonical rendering. Keep all37 reviewed inventory assertions and public-exclusion assertions intact. The four generic legacy caller inventory remains unchanged.
- [ ] Run existing network-storage contract, Technology batch1/direct-validation, new migration and lifecycle-boundary tests; inspect full diff before local commit.

## Task 2 — Input, entitlement and private browser evidence

Create `src/components/cidr-tool.test.tsx`; extend existing `calculator-scenario-reference-integration.test.tsx` only where needed for CIDR snapshots. Test prefix0/32; empty/-1/33/1.5; valid recovery; status/error announcements; exact core parity across all three plans; capture/export identity and unit preservation under existing entitlement rules. Do not claim provider acceptance from mocked boundaries.

Add private-only fixture files `tests/cidr-review/index.html`, `main.tsx`, `browser.mjs`. Extend `scripts/draft-preview.mjs` with explicit fixture `cidr` routed to that directory and existing synthetic-client/Next-link aliases, following reference-six. Retain loopback binding, random per-run authorization, host/origin checks, GET/HEAD-only restriction, envFile:false, filesystem denies and no-store. No production route or certification override. Browser runner reuses existing CDP helper conventions, blocks external requests and closes temporary resources.

- [ ] Browser checks at320/1280 pixels on Free/Pro/Business: exact boundary outputs, keyboard input/Tab, visible methodology/source disclosure, invalid-input recovery, no horizontal overflow, no page errors or unexpected network traffic. Confirm unavailable advanced surfaces honestly remain absent. This is synthetic browser evidence, not a physical-device or production acceptance claim.
- [ ] Add public-route regression to `src/calculators/publication-authority.test.ts` asserting reviewed CIDR cannot be exposed by a forged exact manifest. Reuse registry tests for209 baseline identity preservation; do not rewrite protected decisions.
- [ ] Run `npx vitest run src/calculators/technology-computing src/calculators/final-framework/cidr-final-renderer-migration.test.ts src/calculators/final-framework/legacy-final-presentation-lifecycle-boundary.test.ts src/calculators/final-framework/reviewed-certification-progression.test.ts src/components/cidr-tool.test.tsx src/components/calculator-interactive.test.tsx src/components/calculator-scenario-reference-integration.test.tsx`; run `node tests/cidr-review/browser.mjs`, typecheck, lint and next build --webpack. Record actual results; broaden only for demonstrated cross-cutting change or required CI.

## Task 3 — Evidence packet and independent review, not promotion

Create `docs/audits/CIDR-FIRST-RELEASE-EVIDENCE-2026-10-24.md` on the new approved branch with exact source head, master369 proposal, 33-prefix oracle coverage, raw output compatibility, renderer/browser/entitlement evidence and applicable gaps. Request independent exact-head review; resolve reproducible engineering defects before reporting readiness.

All15 standard QA decisions remain mandatory: engine-tests, formula-review, sources, methodology, reverse-solve, visualization-reconciliation, schedule-reconciliation, scenario-reconciliation, sensitivity-validation, entitlement-validation, ux-responsive, performance, security, seo-content, accessibility. Record evidence or an explicit authorized applicability decision per check; no inherited four-waiver template. Structured reviewed source evidence is required; the repository source URL alone does not create it.

The owner/catalog authority must approve exact master369 total-address-count scope. Authorized reviewers must assess methodology, source evidence, risk classification and QA/applicability. The current DB has no CIDR row; any later catalog creation/certification/publication is a separate protected workflow, outside this plan. Repository reviewStatus promotion likewise requires actual evidence and a separately reviewed change. Hosting/integration/rollback gates remain separate. Success here is one reviewed, release-prepared engineering candidate, not a new live calculator.

## Self-review

No engine replacement, alias creation, source scope expansion or bulk certification is proposed. The sole shared production edit isolates one reviewed tool from the existing legacy router. All five review-focus cases have tests. No reproduced arithmetic failure was found in this investigation; renderer incompatibility is an explicit release prerequisite, not permission to publish. Native implementation followed by independent review is recommended. Await coordinator's concrete subset approval; do not request another broad catalog decision.
