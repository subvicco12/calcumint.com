# Codex F — independent accumulation golden records

15 October 2026. Baseline draft #1397, `d9913f66428c66a1d408c7d60b50f7d2e39238b9`. Branch `verify/nonstandard-independent-goldens`. Release HOLD.

## Bounded engineering result

Five existing financial engine definitions now bind 30 explicit literal golden records (six each). Registry count remains 574. Missing explicit records move 24 → 19; missing standard-risk records remain zero. This metric measures record presence only. All 24 baseline nonstandard calculators still require their applicable specialist evidence; the five added records do not close an approval, source-methodology review, certification, catalog-identity or publication gap. Protected specialist approvals and lifecycle/HOLD evidence remain UNKNOWN/pending. All six existing HOLDs remain in force.

| Registered version-1 identity | Independent arithmetic scope |
| --- | --- |
| `finance.simple-interest` | Noncompounding principal × rate × years; fractional year, zero rate/time/principal, supported 1000-year ceiling. |
| `finance.compound-interest` | Integer powers, semiannual frequency, negative return, exact square-root fractional year, zero duration/principal. |
| `finance.term-deposit` | Annual/semiannual/quarterly/monthly compound growth, explicit months/12 exponent, annual yield distinct from term return, zero-rate maximum term. |
| `finance.recurring-deposit` | Generic monthly model: expand two/three contributions as individual powers; explicit beginning/end timing, single contribution, zero-return maximum term. |
| `finance.sip` | Same geometric contribution expansion under its existing return contract, both timing choices, single contribution, zero-return maximum term. |

Each literal fixture includes its derivation in its label. For example, two end-of-month 100 contributions at 12% nominal annual return are 100 × 1.01 + 100 = 201; beginning timing is 100 × 1.01² + 100 × 1.01 = 203.01. Quarterly 40% nominal annual return gives 1000 × 1.1⁴ = 1464.1 and effective annual yield 46.41%. A one-month deposit at 12% yields 1010, while its annual yield is (1.01¹²−1) × 100 = 12.682503013196972…%, reported at the existing four decimals as 12.6825. Expected outputs are written literal data, not computed by the engine, a wrapper, or historical comparison implementation. Cases avoid ambiguous decimal half-ties. Output money retains the existing two-decimal contract.

## Existing source-contract references

These are the authoritative references already present in the engine contracts, reused without changing metadata or claiming newly fetched source/specialist approval:

- Simple interest: CFPB [Calculating loan payments worksheet](https://files.consumerfinance.gov/f/documents/cfpb_building_block_activities_calculating-loan-payments_worksheet.pdf).
- Compound interest, recurring deposit and SIP: Investor.gov [Compound Interest Calculator](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator).
- Term/recurring deposit: CFPB [How compound interest works](https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/).
- Term-deposit yield: CFPB [Regulation DD Appendix A](https://www.consumerfinance.gov/rules-policy/regulations/1030/a/).
- SIP: Investor.gov [Dollar Cost Averaging](https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging).

The explicit formulas and timing conventions remain the existing registered engineering contract. Generic source pointers do not establish institution-specific deposit conventions, predicted returns, legal APY compliance, or a specialist's acceptance of methodology. Those judgments remain pending. No Mortgage or loan period semantics are introduced.

## Verification

- Focused numerical, framework parity and certification-structure tests: 11 files, 88 tests passed.
- TypeScript `tsc --noEmit`: passed.
- ESLint on the five definitions, five fixture modules and new verification test: passed.
- Runtime registry assertions prove 574 definitions, 19 missing explicit records, zero missing standard-risk records.
- Every literal is checked through the parsed direct calculation and common engine, with locale/currency independence. Free, Pro and Business input labels are stripped by the same authoritative schemas and yield the same expected mathematics. Existing capability tests retain equal mathematical capabilities across all plans.
- Invalid capital/nonfinite values, financial rate limits, noninteger/out-of-range months/frequencies and zero capital in positive-capital public contracts reject through the common schema/engine.

Source status/version flags, calculation expressions, schemas, sources, examples, engine identity, plan capabilities, security/RLS, protected gates and the six HOLDs are unchanged. The five inherited code-certified flags are not new certifications. No database writes, merge, deployment or publication occurred. Full production build is delegated to automatic final-head CI (`next build --webpack`); no local duplicate build is claimed. This is bounded fixture coverage, not exhaustive numeric correctness at extreme magnitudes or all supported inputs.
