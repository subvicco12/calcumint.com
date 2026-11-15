# Statistics B applicability and source evidence

RELEASE HOLD ACTIVE. Private engineering evidence only. No canonical count, certification, publication, release, production, PR1538 or immutable engine change.

URLs, SHA256 digests, UTC retrieval retention timestamp and Firecrawl scrape IDs are in [source-retrievals.json](source-retrievals.json). NIST artifacts retain complete markdown returned by Firecrawl, not raw HTML. Math fractions are flattened by extraction. OpenStax retains only a formula excerpt with attribution. Digests cover exact artifact bytes.

## 289

Tuple: 289 / statistics.combination / combination-calculator / v1 / primary combinations (selections).
Immutable source: src/calculators/statistics/catalog-batch-3.ts.
Evidence: NIST Dataplot “Binomial Coefficients,” Description and Syntax, https://www.itl.nist.gov/div898/software/dataplot/refman2/auxillar/binomial.htm; [retained full markdown](nist-combinations.md).

Actual formula alt text: “B(n,m) = n!/(m!(n-m)!)    n >= m”. Syntax defines both counts as nonnegative integers and m≤n. Applies to unordered selection from distinct objects without replacement. BigInt recurrence preserves exact integer results; results above MAX_SAFE_INTEGER are refused. The 10000 cap and exact result limit are implementation policies, not NIST claims. Independent goldens: 52 choose 5 = 2598960; 56 choose 28 = 7648690600760440; 57 choose 28 refuses overflow. Also covers zero, domain boundaries, nonintegers and r>n.

## 290

Tuple: 290 / statistics.binomial-probability / binomial-probability-calculator / v1 / primary probability (0–1).
Immutable source: src/calculators/statistics/catalog-batch-3.ts.
Evidence: NIST/SEMATECH e-Handbook §1.3.6.6.18, Probability Mass Function, https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm; [retained full markdown](nist-binomial.md).

The section defines two mutually exclusive success/failure outcomes, fixed p across trials, x successes in n trials and the PMF. Flattened formula: “P(x;p,n)=(nx)(p)x(1−p)(n−x)for x=0,1,2,⋯,n” with factorial coefficient. The contract requires independent Bernoulli trials; capture cannot establish independence from observations.

The engine's log-space binary64 PMF is approximate; independent golden 15/128 for n=10,k=3,p=.5 uses tolerance. Degenerate p=0/1 and n=0 have exact endpoints. Capture refuses positive interior probabilities that underflow, become subnormal, or saturate at one for n>0. Historical v1 underflow results remain replayable. These bounds are policy, not certified approximation error.

## 291

Tuple: 291 / statistics.normal-distribution / normal-distribution-calculator / v1 / primary cdf (0–1).
Immutable source: src/calculators/statistics/catalog-batch-3.ts.
Evidence: NIST/SEMATECH e-Handbook §1.3.6.6.1, Probability Density Function and Cumulative Distribution Function, https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm; [retained full markdown](nist-normal.md).

The section provides normal density, standard form μ=0 and σ=1, and the integral defining the CDF. Actual excerpt: “Note that this integral does not exist in a simple closed formula. It is computed numerically.” Inputs x, mean and positive standard deviation share units; PDF has reciprocal input units, z is dimensionless and both tails are probabilities.

Evidence gap: NIST establishes the distribution but does not validate this engine's erf coefficients, global error, extreme-tail relative accuracy or capture cutoff. No retrieved source certifies those coefficients or a uniform error bound. The contract therefore explicitly labels an approximation, restricts capture to |z|≤4 and requires positive finite normal density and nonsaturated tails. This is a conservative scope policy, not an accuracy certificate. Point tests at mean and ±1.96 with tolerance, symmetry and ±4 boundaries do not prove uniform accuracy. Every pdf/cdf/upperTail/zScore field and steps is retained. Historical |z|=40 underflow and input magnitudes 1e60 remain replayable.

## 300

Tuple: 300 / statistics.bayes-theorem / bayes-theorem-calculator / v1 / primary posterior (0–1).
Immutable source: src/calculators/statistics/catalog-batch-4.ts.
Evidence: OpenStax Principles of Data Science §3.4 “Bayes’ Theorem,” Ault, Liao and Musolino (2025), https://openstax.org/books/principles-data-science/pages/3-4-probability-theory; [retained formula excerpt and attribution](openstax-bayes-excerpt.md).

The extracted formula gives numerator P(A)P(B|A) and denominator P(A)P(B|A)+P(A′)P(B|A′). Renaming A=H and B=E matches the engine. H/not-H must be exhaustive complementary hypotheses, supplied probabilities refer to the same population/evidence and P(E)>0. Zero evidence is refused. Exact endpoints with an impossible joint event are accepted; new capture refuses rounded posterior endpoints when both hypotheses contribute positive evidence. Historical rounded endpoints remain replayable. Numerator, denominator and steps remain intact.

Independent golden: prior=.03, likelihood=.75, alternative=.15 yields 15/112, more precise than the source's rounded .134 example. No probability calibration, diagnosis or causal conclusion is established.

## Shared capture and replay

createEngineeringContract accepts exact fields of explicit numeric text, finite binary64 input magnitude ≤1e50 and nonzero magnitude ≥1e-50, then immutable schemas/engines. Unknown/missing fields, malformed input and nonfinite structured output are refused. All outputs are stored.

verifyHistorical checks identity, version and exact recorded forward agreement with the original engine, bypassing capture-only guards. This means historical agreement, not scientific certification. Tests forge versions, slugs, input fields, primary output, steps and output fields. Integration registry/UI/history dispatch remains coordinator-owned.

Immutable engine file SHA256:
- catalog-batch-3.ts: 41df470fd871e6fd1779035805c1b96cb120c91aff7a3cce40bc7628e3c3dd8e
- catalog-batch-4.ts: b5f186fbbbeed527bf7f2734a3b53e02d2fcd2113fcef1b71092ef6d520e35f9
