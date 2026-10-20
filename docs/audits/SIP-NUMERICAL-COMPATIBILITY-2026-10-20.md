# SIP numerical compatibility evidence — 2026-10-20

Status: **reproduced; narrow fail-closed safety guard implemented**. Formula, version 1,
registered golden bindings, identity, history and plan behavior remain intact.
Engineering arithmetic coverage is not financial specialist approval. Existing
Mortgage/BMI official golden evidence gaps remain blocked and outside this lane.

## Root cause and diagnostic reproduction

`finance/sip.ts` accepts finite positive contributions, annual return [-99,1000],
integer term [1,1200], and either timing. `sipFutureValue` divides annual return
by 100 and then 12; it branches only on exact monthly zero. For annual `1e-300`,
monthly r is `8.333333333333333e-304`, but binary64 `1+r === 1`. Subtracting 1
from its power yields zero. Input `{monthlyContribution:1,
annualReturnPercent:1e-300,termMonths:1200,contributionTiming:'end'}` therefore
passes schema and `runCalculator` returns version 1 output
`{futureValue:0,investedAmount:1200,estimatedGain:-1200}`. Beginning timing does
the same. Annual `-1e-300` produces negative zero before rounding and also an
incorrect zero future value. This is before rounding: `roundTo` cannot recover
lost principal. These are pre-guard diagnostics, not passing assertions that canonize the defect.
The guard now throws before multiplication for a nonpositive computed annuity
factor when contribution is positive; it supplies no replacement numeric result.

Independent exact bounds: each of 1200 end deposits has weight `(1+r)^k`,
0 <= k <=1199. For positive r every weight >=1, hence FV >=1200. For
|r|<1e-303, Bernoulli's inequality bounds negative-rate loss by
sum(k)*1e-303 <7.2e-298; positive growth is likewise far below half a cent
(bound each weight by exp(1200e-303)). Both tiny signed inputs must round to
1200 at cent precision. Beginning weights k=1..1200 give the same rounded
conclusion. Annual +/-`Number.MIN_VALUE`, conversely, underflows to signed
monthly zero and currently returns the correct rounded 1200 via the zero branch.

`requiredMonthlySip` uses the same forward factor; tiny nonzero rates yield zero
factor, division becomes infinite and its existing finite check throws. This
does not protect forward calculation. `runCalculator` only parses, invokes,
and attaches definition identity/version; it has no economic result invariant.
The SIP UI catches thrown failures but accepts this finite forward output;
schedule reconciliation can fail while the fallback summary still has the
engine result. Analysis `sipGoal` also calls the inverse. Account actions bind
the existing version 1; snapshots preserve their captured input/output and SIP
is not eligible for current scenario reevaluation. No formatter/history repair
can establish the missing engine value.

## Independent arithmetic coverage

`sip-numerical-compatibility.test.ts` uses a local BigInt rational recurrence
of deposited balances, avoiding the production quotient of powers. It validates
the existing six registered references independently without rebinding them.
Additional literal endpoint references: -99% uses q=367/400 and 400 deposits,
two periods: end 767, beginning 281489/400=703.7225. +1000% uses q=11/6 and
600 deposits, two periods: end 1700, beginning 9350/3. Zero at maximum term,
both signed annual underflows, timing, independent inverse targets and all
three plans are covered. The prior four negative inverse vectors are not
duplicated. No stable-evaluation helper is shipped.

## Compatibility experiment (throwaway diagnostic, not a proposed engine)

Node binary64 grid: annual rates
`[-99,-60,-1,-1e-8,-1e-12,-1e-300,0,1e-300,1e-12,1e-8,1,8,12,100,1000]`;
months `[1,2,12,120,1200]`; contributions `[.01,1,100,10000,1e8]`; both timings.
750 accepted combinations. Compared current evaluation with
`PMT * expm1(n*log1p(r))/r * timingFactor`, retaining the exact-zero branch and
the current rounding algorithm (including its integral-value early return).
256 rounded outputs differ, 28 at |annual rate| >=1. There are 65 raw lower
bound violations at nonnegative rates, including 50 positive-rate zero results.
This grid demonstrates incompatibility, not numerical certification of the
candidate evaluation or exhaustive domain proof.

Examples: annual -1e-8, n=1, PMT=1e8, end: legacy 100000008.27 versus candidate
100000000 (one end contribution must equal principal exactly). Annual 12,
n=1200, PMT=1e8, end: legacy 1533365568055285 versus candidate
1533365568055269.8; beginning: 1548699223735839 versus 1548699223735822.5.
Large values expose existing rounding/integer behavior as well as evaluation
differences. Agreement on the six references does not establish full v1
compatibility for a stable rewrite.

## Decision boundary

A narrow failure guard rejecting nonpositive computed FV for positive deposits
can fail closed on the reproduced cancellation without supplying a speculative
replacement value. Positive deposits and supported q>0 imply a strictly positive
exact sum. It preserves all six reference results and the independently checked
endpoint vectors. It intentionally changes erroneous accepted-input behavior to
an error, requires owner review, and does not catch nonzero cancellation error.
Do not use a strict raw FV >= invested check: normal floating error can put an
otherwise valid end contribution slightly below principal. A general guard
needs an independently justified numerical tolerance and result policy.

Parent authorized the narrow guard: factor extraction preserves the old
quotient and multiplication order. Positive contribution plus factor <=0
throws before multiplication. Zero contribution retains legacy signed-zero
behavior; legitimate tiny positive outputs may still round to zero. Regression
was RED before this change and GREEN afterward through direct, calculate,
runCalculator and inverse paths, both tiny signs and timings.

Stable evaluation remains subject to explicit immutable-version/compatibility
and financial specialist release review. Formerly accepted unsafe input now
errors, rather than returning a corrected number. Nonzero cancellation remains
unresolved; no claim that SIP is fully fixed or fully certified.

Validation: focused SIP suites pass (23 tests), including the six registered
references, registered legacy example and existing four negative inverse vectors. No full
suite, build, deployment, migration, network or production calls performed.

Additional fail-closed boundary: the old exact-zero-rate early return bypassed
the existing finite-result check, so `sipFutureValue(1e308,0,1200)` returned
Infinity. A RED regression confirmed this; the unchanged principal-times-term
calculation now applies that same finite check before return. Direct, calculate
and runCalculator paths throw for both timings. Finite zero-rate and signed
subnormal-rate reference results remain unchanged.
