# Wave 100 Math: private software evidence

Candidate IDs: **213, 221–231, 234** (13). None is already qualified in the supplied 61-ID scoped overlay. This is software evidence for review, not canonical acceptance, certification, publication authority, or a claim of engineering completion. Production writes, deployment and certification remain held.

## Actual delivered gaps

Every selected ID previously had a retained launch engine but lacked this wave's exact-field factory capture, frozen raw snapshot, explicit bounded graph with refused-point gaps, and bounded reverse witness search. The new module adds those missing execution paths, using the immutable registered version-one engine for every value. It never derives graph values from a replacement formula. The reverse search returns only exact machine-output witnesses for a user-supplied candidate list; it neither asserts exhaustive inverse solutions nor chooses an unjustified branch.

| ID | Identity / exact scope | Concrete numerical evidence | Remaining scope boundary |
| --- | --- | --- | --- |
| 213 | fraction-calculator, numerator/denominator quotient | −3/4 = −0.75 | Fraction arithmetic, symbolic reduction and exact rational output are not implemented. |
| 221 | cube-root-calculator, real cube root | ∛(−125) = −5 | Binary64, no complex roots. |
| 222 | power-calculator, base and exp | (−2)^3 = −8 | Real finite output only; negative fractional powers refused. Historical independent golden file has no exact power-calculator row; the new explicit vector supplies local numerical evidence only. |
| 223 | exponent-calculator, base and exponent | 3^4 = 81 | Separate field identity retained; no complex arithmetic. |
| 224 | logarithm-calculator | log₂8 = 3; log₁₀1 = 0 | Existing engine enforces argument/base ≥1e−9 and base ≠1. |
| 225 | reciprocal-calculator | 1/(−4) = −0.25 | Zero, subnormal and overflow results refused. |
| 226 | remainder-calculator | −17 % 5 = −2 | Signed JavaScript remainder, not Euclidean modulo. Conservative zero witnesses require safe integer divisibility or zero dividend. |
| 227 | lcm-calculator | lcm(12,18) = 36 | Positive safe integers; output must be safe integer. |
| 228 | gcf-calculator | gcd(48,18) = 6 | Positive safe integers only. |
| 229 | factor-calculator | smallest factor(12)=2; smallest factor(97)=97 | Smallest factor only, input 2 through 1e9; complete factors are outside scope. |
| 230 | rounding-calculator | −1.25 to one place = −1.2; .04 to one place = 0 | Preserves engine exponent-shift/Math.round policy including ties toward +∞ and signed zero; no banker's-rounding claim. |
| 231 | scientific-notation-calculator | 3.2 × 10⁶ = 3,200,000 | Evaluates coefficient ×10^exponent; normalized formatter is outside scope. |
| 234 | percent-error-calculator | observed 98, accepted 100 → 2% | Accepted value at least 1e−9 per immutable schema; absolute error only. |

## Export contract

`next100MathContracts` supplies `catalogId, engineId, slug, version, title, registered, primaryKey, fields, solveFor, scope, formula, sourceEvidence, limitations`.

`calculateNext100Math(id,input)` returns `{snapshot, captureRevision, formula, steps, unit}`. Inputs must have exactly the named numeric fields. Nonfinite, nonzero subnormal inputs, nonfinite/nonzero-subnormal outputs, and unwitnessed lost-zero outputs are refused. Rounding intentionally allows zero because quantization is its function. The original engines are unchanged.

`graphNext100Math(id,input,samples)` samples the named `solveFor` field at at most 101 explicit points, returning `{x,y}` or `{x,error}`. No interpolation or continuity guarantee is made.

`reverseNext100Math(id,input,target,candidates)` accepts 1–101 explicit candidate field values and returns `{solveFor,target,exhaustive:false,searched,witnesses}`. Each witness contains `{value,input,replay}`. Refused candidates are excluded; duplicate values are deduplicated; exact output equality is mandatory. For example GCF target 6 with fixed b=18 accepts a=6,12,24,30; remainder target 2 with b=5 accepts a=2,7,12,17; rounding target 1.2 to one place accepts 1.16 and 1.24. This bounded search is useful reverse analysis and does not imply symbolic equation solving.

## Source and verification

Identity/differentiation source: `docs/calculator-first/authority-catalog.json` (exact ID rows). Implementation/formula source: exact `launch-<slug>`, slug and version=1 in `src/calculators/launch-portfolio.ts`. Historical independent numerical evidence: `data/verification/codex-a-standard-risk-goldens-2026-10-15.json`, two cases for each selected slug except 222. The new test vectors are manually specified arithmetic expectations, not copied from running the engine. Independent official TC39 and Python documentation and OpenStax textbook captures were subsequently retrieved and frozen; see source-applicability.json for exact excerpts, hashes and per-ID proposed mapping. This is captured evidence pending applicability review, not new certification. ID234 still lacks an exact independent percent-error source.

Executed with Node v22.23.4: focused Vitest **20 tests passed**; focused ESLint passed. Tests include all 13 forward identities, replay witnesses and graph values, strict field identity, finite-range guards, signed remainder, primality/factor scope, rounding ties/zero, non-unique reverse witnesses, exact inverse matching, graph gaps and limits. Full-suite/typecheck/exact-head CI and registry/UI integration belong to the coordinator and remain prerequisites for any qualified engineering claim.

Preserved blockers: 214 decimal-to-fraction rounding policy, 217 weighted-average identity, 232 arbitrary precision, 233 nondeterminism, 235 unrestricted graphing scope and 236/237 solver-source scope are not silently reclassified. Broad catalog claims for 213/229/231 also require human scope review; this module explicitly exposes their narrower retained engine behavior.

## New independent source captures

Firecrawl retrieved exact official TC39 number/math semantics (ECMAScript2027 draft; provider cache timestamps recorded), Python official integer mathematics definitions and OpenStax LCM/factor/reciprocal sections. Full returned markdown is frozen with metadata, and source-applicability.json binds exact excerpts and SHA256 to candidate IDs. IDs213,221–231 have proposed independent source mapping. TC39 is the retained engine language semantic authority, not canonical approval of a catalog identity. Python gcd/lcm defines mathematical target functions only; this software continues using its existing Euclidean engine. OpenStax factors supports prime/composite definitions but does not grant broad complete-factor-list scope. Decimal exponent shifting is a retained local policy; TC39 round only establishes its integer rounding primitive. ID234 remains blocked on exact percent-error source capture. Source applicability remains unsigned and subject to independent review for every ID.
