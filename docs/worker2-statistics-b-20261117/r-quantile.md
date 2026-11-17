|     |     |
| --- | --- |
| quantile {stats} | R Documentation |

## Sample Quantiles

### Description

The generic function `quantile` produces sample quantiles
corresponding to the given probabilities.
The smallest observation corresponds to a probability of 0 and the
largest to a probability of 1.

### Usage

```r
quantile(x, ...)

## Default S3 method:
quantile(x, probs = seq(0, 1, 0.25), na.rm = FALSE,
         names = TRUE, type = 7, digits = 7,
         fuzz = if(type == 7L) 0 else 4 * .Machine$double.eps,
         ...)
```

### Arguments

|     |     |
| --- | --- |
| `x` | numeric vector whose sample quantiles are wanted, or an<br>object of a class for which a method has been defined (see also<br>‘details’). `NA` and `NaN` values are not<br>allowed in numeric vectors unless `na.rm` is `TRUE`. |
| `probs` | numeric vector of probabilities with values in<br>`[0,1][0,1][0,1]`. (Values up to ‘⁠2e-14⁠’ outside that<br>range are accepted and moved to the nearby endpoint.) |
| `na.rm` | logical; if true, any `NA` and `NaN` values<br>are removed from `x` before the quantiles are computed. |
| `names` | logical; if true, the result has a `names`<br>attribute. Set to `FALSE` for speedup with many `probs`. |
| `type` | an integer between 1 and 9 selecting one of the<br>nine quantile algorithms detailed below to be used. |
| `digits` | used only when `names` is true: the precision to use<br>when formatting the percentages. In **R** versions up to 4.0.x, this had<br>been set to `max(2, getOption("digits"))`, internally. |
| `fuzz` | small non-negative number to protect against rounding errors<br>when `j <- floor(np + m)`, (`npnpnp` “a version of”<br>`n * probs`, see the formula below), is computed. |
| `...` | further arguments passed to or from other methods. |

### Details

A vector of length `length(probs)` is returned;
if `names = TRUE`, it has a `names` attribute.

`NA` and `NaN` values in `probs` are
propagated to the result.

The default method works with classed objects sufficiently like
numeric vectors that `sort` and (not needed by types 1 and 3)
addition of elements and multiplication by a number work correctly.
Note that as this is in a namespace, the copy of `sort` in
base will be used, not some S4 generic of that name. Also note
that that is no check on the ‘correctly’, and so
e.g. `quantile` can be applied to complex vectors which (apart
from ties) will be ordered on their real parts.

There is a method for the date-time classes (see
`"POSIXt"`). Types 1 and 3 can be used for class
`"Date"` and for ordered factors.

`fuzz := 4 * .Machine$double.eps` has been hard coded and used for
`type = 4,5,6, 8,9` since `type`s were introduced,
and is used, since **R** 4.5.0, also for the other types (but with default
`0` for the default `type = 7` for back compatibility reasons).

### Types

`quantile` returns estimates of underlying distribution quantiles
based on one or two order statistics from the supplied elements in
`x` at probabilities in `probs`. One of the nine quantile
algorithms discussed in [Hyndman and Fan (1996)](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html#reference+quantile.Rd+R+3AHyndman+2BFan+3A1996), selected by
`type`, is employed.

All sample quantiles are defined as weighted averages of
consecutive order statistics. Sample quantiles of type `iii`
are defined by:

`Qi(p)=(1−γ)xj+γxj+1Q_{i}(p) = (1 - \gamma)x_{j} + \gamma x_{j+1}Qi​(p)=(1−γ)xj​+γxj+1​`

where `1≤i≤91 \le i \le 91≤i≤9`,
`j−mn≤p<j−m+1n\frac{j - m}{n} \le p < \frac{j - m + 1}{n}nj−m​≤p<nj−m+1​`,
`xjx_{j}xj​` is the `jjj`-th order statistic, `nnn` is the
sample size, the value of `γ\gammaγ` is a function of
`j=⌊np+m⌋j = \lfloor np + m\rfloorj=⌊np+m⌋` and `g=np+m−jg = np + m - jg=np+m−j`,
and `mmm` is a constant determined by the sample quantile type.

#### Discontinuous sample quantile types 1, 2, and 3

For types 1, 2 and 3, `Qi(p)Q_i(p)Qi​(p)` is a discontinuous
function of `ppp`, with `m=0m = 0m=0` when `i=1i = 1i=1` and `i=2i =
2i=2`, and `m=−1/2m = -1/2m=−1/2` when `i=3i = 3i=3`.

Type 1

Inverse of empirical distribution function.
`γ=0\gamma = 0γ=0` if `g=0g = 0g=0`, and 1 otherwise.

Type 2

Similar to type 1 but with averaging at discontinuities.
`γ=0.5\gamma = 0.5γ=0.5` if `g=0g = 0g=0`, and 1 otherwise (SAS default, see
[Wicklin (2017)](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html#reference+quantile.Rd+R+3AWicklin+3A2017)).

Type 3

Nearest even order statistic (SAS default till ca. 2010).
`γ=0\gamma = 0γ=0` if `g=0g = 0g=0` and `jjj` is even,
and 1 otherwise.

#### Continuous sample quantile types 4 through 9

For types 4 through 9, `Qi(p)Q_i(p)Qi​(p)` is a continuous function
of `ppp`, with `γ=g\gamma = gγ=g` and `mmm` given below. The
sample quantiles can be obtained equivalently by linear interpolation
between the points `(pk,xk)(p_k,x_k)(pk​,xk​)` where `xkx_kxk​`
is the `kkk`-th order statistic. Specific expressions for
`pkp_kpk​` are given below.

Type 4

`m=0m = 0m=0`. `pk=knp_k = \frac{k}{n}pk​=nk​`.
That is, linear interpolation of the empirical cdf.

Type 5

`m=1/2m = 1/2m=1/2`.
`pk=k−0.5np_k = \frac{k - 0.5}{n}pk​=nk−0.5​`.
That is a piecewise linear function where the knots are the values
midway through the steps of the empirical cdf. This is popular
amongst hydrologists.

Type 6

`m=pm = pm=p`. `pk=kn+1p_k = \frac{k}{n + 1}pk​=n+1k​`.
Thus `pk=E[F(xk)]p_k = \mbox{E}[F(x_{k})]pk​=E[F(xk​)]`.
This is used by Minitab and by SPSS.

Type 7

`m=1−pm = 1-pm=1−p`.
`pk=k−1n−1p_k = \frac{k - 1}{n - 1}pk​=n−1k−1​`.
In this case, `pk=mode[F(xk)]p_k = \mbox{mode}[F(x_{k})]pk​=mode[F(xk​)]`.
This is used by S.

Type 8

`m=(p+1)/3m = (p+1)/3m=(p+1)/3`.
`pk=k−1/3n+1/3p_k = \frac{k - 1/3}{n + 1/3}pk​=n+1/3k−1/3​`.
Then `pk≈median[F(xk)]p_k \approx \mbox{median}[F(x_{k})]pk​≈median[F(xk​)]`.
The resulting quantile estimates are approximately median-unbiased
regardless of the distribution of `x`.

Type 9

`m=p/4+3/8m = p/4 + 3/8m=p/4+3/8`.
`pk=k−3/8n+1/4p_k = \frac{k - 3/8}{n + 1/4}pk​=n+1/4k−3/8​`.
The resulting quantile estimates are approximately unbiased for
the expected order statistics if `x` is normally distributed.

Further details are provided in [Hyndman and Fan (1996)](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html#reference+quantile.Rd+R+3AHyndman+2BFan+3A1996) who
recommended type 8.
The default method is type 7, as used by S and by **R** < 2.0.0.
[Makkonen and Pajari (2014)](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html#reference+quantile.Rd+R+3AMakkonen+2BPajari+3A2014) argue for type 6, also as already
proposed by Weibull in 1939.
The Wikipedia page contains further information about availability of
these 9 types in software.

### Author(s)

of the version used in **R** >= 2.0.0, Ivan Frohne and Rob J Hyndman;
tweaks, notably use of `fuzz`, by the R Core Team.

### References

Becker R. A., Chambers J. M., Wilks A. R. (1988).
_The New S Language_.
Chapman and Hall/CRC, London.
ISBN 053409192X.

Hyndman R. J., Fan Y. (1996).
“Sample Quantiles in Statistical Packages.”
_The American Statistician_, **50**(4), 361–365.
[doi:10.1080/00031305.1996.10473566](https://doi.org/10.1080/00031305.1996.10473566).

Langford E. (2006).
“Quartiles in Elementary Statistics.”
_Journal of Statistics Education_, **14**(3).
[doi:10.1080/10691898.2006.11910589](https://doi.org/10.1080/10691898.2006.11910589).

Makkonen L., Pajari M. (2014).
“Defining Sample Quantiles by the True Rank Probability.”
_Journal of Probability and Statistics_, **2014**, 1–6.
[doi:10.1155/2014/326579](https://doi.org/10.1155/2014/326579).

Wicklin R. (2017).
“Sample Quantiles: A Comparison of 9 Definitions.”
SAS Blog.
[https://blogs.sas.com/content/iml/2017/05/24/definitions-sample-quantiles.htm](https://blogs.sas.com/content/iml/2017/05/24/definitions-sample-quantiles.htm).

Wikipedia: [https://en.wikipedia.org/wiki/Quantile#Estimating\_quantiles\_from\_a\_sample](https://en.wikipedia.org/wiki/Quantile#Estimating_quantiles_from_a_sample)

### See Also

`ecdf` for empirical distributions of which
`quantile` is an inverse;
`boxplot.stats` and `fivenum` for computing
other versions of quartiles, etc.

### Examples

```r
quantile(x <- rnorm(1001)) # Extremes & Quartiles by default
quantile(x,  probs = c(0.1, 0.5, 1, 2, 5, 10, 50, NA)/100)

### Compare different types
quantAll <- function(x, prob, ...)
  t(vapply(1:9, function(typ) quantile(x, probs = prob, type = typ, ...),
           quantile(x, prob, type=1, ...)))
p <- c(0.1, 0.5, 1, 2, 5, 10, 50)/100
signif(quantAll(x, p), 4)

## 0% and 100% are equal to min(), max() for all types:
stopifnot(t(quantAll(x, prob=0:1)) == range(x))

## for complex numbers:
z <- complex(real = x, imaginary = -10*x)
signif(quantAll(z, p), 4)
```

* * *

\[Package _stats_ version 4.6.0 [Index](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/00Index.html)\]
