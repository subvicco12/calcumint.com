# Coordinate Slope atomic registry migration — review packet

**State:** REVIEW PREPARATION ONLY. Owner approved Master #276 Geometry coordinate-point product contract, **not** code activation, certification, publication, merge or deployment. All release gates HOLD.

## CI baseline
Commit `5db34ea1571c0e77002ba0bef9f777d869bc3260`: CI run 38290135716 **success**; offline catalog reconciliation run 38290135737 **success**.

## Repository consumer inventory (scoped; not exhaustive production-data proof)

| Surface | Inspected evidence | Migration implication |
| --- | --- | --- |
| Registry | `src/calculators/registry.ts`; launch and geometry definitions | Replace active launch Slope with coordinate Geometry Slope **atomically**, never both with same slug |
| Existing input validation | `src/calculators/launch-portfolio-boundaries.test.ts` references `slope-calculator` with `rise:1,run:0` | Preserve legacy behavior through an explicit adapter or migrate the test and clearly version legacy handling |
| Snapshots | `src/lib/calculation-snapshot.ts` stores `calculatorSlug`, `calculatorVersion`, `input`, `output` | Old snapshots are not automatically compatible with new coordinate inputs or `value/dx/dy/steps` output |
| Scenario reevaluation | `src/lib/scenario-reevaluation.ts` requires reviewed identity, version, evidence and complete-input contract | Do not enable new Slope re-evaluation by slug alone |
| Scenario comparison | `src/calculators/scenarios.ts` accepts caller-supplied inputs and calculation functions | Audit downstream callers before changing schemas |
| Public route | `src/lib/public-calculator-route.ts` consults authoritative publication snapshot | Registry activation must never imply public publication |
| Shared links | `src/app/share/[token]/page.tsx` resolves **custom** calculator share links through `share_links` and `custom_calculators` | No direct built-in Slope coupling shown in this route; other share surfaces remain to audit |
| Batch API | `src/app/api/v1/batch/route.ts` operates on organization **custom** calculators | No direct built-in Slope coupling shown in this endpoint; do not assume all API consumers unaffected |

**Limit:** These are code-level observations, not a verified inventory of production persisted rows, external API clients, browser-local data, analytics, or deep links. Those require separate read-only inspection.

## Proposed exact-head atomic migration (NOT EXECUTED)

1. Document final identity: Master #276, category Geometry, target ID `geometry.slope`, slug `slope-calculator`, coordinate inputs `x1,y1,x2,y2`.
2. Design reviewed legacy adapter: for finite `rise,run` with nonzero run, map to `(0,0)` and `(run,rise)`; preserve original legacy snapshot unchanged and expose derived coordinate calculation separately. Never relabel original coordinates.
3. In **one reviewed code change**, remove the launch Slope definition from active `launchDefinitions` / registry and add `geometry.slope` to exported `geometryCompletionDefinitions`; ensure the slug appears exactly once in active registry and category matches Geometry.
4. Update `launch-portfolio-boundaries.test.ts`, six-standard evidence tests, catalog identity ledger and routing expectations to distinguish current and target states; add golden fixtures for positive, negative, vertical, near-vertical, overflow and endpoint reversal.
5. Test read-only legacy snapshot rendering and any reviewed adapter; enforce schema/version gating for scenario re-evaluation. Validate DB manifest remains unpublished for this slug and no public route is exposed.
6. Require full CI, security checks, catalog certification, independent review, publication authority lifecycle and explicit release approval. **Do not update production DB, merge or deploy** without authorization.

## Unresolved blocking decisions

- Legacy snapshot/API compatibility policy and migration versioning.
- Persisted data and external consumer inventory.
- Full target output schema and near-vertical numeric tolerance.
- Separate certification, publication and release approvals.

The approved product contract is recorded in `slope-identity-disposition-2026-10-12.md`. This packet does not waive any gate.
