# Worked example metadata reconciliation

Baseline: `10dcc77f78d59993950981150f152e184b8d705b` (PR1476 frozen head).
Scope: the 25 failed examples in `data/catalog/calculator-completion-2026-10-25/inventory.json`.
Result: 22 resolved; 3 explicitly unresolved. This is repository fixture evidence, not publication, certification, or release authority. RELEASE HOLD remains.

## Nineteen binary64 display witnesses

The scalar mathematical expected values and existing independent goldens are unchanged. The existing calculate contract prints its unformatted binary64 result in each step. A numeric golden may correctly tolerate the last binary digits; its decimal spelling is not automatically a valid exact step string. Optional `expectedStep` metadata supplies an independently checked display witness while retaining the original numeric expectation.

`src/calculators/worked-example-display.test.ts` specifies all 19 exact display witnesses. Its independent formula substitution test checks each witness without calling a calculator or its expression/product helper. For solid geometry it multiplies exact binary operands using a 100-digit Decimal oracle, independently of the implementation's BigInt significand algorithm. Binary operands use `0b` representations rather than shortened decimal strings. The documented dimensions/formulas supply all operands. The earthquake witness additionally includes the existing six-place rounding contract (including its relative tie allowance); it is not a revised physical energy estimate.

The tire witness uses `(653.2-634.3)/634.3*100`; the scalar mathematical expectation remains unchanged. Rectangular pyramid slants use the documented binary64 `Math.hypot(5,1.5)` and `Math.hypot(5,2)` values, not algebraically rearranged square roots. Python Fraction multiplication independently confirmed the other seven solid-geometry witnesses; Python's platform hypot can differ by an ulp and was not used as the JavaScript hypot contract oracle.

Before metadata changes, all 19 display regressions failed on expected step text. Afterward all 19 pass exact string comparisons and the original `goldenMismatch` comparator. The twentieth test independently derives all 19 display witnesses.

## Three analytic grids

`src/calculators/advanced-math/graph-example-fixtures.ts` constructs full expectations independently of the expression engine:

- graphing and 2D parabola: `x=(i-40)/8`, `y=x*x`, 81 points, extrema 0 and 25;
- 3D paraboloid: quarter-grid coordinates from -2 through 2, row-major 17×17 grid, `z=x*x+y*y`, extrema 0 and 8.

These coordinates and polynomial values are exactly representable binary fractions. Existing sparse goldens corroborate point counts, extrema, endpoints, middle points, and step wording; they are unchanged. All 3 new tests failed before wiring the complete fixtures, and pass afterward with full object equality and the original comparator.

## Three unresolved examples

No partial-expectation type, weaker comparator, additional tolerance, or output snapshot was introduced. These fixtures remain unchanged and visibly fail the original strict contract check:

- `derivative-calculator`: the analytic derivative is 12, and samples could be independently constructed, but the final step interpolates an approximate binary64 Richardson derivative. The existing independent golden intentionally excludes that step's numeric text. Replacing it with the exact analytic 12 would assert a different string contract.
- `limit-calculator`: the analytic limit is 2 and the removable expression simplifies to `x+1`; current sampled values and side estimates arise from the unsimplified binary64 rational expression and extrapolation. The final step interpolates that numerical observation. Existing independent goldens do not establish its exact string.
- `integral-calculator`: the analytic integral is 9, but the independent golden intentionally omits `estimatedError`, `intervals`, and the final diagnostic step. The reported error includes a shifted midpoint-probe gap, so zero error and 8 intervals are stale expectations. Analytic integration does not independently establish those algorithm diagnostics. No actual-output dump was substituted.

These require an independently specified numerical diagnostic/display contract before full fixture replacement. They remain unresolved rather than receiving fabricated implementation snapshots.

Validation: 12 focused test files passed (59 tests), followed by the added unresolved-contract regression (4 graph fixture tests now, 60 focused tests total). `npm run typecheck` passed. `git diff --check` passed. Source comparison confirmed unchanged calculate blocks and goldenTests text in all 18 modified production files.
