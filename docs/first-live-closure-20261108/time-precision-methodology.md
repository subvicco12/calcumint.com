# Scoped numerical bound for unchanged conversion.time@1

This is an engineering derivation for the existing factor table and operation order, with reproducible finite witnesses. It is not source applicability approval, competent reviewer signoff, canonical adoption, certification or publication authority. The assumed week is a fixed 604800-second duration; this calculation does not establish the missing authoritative source passage or its applicability.

For different units, the engine evaluates `ratio = fl(sourceFactor / targetFactor)` and then `result = fl(x * ratio)`. It does not multiply by the source factor first. For identical units it returns the supplied finite Number unchanged.

Let `u = 2^-53`, with IEEE binary64 round-to-nearest arithmetic. The stored factors 1, 60, 3600, 86400 and 604800 are exact integers. The stored millisecond factor is exactly `1152921504606847 / 2^60`; relative to the intended exact `1/1000`, its representation error is `epsilon = 3/2^57`, positive. If milliseconds are the source, the ratio's factor representation multiplier is `1+epsilon`; if milliseconds are the target it is `1/(1+epsilon)`. Its absolute relative deviation is at most epsilon in either direction. For other pairs it is zero. Equal-unit pairs bypass both arithmetic operations.

For every nonzero supplied binary64 Number `x` satisfying `2^-970 <= abs(x) <= 2^990`, all 36 unit pairs have normal, finite arithmetic. In particular, both the exact intended ratios and every rounded stored ratio are strictly between `2^-30` and `2^30` (the extreme intended ratio is 604800000 and its reciprocal). Therefore the exact multiplication by the rounded ratio has magnitude strictly between `2^-1000` and `2^1020`, with a large margin from subnormal results and overflow. Division and multiplication each admit a relative rounding error bounded by u.

Against the exact target `x * exactSourceFactor / exactTargetFactor`, the absolute relative forward error is at most

`B = (1+epsilon)(1+u)^2 - 1 < 3u`.

This follows by composing the factor representation multiplier and the two rounding multipliers. The lower deviation is no larger than this upper bound. The executable additionally audits the actual 36 rounded ratios exactly: if a pair has exact relative coefficient error `rho`, its sharper output bound is `rho + u(1+rho)`. All comparisons of coefficients and witness forward errors use exact BigInt rational arithmetic, without numerical comparison tolerances.

The primary statement treats x as the exact supplied binary64 Number. It does not claim that Number equals a user's exact decimal text. If decimal text is separately correctly rounded to a normal finite supplied Number within the stated scope, with relative parsing error at most u, the conditional bound against the original decimal is `(1+epsilon)(1+u)^3 - 1 < 4u`. Arbitrary text parsing policies, decimal underflow, overflow and decimal formatting accuracy are outside this claim.

Zero is exact, including its sign in the tested operation paths. Identical-unit conversion returns every finite Number exactly, including subnormal and extreme inputs. For nonidentity conversion the engine itself can underflow a nonzero input to zero: `Number.MIN_VALUE` seconds to weeks returns zero. That is outside this relative-error scope; the existing caller-level nonzero-to-zero refusal remains necessary. Overflow is rejected by the existing engine. No engine behavior was changed.

Reproduce with `node tests/first-live-closure-20261108/time-precision-bound.mjs`. The retained `time-precision-evidence.json` binds the source, script and raw log hashes and records 36 exact coefficient audits, 648 signed nonzero actual-engine witnesses at ordinary and scoped endpoint magnitudes, 72 signed-zero checks, 24 extreme identity checks, and the excluded underflow/overflow observations. Existing golden and replay coverage is retained; this evidence does not replace it or claim exhaustive execution over the domain.
