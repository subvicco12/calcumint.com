### Navigation

- [index](https://docs.python.org/3/genindex.html "General Index")
- [modules](https://docs.python.org/3/py-modindex.html "Python Module Index") \|
- [next](https://docs.python.org/3/library/math.integer.html "math.integer — integer-specific mathematics functions") \|
- [previous](https://docs.python.org/3/library/numbers.html "numbers — Numeric abstract base classes") \|
- ![Python logo](https://docs.python.org/3/_static/py.svg)
- [Python](https://www.python.org/) »
- German \| DeutschGreek \| ΕλληνικάEnglishSpanish \| españolPersian \| فارسیFrench \| françaisItalian \| italianoJapanese \| 日本語Korean \| 한국어Punjabi \| ਪੰਜਾਬੀPolish \| polskiBrazilian Portuguese \| Português brasileiroRomanian \| RomâneșteRussian \| РусскийTurkish \| TürkçeSimplified Chinese \| 简体中文Traditional Chinese \| 繁體中文

dev (3.16)3.15.23.143.133.123.113.103.93.83.73.63.53.43.33.23.13.02.72.6

- [3.15.2 documentation](https://docs.python.org/3/index.html) »

- [The Python standard library](https://docs.python.org/3/library/index.html) »
- [Numeric and Mathematical Modules](https://docs.python.org/3/library/numeric.html) »
- [`math` — Mathematical functions](https://docs.python.org/3/library/math.html)
- \|

- Theme
AutoLightDark \|

# `math` — Mathematical functions [¶](https://docs.python.org/3/library/math.html\#module-math "Link to this heading")

* * *

This module provides access to common mathematical functions and constants,
including those defined by the C standard.

These functions cannot be used with complex numbers; use the functions of the
same name from the [`cmath`](https://docs.python.org/3/library/cmath.html#module-cmath "cmath: Mathematical functions for complex numbers.") module if you require support for complex
numbers. The distinction between functions which support complex numbers and
those which don’t is made since most users do not want to learn quite as much
mathematics as required to understand complex numbers. Receiving an exception
instead of a complex result allows earlier detection of the unexpected complex
number used as a parameter, so that the programmer can determine how and why it
was generated in the first place.

The following functions are provided by this module. Except when explicitly
noted otherwise, all return values are floats.

|     |     |
| --- | --- |
| **Floating point arithmetic** |
| [`ceil(x)`](https://docs.python.org/3/library/math.html#math.ceil "math.ceil") | Ceiling of _x_, the smallest integer greater than or equal to _x_ |
| [`fabs(x)`](https://docs.python.org/3/library/math.html#math.fabs "math.fabs") | Absolute value of _x_ |
| [`floor(x)`](https://docs.python.org/3/library/math.html#math.floor "math.floor") | Floor of _x_, the largest integer less than or equal to _x_ |
| [`fma(x, y, z)`](https://docs.python.org/3/library/math.html#math.fma "math.fma") | Fused multiply-add operation: `(x * y) + z` |
| [`fmax(x, y)`](https://docs.python.org/3/library/math.html#math.fmax "math.fmax") | Maximum of two floating-point values |
| [`fmin(x, y)`](https://docs.python.org/3/library/math.html#math.fmin "math.fmin") | Minimum of two floating-point values |
| [`fmod(x, y)`](https://docs.python.org/3/library/math.html#math.fmod "math.fmod") | Remainder of division `x / y` |
| [`modf(x)`](https://docs.python.org/3/library/math.html#math.modf "math.modf") | Fractional and integer parts of _x_ |
| [`remainder(x, y)`](https://docs.python.org/3/library/math.html#math.remainder "math.remainder") | Remainder of _x_ with respect to _y_ |
| [`trunc(x)`](https://docs.python.org/3/library/math.html#math.trunc "math.trunc") | Integer part of _x_ |
| **Floating point manipulation functions** |
| [`copysign(x, y)`](https://docs.python.org/3/library/math.html#math.copysign "math.copysign") | Magnitude (absolute value) of _x_ with the sign of _y_ |
| [`frexp(x)`](https://docs.python.org/3/library/math.html#math.frexp "math.frexp") | Mantissa and exponent of _x_ |
| [`isclose(a, b, rel_tol, abs_tol)`](https://docs.python.org/3/library/math.html#math.isclose "math.isclose") | Check if the values _a_ and _b_ are close to each other |
| [`isfinite(x)`](https://docs.python.org/3/library/math.html#math.isfinite "math.isfinite") | Check if _x_ is neither an infinity nor a NaN |
| [`isnormal(x)`](https://docs.python.org/3/library/math.html#math.isnormal "math.isnormal") | Check if _x_ is a normal number |
| [`issubnormal(x)`](https://docs.python.org/3/library/math.html#math.issubnormal "math.issubnormal") | Check if _x_ is a subnormal number |
| [`isinf(x)`](https://docs.python.org/3/library/math.html#math.isinf "math.isinf") | Check if _x_ is a positive or negative infinity |
| [`isnan(x)`](https://docs.python.org/3/library/math.html#math.isnan "math.isnan") | Check if _x_ is a NaN (not a number) |
| [`ldexp(x, i)`](https://docs.python.org/3/library/math.html#math.ldexp "math.ldexp") | `x * (2**i)`, inverse of function [`frexp()`](https://docs.python.org/3/library/math.html#math.frexp "math.frexp") |
| [`nextafter(x, y, steps)`](https://docs.python.org/3/library/math.html#math.nextafter "math.nextafter") | Floating-point value _steps_ steps after _x_ towards _y_ |
| [`signbit(x)`](https://docs.python.org/3/library/math.html#math.signbit "math.signbit") | Check if _x_ is a negative number |
| [`ulp(x)`](https://docs.python.org/3/library/math.html#math.ulp "math.ulp") | Value of the least significant bit of _x_ |
| **Power, exponential and logarithmic functions** |
| [`cbrt(x)`](https://docs.python.org/3/library/math.html#math.cbrt "math.cbrt") | Cube root of _x_ |
| [`exp(x)`](https://docs.python.org/3/library/math.html#math.exp "math.exp") | _e_ raised to the power _x_ |
| [`exp2(x)`](https://docs.python.org/3/library/math.html#math.exp2 "math.exp2") | _2_ raised to the power _x_ |
| [`expm1(x)`](https://docs.python.org/3/library/math.html#math.expm1 "math.expm1") | _e_ raised to the power _x_, minus 1 |
| [`log(x, base)`](https://docs.python.org/3/library/math.html#math.log "math.log") | Logarithm of _x_ to the given base ( _e_ by default) |
| [`log1p(x)`](https://docs.python.org/3/library/math.html#math.log1p "math.log1p") | Natural logarithm of _1+x_ (base _e_) |
| [`log2(x)`](https://docs.python.org/3/library/math.html#math.log2 "math.log2") | Base-2 logarithm of _x_ |
| [`log10(x)`](https://docs.python.org/3/library/math.html#math.log10 "math.log10") | Base-10 logarithm of _x_ |
| [`pow(x, y)`](https://docs.python.org/3/library/math.html#math.pow "math.pow") | _x_ raised to the power _y_ |
| [`sqrt(x)`](https://docs.python.org/3/library/math.html#math.sqrt "math.sqrt") | Square root of _x_ |
| **Summation and product functions** |
| [`dist(p, q)`](https://docs.python.org/3/library/math.html#math.dist "math.dist") | Euclidean distance between two points _p_ and _q_ given as an iterable of coordinates |
| [`fsum(iterable)`](https://docs.python.org/3/library/math.html#math.fsum "math.fsum") | Sum of values in the input _iterable_ |
| [`hypot(*coordinates)`](https://docs.python.org/3/library/math.html#math.hypot "math.hypot") | Euclidean norm of an iterable of coordinates |
| [`prod(iterable, start)`](https://docs.python.org/3/library/math.html#math.prod "math.prod") | Product of elements in the input _iterable_ with a _start_ value |
| [`sumprod(p, q)`](https://docs.python.org/3/library/math.html#math.sumprod "math.sumprod") | Sum of products from two iterables _p_ and _q_ |
| **Angular conversion** |
| [`degrees(x)`](https://docs.python.org/3/library/math.html#math.degrees "math.degrees") | Convert angle _x_ from radians to degrees |
| [`radians(x)`](https://docs.python.org/3/library/math.html#math.radians "math.radians") | Convert angle _x_ from degrees to radians |
| **Trigonometric functions** |
| [`acos(x)`](https://docs.python.org/3/library/math.html#math.acos "math.acos") | Arc cosine of _x_ |
| [`asin(x)`](https://docs.python.org/3/library/math.html#math.asin "math.asin") | Arc sine of _x_ |
| [`atan(x)`](https://docs.python.org/3/library/math.html#math.atan "math.atan") | Arc tangent of _x_ |
| [`atan2(y, x)`](https://docs.python.org/3/library/math.html#math.atan2 "math.atan2") | `atan(y / x)` |
| [`cos(x)`](https://docs.python.org/3/library/math.html#math.cos "math.cos") | Cosine of _x_ |
| [`sin(x)`](https://docs.python.org/3/library/math.html#math.sin "math.sin") | Sine of _x_ |
| [`tan(x)`](https://docs.python.org/3/library/math.html#math.tan "math.tan") | Tangent of _x_ |
| **Hyperbolic functions** |
| [`acosh(x)`](https://docs.python.org/3/library/math.html#math.acosh "math.acosh") | Inverse hyperbolic cosine of _x_ |
| [`asinh(x)`](https://docs.python.org/3/library/math.html#math.asinh "math.asinh") | Inverse hyperbolic sine of _x_ |
| [`atanh(x)`](https://docs.python.org/3/library/math.html#math.atanh "math.atanh") | Inverse hyperbolic tangent of _x_ |
| [`cosh(x)`](https://docs.python.org/3/library/math.html#math.cosh "math.cosh") | Hyperbolic cosine of _x_ |
| [`sinh(x)`](https://docs.python.org/3/library/math.html#math.sinh "math.sinh") | Hyperbolic sine of _x_ |
| [`tanh(x)`](https://docs.python.org/3/library/math.html#math.tanh "math.tanh") | Hyperbolic tangent of _x_ |
| **Special functions** |
| [`erf(x)`](https://docs.python.org/3/library/math.html#math.erf "math.erf") | [Error function](https://en.wikipedia.org/wiki/Error_function) at _x_ |
| [`erfc(x)`](https://docs.python.org/3/library/math.html#math.erfc "math.erfc") | [Complementary error function](https://en.wikipedia.org/wiki/Error_function) at _x_ |
| [`gamma(x)`](https://docs.python.org/3/library/math.html#math.gamma "math.gamma") | [Gamma function](https://en.wikipedia.org/wiki/Gamma_function) at _x_ |
| [`lgamma(x)`](https://docs.python.org/3/library/math.html#math.lgamma "math.lgamma") | Natural logarithm of the absolute value of the [Gamma function](https://en.wikipedia.org/wiki/Gamma_function) at _x_ |
| **Constants** |
| [`pi`](https://docs.python.org/3/library/math.html#math.pi "math.pi") | _π_ = 3.141592… |
| [`e`](https://docs.python.org/3/library/math.html#math.e "math.e") | _e_ = 2.718281… |
| [`tau`](https://docs.python.org/3/library/math.html#math.tau "math.tau") | _τ_ = 2 _π_ = 6.283185… |
| [`inf`](https://docs.python.org/3/library/math.html#math.inf "math.inf") | Positive infinity |
| [`nan`](https://docs.python.org/3/library/math.html#math.nan "math.nan") | “Not a number” (NaN) |

## Floating point arithmetic [¶](https://docs.python.org/3/library/math.html\#floating-point-arithmetic "Link to this heading")

math.ceil( _x_) [¶](https://docs.python.org/3/library/math.html#math.ceil "Link to this definition")

Return the ceiling of _x_, the smallest integer greater than or equal to _x_.
If _x_ is not a float, delegates to [`x.__ceil__`](https://docs.python.org/3/reference/datamodel.html#object.__ceil__ "object.__ceil__"),
which should return an [`Integral`](https://docs.python.org/3/library/numbers.html#numbers.Integral "numbers.Integral") value.

math.fabs( _x_) [¶](https://docs.python.org/3/library/math.html#math.fabs "Link to this definition")

Return the absolute value of _x_.

math.floor( _x_) [¶](https://docs.python.org/3/library/math.html#math.floor "Link to this definition")

Return the floor of _x_, the largest integer less than or equal to _x_. If
_x_ is not a float, delegates to [`x.__floor__`](https://docs.python.org/3/reference/datamodel.html#object.__floor__ "object.__floor__"), which
should return an [`Integral`](https://docs.python.org/3/library/numbers.html#numbers.Integral "numbers.Integral") value.

math.fma( _x_, _y_, _z_) [¶](https://docs.python.org/3/library/math.html#math.fma "Link to this definition")

Fused multiply-add operation. Return `(x * y) + z`, computed as though with
infinite precision and range followed by a single round to the `float`
format. This operation often provides better accuracy than the direct
expression `(x * y) + z`.

This function follows the specification of the fusedMultiplyAdd operation
described in the IEEE 754 standard. The standard leaves one case
implementation-defined, namely the result of `fma(0, inf, nan)`
and `fma(inf, 0, nan)`. In these cases, `math.fma` returns a NaN,
and does not raise any exception.

Added in version 3.13.

math.fmax( _x_, _y_) [¶](https://docs.python.org/3/library/math.html#math.fmax "Link to this definition")

Get the larger of two floating-point values, treating NaNs as missing data.

When both operands are (signed) NaNs or zeroes, return `nan` and `0`
respectively and the sign of the result is implementation-defined, that
is, `fmax()` is not required to be sensitive to the sign of such
operands (see Annex F of the C11 standard, §F.10.0.3 and §F.10.9.2).

Added in version 3.15.

math.fmin( _x_, _y_) [¶](https://docs.python.org/3/library/math.html#math.fmin "Link to this definition")

Get the smaller of two floating-point values, treating NaNs as missing data.

When both operands are (signed) NaNs or zeroes, return `nan` and `0`
respectively and the sign of the result is implementation-defined, that
is, `fmin()` is not required to be sensitive to the sign of such
operands (see Annex F of the C11 standard, §F.10.0.3 and §F.10.9.3).

Added in version 3.15.

math.fmod( _x_, _y_) [¶](https://docs.python.org/3/library/math.html#math.fmod "Link to this definition")

Return the floating-point remainder of `x / y`,
as defined by the platform C library function `fmod(x, y)`. Note that the
Python expression `x % y` may not return the same result. The intent of the C
standard is that `fmod(x, y)` be exactly (mathematically; to infinite
precision) equal to `x - n*y` for some integer _n_ such that the result has
the same sign as _x_ and magnitude less than `abs(y)`. Python’s `x % y`
returns a result with the sign of _y_ instead, and may not be exactly computable
for float arguments. For example, `fmod(-1e-100, 1e100)` is `-1e-100`, but
the result of Python’s `-1e-100 % 1e100` is `1e100-1e-100`, which cannot be
represented exactly as a float, and rounds to the surprising `1e100`. For
this reason, function `fmod()` is generally preferred when working with
floats, while Python’s `x % y` is preferred when working with integers.

math.modf( _x_) [¶](https://docs.python.org/3/library/math.html#math.modf "Link to this definition")

Return the fractional and integer parts of _x_. Both results carry the sign
of _x_ and are floats.

Note that `modf()` has a different call/return pattern
than its C equivalents: it takes a single argument and return a pair of
values, rather than returning its second return value through an ‘output
parameter’ (there is no such thing in Python).

math.remainder( _x_, _y_) [¶](https://docs.python.org/3/library/math.html#math.remainder "Link to this definition")

Return the IEEE 754-style remainder of _x_ with respect to _y_. For
finite _x_ and finite nonzero _y_, this is the difference `x - n*y`,
where `n` is the closest integer to the exact value of the quotient `x /
y`. If `x / y` is exactly halfway between two consecutive integers, the
nearest _even_ integer is used for `n`. The remainder `r = remainder(x,
y)` thus always satisfies `abs(r) <= 0.5 * abs(y)`.

Special cases follow IEEE 754: in particular, `remainder(x, math.inf)` is
_x_ for any finite _x_, and `remainder(x, 0)` and
`remainder(math.inf, x)` raise [`ValueError`](https://docs.python.org/3/builtins/exceptions.html#ValueError "ValueError") for any non-NaN _x_.
If the result of the remainder operation is zero, that zero will have
the same sign as _x_.

On platforms using IEEE 754 binary floating point, the result of this
operation is always exactly representable: no rounding error is introduced.

Added in version 3.7.

math.trunc( _x_) [¶](https://docs.python.org/3/library/math.html#math.trunc "Link to this definition")

Return _x_ with the fractional part
removed, leaving the integer part. This rounds toward 0: `trunc()` is
equivalent to [`floor()`](https://docs.python.org/3/library/math.html#math.floor "math.floor") for positive _x_, and equivalent to [`ceil()`](https://docs.python.org/3/library/math.html#math.ceil "math.ceil")
for negative _x_. If _x_ is not a float, delegates to [`x.__trunc__`](https://docs.python.org/3/reference/datamodel.html#object.__trunc__ "object.__trunc__"), which should return an [`Integral`](https://docs.python.org/3/library/numbers.html#numbers.Integral "numbers.Integral") value.

For the [`ceil()`](https://docs.python.org/3/library/math.html#math.ceil "math.ceil"), [`floor()`](https://docs.python.org/3/library/math.html#math.floor "math.floor"), and [`modf()`](https://docs.python.org/3/library/math.html#math.modf "math.modf") functions, note that _all_
floating-point numbers of sufficiently large magnitude are exact integers.
Python floats typically carry no more than 53 bits of precision (the same as the
platform C double type), in which case any float _x_ with `abs(x) >= 2**52`
necessarily has no fractional bits.

## Floating point manipulation functions [¶](https://docs.python.org/3/library/math.html\#floating-point-manipulation-functions "Link to this heading")

math.copysign( _x_, _y_) [¶](https://docs.python.org/3/library/math.html#math.copysign "Link to this definition")

Return a float with the magnitude (absolute value) of _x_ but the sign of
_y_. On platforms that support signed zeros, `copysign(1.0, -0.0)`
returns _-1.0_.

math.frexp( _x_) [¶](https://docs.python.org/3/library/math.html#math.frexp "Link to this definition")

Return the mantissa and exponent of _x_ as the pair `(m, e)`.
If _x_ is a finite nonzero number, then _m_ is a float with
`0.5 <= abs(m) < 1.0` and an integer _e_ is such that
`x == m * 2**e` exactly. Else, return `(x, 0)`.
This is used to “pick apart” the internal representation of
a float in a portable way.

Note that `frexp()` has a different call/return pattern
than its C equivalents: it takes a single argument and return a pair of
values, rather than returning its second return value through an ‘output
parameter’ (there is no such thing in Python).

math.isclose( _a_, _b_, _\*_, _rel\_tol=1e-09_, _abs\_tol=0.0_) [¶](https://docs.python.org/3/library/math.html#math.isclose "Link to this definition")

Return `True` if the values _a_ and _b_ are close to each other and
`False` otherwise.

Whether or not two values are considered close is determined according to
given absolute and relative tolerances. If no errors occur, the result will
be: `abs(a-b) <= max(rel_tol * max(abs(a), abs(b)), abs_tol)`.

_rel\_tol_ is the relative tolerance – it is the maximum allowed difference
between _a_ and _b_, relative to the larger absolute value of _a_ or _b_.
For example, to set a tolerance of 5%, pass `rel_tol=0.05`. The default
tolerance is `1e-09`, which assures that the two values are the same
within about 9 decimal digits. _rel\_tol_ must be nonnegative and less
than `1.0`.

_abs\_tol_ is the absolute tolerance; it defaults to `0.0` and it must be
nonnegative. When comparing `x` to `0.0`, `isclose(x, 0)` is computed
as `abs(x) <= rel_tol  * abs(x)`, which is `False` for any nonzero `x` and
_rel\_tol_ less than `1.0`. So add an appropriate positive _abs\_tol_ argument
to the call.

The IEEE 754 special values of `NaN`, `inf`, and `-inf` will be
handled according to IEEE rules. Specifically, `NaN` is not considered
close to any other value, including `NaN`. `inf` and `-inf` are only
considered close to themselves.

Added in version 3.5.

See also

[**PEP 485**](https://peps.python.org/pep-0485/) – A function for testing approximate equality

math.isfinite( _x_) [¶](https://docs.python.org/3/library/math.html#math.isfinite "Link to this definition")

Return `True` if _x_ is neither an infinity nor a NaN, and
`False` otherwise. (Note that `0.0` _is_ considered finite.)

Added in version 3.2.

math.isnormal( _x_) [¶](https://docs.python.org/3/library/math.html#math.isnormal "Link to this definition")

Return `True` if _x_ is a normal number, that is a finite
nonzero number that is not a subnormal (see [`issubnormal()`](https://docs.python.org/3/library/math.html#math.issubnormal "math.issubnormal")).
Return `False` otherwise.

Added in version 3.15.

math.issubnormal( _x_) [¶](https://docs.python.org/3/library/math.html#math.issubnormal "Link to this definition")

Return `True` if _x_ is a subnormal number, that is a finite
nonzero number with a magnitude smaller than [`sys.float_info.min`](https://docs.python.org/3/library/sys.html#sys.float_info.min "sys.float_info.min").
Return `False` otherwise.

Added in version 3.15.

math.isinf( _x_) [¶](https://docs.python.org/3/library/math.html#math.isinf "Link to this definition")

Return `True` if _x_ is a positive or negative infinity, and
`False` otherwise.

math.isnan( _x_) [¶](https://docs.python.org/3/library/math.html#math.isnan "Link to this definition")

Return `True` if _x_ is a NaN (not a number), and `False` otherwise.

math.ldexp( _x_, _i_) [¶](https://docs.python.org/3/library/math.html#math.ldexp "Link to this definition")

Return `x * (2**i)`. This is essentially the inverse of function
[`frexp()`](https://docs.python.org/3/library/math.html#math.frexp "math.frexp").

math.nextafter( _x_, _y_, _steps=1_) [¶](https://docs.python.org/3/library/math.html#math.nextafter "Link to this definition")

Return the floating-point value _steps_ steps after _x_ towards _y_.

If _x_ is equal to _y_, return _y_, unless _steps_ is zero.

Examples:

- `math.nextafter(x, math.inf)` goes up: towards positive infinity.

- `math.nextafter(x, -math.inf)` goes down: towards minus infinity.

- `math.nextafter(x, 0.0)` goes towards zero.

- `math.nextafter(x, math.copysign(math.inf, x))` goes away from zero.


See also [`math.ulp()`](https://docs.python.org/3/library/math.html#math.ulp "math.ulp").

Added in version 3.9.

Changed in version 3.12: Added the _steps_ argument.

math.signbit( _x_) [¶](https://docs.python.org/3/library/math.html#math.signbit "Link to this definition")

Return `True` if the sign of _x_ is negative and `False` otherwise.

This is useful to detect the sign bit of zeroes, infinities and NaNs.

Added in version 3.15.

math.ulp( _x_) [¶](https://docs.python.org/3/library/math.html#math.ulp "Link to this definition")

Return the value of the least significant bit of the float _x_:

- If _x_ is a NaN (not a number), return _x_.

- If _x_ is negative, return `ulp(-x)`.

- If _x_ is a positive infinity, return _x_.

- If _x_ is equal to zero, return the smallest positive
_denormalized_ representable float (smaller than the minimum positive
_normalized_ float, [`sys.float_info.min`](https://docs.python.org/3/library/sys.html#sys.float_info "sys.float_info")).

- If _x_ is equal to the largest positive representable float,
return the value of the least significant bit of _x_, such that the first
float smaller than _x_ is `x - ulp(x)`.

- Otherwise ( _x_ is a positive finite number), return the value of the least
significant bit of _x_, such that the first float bigger than _x_
is `x + ulp(x)`.


ULP stands for “Unit in the Last Place”.

See also [`math.nextafter()`](https://docs.python.org/3/library/math.html#math.nextafter "math.nextafter") and [`sys.float_info.epsilon`](https://docs.python.org/3/library/sys.html#sys.float_info "sys.float_info").

Added in version 3.9.

## Power, exponential and logarithmic functions [¶](https://docs.python.org/3/library/math.html\#power-exponential-and-logarithmic-functions "Link to this heading")

math.cbrt( _x_) [¶](https://docs.python.org/3/library/math.html#math.cbrt "Link to this definition")

Return the cube root of _x_.

Added in version 3.11.

math.exp( _x_) [¶](https://docs.python.org/3/library/math.html#math.exp "Link to this definition")

Return _e_ raised to the power _x_, where _e_ = 2.718281… is the base
of natural logarithms. This is usually more accurate than `math.e ** x`
or `pow(math.e, x)`.

math.exp2( _x_) [¶](https://docs.python.org/3/library/math.html#math.exp2 "Link to this definition")

Return _2_ raised to the power _x_.

Added in version 3.11.

math.expm1( _x_) [¶](https://docs.python.org/3/library/math.html#math.expm1 "Link to this definition")

Return _e_ raised to the power _x_, minus 1. Here _e_ is the base of natural
logarithms. For small floats _x_, the subtraction in `exp(x) - 1`
can result in a [significant loss of precision](https://en.wikipedia.org/wiki/Loss_of_significance); the `expm1()`
function provides a way to compute this quantity to full precision:

Copy

```
>>> from math import exp, expm1
>>> exp(1e-5) - 1  # gives result accurate to 11 places
1.0000050000069649e-05
>>> expm1(1e-5)    # result accurate to full precision
1.0000050000166668e-05
```

Added in version 3.2.

math.log( _x_\[, _base_\]) [¶](https://docs.python.org/3/library/math.html#math.log "Link to this definition")

With one argument, return the natural logarithm of _x_ (to base _e_).

With two arguments, return the logarithm of _x_ to the given _base_,
calculated as `log(x)/log(base)`.

math.log1p( _x_) [¶](https://docs.python.org/3/library/math.html#math.log1p "Link to this definition")

Return the natural logarithm of _1+x_ (base _e_). The
result is calculated in a way which is accurate for _x_ near zero.

math.log2( _x_) [¶](https://docs.python.org/3/library/math.html#math.log2 "Link to this definition")

Return the base-2 logarithm of _x_. This is usually more accurate than
`log(x, 2)`.

Added in version 3.3.

See also

[`int.bit_length()`](https://docs.python.org/3/builtins/stdtypes.html#int.bit_length "int.bit_length") returns the number of bits necessary to represent
an integer in binary, excluding the sign and leading zeros.

math.log10( _x_) [¶](https://docs.python.org/3/library/math.html#math.log10 "Link to this definition")

Return the base-10 logarithm of _x_. This is usually more accurate
than `log(x, 10)`.

math.pow( _x_, _y_) [¶](https://docs.python.org/3/library/math.html#math.pow "Link to this definition")

Return _x_ raised to the power _y_. Exceptional cases follow
the IEEE 754 standard as far as possible. In particular,
`pow(1.0, x)` and `pow(x, 0.0)` always return `1.0`, even
when _x_ is a zero or a NaN. If both _x_ and _y_ are finite,
_x_ is negative, and _y_ is not an integer then `pow(x, y)`
is undefined, and raises [`ValueError`](https://docs.python.org/3/builtins/exceptions.html#ValueError "ValueError").

Unlike the built-in `**` operator, `math.pow()` converts both
its arguments to type [`float`](https://docs.python.org/3/builtins/functions.html#float "float"). Use `**` or the built-in
`pow()` function for computing exact integer powers.

Changed in version 3.11: The special cases `pow(0.0, -inf)` and `pow(-0.0, -inf)` were
changed to return `inf` instead of raising [`ValueError`](https://docs.python.org/3/builtins/exceptions.html#ValueError "ValueError"),
for consistency with IEEE 754.

math.sqrt( _x_) [¶](https://docs.python.org/3/library/math.html#math.sqrt "Link to this definition")

Return the square root of _x_.

## Summation and product functions [¶](https://docs.python.org/3/library/math.html\#summation-and-product-functions "Link to this heading")

math.dist( _p_, _q_) [¶](https://docs.python.org/3/library/math.html#math.dist "Link to this definition")

Return the Euclidean distance between two points _p_ and _q_, each
given as a sequence (or iterable) of coordinates. The two points
must have the same dimension.

Roughly equivalent to:

Copy

```
sqrt(sum((px - qx) ** 2.0 for px, qx in zip(p, q, strict=True)))
```

Added in version 3.8.

math.fsum( _iterable_) [¶](https://docs.python.org/3/library/math.html#math.fsum "Link to this definition")

Return an accurate floating-point sum of values in the iterable. Avoids
loss of precision by tracking multiple intermediate partial sums.

The algorithm’s accuracy depends on IEEE-754 arithmetic guarantees and the
typical case where the rounding mode is half-even. On some non-Windows
builds, the underlying C library uses extended precision addition and may
occasionally double-round an intermediate sum causing it to be off in its
least significant bit.

For further discussion and two alternative approaches, see the [ASPN cookbook\\
recipes for accurate floating-point summation](https://code.activestate.com/recipes/393090-binary-floating-point-summation-accurate-to-full-p/).

math.hypot( _\*coordinates_) [¶](https://docs.python.org/3/library/math.html#math.hypot "Link to this definition")

Return the Euclidean norm, `sqrt(sum(x**2 for x in coordinates))`.
This is the length of the vector from the origin to the point
given by the coordinates.

For a two dimensional point `(x, y)`, this is equivalent to computing
the hypotenuse of a right triangle using the Pythagorean theorem,
`sqrt(x*x + y*y)`.

Changed in version 3.8: Added support for n-dimensional points. Formerly, only the two
dimensional case was supported.

Changed in version 3.10: Improved the algorithm’s accuracy so that the maximum error is
under 1 ulp (unit in the last place). More typically, the result
is almost always correctly rounded to within 1/2 ulp.

math.prod( _iterable_, _\*_, _start=1_) [¶](https://docs.python.org/3/library/math.html#math.prod "Link to this definition")

Calculate the product of all the elements in the input _iterable_.
The default _start_ value for the product is `1`.

When the iterable is empty, return the start value. This function is
intended specifically for use with numeric values and may reject
non-numeric types.

Added in version 3.8.

math.sumprod( _p_, _q_) [¶](https://docs.python.org/3/library/math.html#math.sumprod "Link to this definition")

Return the sum of products of values from two iterables _p_ and _q_.

Raises [`ValueError`](https://docs.python.org/3/builtins/exceptions.html#ValueError "ValueError") if the inputs do not have the same length.

Roughly equivalent to:

Copy

```
sum(map(operator.mul, p, q, strict=True))
```

For float and mixed int/float inputs, the intermediate products
and sums are computed with extended precision.

Added in version 3.12.

## Angular conversion [¶](https://docs.python.org/3/library/math.html\#angular-conversion "Link to this heading")

math.degrees( _x_) [¶](https://docs.python.org/3/library/math.html#math.degrees "Link to this definition")

Convert angle _x_ from radians to degrees.

math.radians( _x_) [¶](https://docs.python.org/3/library/math.html#math.radians "Link to this definition")

Convert angle _x_ from degrees to radians.

## Trigonometric functions [¶](https://docs.python.org/3/library/math.html\#trigonometric-functions "Link to this heading")

math.acos( _x_) [¶](https://docs.python.org/3/library/math.html#math.acos "Link to this definition")

Return the arc cosine of _x_, in radians. The result is between `0` and
`pi`.

math.asin( _x_) [¶](https://docs.python.org/3/library/math.html#math.asin "Link to this definition")

Return the arc sine of _x_, in radians. The result is between `-pi/2` and
`pi/2`.

math.atan( _x_) [¶](https://docs.python.org/3/library/math.html#math.atan "Link to this definition")

Return the arc tangent of _x_, in radians. The result is between `-pi/2` and
`pi/2`.

math.atan2( _y_, _x_) [¶](https://docs.python.org/3/library/math.html#math.atan2 "Link to this definition")

Return `atan(y / x)`, in radians. The result is between `-pi` and `pi`.
The vector in the plane from the origin to point `(x, y)` makes this angle
with the positive X axis. The point of `atan2()` is that the signs of both
inputs are known to it, so it can compute the correct quadrant for the angle.
For example, `atan(1)` and `atan2(1, 1)` are both `pi/4`, but `atan2(-1,
-1)` is `-3*pi/4`.

math.cos( _x_) [¶](https://docs.python.org/3/library/math.html#math.cos "Link to this definition")

Return the cosine of _x_ radians.

math.sin( _x_) [¶](https://docs.python.org/3/library/math.html#math.sin "Link to this definition")

Return the sine of _x_ radians.

math.tan( _x_) [¶](https://docs.python.org/3/library/math.html#math.tan "Link to this definition")

Return the tangent of _x_ radians.

## Hyperbolic functions [¶](https://docs.python.org/3/library/math.html\#hyperbolic-functions "Link to this heading")

[Hyperbolic functions](https://en.wikipedia.org/wiki/Hyperbolic_functions)
are analogs of trigonometric functions that are based on hyperbolas
instead of circles.

math.acosh( _x_) [¶](https://docs.python.org/3/library/math.html#math.acosh "Link to this definition")

Return the inverse hyperbolic cosine of _x_.

math.asinh( _x_) [¶](https://docs.python.org/3/library/math.html#math.asinh "Link to this definition")

Return the inverse hyperbolic sine of _x_.

math.atanh( _x_) [¶](https://docs.python.org/3/library/math.html#math.atanh "Link to this definition")

Return the inverse hyperbolic tangent of _x_.

math.cosh( _x_) [¶](https://docs.python.org/3/library/math.html#math.cosh "Link to this definition")

Return the hyperbolic cosine of _x_.

math.sinh( _x_) [¶](https://docs.python.org/3/library/math.html#math.sinh "Link to this definition")

Return the hyperbolic sine of _x_.

math.tanh( _x_) [¶](https://docs.python.org/3/library/math.html#math.tanh "Link to this definition")

Return the hyperbolic tangent of _x_.

## Special functions [¶](https://docs.python.org/3/library/math.html\#special-functions "Link to this heading")

math.erf( _x_) [¶](https://docs.python.org/3/library/math.html#math.erf "Link to this definition")

Return the [error function](https://en.wikipedia.org/wiki/Error_function) at
_x_.

The `erf()` function can be used to compute traditional statistical
functions such as the [cumulative standard normal distribution](https://en.wikipedia.org/wiki/Cumulative_distribution_function):

Copy

```
def phi(x):
    'Cumulative distribution function for the standard normal distribution'
    return (1.0 + erf(x / sqrt(2.0))) / 2.0
```

Added in version 3.2.

math.erfc( _x_) [¶](https://docs.python.org/3/library/math.html#math.erfc "Link to this definition")

Return the complementary error function at _x_. The [complementary error\\
function](https://en.wikipedia.org/wiki/Error_function) is defined as
`1.0 - erf(x)`. It is used for large values of _x_ where a subtraction
from one would cause a [loss of significance](https://en.wikipedia.org/wiki/Loss_of_significance).

Added in version 3.2.

math.gamma( _x_) [¶](https://docs.python.org/3/library/math.html#math.gamma "Link to this definition")

Return the [Gamma function](https://en.wikipedia.org/wiki/Gamma_function) at
_x_.

Added in version 3.2.

math.lgamma( _x_) [¶](https://docs.python.org/3/library/math.html#math.lgamma "Link to this definition")

Return the natural logarithm of the absolute value of the Gamma
function at _x_.

Added in version 3.2.

## Number-theoretic functions [¶](https://docs.python.org/3/library/math.html\#number-theoretic-functions "Link to this heading")

For backward compatibility, the `math` module provides also aliases of
the following functions from the [`math.integer`](https://docs.python.org/3/library/math.integer.html#module-math.integer "math.integer: Integer-specific mathematics functions.") module:

|     |     |
| --- | --- |
| [`comb(n, k)`](https://docs.python.org/3/library/math.integer.html#math.integer.comb "math.integer.comb") | Number of ways to choose _k_ items from _n_ items without repetition<br>and without order |
| [`factorial(n)`](https://docs.python.org/3/library/math.integer.html#math.integer.factorial "math.integer.factorial") | _n_ factorial |
| [`gcd(*integers)`](https://docs.python.org/3/library/math.integer.html#math.integer.gcd "math.integer.gcd") | Greatest common divisor of the integer arguments |
| [`isqrt(n)`](https://docs.python.org/3/library/math.integer.html#math.integer.isqrt "math.integer.isqrt") | Integer square root of a nonnegative integer _n_ |
| [`lcm(*integers)`](https://docs.python.org/3/library/math.integer.html#math.integer.lcm "math.integer.lcm") | Least common multiple of the integer arguments |
| [`perm(n, k)`](https://docs.python.org/3/library/math.integer.html#math.integer.perm "math.integer.perm") | Number of ways to choose _k_ items from _n_ items without repetition<br>and with order |

Added in version 3.5: The [`gcd()`](https://docs.python.org/3/library/math.html#math.gcd "math.gcd") function.

Added in version 3.8: The [`comb()`](https://docs.python.org/3/library/math.html#math.comb "math.comb"), [`perm()`](https://docs.python.org/3/library/math.html#math.perm "math.perm") and [`isqrt()`](https://docs.python.org/3/library/math.html#math.isqrt "math.isqrt") functions.

Added in version 3.9: The [`lcm()`](https://docs.python.org/3/library/math.html#math.lcm "math.lcm") function.

Changed in version 3.9: Added support for an arbitrary number of arguments in the [`gcd()`](https://docs.python.org/3/library/math.html#math.gcd "math.gcd")
function.
Formerly, only two arguments were supported.

Changed in version 3.10: Floats with integral values (like `5.0`) are no longer accepted in the
[`factorial()`](https://docs.python.org/3/library/math.html#math.factorial "math.factorial") function.

[Soft deprecated](https://docs.python.org/3/glossary.html#term-soft-deprecated) since version 3.15: Use the [`math.integer`](https://docs.python.org/3/library/math.integer.html#module-math.integer "math.integer: Integer-specific mathematics functions.") functions instead of these aliases.

## Constants [¶](https://docs.python.org/3/library/math.html\#constants "Link to this heading")

math.pi [¶](https://docs.python.org/3/library/math.html#math.pi "Link to this definition")

The mathematical constant _π_ = 3.141592…, to available precision.

math.e [¶](https://docs.python.org/3/library/math.html#math.e "Link to this definition")

The mathematical constant _e_ = 2.718281…, to available precision.

math.tau [¶](https://docs.python.org/3/library/math.html#math.tau "Link to this definition")

The mathematical constant _τ_ = 6.283185…, to available precision.
Tau is a circle constant equal to 2 _π_, the ratio of a circle’s circumference to
its radius. To learn more about Tau, check out Vi Hart’s video [Pi is (still)\\
Wrong](https://vimeo.com/147792667), and start celebrating
[Tau day](https://tauday.com/) by eating twice as much pie!

Added in version 3.6.

math.inf [¶](https://docs.python.org/3/library/math.html#math.inf "Link to this definition")

A floating-point positive infinity. (For negative infinity, use
`-math.inf`.) Equivalent to the output of `float('inf')`.

Added in version 3.5.

math.nan [¶](https://docs.python.org/3/library/math.html#math.nan "Link to this definition")

A floating-point “not a number” (NaN) value. Equivalent to the output of
`float('nan')`. Due to the requirements of the [IEEE-754 standard](https://en.wikipedia.org/wiki/IEEE_754), `math.nan` and `float('nan')` are
not considered to equal to any other numeric value, including themselves. To check
whether a number is a NaN, use the [`isnan()`](https://docs.python.org/3/library/math.html#math.isnan "math.isnan") function to test
for NaNs instead of `is` or `==`.
Example:

Copy

```
>>> import math
>>> math.nan == math.nan
False
>>> float('nan') == float('nan')
False
>>> math.isnan(math.nan)
True
>>> math.isnan(float('nan'))
True
```

Added in version 3.5.

Changed in version 3.11: It is now always available.

**CPython implementation detail:** The `math` module consists mostly of thin wrappers around the platform C
math library functions. Behavior in exceptional cases follows Annex F of
the C99 standard where appropriate. The current implementation will raise
[`ValueError`](https://docs.python.org/3/builtins/exceptions.html#ValueError "ValueError") for invalid operations like `sqrt(-1.0)` or `log(0.0)`
(where C99 Annex F recommends signaling invalid operation or divide-by-zero),
and [`OverflowError`](https://docs.python.org/3/builtins/exceptions.html#OverflowError "OverflowError") for results that overflow (for example,
`exp(1000.0)`). A NaN will not be returned from any of the functions
above unless one or more of the input arguments was a NaN; in that case,
most functions will return a NaN, but (again following C99 Annex F) there
are some exceptions to this rule, for example `pow(float('nan'), 0.0)` or
`hypot(float('nan'), float('inf'))`.

Note that Python makes no effort to distinguish signaling NaNs from
quiet NaNs, and behavior for signaling NaNs remains unspecified.
Typical behavior is to treat all NaNs as though they were quiet.

See also

Module [`cmath`](https://docs.python.org/3/library/cmath.html#module-cmath "cmath: Mathematical functions for complex numbers.")

Complex number versions of many of these functions.

Module [`math.integer`](https://docs.python.org/3/library/math.integer.html#module-math.integer "math.integer: Integer-specific mathematics functions.")

Integer-specific mathematics functions.

### [Table of Contents](https://docs.python.org/3/contents.html)

- [`math` — Mathematical functions](https://docs.python.org/3/library/math.html#)
  - [Floating point arithmetic](https://docs.python.org/3/library/math.html#floating-point-arithmetic)
  - [Floating point manipulation functions](https://docs.python.org/3/library/math.html#floating-point-manipulation-functions)
  - [Power, exponential and logarithmic functions](https://docs.python.org/3/library/math.html#power-exponential-and-logarithmic-functions)
  - [Summation and product functions](https://docs.python.org/3/library/math.html#summation-and-product-functions)
  - [Angular conversion](https://docs.python.org/3/library/math.html#angular-conversion)
  - [Trigonometric functions](https://docs.python.org/3/library/math.html#trigonometric-functions)
  - [Hyperbolic functions](https://docs.python.org/3/library/math.html#hyperbolic-functions)
  - [Special functions](https://docs.python.org/3/library/math.html#special-functions)
  - [Number-theoretic functions](https://docs.python.org/3/library/math.html#number-theoretic-functions)
  - [Constants](https://docs.python.org/3/library/math.html#constants)

#### Previous topic

[`numbers` — Numeric abstract base classes](https://docs.python.org/3/library/numbers.html "previous chapter")

#### Next topic

[`math.integer` — integer-specific mathematics functions](https://docs.python.org/3/library/math.integer.html "next chapter")

### This page

- [Report a bug](https://docs.python.org/3/bugs.html)
- [Improve this page](https://docs.python.org/3/improve-page.html?pagetitle=math+%E2%80%94+Mathematical+functions&pageurl=https%3A%2F%2Fdocs.python.org%2F3%2Flibrary%2Fmath.html&pagesource=library%2Fmath.rst)
- [Show source](https://github.com/python/cpython/blob/3.15/Doc/library/math.rst?plain=1)

«

### Navigation

- [index](https://docs.python.org/3/genindex.html "General Index")
- [modules](https://docs.python.org/3/py-modindex.html "Python Module Index") \|
- [next](https://docs.python.org/3/library/math.integer.html "math.integer — integer-specific mathematics functions") \|
- [previous](https://docs.python.org/3/library/numbers.html "numbers — Numeric abstract base classes") \|
- ![Python logo](https://docs.python.org/3/_static/py.svg)
- [Python](https://www.python.org/) »
- German \| DeutschGreek \| ΕλληνικάEnglishSpanish \| españolPersian \| فارسیFrench \| françaisItalian \| italianoJapanese \| 日本語Korean \| 한국어Punjabi \| ਪੰਜਾਬੀPolish \| polskiBrazilian Portuguese \| Português brasileiroRomanian \| RomâneșteRussian \| РусскийTurkish \| TürkçeSimplified Chinese \| 简体中文Traditional Chinese \| 繁體中文

dev (3.16)3.15.23.143.133.123.113.103.93.83.73.63.53.43.33.23.13.02.72.6

- [3.15.2 documentation](https://docs.python.org/3/index.html) »

- [The Python standard library](https://docs.python.org/3/library/index.html) »
- [Numeric and Mathematical Modules](https://docs.python.org/3/library/numeric.html) »
- [`math` — Mathematical functions](https://docs.python.org/3/library/math.html)
- \|

- Theme
AutoLightDark \|
