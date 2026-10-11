# Mortgage specialist review package

Prepared 12 October 2026, IST. This is an engineering evidence package, **not financial approval**. Proposed Mortgage source #60: `8eedfcc842bca15429e1578854c198f6899e7cb6`; integrated draft #1380: `8b3600c8d79e83326b770dca5bfcb9a07ec07567`. Main and cumulative #1379 remain unchanged. No review, HOLD, publication or specialist status is inferred from code certification.

## Review authority and present scope

Identity: `finance.mortgage`, `mortgage-payment`, version 1. The proposed definition delegates `finance.loan-payment` v1. Inputs are positive finite principal, annual rate 0–1000%, and integer term 1–1200 months. UI property price minus down payment derives principal, with required fields and nonnegative down payment; nonpositive derived principal is rejected. Sources are the two existing CFPB references in the proposed definition; their presence does not approve CalcuMint's exact rounding policy.

Existing behavior: calculate fixed-rate periodic payment; round monthly payment to two decimals; multiply that rounded payment by the term and round total principal/interest to two decimals; subtract principal and round total modeled interest. Source `roundTo` uses its established half-away-from-zero/tolerance behavior and normalizes signed zero. No formulas were changed for this package.

Only aggregate principal and interest are supported. Taxes, homeowners/mortgage insurance, HOA/association fees, closing costs, other ownership costs, currency/locale context, approval/underwriting and period dates are not modeled. Rate comparisons independently evaluate this same aggregate engine; they are not amortization periods.

## Reproducible observations

Full inputs and outputs/rejections are in [MORTGAGE-SPECIALIST-REVIEW-VECTORS.json](MORTGAGE-SPECIALIST-REVIEW-VECTORS.json); targeted tests compare every vector to the actual proposed engine. These observations preserve current behavior without endorsing it.

| Case | Principal / annual rate / months | Monthly payment | Total principal & interest | Total modeled interest |
|---|---|---:|---:|---:|
| Source golden | 100000 / 6% / 360 | 599.55 | 215838 | 115838 |
| Zero-rate rounding | 320000 / 0% / 360 | 888.89 | 320000.4 | 0.4 |
| Tiny principal | 0.001 / 0% / 1 | 0 | 0 | 0 |
| Fractional principal/small rate | 123456.789 / 0.001% / 37 | 3336.72 | 123458.64 | 1.85 |
| Upper schema boundary | 100 / 1000% / 1200 | 83.33 | 99996 | 99896 |

A schema-valid rate of `1e-300` produces a nonfinite intermediate and is rejected by the existing rounding guard. Invalid principal, negative/out-of-range rates and zero/fractional/overlong terms are rejected. Nonfinite input/result export data is independently blocked by shared account snapshot validation.

The zero-rate case requires explicit financial review: the aggregate's `totalInterest` is 0.4 from rounding, while LoanAnalysis v1 on the same principal/rate/term reports totalInterest 0 and terminal balance 0. Its period rows therefore cannot be substituted as a reconciled Mortgage schedule. The tiny-principal rounded-zero outcome and tolerances likewise require an explicit decision; they must not be silently clamped or reinterpreted by presentation code.

## Required specialist decisions — all unresolved

| Decision | Required evidence / responsible authority |
|---|---|
| Aggregate rounding suitability | Financial specialist documents whether current monthly-first rounding, rounding residuals at zero rate, and tiny values are acceptable for this model. A change requires a separately governed immutable engine version, not a renderer adjustment. |
| Period recurrence and precision | Financial specialist supplies reviewed payment/interest/principal/balance recurrence, precision at each step, source basis and golden vectors. Engineering must not infer these from the aggregate formula. |
| Final payment and residual balance | Define final-payment adjustment, treatment of overpayment/underpayment/residual cents and exact terminal reconciliation to the accepted aggregate contract. No terminal tolerance or forced zero is prescribed here. |
| Period identity / dates | Specify ordinal/date semantics, first due date if applicable, duration, complete versus sampled rows and any explicitly modeled calendar conventions. |
| Summation / terminal mappings | Declare which fields reconcile to which aggregate outputs, what tolerance (if any) is reviewed, and which sampled rows may not be summed. |
| Cost and jurisdiction boundaries | Explicitly retain excluded ownership costs or supply separately reviewed inputs/formulas/currency context. No defaults or conversions may be inferred. |
| Specialist approval and lifecycle | Authorized reviewer records the actual reviewed evidence; owner/admin retains existing certification, immutable-version, HOLD and publication checks. Protected records remain UNKNOWN to this anonymous engineering session. |

## Acceptance criteria for a future period implementation

1. A supplied reviewed contract and immutable engine identity/version precede any new financial calculation or schedule adapter. Existing aggregate behavior stays unchanged unless a separately governed version is authorized.
2. Direct engine golden/boundary tests cover zero/ordinary/extreme rates, fractional/tiny principal, term bounds, reviewed rounding residuals and final-payment behavior. The approved summation and terminal mappings reconcile without invented tolerances or hidden row drops.
3. Free/Pro/Business use identical mathematical data; existing entitlement policy controls presentation/export. Chart, accessible table, JSON and CSV use the same raw ordered rows and declare complete/sampled scope.
4. Invalid/nonfinite/unavailable outputs fail visibly and disable history/downloads; blank required inputs never become authoritative zero. Zero values supported by the reviewed schema remain intact.
5. Keyboard/screen-reader and 320px responsive acceptance, bounded large-result rendering, and full raw export fidelity are tested. Harness tests do not substitute for specialist assistive-technology acceptance.
6. Existing RLS, specialist/HOLD and matching published-ID/version gates remain intact. Authorized owner/admin approval, release/deployment and live route verification remain separate steps; this package performs none.

**Release evidence:** 574 registered engines / 226 source code-certified candidates; 209 prior anonymous authoritative published entries reused. Mortgage is not observed in that manifest. Specialist approval/HOLD remains UNKNOWN, and Mortgage period outputs remain **BLOCKED**. BMI and Break-even draft restrictions and the sixteen-candidate matrix remain unchanged.
