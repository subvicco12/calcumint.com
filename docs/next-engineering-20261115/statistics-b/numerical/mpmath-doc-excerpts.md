# Official mpmath function documentation excerpts

Retrieved UTC: 2026-11-15 10:03:59 UTC
Source: https://mpmath.org/doc/1.3.0/functions/expintegrals.html
Firecrawl scrape ID: 01a1dea9-3a38-75a4-b4fc-aa5693868a7e
Reported page title: Exponential integrals and error functions — mpmath 1.2.0 documentation

Provenance limitation: the version-addressed /doc/1.3.0 URL reports a 1.2.0 documentation title. Installed package version and implementation file hashes are checked separately; this page establishes function definitions, not an independently verified release tag.

### `erfinv()` [¶](https://mpmath.org/doc/1.3.0/functions/expintegrals.html\#erfinv "Permalink to this headline")

`mpmath.``erfinv`( _x_) [¶](https://mpmath.org/doc/1.3.0/functions/expintegrals.html#mpmath.erfinv "Permalink to this definition")

Computes the inverse error function, satisfying

erf(erfinv(x))=erfinv(erf(x))=x.erf(erfinv(x))=erfinv(erf(x))=x.

This function is defined only for −1≤x≤1−1≤x≤1.



## The normal distribution [¶](https://mpmath.org/doc/1.3.0/functions/expintegrals.html\#the-normal-distribution "Permalink to this headline")

### `npdf()` [¶](https://mpmath.org/doc/1.3.0/functions/expintegrals.html\#npdf "Permalink to this headline")

`mpmath.``npdf`( _x_, _mu=0_, _sigma=1_) [¶](https://mpmath.org/doc/1.3.0/functions/expintegrals.html#mpmath.npdf "Permalink to this definition")

`npdf(x, mu=0, sigma=1)` evaluates the probability density
function of a normal distribution with mean value μμ
and variance σ2σ2.

Elementary properties of the probability distribution can
be verified using numerical integration:

```
>>> from mpmath import *
>>> mp.dps = 15; mp.pretty = True
>>> quad(npdf, [-inf, inf])
1.0
>>> quad(lambda x: npdf(x, 3), [3, inf])
0.5
>>> quad(lambda x: npdf(x, 3, 2), [3, inf])
0.5
```

See also [`ncdf()`](https://mpmath.org/doc/1.3.0/functions/expintegrals.html#mpmath.ncdf "mpmath.ncdf"), which gives the cumulative
distribution.

### `ncdf()` [¶](https://mpmath.org/doc/1.3.0/functions/expintegrals.html\#ncdf "Permalink to this headline")

`mpmath.``ncdf`( _x_, _mu=0_, _sigma=1_) [¶](https://mpmath.org/doc/1.3.0/functions/expintegrals.html#mpmath.ncdf "Permalink to this definition")

`ncdf(x, mu=0, sigma=1)` evaluates the cumulative distribution
function of a normal distribution with mean value μμ
and variance σ2σ2.

See also [`npdf()`](https://mpmath.org/doc/1.3.0/functions/expintegrals.html#mpmath.npdf "mpmath.npdf"), which gives the probability density.

Elementary properties include:

```
>>> from mpmath import *
>>> mp.dps = 15; mp.pretty = True
>>> ncdf(pi, mu=pi)
0.5
>>> ncdf(-inf)
0.0
>>> ncdf(+inf)
1.0
```

The cumulative distribution is the integral of the density
function having identical mu and sigma:

```
>>> mp.dps = 15
>>> diff(ncdf, 2)
0.053990966513188
>>> npdf(2)
0.053990966513188
>>> diff(lambda x: ncdf(x, 1, 0.5), 0)
0.107981933026376
>>> npdf(0, 1, 0.5)
0.107981933026376
```
