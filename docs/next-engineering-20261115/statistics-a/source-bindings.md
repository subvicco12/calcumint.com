# Statistics A engineering source bindings

Release hold active. These are private engineering candidates only. This lane does not change existing engines, canonical counts, registry integration, acceptance/certification, PR 1538, production, or publication status.

Primary excerpts were retrieved through Firecrawl from the named OpenStax textbook sections on 2026-11-15. Each retained file includes its source URL, retrieval timestamp, attribution and retrieval ID. [The evidence manifest](evidence/manifest.json) records SHA-256 over the exact UTF-8 bytes of each retained excerpt file. Excerpts are explicitly partial and preserve Firecrawl's duplicated mathematical glyphs. Formula text below is an applicability explanation, not a claim of independently certified numeric accuracy.

## ID 284

- Exact tuple: `statistics.z-score` / `z-score-calculator` / version `1`.
- Export: `zScoreCalculator`, `src/calculators/statistics/catalog-batch-1.ts`.
- Primary result/unit: `zScore`, dimensionless. Input value, mean and positive standard deviation must share a unit. All original `deviation` and `steps` output is retained.
- Formula: `z = (x - μ) / σ`.
- Primary binding: [OpenStax Introductory Statistics 2e, 6.1](evidence/284-z-score.md), “The Standard Normal Distribution.” Its z-score section gives the standardization equation, sign/zero interpretation and the fixture `x=17, μ=5, σ=6 → z=2`.
- Applicability: arithmetic standardization of supplied parameters. A normal model is required for a normal-distribution interpretation; this contract does not estimate that model or calculate a tail probability. `σ > 0` is enforced by the original engine schema. New capture also uses the shared finite bounded domain. Historical replay retains the original wider finite-input domain.

## ID 285

- Exact tuple: `statistics.confidence-interval` / `confidence-interval-calculator` / version `1`.
- Export: `confidenceIntervalCalculator`, `src/calculators/statistics/catalog-batch-2.ts`.
- Primary result/unit: `marginOfError`, supplied estimate unit. All `estimate`, `lowerBound`, `upperBound`, `confidenceLevel`, `criticalValue`, and `steps` fields are retained.
- Formula: `estimate ± z* × SE`, with two-sided `z* = Φ⁻¹((1+CL)/2)`.
- Primary binding: [OpenStax Introductory Statistics 2e, 8.1](evidence/285-confidence-interval.md). It supplies the interval form, a normal sampling-distribution/known-population-SD assumption, the `σ/√n` standard error and `95% → z*=1.96` rounded textbook value.
- Applicability: caller supplies an estimate and a valid positive standard error for a justified normal approximation. No estimated degrees of freedom, Student t model, raw-data inference, or guarantee of coverage. Exactly `0.8, 0.9, 0.95, 0.98, 0.99` confidence fractions are supported by v1. A capture-only guard rejects either endpoint equaling the estimate because positive SE gives a mathematically nonzero width; for example estimate `1e20`, SE `1`, CL `0.95` collapses both endpoints in binary64. Historical replay intentionally accepts that unchanged v1 result.
- Precision limit: textbook formulas/rounded quantiles support applicability, not all twelve decimal places of the inherited critical-value table. This lane does not replace or independently certify that table.

## ID 286

- Exact tuple: `statistics.sample-size` / `sample-size-calculator` / version `1`.
- Export: `sampleSizeCalculator`, `src/calculators/statistics/catalog-batch-2.ts`.
- Primary result/unit: `sampleSize`, observations. All `unroundedSampleSize`, `confidenceLevel`, `marginOfError`, `proportion`, and `steps` fields are retained.
- Formula: `n = ceil(z*² × p × (1-p) / E²)`.
- Primary binding: [OpenStax Introductory Statistics 2e, 8.3](evidence/286-sample-size.md), “Calculating the Sample Size n.” It solves the proportion error-bound equation for n, identifies `p=0.5` as giving the largest product and directs rounding to the next higher integer.
- Applicability: approximate proportion planning with an assumed interior `0 < p < 1`, absolute fractional `0 < E ≤ 1`, the five v1 normal confidence levels, and n at most `1e9`. No finite-population correction. This is a planning formula; it does not validate that a realized sample supports a normal inference. Capture rejects `p=0`/`p=1`: those yield zero observations in v1 and do not provide an informative normal-approximation plan. Historical replay continues to accept both original endpoints. The unchanged engine enforces count overflow.
- Precision limit: inherited rounded critical constants have the same limitation as ID 285. Independent `95%, E=0.05, p=0.5` fixture gives 385 after rounding upward; pre-round comparison allows the v1 table's rounding.

## ID 287

- Exact tuple: `statistics.probability` / `probability-calculator` / version `1`.
- Export: `probabilityCalculator`, `src/calculators/statistics/catalog-batch-2.ts`.
- Primary result/unit: `bothIndependent`, probability. All supplied probabilities, `eitherIndependent`, `notA`, and `steps` fields are retained.
- Formulas: `P(A∩B)=P(A)P(B)`; `P(A∪B)=P(A)+P(B)-P(A∩B)`; `P(Aᶜ)=1-P(A)`.
- Primary bindings: [OpenStax Introductory Statistics 2e, 3.3](evidence/287-probability-rules.md) explicitly gives multiplication under independence and the addition rule. [Section 3.1](evidence/287-probability-complement.md) gives the complement sum and probability range `[0,1]`.
- Applicability: independence is a supplied assumption, not inferred. No dependent/conditional-event model. Original input schema enforces `[0,1]`. Capture additionally rejects computed probabilities outside `[0,1]`, intersection above either event, union below either event, a positive interior event swallowed by the complement, or a positive interior event contribution swallowed by the union. E.g. `A=1e-50,B=0.5` loses A in its complement; swapping these values loses B in the union. `A=1,B=0.13` produces a v1 union of `0.9999999999999999`, below A, and is rejected only for new capture. No clipping or recalculation occurs. Original v1 outputs remain historically verifiable.

## ID 288

- Exact tuple: `statistics.permutation` / `permutation-calculator` / version `1`.
- Export: `permutationCalculator`, `src/calculators/statistics/catalog-batch-2.ts`.
- Primary result/unit: `permutations`, ordered selections. All `n`, `r`, and `steps` output is retained.
- Formula: `P(n,r)=n!/(n-r)!`, evaluated as the product of r consecutive factors; the empty product `P(n,0)=1`.
- Primary binding: [OpenStax College Algebra 2e, 9.5](evidence/288-permutation.md), “Finding the Number of Permutations of n Distinct Objects Using a Formula.” It defines ordered selection of r distinct objects, the factorial quotient, and the independent `P(6,3)=120` worked fixture.
- Applicability: integer `0 ≤ r ≤ n ≤ 1e9`, without replacement and with distinct objects. The original engine rejects any multiplication outside the exact safe-integer range; `18! = 6402373705728000` is accepted, `19!` rejected. No repeated-object or combination model. No extra capture guard is needed beyond the shared bounded-input policy and original exact integer checks.

## Engineering and historical boundary

Every capture delegates to the immutable v1 engine and retains its complete structured output. The shared helper requires exact numeric-text fields and bounds new captures to zero or `1e-50 ≤ |x| ≤ 1e50`; it rejects nonfinite structured data and nonzero subnormal primary results. ID-specific validators run only during capture. Historical verification requires exact slug/version, exact numeric engine input fields, and exact replay equality of the entire recorded output including steps. Tampering and unknown versions fail closed. Original-domain historical fixtures, including the new capture exclusions above, are verified without applying those exclusions.

No primary formula-source retrieval gaps remain. The inherited critical-value table's full decimal accuracy and normal-inference suitability for arbitrary supplied data are not certified by this work. Release, canonical acceptance and publication remain on hold.
