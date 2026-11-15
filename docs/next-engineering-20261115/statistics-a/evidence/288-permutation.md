# Retained primary-source excerpts: 288-permutation

Source URL: https://openstax.org/books/college-algebra-2e/pages/9-5-counting-principles
Retrieved at: 2026-11-15 (UTC); retrieval observed by 2026-11-15T09:39:13Z. Sub-second retrieval timing was not recorded.
Retrieval: Firecrawl scrape, HTTP 200; scrape ID 01a1de8e-56fa-7370-b7f0-2f4b29f13679.
Coverage: selected verbatim Markdown excerpts, not a full-page archive. Mathematical glyph duplication is present in the retrieved representation.
Attribution: OpenStax, Jay Abramson, College Algebra 2e, section 9.5. Access for free at the source URL above.
Purpose: private engineering formula applicability evidence; no publication or acceptance authority.

#### Finding the Number of Permutations of _n_ Distinct Objects Using a Formula

For some permutation problems, it is inconvenient to use the Multiplication Principle because there are so many numbers to multiply. Fortunately, we can solve these problems using a formula. Before we learn the formula, let’s look at two common notations for permutations. If we have a set of 𝑛nn objects and we want to choose 𝑟rr objects from the set in order, we write 𝑃⁡(𝑛,𝑟).P⁡(n,r).P(n,r). Another way to write this is 𝑛⁢𝑃𝑟,n⁢Pr,nPr, a notation commonly seen on computers and calculators. To calculate 𝑃⁡(𝑛,𝑟),P⁡(n,r),P(n,r), we begin by finding 𝑛!,n!,n!, the number of ways to line up all 𝑛nn objects. We then divide by (𝑛−𝑟)!(n−r)!(n−r)! to cancel out the (𝑛−𝑟)(n−r)(n−r) items that we do not wish to line up.

Let’s see how this works with a simple example. Imagine a club of six people. They need to elect a president, a vice president, and a treasurer. Six people can be elected president, any one of the five remaining people can be elected vice president, and any of the remaining four people could be elected treasurer. The number of ways this may be done is 6×5×4=120.6×5×4=120.6×5×4=120. Using factorials, we get the same result.

6!3!=6·5·4·3!3!=6·5·4=1206!3!=6·5·4·3!3!=6·5·4=1206!3!=6·5·4·3!3!=6·5·4=120

There are 120 ways to select 3 officers in order from a club with 6 members. We refer to this as a permutation of 6 taken 3 at a time. The general formula is as follows.

𝑃⁡(𝑛,𝑟)=𝑛!(𝑛−𝑟)!P⁡(n,r)=n!(n−r)!P(n,r)=n!(n−r)!

Note that the formula stills works if we are choosing underlineallend underline𝑛nn objects and placing them in order. In that case we would be dividing by (𝑛−𝑛)!(n−n)!(n−n)! or 0!,0!,0!, which we said earlier is equal to 1. So the number of permutations of 𝑛nn objects taken 𝑛nn at a time is 𝑛!1n!1n!1 or just 𝑛!.n!.n!.

Given 𝑛nn distinct objects, the number of ways to select 𝑟rr objects from the set in order is

𝑃⁡(𝑛,𝑟)=𝑛!(𝑛−𝑟)!P⁡(n,r)=n!(n−r)!P(n,r)=n!(n−r)!
