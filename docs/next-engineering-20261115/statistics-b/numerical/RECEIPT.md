# Independent numerical QA receipt: statistics 285, 286 and 291

RELEASE HOLD ACTIVE. Numerical evidence only; no certification, production, canonical count, integration or SRC change.

## Reproduce from repository root

```sh
node scripts/next-engineering-20261115/numerical-oracle.mjs
```

Requires repository node_modules with esbuild and Python with exactly mpmath==1.3.0. Override the interpreter with NUMERICAL_ORACLE_PYTHON if needed. The driver refuses a different mpmath version and does not install anything. Bundles use original immutable engine modules, schema validation and calculate functions; temporary bundles are removed. The Python side provides an independent oracle, not a replacement calculator.

Runtime used: CPython 3.12.14; mpmath 1.3.0 at 90 decimal digits; Node v24.19.0; esbuild 0.28.2. Python library source-file hashes and aggregate digest are retained in RESULTS.json. Original engine hashes, reproducer hashes and evidence hashes are in HASHES.json. The source hashes are checked before and after the run.

## Predeclared specification

SPEC.json was written before numerical execution (timestamp inside). Tolerances were not widened after observing results:

| Quantity | Declared tolerance |
| --- | --- |
| Five inherited critical values vs ideal inverse normal | absolute ≤5e-13 |
| Normal CDF and upper tail | absolute ≤1e-7 each |
| Normal PDF | relative ≤1e-12 |
| CDF(z) versus upperTail(-z) | absolute ≤1e-7 |
| CDF plus upper tail versus 1 | absolute ≤1e-15 |
| CDF / upper-tail ordering | nondecreasing / nonincreasing |

The standard-normal grid has exactly 8001 points, integer/1000 for integer=-4000…4000, including both endpoints and zero. Thus declared spacing is 0.001 on [-4,4]; actual binary64 inputs are retained.

Twenty location/scale cases use four (mean,scale) pairs: (123.5,2.25), (-10,.125), (1e12,.001), (1e-20,1e-20), with each target z in {-4,-1.96,0,1.96,4}. Oracle arguments use the exact actual binary64 x/mean/scale, rather than treating intended decimal z as exact. At mean=1e12 and scale=.001, the intended ±4 inputs round to actual engine z=±4.0283203125; those two are outside the private |z|≤4 capture scope. They are supplementary immutable-engine checks and do not establish capture acceptance. The other 18 transformed cases are within scope. Large location/small scale also moves intended ±1.96 to actual ±1.953125. This input quantization is retained, not hidden by comparing against the intended z.

## Measured results

24,063/24,063 normal scalar comparisons pass: 8021 cases × (CDF, upper tail, PDF). Five critical-value comparisons pass. All nine aggregate checks pass. These are numerical case/assertion counts, not additional Vitest unit tests.

| Maximum observed discrepancy | Value | Witness |
| --- | --- | --- |
| CDF absolute error | 6.968741261075226e-8 | x=.064, μ=0, σ=1 |
| Upper-tail absolute error | 6.968741261075226e-8 | x=-.064, μ=0, σ=1 |
| PDF relative error | 7.579148293168502e-16 | x=5e-20, μ=1e-20, σ=1e-20 |
| Critical-value absolute error | 4.728118191455206e-13 | confidence .90 |
| CDF/upper-tail reflection residual | 1.0000000272292198e-9 | z=0 |
| Complement residual | 5.551115123125783e-17 | retained full results |

Grid CDF is nondecreasing; grid upper tail is nonincreasing. Reflection is approximate: at zero the immutable engine returns CDF=.5000000005 and upperTail=.4999999995. Passing the declared 1e-7 reflection tolerance does not mean exact symmetry.

Critical errors by confidence: .80=3.995817641039354e-13; .90=4.728118191455206e-13; .95=5.414293113527272e-14; .98=1.590845998665210e-13; .99=9.909916203466899e-14. Full 90-digit oracle values are retained.

## 286 rounding-boundary witnesses

Each witness fixes p=.5 and an integer target 100000000. Its actual binary64 margin is generated from a high-precision midpoint between the square of the inherited binary64 table critical value and the square of the ideal inverse-normal value. Both calculations use the identical actual binary64 margin. The v1 values below are the original engine outputs:

| Confidence | Margin input | v1 unrounded n | v1 ceil | Ideal-quantile ceil |
| --- | --- | --- | --- | --- |
| .80 | 0.00006407757827724001 | 100000000.0000312 | 100000001 | 100000000 |
| .90 | 0.00008224268134756182 | 99999999.99997126 | 100000000 | 100000001 |
| .95 | 0.00009799819922700136 | 99999999.99999723 | 100000000 | 100000001 |
| .98 | 0.00011631739370204603 | 100000000.00000685 | 100000001 | 100000000 |
| .99 | 0.0001287914651774475 | 100000000.00000386 | 100000001 | 100000000 |

RESULTS.json includes every input, immutable structured output and 90-digit ideal unrounded value. Therefore v1 sample size is the ceiling of its inherited rounded-table computation. It has no guarantee of matching the ideal-quantile ceiling or producing a mathematically minimal ideal-normal sample size near integer boundaries. This is an applicability finding, not an engine change.

## Evidence and provenance

- engine-observations.json.gz retains SPEC plus all original engine inputs and complete structured outputs, including steps.
- oracle-values.json.gz retains every actual normal input, 90-digit exact-input z, oracle PDF/CDF/upperTail and numerical error.
- RESULTS.json retains critical values, every rounding witness, maxima with exact cases, property measurements, runtime/library source provenance and counts.
- HASHES.json records SHA256 digests for evidence, scripts and original engine sources.
- mpmath-doc-excerpts.md retains official function documentation for erfinv, npdf and ncdf, source URL, retrieval time and scrape ID.

The oracle uses sqrt(2)*erfinv(confidence) for the two-sided critical value, ncdf(z), ncdf(-z) and npdf(x,mean,scale). Confidence labels are intended exact decimals; all other oracle inputs are converted directly from parsed binary64 floats to mp.mpf.

Provenance gap: the official https://mpmath.org/doc/1.3.0/functions/expintegrals.html URL reports “mpmath 1.2.0 documentation” in its retrieved title. Installed mpmath asserts 1.3.0 and all installed Python source files are hashed; the retrieved documentation establishes function semantics but does not independently authenticate a 1.3.0 release archive. No new external source artifact replaces original source-admission evidence.

## Validation and limits

The reproducer exits zero only if declared tolerances, monotonicity, symmetry/complement checks and all five differing-ceiling witnesses pass. Focused ESLint on numerical-oracle.mjs passes. SHA256 manifest checks and staged diff whitespace checks pass. No full suite/build/production check was run.

A dense finite grid and selected transformations do not prove a supremum on the continuous domain. This evidence supports the measured approximation scope and inherited table rounding only; it does not establish a global analytic error bound, empirical normality, confidence coverage or population assumptions.

Local Node24 synchronous child-process input stalled / returned EPERM during initial harness development; the final reproducer uses asynchronous execFile and file-based input and completes normally. The original oracle specification and tolerances were retained.
