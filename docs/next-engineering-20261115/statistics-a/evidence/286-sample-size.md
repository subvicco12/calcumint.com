# Retained primary-source excerpts: 286-sample-size

Source URL: https://openstax.org/books/introductory-statistics-2e/pages/8-3-a-population-proportion
Retrieved at: 2026-11-15 (UTC); retrieval observed by 2026-11-15T09:39:13Z. Sub-second retrieval timing was not recorded.
Retrieval: Firecrawl scrape, HTTP 200; scrape ID 01a1de8e-56ff-7461-bce1-c9b45d94b78d.
Coverage: selected verbatim Markdown excerpts, not a full-page archive. Mathematical glyph duplication is present in the retrieved representation.
Attribution: OpenStax, Barbara Illowsky and Susan Dean, Introductory Statistics 2e. Access for free at the source URL above.
Purpose: private engineering formula applicability evidence; no publication or acceptance authority.

### Calculating the Sample Size _n_

If researchers desire a specific margin of error, then they can use the error bound formula to calculate the required sample size.

The error bound formula for a population proportion is

- 𝐸⁢𝐵⁢𝑃=(𝑧𝛼2)⁢(√𝑝′⁢𝑞′𝑛)E⁢B⁢P=(zα2)⁢(p′⁢q′n)EBP=(zα2)(p′q′n)
- Solving for _n_ gives you an equation for the sample size.
- 𝑛=(𝑧𝛼2)2⁢(𝑝′⁢𝑞′)𝐸⁢𝐵⁢𝑃2n=(zα2)2⁢(p′⁢q′)E⁢B⁢P2n=(zα2)2(p′q′)EBP2

---

However, in order to find _n_, we need to know the estimated (sample) proportion _p_′. Remember that _q_′ = 1 – _p_′. But, we do not know _p_′ yet. Since we multiply _p_′ and _q_′ together, we make them both equal to 0.5 because _p_′ _q_′ = (0.5)(0.5) = 0.25 results in the largest possible product. (Try other products: (0.6)(0.4) = 0.24; (0.3)(0.7) = 0.21; (0.2)(0.8) = 0.16 and so on). The largest possible product gives us the largest _n_. This gives us a large enough sample so that we can be 90% confident that we are within three percentage points of the true population proportion. To calculate the sample size _n_, use the formula and make the substitutions.

𝑛=𝑧2⁢𝑝′⁢𝑞′𝐸⁢𝐵⁢𝑃2n=z2⁢p′⁢q′E⁢B⁢P2n=z2p′q′EBP2 gives 𝑛=1.6452⁢(0.5)⁢(0.5)0.032=751.7n=1.6452⁢(0.5)⁢(0.5)0.032=751.7n=1.6452(0.5)(0.5)0.032=751.7

Round the answer to the next higher value. The sample size should be 752 cell phone customers aged 50+ in order to be 90% confident that the estimated (sample) proportion is within three percentage points of the true population proportion of all customers aged 50+ who use text messaging on their cell phones.
