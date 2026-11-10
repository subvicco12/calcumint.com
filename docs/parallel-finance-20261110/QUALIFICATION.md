# Fixed-rate annuity engineering candidate

Revision: `private-annuity-log1p-20261110.1`. Standalone, unregistered, unrounded engineering helper; no allocated calculator version, specialist approval, certification or production routing.

## Distinct remaining gap

`src/calculators/finance/loan-analysis.ts` exports `paymentForLoan` and `maxPrincipalForPayment`. Their existing denominator `1 - (1+r)^(-n)` loses precision when `r` is small. For principal 1200, annual percentage rate `1e-14`, 12 months, the historical payment throws a numeric-range error although the discounted-cash-flow payment is approximately 100. For annual percentage rate `1e-10`, a one-month payment has approximately 0.000799917 relative error against the decimal cash-flow oracle. The existing upper/lower numeric guards do not correct cancellation.

The candidate evaluates the algebraically equivalent present-value factor `-expm1(-n*log1p(r))/r`, and divides principal by that factor. This also avoids multiplying large principal by rate before dividing. At rates below `EPSILON/(2*n)`, the first-order factor difference is below binary64 precision across the bounded domain, so the zero-rate limit is used; this prevents subnormal intermediate errors. The inverse returns the present value of a given monthly payment. Both entry points enforce positive finite amount, annual percentage rate 0..1000 and integer months 1..1200, then reject nonfinite or zero-underflow results.

## Source scope and preserved lineage

The existing `finance.loan-refinance` definition cites CFPB, “How do mortgage lenders calculate monthly payments,” https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/ . Its recorded formula is `M = P*r / (1-(1+r)^(-n))`; the candidate changes numerical evaluation of that same fixed-rate amortization identity. This is reuse of repository source evidence, not a new external-source qualification. No new tax, lender, fee, cash-flow timing, eligibility or rounding policy is established.

The existing `docs/calculator-sprint-20261108/financial-successor.json` retains original PRs #1370, #1231 and #1230 and their financial review requirements. Their overflow/direct-call guards and private financial rounding work remain intact. This candidate addresses a separate small-rate cancellation gap and does not claim those PRs, financial acceptance #1/#51, publication or specialist review are closed. There is no change to historical replay, rounding helpers, registry, source binding, callers, native delivery or SQL.

## Focused evidence

`npx vitest run --config tests/parallel-finance-20261110/vitest.config.ts` passes 12 tests, including 36 independent decimal discounted-cash-flow profiles (9 rates × 4 terms), each checking payment and principal. The 90-digit decimal reference sums individual discounted payments; it does not reuse the candidate's log/expm1 identity. Cases include zero, subnormal and tiny rates; ordinary and maximum rates; 1, 12, 360 and 1200 months; representable large payments; result overflow/underflow; and invalid direct-call domains.

Before implementation, candidate exports temporarily delegated to unchanged historical helpers: 6 of the original 10 tests failed (tiny-rate exceptions, cancellation error and direct-call bounds). After implementation the focused suite passed; two subnormal rate profiles were then added, yielding 12 passing tests. A regression witness explicitly verifies the historical helper still throws for the tiny-rate example. Focused ESLint also passes. Full-suite verification belongs to the root integration run; no build or commit was performed in this lane.

Future adoption requires an allocated successor engine/version, caller integration with historical compatibility preserved, applicable financial specialist review and exact-head release checks. This document is engineering evidence only.
