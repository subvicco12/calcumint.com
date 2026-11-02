# Basic math bounded review

Pinned baseline: `af94b00cee5e8ef53e2b6ecdf1501c6b45cbaee5`. 24 candidate bindings, all version 1. Read only; no certification, approval or production eligibility inferred.

- All input fields begin z.number().finite(); per-field min/max/int/disallow enforced before calculation. Bottom superRefine adds no additional constraints for these 24 inputs.
- calculate rejects nonfinite results and returns only {result}. formatResult is not part of returned software output.
- Default example expected values are computed by spec.compute, not independent oracles. 23 rows have three recorded cases; decimal-to-fraction has 25 recorded cases. Queue stores hashes and labels, not complete executable vectors.
- Imported exact fixture sources subsequently supplied and read. Replayed 46 vectors for 23 calculators plus 24 decimal/fraction vectors (70 total) against isolated exact compute expressions; zero mismatches using Object.is or relative tolerance 1e-12. Decimal display strings also matched all 24 literal fraction expectations. This is not full engine/schema/browser acceptance. Queue evidenceKind remains authored fixture actual engine not independent acceptance.
- Readiness statuses are legacy observations; full canonical identity, source applicability, qualified review and full-domain acceptance remain unestablished. No certification or production claim made.
- Difficulty is proposed bounded contract review effort, not canonical product completeness or an exemption. Tie break ascending master ID.

| ID | Proposed scope | Limitations / decision | Difficulty | Minimum independent tests |
|---|---|---|---|---|
| 208 | absolute-baseline signed percent change | Choose absolute old denominator for negative baselines; old≠0. | 2/5 | old=0 rejected; old=-100,next=-50 →50; opposite large values with finite 200% |
| 209 | apply a nonnegative percentage increase | Original value can be negative; output is adjusted value, not percentage difference. | 1/5 | 240,12.5 →270; zero value; negative percent rejected; overflow outcome |
| 210 | apply a nonnegative percentage decrease | Percent has no 100 cap; >100 gives sign reversal; owner must choose policy. | 2/5 | 240,12.5 →210; percent=100 →0; percent=150 with value100 →-50 |
| 211 | numeric ratio a/b | No reduced integer ratio or colon output. | 1/5 | 7/4 →1.75; negative operands; b=0 rejected |
| 212 | two-number numeric proportion a/b | Does not solve an unknown fourth proportional term. | 2/5 | 3/8 →0.375; signed operands; b=0 rejected |
| 213 | evaluate one numerator/denominator | No arithmetic between fractions, simplification or mixed-number contract. | 2/5 | -7/8 →-0.875; denominator=0 rejected; noninteger operands policy |
| 214 | precision-bounded decimal rounding and reduced display | Precision integer 0..12; additive EPSILON changes rounding; formatResult is a separate display callback, returned object is result only. | 5/5 | 0.4999999999999999,p=0 → implemented1 versus stated0; negative half ties and signed zero; p=-1/13/noninteger rejected; large finite decimal scale overflow; display/replay equality |
| 215 | numeric numerator/denominator conversion | Inputs are finite real numbers, not restricted to integer fraction components. | 1/5 | -3/8 →-0.375; zero denominator rejected; repeating third rounding tolerance |
| 216 | arithmetic mean of exactly two values | No list, count or arbitrary sample mean. Fallback handles overflowed sum. | 1/5 | -7,3 →-2; both1e308 →1e308; opposite signs |
| 217 | fixed 1:2 weighted mean of two values | No configurable weights; broad title requires explicit narrowing. | 3/5 | -4,5 →2; equal extremes; opposite signed cancellation |
| 218 | real number square | Finite inputs may overflow output; no arbitrary precision. | 1/5 | -12 →144; 0; near finite-overflow boundary |
| 219 | real number cube | Finite inputs may overflow or underflow; no arbitrary precision. | 1/5 | -3 →-27; 0; signed finite extremes |
| 220 | principal real square root | x≥0; no complex roots. | 1/5 | 225 →15; 0; x=-1 rejected; small positive tolerance |
| 221 | real cube root | Negative inputs supported by Math.cbrt. | 1/5 | -64 →-4; 0; subnormal and large finite values |
| 223 | real base to real exponent where finite | Math.pow domain is runtime rejection, not input cross-field refinement; decide 0^0 and negative fractional bases. | 3/5 | 2,-3 →0.125; 0,0 →1 policy; -1,0.5 rejected at calculate; 0,-1 rejected at calculate |
| 224 | change-of-base real logarithm | x and base each ≥1e-9; base≠1. This excludes many mathematically positive inputs. | 3/5 | 81,3 →4; x/base=0 rejected; base=1 rejected; x=1e-10 policy; base close to1 tolerance |
| 225 | real reciprocal | x≠0; sufficiently tiny nonzero inputs overflow and are rejected. | 1/5 | -8 →-0.125; 0 rejected; smallest finite input overflow policy |
| 226 | JavaScript truncating signed remainder | Declared a mod b is ambiguous for negative dividends; noninteger operands accepted. | 3/5 | 29,6 →5; -7,3 →-1; 7,-3 →1; b=0 rejected; decimal operands |
| 227 | LCM of two positive integers with safe output | Input .int exact safe-range semantics depend on pinned Zod; compute throws if result not safe integer. Zero/negative inputs excluded. | 3/5 | 12,18 →36; 1,1 →1; zero/negative/noninteger rejected; coprime inputs exceeding safe output rejected |
| 228 | GCF of two positive integers | Zero and negatives excluded; verify pinned Zod .int safe-integer restriction before asserting range. | 2/5 | 48,18 →6; coprime →1; equal integers; zero/noninteger rejected |
| 229 | smallest factor >1 for integer 2..1e9 | Returns input itself for primes; does not list all factors or prime decomposition. | 2/5 | 12 →2; prime97 →97; 2 →2; 1 and 1e9+1 rejected; 1e9 →2 |
| 230 | round finite value to nonnegative integer decimal places | Exponent-shift implementation; Math.round ties toward +∞, preserves negative zero; no explicit maximum places in field config. | 4/5 | -1.25,p1 →-1.2; 1.005,p2 →1.01; negative zero; very large places return unchanged; noninteger/negative places rejected |
| 231 | evaluate coefficient times 10 to real exponent | No normalization or scientific string output; exponent is not required integer; fallback reorders for representability. | 3/5 | 1.25,3 →1250; zero coefficient/extreme exponent; coefficient1e-300,exponent309 →1e9; fractional exponent0.5 tolerance; true overflow rejected |
| 234 | absolute percent error with accepted value ≥1e-9 | Formula text says nonzero accepted value but validator requires positive floor; negative/very small accepted values excluded. | 3/5 | observed9,actual8 →12.5; observed negative; actual=-8 and1e-10 rejected policy; opposite extreme finite200% |

Demonstrated declaration mismatch: ID214 accepts decimal=0.4999999999999999, precision=0. Literal displayed formula rounds to 0; implemented EPSILON-adjusted expression returns 1. Reproduced in Node from exact compute expression, not full engine. Existing EPSILON-labelled fixture shows this may be intentional policy, so obtain an explicit choice and align text/tests.

Imported vectors are now read and isolated replayed (70 numeric vectors, plus 24 decimal display expectations; zero mismatches within relative tolerance 1e-12). The decimal numeric goldenTests map drops fraction assertions, so full display-path acceptance is still needed. Request approved tolerances and exact Zod version before full-engine/schema acceptance. For each proposed scope obtain approved identity, input/output, numerical range and applicable source section; no new URL crawl was performed.

Proposed effort order: 209, 211, 215, 216, 218, 219, 220, 221, 225, 208, 210, 212, 213, 228, 229, 217, 223, 224, 226, 227, 231, 234, 230, 214.
