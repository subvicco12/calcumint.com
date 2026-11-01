# Six bounded calculator contracts

Test-first evidence targets registered candidates 235 Graphing v1, 251 2D Plotter v1, 275 Volume v1, 276 Slope v2, 282 Standard Deviation v1 and 283 Variance v1. All retained canonical, source, qualified-review and publication gates remain unchanged. Original Blueprint SHA and exact per-ID requirement pointers are retained in the adjacent JSON.

Graph helpers consume actual ordered engine points from the existing 81-position grid. They may split an omitted-sample gap, but cannot establish continuity or detect asymptotes between finite samples. Slope presentation retains raw value/deltas and steps. Prism labels describe compatible dimensions without selecting a physical unit. Statistics tests use independent population/sample goldens and negative boundaries. No new engine or historical math replacement is proposed.

Initial focused command: `./node_modules/.bin/vitest run src/lib/batch21-six-calculators.test.ts`. Result: expected RED, missing helper module. Baseline CI run 41302698955 was subsequently confirmed successful by root. Implementation now passes15focused tests and focused ESLint. Final-source browser evidence verifies both widths, actual exports and scenario recovery through the new exact-version verifier; transport remains synthetic, not real authenticated storage.

Verified bounded browser checks: change actual inputs and check displayed/raw values; clear graph bounds and confirm rejection; compare `1/x` omitted-sample segments with actual points; preserve the single segment for an asymptote between finite samples; expose slope deltas and vertical error; switch statistics population/sample; check prism dimensional labels; verify snapshot version and metadata through existing account workflows without inferring authenticated acceptance from a unit test.

Protected manifest check: both new helpers/tests and new evidence paths are outside `docs/software-closure/preservation.json`. No historical engine or protected closure file was edited.

Exception distinction: schema failures use `CalculatorValidationError`; sample singleton and graph ranges producing fewer than two finite points throw ordinary engine `Error`. Slope vertical input fails refinement; quotient overflow fails the calculate guard. These existing differences are preserved.

Slope helper extension was tested RED (two missing-series failures), then GREEN. Its optional coordinate input adds exactly the two provided finite endpoints in their supplied order, including reverse order. It retains raw deltas, scalar output and engine steps, and infers no infinite line.

Additive six-snapshot verification now supplies strict snapshot-shape/deep-copy, exact slug/version, parsed-input field rejection and actual registered-engine output agreement. The original verifier remains unchanged behind a new dispatch wrapper. Only import hooks changed in scenario recovery and saved actions. Slope v1 is rejected without upgrade. All six pass serialized history readback and two-scenario report recovery tests, with input/output/version/extra-field tamper rejection and unchanged original bytes. New 8 + original replay 12 + existing recovery 2 tests pass; focused ESLint passes. This is forward-engine agreement only; no authenticated storage or plan-entitlement acceptance is inferred.

Independent graph witness: both actual v1 graph engines are checked against all 81 exact dyadic pairs derived from integer n=-40..40, x=n/8 and y=n²/64, for 162 expected coordinate/value pairs across the two bindings. The final focused test count is15, all passing, including grid-step underflow rejection. This witness covers only x² on [-5,5].
