### Navigation

- [index](https://docs.python.org/3/genindex.html "General Index")
- [modules](https://docs.python.org/3/py-modindex.html "Python Module Index") \|
- [next](https://docs.python.org/3/library/cmath.html "cmath — Mathematical functions for complex numbers") \|
- [previous](https://docs.python.org/3/library/math.html "math — Mathematical functions") \|
- ![Python logo](https://docs.python.org/3/_static/py.svg)
- [Python](https://www.python.org/) »
- German \| DeutschGreek \| ΕλληνικάEnglishSpanish \| españolPersian \| فارسیFrench \| françaisItalian \| italianoJapanese \| 日本語Korean \| 한국어Punjabi \| ਪੰਜਾਬੀPolish \| polskiBrazilian Portuguese \| Português brasileiroRomanian \| RomâneșteRussian \| РусскийTurkish \| TürkçeSimplified Chinese \| 简体中文Traditional Chinese \| 繁體中文

dev (3.16)3.15.23.143.133.123.113.103.93.83.73.63.53.43.33.23.13.02.72.6

- [3.15.2 documentation](https://docs.python.org/3/index.html) »

- [The Python standard library](https://docs.python.org/3/library/index.html) »
- [Numeric and Mathematical Modules](https://docs.python.org/3/library/numeric.html) »
- [`math.integer` — integer-specific mathematics functions](https://docs.python.org/3/library/math.integer.html)
- \|

- Theme
AutoLightDark \|

# `math.integer` — integer-specific mathematics functions [¶](https://docs.python.org/3/library/math.integer.html\#module-math.integer "Link to this heading")

Added in version 3.15.

* * *

This module provides access to the mathematical functions defined for integer arguments.
These functions accept integers and objects that implement the
[`__index__()`](https://docs.python.org/3/reference/datamodel.html#object.__index__ "object.__index__") method which is used to convert the object to an integer
number.

The following functions are provided by this module. All return values are
computed exactly and are integers.

math.integer.comb( _n_, _k_, _/_) [¶](https://docs.python.org/3/library/math.integer.html#math.integer.comb "Link to this definition")

Return the number of ways to choose _k_ items from _n_ items without repetition
and without order.

Evaluates to `n! / (k! * (n - k)!)` when `k <= n` and evaluates
to zero when `k > n`.

Also called the binomial coefficient because it is equivalent
to the coefficient of k-th term in polynomial expansion of
`(1 + x)ⁿ`.

Raises [`ValueError`](https://docs.python.org/3/builtins/exceptions.html#ValueError "ValueError") if either of the arguments are negative.

math.integer.factorial( _n_, _/_) [¶](https://docs.python.org/3/library/math.integer.html#math.integer.factorial "Link to this definition")

Return factorial of the nonnegative integer _n_.

math.integer.gcd( _\*integers_) [¶](https://docs.python.org/3/library/math.integer.html#math.integer.gcd "Link to this definition")

Return the greatest common divisor of the specified integer arguments.
If any of the arguments is nonzero, then the returned value is the largest
positive integer that is a divisor of all arguments. If all arguments
are zero, then the returned value is `0`. `gcd()` without arguments
returns `0`.

math.integer.isqrt( _n_, _/_) [¶](https://docs.python.org/3/library/math.integer.html#math.integer.isqrt "Link to this definition")

Return the integer square root of the nonnegative integer _n_. This is the
floor of the exact square root of _n_, or equivalently the greatest integer
_a_ such that _a_ ² ≤ _n_.

For some applications, it may be more convenient to have the least integer
_a_ such that _n_ ≤ _a_ ², or in other words the ceiling of
the exact square root of _n_. For positive _n_, this can be computed using
`a = 1 + isqrt(n - 1)`.

math.integer.lcm( _\*integers_) [¶](https://docs.python.org/3/library/math.integer.html#math.integer.lcm "Link to this definition")

Return the least common multiple of the specified integer arguments.
If all arguments are nonzero, then the returned value is the smallest
positive integer that is a multiple of all arguments. If any of the arguments
is zero, then the returned value is `0`. `lcm()` without arguments
returns `1`.

math.integer.perm( _n_, _k=None_, _/_) [¶](https://docs.python.org/3/library/math.integer.html#math.integer.perm "Link to this definition")

Return the number of ways to choose _k_ items from _n_ items
without repetition and with order.

Evaluates to `n! / (n - k)!` when `k <= n` and evaluates
to zero when `k > n`.

If _k_ is not specified or is `None`, then _k_ defaults to _n_
and the function returns `n!`.

Raises [`ValueError`](https://docs.python.org/3/builtins/exceptions.html#ValueError "ValueError") if either of the arguments are negative.

#### Previous topic

[`math` — Mathematical functions](https://docs.python.org/3/library/math.html "previous chapter")

#### Next topic

[`cmath` — Mathematical functions for complex numbers](https://docs.python.org/3/library/cmath.html "next chapter")

### This page

- [Report a bug](https://docs.python.org/3/bugs.html)
- [Improve this page](https://docs.python.org/3/improve-page.html?pagetitle=math.integer+%E2%80%94+integer-specific+mathematics+functions&pageurl=https%3A%2F%2Fdocs.python.org%2F3%2Flibrary%2Fmath.integer.html&pagesource=library%2Fmath.integer.rst)
- [Show source](https://github.com/python/cpython/blob/3.15/Doc/library/math.integer.rst?plain=1)

«

### Navigation

- [index](https://docs.python.org/3/genindex.html "General Index")
- [modules](https://docs.python.org/3/py-modindex.html "Python Module Index") \|
- [next](https://docs.python.org/3/library/cmath.html "cmath — Mathematical functions for complex numbers") \|
- [previous](https://docs.python.org/3/library/math.html "math — Mathematical functions") \|
- ![Python logo](https://docs.python.org/3/_static/py.svg)
- [Python](https://www.python.org/) »
- German \| DeutschGreek \| ΕλληνικάEnglishSpanish \| españolPersian \| فارسیFrench \| françaisItalian \| italianoJapanese \| 日本語Korean \| 한국어Punjabi \| ਪੰਜਾਬੀPolish \| polskiBrazilian Portuguese \| Português brasileiroRomanian \| RomâneșteRussian \| РусскийTurkish \| TürkçeSimplified Chinese \| 简体中文Traditional Chinese \| 繁體中文

dev (3.16)3.15.23.143.133.123.113.103.93.83.73.63.53.43.33.23.13.02.72.6

- [3.15.2 documentation](https://docs.python.org/3/index.html) »

- [The Python standard library](https://docs.python.org/3/library/index.html) »
- [Numeric and Mathematical Modules](https://docs.python.org/3/library/numeric.html) »
- [`math.integer` — integer-specific mathematics functions](https://docs.python.org/3/library/math.integer.html)
- \|

- Theme
AutoLightDark \|
