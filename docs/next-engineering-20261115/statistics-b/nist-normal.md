![](https://www.itl.nist.gov/div898/handbook/gifs/nvgtbr.gif)

|     |     |
| --- | --- |
| 1.[Exploratory Data Analysis](https://www.itl.nist.gov/div898/handbook/eda/eda.htm)

1.3.[EDA Techniques](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3.htm)

1.3.6.[Probability Distributions](https://www.itl.nist.gov/div898/handbook/eda/section3/eda36.htm)

1.3.6.6.[Gallery of Distributions](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366.htm)

|     |     |
| --- | --- |
| ## 1.3.6.6.1. | ## Normal Distribution | |
| _Probability Density Function_ | The general formula for the [probability\<br>density function](https://www.itl.nist.gov/div898/handbook/eda/section3/eda362.htm#PDF) of the normal distribution is<br>f(x)=e−(x−μ)2/(2σ2)σ2π<br>where _μ_ is the [location parameter](https://www.itl.nist.gov/div898/handbook/eda/section3/eda364.htm) and<br>_σ_ is the [scale parameter](https://www.itl.nist.gov/div898/handbook/eda/section3/eda364.htm). The case<br>where _μ_ = 0 and _σ_ = 1 is called the **standard**<br>**normal distribution**. The equation for the standard normal<br>distribution is<br>f(x)=e−x2/22π<br>Since the general form of probability functions can be <br>[expressed in terms of the standard\<br>distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda364.htm#FORMULAS), all subsequent formulas in this section are<br>given for the standard form of the function.<br>The following is the plot of the standard normal probability density<br>function.<br>![plot of the standard normal probability density function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/norpdf.gif) |
| _Cumulative Distribution Function_ | The formula for the cumulative distribution function of the standard<br>normal distribution is<br>F(x)=∫−∞xe−x2/22π<br>Note that this integral does not exist in a simple closed formula. It is<br>computed numerically.<br>The following is the plot of the normal cumulative distribution<br>function.<br>![plot of the normal cumulative distribution function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/norcdf.gif) |
| _Percent Point Function_ | The formula for the [percent point\<br>function](https://www.itl.nist.gov/div898/handbook/eda/section3/eda362.htm#PPF) of the normal distribution does not exist in<br>a simple closed formula. It is computed numerically.<br>The following is the plot of the normal percent point function.<br>![plot of the normal percent point function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/norppf.gif) |
| _Hazard Function_ | The formula for the [hazard\<br>function](https://www.itl.nist.gov/div898/handbook/eda/section3/eda362.htm#HAZ) of the normal distribution is<br>h(x)=ϕ(x)Φ(−x)<br>where Φ is the cumulative distribution function of the standard<br>[normal](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm) distribution and ϕ is the probability<br>density function of the standard [normal](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm)<br>distribution.<br>The following is the plot of the normal hazard function.<br>![plot of the normal hazard function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/norhaz.gif) |
| _Cumulative Hazard Function_ | The normal [cumulative hazard function](https://www.itl.nist.gov/div898/handbook/eda/section3/eda362.htm#CUMHAZ)<br>can be computed from the normal cumulative distribution function.<br>The following is the plot of the normal cumulative hazard function.<br>![plot of the normal cumulative hazard function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/norcha.gif) |
| _Survival Function_ | The normal [survival function](https://www.itl.nist.gov/div898/handbook/eda/section3/eda362.htm#SURVIVAL)<br>can be computed from the normal cumulative distribution function.<br>The following is the plot of the normal survival function.<br>![normal survival function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/norsurv.gif) |
| _Inverse Survival Function_ | The normal [inverse survival\<br>function](https://www.itl.nist.gov/div898/handbook/eda/section3/eda362.htm#INVERSESURVIVAL) can be computed from the normal percent point function.<br>The following is the plot of the normal inverse survival function.<br>![normal inverse survival function](https://www.itl.nist.gov/div898/handbook/eda/section3/gif/norisurv.gif) |
| _Common Statistics_ | |     |     |
| --- | --- |
| Mean | The location parameter _μ_. |
| Median | The location parameter _μ_. |
| Mode | The location parameter _μ_. |
| Range | −∞ to ∞. |
| Standard Deviation | The scale parameter _σ_. |
| Coefficient of Variation | _σ_/ _μ_ |
| Skewness | 0 |
| Kurtosis | 3 | |
| _Parameter Estimation_ | The location and scale parameters of the normal distribution can<br>be estimated with the sample [mean](https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm) and sample<br>[standard deviation](https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm), respectively. |
| _Comments_ | For both theoretical and practical reasons, the normal distribution is<br>probably the most important distribution in statistics. For example,<br>- Many classical statistical tests are based on the assumption<br>   that the data follow a normal distribution. This assumption<br>   should be tested before applying these tests.<br>   <br>  <br>- In modeling applications, such as linear and non-linear<br>   regression, the error term is often assumed to follow a normal<br>   distribution with fixed location and scale.<br>   <br>  <br>- The normal distribution is used to find significance levels<br>   in many hypothesis tests and confidence intervals. |
| _Theroretical Justification - Central Limit Theorem_ | The normal distribution is widely used. Part of the appeal is<br>that it is well behaved and mathematically tractable. However,<br>the central limit theorem provides a theoretical basis for why it<br>has wide applicability.<br>The central limit theorem basically states that as the sample<br>size ( _N_) becomes large, the following occur:<br>1. The sampling distribution of the mean becomes approximately<br>    normal regardless of the distribution of the original<br>    variable.<br>    <br>   <br>2. The sampling distribution of the mean is centered at the<br>    population mean, μ, of the<br>    original variable. In addition, the standard deviation<br>    of the sampling distribution of the mean approaches<br>    σ/N. |
| _Software_ | Most general purpose statistical software programs support at least<br>some of the probability functions for the normal distribution. |

![](https://www.itl.nist.gov/div898/handbook/gifs/nvgbrbtm.gif)
