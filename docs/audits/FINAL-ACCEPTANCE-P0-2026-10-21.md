# Final acceptance P0 presentation closure — 21 October 2026

**RELEASE HOLD.** Engineering closure only. No production writes, migrations, payments, merges, deployment, certification, public registration, publication or approval changes. Source draft #1461 and unrelated source PRs remain intact.

Base: #1461 `c147cce2238b9f3b7fe56c3ec4ad44928c681d78`. Branch: `fix/final-acceptance-presentation-p0-20261021`. The governing independent acceptance pass supplied 424 requirement records and a reproducible schedule probe. This batch closes the two demonstrated presentation blockers, not the remaining Final-product release gates.

## Schedule correctness

Before: `FinalResultPresentation` used first-row keys as headers but each row's insertion order as cells. Headers principal/interest with second-row values `{interest:3,principal:7}` displayed principal=3, interest=7. Tests reproduced this before the fix.

Both result surfaces now reuse `FinalScheduleTable`. Authoritative metadata controls column identity, order, labels and units. Without metadata, a stable union of actual keys controls every cell; unknown financial labels/units are not inferred. Missing fields display an em dash, additional legacy fields gain a correctly aligned column, zero/negative/tiny values retain existing formatting, and metadata-invalid or unreconciled schedules fail closed without hiding valid core results. Legacy rows are not called complete or checkpoint data without authoritative metadata.

The existing accessible caption, scoped headers, focusable overflow region and bounded first24+terminal summary now apply to both surfaces. Expansion is keyboard-operable. One old source-string accessibility assertion was converted to actual rendered semantic assertions because moving the table into the shared component must not invalidate a correct accessibility contract.

Loan/EMI and SIP/Compound Interest schedule/terminal/export regressions pass. Mortgage remains aggregate-only; no period data, rounding policy or financial rule was invented.

## Break-even crossover and target profit

Before: scalar results existed but no cost/revenue crossover, and the target-profit variable was declared without a corresponding experience. Browser/DOM regressions first failed for the missing chart and target control.

A pure **DRAFT** projection follows the existing SBA contribution-margin model: revenue=pq, total cost=F+vq, profit=q(p−v)−F. It uses decimal arithmetic with a local precision context, produces the exact same data for SVG and accessible table, retains signed profit/zero/tiny values, and checks the unrounded crossover against the unchanged v1 engine's independently rounded units/revenue. At q=kF/(p−v), profit is evaluated as F(k−1), avoiding artificial residuals from cancellation at the crossover. Zero fixed costs use explicit0/1/2 continuous-unit samples; other samples are0/half/crossover/twice-crossover. They are illustrative quantities, not extra financial assumptions.

The chart is available to Free, Pro and Business. Solid revenue and dashed cost lines have text labels and an accessible data alternative; neither color nor pointer interaction is required. No currency is inferred: amounts must share the input currency/measurement period. Chart and table retain the same deterministic rows. Nonfinite, underflowed or historically incompatible projections show an optional-data error while the valid core result remains visible.

Pro/Business target-profit analysis calls the **existing** `business.target-profit-units` v1 DRAFT engine. No core engine, identity, source, schema, formula, version or golden binding changed. Its existing input limit10^15 and six-decimal continuous-quantity rounding remain authoritative. The UI displays the returned quantity, modeled revenue/cost/profit and any target residual; it never silently rounds up to whole items or promises exact profit after quantity rounding. Unrepresentable targets fail closed and recover without removing the core answer. Plan capability checks surround the optional UI; no plan logic was introduced into mathematical functions.

### Mathematical references and independent vectors

- Existing `business.break-even` v1: SBA break-even analysis; `src/calculators/business/break-even.ts`.
- Existing `business.target-profit-units` v1: source-documented algebraic target extension; `src/calculators/business/catalog-batch-1.ts`.
- Independent vectors: F=10000,p=50,v=30 gives q0/250/500/1000, revenue0/12500/25000/50000, costs10000/17500/25000/40000 and profit−10000/−5000/0/10000. Target5000 gives750 units and profit5000; target0 gives500.
- Fractional case F=1,p=4,v=1 preserves core0.33 units and1.33 revenue, with unrounded crossover1/3. Target1 gives existing engine0.666667 units and modeled profit1.000001; the residual is disclosed.
- Zero fixed cost, tiny signed values, nonfinite inputs, equal price/cost, overflow and unrepresentable six-place targets are covered.

These are mathematical engineering vectors, not new certification records or specialist approvals. Break-even remains DRAFT and excluded from public discovery.

## Validation evidence

- Red: seven of eight initial DOM tests failed for the demonstrated missing behavior; the existing metadata-aware renderer control passed.
- Green: 88 focused tests in13 files passed, including schedule/period/export and certification/rule-pack checks. Seven boundary/UI tests also passed (overlap with the focused run; do not sum as unique tests). There are21 new regression cases across three files.
- Browser:36/36 Reference Six ×Free/Pro/Business ×320/1280 journeys,32 actual financial JSON/CSV downloads, zero issues. Two extra real-browser schedule probes verify reordered/missing/additional keys, metadata labels/units, keyboard focus and no page overflow. Paid Break-even journeys check literal independent chart/table values, target750/500, errors and recovery. Headless Chromium is not physical Android/TalkBack or live authentication/provider verification.
- Typecheck PASS after correcting a test's unsupported context property; plan remains outside the calculator context. Affected ESLint: zero errors, four existing shared-file warnings, no new warnings. One `next build --webpack` PASS. Next-generated TypeScript configuration files were inspected and excluded.
- Final exact-head CI is recorded by the cumulative draft PR's immutable commit/check associations; required checks remain enabled. No unchanged database tests are manually rerun.

[Browser summary](final-acceptance-p0-2026-10-21/browser-summary.json) contains bounded evidence; raw screenshots/downloads stay in `/workspace/review-artifacts/final-acceptance-p0-2026-10-21/browser`.

## Acceptance ledger and remaining gates

[Updated424-record ledger](final-acceptance-p0-2026-10-21/acceptance-ledger.csv) and [closure/provenance](final-acceptance-p0-2026-10-21/closure.json) preserve the independent report's IDs/source wording and record nine requirement-level evidence changes for the two fixes. Scoped totals: **55 VERIFIED,330 PARTIAL,20 BLOCKED,19 UNKNOWN**. Repeated appendix requirements remain; these are not a completion percentage. Broad reconciliation requirements move to PARTIAL rather than declaring the entire portfolio complete.

Unchanged:540 master IDs,574 registry definitions,14 owner-authorized private DRAFT engines; SIPv1, unpublished/unregistered SIPv2 and Slopev1 history. All836 waiver authorities,210 source reviews,540 mapping decisions,12 HOLD dispositions and38 specialist reviews remain UNKNOWN without authentic authorized evidence.

Release still requires protected production schema/function/grant fingerprints, reviewed009/011/013/029 and032–035/038 migration/RPC adoption and rollback, genuine isolated auth/payment acceptance, Mortgage period/final-payment decisions, BMI clinical/golden approval, SIPv2 numerical-policy review, physical-device/accessibility/performance acceptance and remaining Blueprint/Business/PDF workflows. Passing this batch does not infer any of these decisions.

Next: independently review these two engineering closures, then rehearse the exact owner-approved database upgrade/rollback contract when protected fingerprints are supplied. Continue separately scoped, source-backed remaining product work; do not publish calculators to erase404s or improve counts.
