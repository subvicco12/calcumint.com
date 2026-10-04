# Final Product Completion Matrix

Authority: CalcuMint Final Master Blueprint & Product Architecture (1 Oct 2026), Master Calculator Catalog, certified repository definitions/tests, and authoritative publication lifecycle.

## Purpose
Prevent repeated per-calculator rediscovery and shorten completion time by using one fail-closed migration contract and family-based execution plan.

## Permanent completion order
1. Framework invariants: deterministic engine -> StructuredCalculationResult -> PresentationDefinition -> FinalCalculatorRenderer -> centralized entitlements.
2. Family contract: define visible legacy-equivalent result contract, meaningful presentation/analysis capabilities, trust/methodology/sources, and route/account/Steps preservation once per family.
3. Calculator readiness: certified definition, golden/boundary vectors, risk/YMYL eligibility, exact visible contract.
4. Migration: adapter + presentation + renderer route only; no formula or publication changes in the migration PR.
5. Authority: post-migration engine/result/trust/presentation/route parity test.
6. Catalog/family convergence: repeat from current exact certified main; do not replay independent readiness PRs until the preceding authority merge is complete.
7. Final product QA: reconciliation, entitlement parity, responsive/accessibility/performance/SEO/security.
8. Publication: separate authoritative lifecycle action only after all applicable gates.

## Anti-rework rules
- Do not create downstream readiness PRs before an upstream migration+authority sequence completes; prepare branches/tests only. This avoids predictable stale-PR replay churn.
- Batch source audits and family-contract preparation in parallel; serialize only merges that alter exact main.
- Never infer units, metrics, visualizations, analysis features, methodology or sources. Lock existing/certified semantics in tests before routing changes.
- Preserve engine Steps and CalculatorAccountActions where the legacy tool owns them unless an explicit governed architecture change says otherwise.
- Every migration test must assert primary id/label/value/unit, metric ids/order/labels, methodology, sources/trust, presentation family/domain/level, route, and retained adjacent surfaces.
- Every authority test must execute certified engine vectors and bind those outputs to the migrated Final contract.
- YMYL/regulatory calculators stay outside automatic family migration until specialist/rule-pack gates are satisfied.
- Free/Pro/Business parity is tested at engine output; entitlements wrap analysis/workflow only.
- Charts, schedules, scenarios, sensitivity, exports and AI consume structured deterministic outputs; no duplicate formulas.
- Production build remains `next build --webpack`; Paddle remains sandbox until separately authorized.

## Merge discipline
For each calculator/family: exact-main readiness SUCCESS -> expected-head squash merge -> exact-main migration SUCCESS -> expected-head squash merge -> exact-main authority SUCCESS -> expected-head squash merge. Run independent audits/preparation during CI, but do not open merge-candidate PRs that are known to become stale.

## Definition of Final product completion
A calculator is complete only when deterministic certification, Final presentation, central entitlement behavior, trust/methodology metadata, required risk review, reconciliation, UX/accessibility/performance/SEO/security QA and authoritative publication lifecycle all pass. Rendering alone is not Final.

## Platform completion lanes
A. Calculator-family convergence and catalog coverage.
B. Reusable Goal Solver/scenario/sensitivity/chart/table/export reconciliation.
C. Central Free/Pro/Business parity and contextual previews.
D. Persistence/projects/history and auditability.
E. Business teams/builder/embed/API/batch/webhooks/branding/governance.
F. AI grounded only in certified structured results.
G. Publication/admin lifecycle and YMYL/rule-pack governance.
H. Cross-device accessibility/performance/SEO/security and launch readiness.

## Current controlled sequence
Standard Deviation authority is complete at the baseline used to create this audit. Next merge sequence is Variance, then Flooring. Parallel work should prepare later family migrations and platform QA without creating PRs guaranteed to stale.
