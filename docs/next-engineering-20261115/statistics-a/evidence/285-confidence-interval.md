# Retained primary-source excerpts: 285-confidence-interval

Source URL: https://openstax.org/books/introductory-statistics-2e/pages/8-1-a-single-population-mean-using-the-normal-distribution
Retrieved at: 2026-11-15 (UTC); retrieval observed by 2026-11-15T09:39:13Z. Sub-second retrieval timing was not recorded.
Retrieval: Firecrawl scrape, HTTP 200; scrape ID 01a1de8e-56ff-7406-a4eb-44f092c55e3d.
Coverage: selected verbatim Markdown excerpts, not a full-page archive. Mathematical glyph duplication is present in the retrieved representation.
Attribution: OpenStax, Barbara Illowsky and Susan Dean, Introductory Statistics 2e. Access for free at the source URL above.
Purpose: private engineering formula applicability evidence; no publication or acceptance authority.

A confidence interval for a population mean, when the population standard deviation is known, is based on the conclusion of the Central Limit Theorem that the sampling distribution of the sample means follow an approximately normal distribution. Suppose that our sample has a mean of ̅̅̅̅̅𝑥=10x¯ = 10x¯ = 10 and we have constructed the 90% confidence interval (5, 15) where _EBM_ = 5\.

---

**The confidence interval estimate will have the form:**

(point estimate - error bound, point estimate + error bound) or, in symbols,(̅̅̅̅̅𝑥–𝐸⁢𝐵⁢𝑀,̅̅̅̅̅𝑥+𝐸⁢𝐵⁢𝑀x¯–E⁢B⁢M,x¯+E⁢B⁢Mx¯–EBM,x¯+EBM)

---

̅̅̅̅̅̅𝑋⁢±𝑍𝑎/2⁡(𝜎√𝑛)⁢=⁢2±1.645⁢(0.1)⁢=⁢2±0.1645⁢1.8355≤𝜇≤2.1645X¯⁢±Za/2⁡(σn)⁢=⁢2±1.645⁢(0.1)⁢=⁢2±0.1645⁢1.8355≤μ≤2.1645X¯±Za/2σn=2±1.645(0.1)=2±0.16451.8355≤μ≤2.1645

To capture the central 90%, we must go out 1.645 "standard deviations" on either side of the calculated sample mean. The value 1.645 is the _z_-score from a standard normal probability distribution that puts an area of 0.90 in the center, an area of 0.05 in the far left tail, and an area of 0.05 in the far right tail.

It is important that the "standard deviation" used must be appropriate for the parameter we are estimating, so in this section we need to use the standard deviation that applies to sample means, which is 𝜎√𝑛σnσn. The fraction 𝜎√𝑛σnσn, is commonly called the "standard error of the mean" in order to distinguish clearly the standard deviation for a mean from the population standard deviation _σ_.

---

For example, when _CL_ = 0.95, _α_ = 0.05 and 𝛼2α2α2 = 0.025; we write 𝑧𝛼2zα2zα2 = _z_ 0.025.

The area to the right of _z_ 0.025 is 0.025 and the area to the left of _z_ 0.025 is 1 – 0.025 = 0.975.

𝑧𝛼2=𝑧0.⁢025=1.96zα2 = z0.⁢025 = 1.96zα2 = z0.025 = 1.96, using a calculator, computer or a standard normal probability table.

`invNorm`(0.975, 0, 1) = 1.96

Remember to use the area to the LEFT of 𝑧𝛼2zα2zα2; in this chapter the last two inputs in the invNorm command are 0, 1, because you are using a standard normal distribution _Z_ ~ _N_(0, 1).
