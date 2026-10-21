# SIP exact-decimal reference investigation — 2026-10-20

RELEASE HOLD: version-1 numerical behavior is release-blocking at the tested tiny signed rates. Engineering arithmetic evidence; financial specialist approval UNKNOWN.
Baseline: calculator `finance.sip` version 1, parent commit `6367bbc` (1446 baseline).
No production algorithm, schema, engine, golden, example or UI changes.

The existing erased-factor guard does not catch a positive but inaccurate annuity
factor. Reproduction: annual return `1e-12`, monthly contribution `10000`, 1200
end deposits yields `12789769.243681803`; exact decimal recurrence rounds to
`12000000.00`. Raw error lies in `[78976924,78976925]` cents; version-1 rounded
output differs by `78976924` cents. Negative `-1e-12` has the same material
positive error. Even one end deposit, whose exact value is its contribution,
returns `10658.141036401503` at either tiny signed rate instead of `10000`.
These are existing nonzero cancellation errors, not newly shipped fixes.

## Independent oracle and bounds

`verification/sip-high-precision-reference.ts` parses accepted decimal Numbers
using their canonical `Number.toString()` spelling into exact BigInt rationals.
Annual percent is divided exactly by 1200. End deposits follow
`V[k+1] = V[k] q/d + PMT`; beginning deposits multiply that sum by `q/d`.
There is no production quotient, floating exponentiation, dependency installation,
or production import. Up to 1200 deposits and 18 fractional decimal places are
supported; integer decimal exponents up to 308 are supported. Finer/subnormal
rates deliberately fail the reference bound rather than allocating enormous
rational denominators. This is a bounded source-contract oracle, not a new
financial policy or an exhaustive numeric certification.

Oracle validation precedes comparisons: seven hand-derived examples include
positive/negative rates, both timings and exact half-cent neighbors. Exact signed
floor/ceil intervals enclose the difference between the observed canonical decimal
and rational reference in cents. Thus intervals describe displayed Number decimal
values; they do not claim to enclose the precise underlying IEEE binary value.
Exact cents use nonnegative half-away rounding with no floating tolerance.

The fixture has 55 vectors: eight signed/zero/endpoint/ordinary rates × three
terms × two timings, plus seven rounding/integer boundaries. Four integer cases
cover `MAX_SAFE_INTEGER`, its next representable integer, `1e100` and `1e300`.
Huge values are interpreted as accepted decimal spellings, not as exact binary
integer expansions or as evidence that cent resolution survives at that scale.
Two `1000%`/1200-month vectors are mathematically above Number.MAX_VALUE;
their rejection is verified against the rational bound.

## Version compatibility and diagnostics

53 vectors return finite production results; 25 rounded output values differ
from exact reference cents. 24 are tiny signed-rate cases (`±1e-12`, `±1e-10`);
the remaining case is `0.004999999999999999` at zero return for one end deposit.
Its exact nearest cent is zero but the shared rounding tolerance produces `0.01`.
That rounding question affects shared policy and is not resolved by this audit.
All six existing goldens and the registered legacy example remain unchanged and
pass at version 1. Known wrong outputs are diagnostic observations, never new
golden expectations. The test emits all exact cents, raw error intervals,
rounded output cents and candidate error intervals for review.

The unshipped `expm1(n*log1p(r))/r` candidate is diagnostic only. For the illustrated
`±1e-12`/1200-month cases its decimal error intervals lie within `[-1,1]` cents,
while production errors exceed 789769 dollars. This does not approve candidate
rounding, universal precision, overflow handling or a version transition. Existing
750-grid compatibility evidence remains separate; this investigation adds no
replacement of that grid and reruns no full suite/build.

## Verification and owner decision

Focused commands: Vitest on `sip-high-precision.test.ts` and existing
`sip-numerical-compatibility.test.ts` (16 tests); ESLint on the three new TS files;
`tsc --noEmit --incremental false`. Prior actual UI parity evidence is reused;
this task does not claim new UI loop coverage. Parent remains responsible for
broader integration checks; all 1636 calculators remain UNKNOWN.

Minimum owner decision: choose whether version 1 must preserve existing rounded
outputs or whether corrected arithmetic needs a versioned numerical change, and
explicitly decide the shared near-half-cent rounding policy. A mathematical
reference does not substitute for financial/source review. Until then retain the
release hold; no engine algorithm change is authorized by this evidence.
