![](https://www.itl.nist.gov/div898/handbook/gifs/nvgtbr.gif)

|     |     |
| --- | --- |
| 1.[Exploratory Data Analysis](https://www.itl.nist.gov/div898/handbook/eda/eda.htm)

1.3.[EDA Techniques](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3.htm)

1.3.6.[Probability Distributions](https://www.itl.nist.gov/div898/handbook/eda/section3/eda36.htm)

1.3.6.6.[Gallery of Distributions](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366.htm)

|     |     |
| --- | --- |
| ## 1.3.6.6.18. | ## Binomial Distribution | |
| _Probability Mass Function_ | The binomial distribution is used when there are exactly two mutually<br>exclusive outcomes of a trial. These outcomes are appropriately<br>labeled "success" and "failure". The binomial distribution is used to<br>obtain the probability of observing _x_ successes in _N_<br>trials, with the probability of success on a single trial denoted by<br>_p_. The binomial distribution assumes that _p_ is fixed<br>for all trials.<br>The formula for the binomial probability mass function is<br>P(x;p,n)=(nx)(p)x(1−p)(n−x)for x=0,1,2,⋯,n<br>where<br>(nx)=n!x!(n−x)!<br>The following is the plot of the binomial probability density<br>function for four values of _p_ and _n_ = 100.<br>![plot of the binomial probability density function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/binpdf4.gif) |
| _Cumulative Distribution Function_ | The formula for the binomial cumulative probability function is<br>F(x;p,n)=∑i=0x(ni)(p)i(1−p)(n−i)<br>The following is the plot of the binomial cumulative distribution<br>function with the same values of _p_ as the pdf plots above.<br>![plot of the binomial cumulative distribution function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/bincdf4.gif) |
| _Percent Point Function_ | The binomial percent point function does not exist in simple<br>closed form. It is computed numerically. Note that because<br>this is a discrete distribution that is only defined for integer<br>values of _x_, the percent point function is not smooth in the<br>way the percent point function typically is for a continuous<br>distribution.<br>The following is the plot of the binomial percent point function<br>with the same values of _p_ as the pdf plots above.<br>![plot of the binomial percent point function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/binppf4.gif) |
| _Common Statistics_ | |     |     |
| --- | --- |
| Mean | _np_ |
| Mode | _p_( _n_ \+ 1) - 1 ≤ _x_ ≤<br> _p_( _n_ \+ 1) |
| Range | 0 to _n_ |
| Standard Deviation | np(1−p) |
| Coefficient of Variation | (1−p)np |
| Skewness | (1−2p)np(1−p) |
| Kurtosis | 3−6n+1np(1−p) | |
| _Comments_ | The binomial distribution is probably the most commonly used<br>discrete distribution. |
| _Parameter Estimation_ | The maximum likelihood estimator of _p_ (for fixed _n_) is<br>p~=xn |
| _Software_ | Most general purpose statistical software programs support at least<br>some of the probability functions for the binomial distribution. |

![](https://www.itl.nist.gov/div898/handbook/gifs/nvgbrbtm.gif)
