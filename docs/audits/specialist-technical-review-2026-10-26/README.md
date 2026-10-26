# Specialist technical review closure — evidence only

All 70 qualified approvals remain **PENDING**. RELEASE HOLD; no publication/certification authority.

Seven proposed contracts corrected: #86 separates exact-zero depletion from first shortfall; #96 separates total/vested assets; #173 separates conditional and unconditional costs with time discounting for both; #198/#199 define gross receipts, refunds and credits once; #204 eliminates duplicate retained sale fees and separates inventory from cash; #527 becomes a provisional dependency proposal pending complete version-bound rules. No calculator formula, technical version or historical output is changed.

`technical-register.json` is the full 70-row updated register. Original classifications remain as historical findings; `engineeringClosureStatus` records the seven corrected proposals without claiming qualified acceptance. Original register is retained in `upstream/`. `proposal-revisions.json` includes definitions, exact remaining questions and independent counterexamples.

## Exact policy decisions (54 cases)

Each case below has ID-specific questions, required specialist groups, source URLs and evidence requirements in `specialist-questions.json`. No answers or signatures are manufactured.

### #19 — Credit Card Minimum Payment Calculator (credit_finance)

- **19-Q01** For #19 Credit Card Minimum Payment Calculator, what exact policy is approved for: Issuer formula, percent/floor basis, interest/fees inclusion, due dates and payoff assumptions?
- **19-Q02** For #19 Credit Card Minimum Payment Calculator, what exact policy is approved for: Actual issuer rule missing; no percent/floor default?

### #20 — Balance Transfer Calculator (credit_finance)

- **20-Q01** For #20 Balance Transfer Calculator, what exact policy is approved for: Fee capitalization, promotional duration, payment order and rate reset?
- **20-Q02** For #20 Balance Transfer Calculator, what exact policy is approved for: Promotion reset, allocation and loss-of-promotion conditions unselected?

### #21 — Debt Consolidation Calculator (credit_finance)

- **21-Q01** For #21 Debt Consolidation Calculator, what exact policy is approved for: Debt types, fees, payment policy and cost-comparison basis?
- **21-Q02** For #21 Debt Consolidation Calculator, what exact policy is approved for: Unequal horizons need residual liabilities/discounting; cannot infer consolidation eligibility?

### #23 — HELOC Calculator (credit_finance)

- **23-Q01** For #23 HELOC Calculator, what exact policy is approved for: Draw schedule, variable-rate/index/cap convention, repayment phase and fees?
- **23-Q02** For #23 HELOC Calculator, what exact policy is approved for: Index, margin, reset, caps, draw phase and repayment contract missing?

### #32 — Rent vs Buy Calculator (property_finance)

- **32-Q01** For #32 Rent vs Buy Calculator, what exact policy is approved for: Discounting, tax treatment, financing, maintenance and terminal-sale inclusions?
- **32-Q02** For #32 Rent vs Buy Calculator, what exact policy is approved for: Cash-flow accounting proposal only; no official universal rent-buy method selected?

### #34 — Property Tax Calculator (tax_property)

- **34-Q01** For #34 Property Tax Calculator, what exact policy is approved for: Assessed versus market value, exemptions, caps, levies and jurisdiction?
- **34-Q02** For #34 Property Tax Calculator, what exact policy is approved for: NYC form is illustrative; jurisdiction/year/class and assessment rules unselected?

### #35 — Closing Cost Calculator (property_finance)

- **35-Q01** For #35 Closing Cost Calculator, what exact policy is approved for: Buyer/seller scope, taxes, lender fees, escrows and prepaid-item treatment?
- **35-Q02** For #35 Closing Cost Calculator, what exact policy is approved for: Buyer/seller and financing allocations must be pinned; avoid double-counting deposits/down payment?

### #36 — Rental Property Calculator (property_finance)

- **36-Q01** For #36 Rental Property Calculator, what exact policy is approved for: Expense classification, financing, capex, depreciation and sale assumptions?
- **36-Q02** For #36 Rental Property Calculator, what exact policy is approved for: NOI/capex classification proposed; taxable income differs from cash flow?

### #43 — Rental ROI Calculator (property_finance)

- **43-Q01** For #43 Rental ROI Calculator, what exact policy is approved for: Return metric, leverage, sale proceeds, costs and annualization convention?
- **43-Q02** For #43 Rental ROI Calculator, what exact policy is approved for: Return definition not selected; annualized IRR is a different metric?

### #46 — House Flipping Profit Calculator (property_finance)

- **46-Q01** For #46 House Flipping Profit Calculator, what exact policy is approved for: Fee/tax inclusions, finance timing, budget contingencies and return basis?
- **46-Q02** For #46 House Flipping Profit Calculator, what exact policy is approved for: Taxes and timing remain explicit; accounting identity is not market forecast?

### #48 — Investment Property Affordability Calculator (property_finance)

- **48-Q01** For #48 Investment Property Affordability Calculator, what exact policy is approved for: Rental-income credit, debt obligations, reserves, operating costs and eligibility exclusions?
- **48-Q02** For #48 Investment Property Affordability Calculator, what exact policy is approved for: No underwriting/approval claim; lender income credit, reserves and constraints missing?

### #49 — Mortgage + Rental Combined Model (property_finance)

- **49-Q01** For #49 Mortgage + Rental Combined Model, what exact policy is approved for: Mortgage schedule version, cash-flow alignment, operating inclusions and sale horizon?
- **49-Q02** For #49 Mortgage + Rental Combined Model, what exact policy is approved for: Period alignment, taxes and terminal liabilities must be reviewed?

### #80 — Retirement Corpus Calculator (retirement_finance_numerical)

- **80-Q01** For #80 Retirement Corpus Calculator, what exact policy is approved for: Withdrawal recurrence, horizon, inflation basis, taxes/benefits and terminal balance?
- **80-Q02** For #80 Retirement Corpus Calculator, what exact policy is approved for: Finite deterministic present value only; longevity and sequence risk not selected?

### #81 — Retirement Savings Calculator (retirement_finance_numerical)

- **81-Q01** For #81 Retirement Savings Calculator, what exact policy is approved for: Whether the intended product is a generic savings projection or a rule-specific retirement account?
- **81-Q02** For #81 Retirement Savings Calculator, what exact policy is approved for: End-period contributions assumed; account-specific tax rules excluded unless selected?

### #82 — Retirement Age Calculator (retirement_finance_numerical)

- **82-Q01** For #82 Retirement Age Calculator, what exact policy is approved for: Target corpus model, contribution/return timing and no-solution handling?
- **82-Q02** For #82 Retirement Age Calculator, what exact policy is approved for: Nonmonotonic targets need full scan; report none within horizon rather than guaranteed age?

### #84 — Inflation-Adjusted Retirement Need Calculator (retirement_finance_numerical)

- **84-Q01** For #84 Inflation-Adjusted Retirement Need Calculator, what exact policy is approved for: Spending basis, retirement horizon and downstream corpus/withdrawal policy?
- **84-Q02** For #84 Inflation-Adjusted Retirement Need Calculator, what exact policy is approved for: Nominal/real and downstream corpus method remain unselected?

### #85 — Retirement Withdrawal Calculator (retirement_finance_numerical)

- **85-Q01** For #85 Retirement Withdrawal Calculator, what exact policy is approved for: Nominal/real withdrawals, indexation, depletion behavior and taxes/benefits?
- **85-Q02** For #85 Retirement Withdrawal Calculator, what exact policy is approved for: Beginning-period variant differs; taxes and depletion handling unselected?

### #88 — FIRE Calculator (retirement_finance_numerical)

- **88-Q01** For #88 FIRE Calculator, what exact policy is approved for: Withdrawal-rule authority, annual spending definition, tax/benefits and accumulation assumptions?
- **88-Q02** For #88 FIRE Calculator, what exact policy is approved for: 4% is witness input, not endorsed safe rate; target authority missing?

### #89 — Coast FIRE Calculator (retirement_finance_numerical)

- **89-Q01** For #89 Coast FIRE Calculator, what exact policy is approved for: Target corpus/withdrawal policy, inflation consistency and contributions after coast date?
- **89-Q02** For #89 Coast FIRE Calculator, what exact policy is approved for: No later contributions; nominal/real consistency and target authority required?

### #90 — Lean FIRE Calculator (retirement_finance_numerical)

- **90-Q01** For #90 Lean FIRE Calculator, what exact policy is approved for: Owner spending scenario plus financial review of the shared FIRE model?
- **90-Q02** For #90 Lean FIRE Calculator, what exact policy is approved for: Lean spending has no universal threshold; shared FIRE method remains pending?

### #91 — Fat FIRE Calculator (retirement_finance_numerical)

- **91-Q01** For #91 Fat FIRE Calculator, what exact policy is approved for: Owner spending scenario plus financial review of the shared FIRE model?
- **91-Q02** For #91 Fat FIRE Calculator, what exact policy is approved for: Fat spending has no universal threshold; shared FIRE method remains pending?

### #95 — Required Minimum Distribution Calculator (retirement_finance_tax)

- **95-Q01** For #95 Required Minimum Distribution Calculator, what exact policy is approved for: Required distribution rules, table, account balance date and exceptions?
- **95-Q02** For #95 Required Minimum Distribution Calculator, what exact policy is approved for: Example is owner IRA only; inherited accounts and spouse >10 years younger require different branch?
- **95-Q03** For #95 Required Minimum Distribution Calculator, what exact policy is approved for: Official whole-dollar4065 example is approximate; exact quotient4065.04065...; cents rounding4065.04 is separate display policy, not authority to under-distribute?

### #97 — Roth IRA Calculator (retirement_finance_tax)

- **97-Q01** For #97 Roth IRA Calculator, what exact policy is approved for: Income limits, contribution eligibility, qualified distributions and tax treatment?
- **97-Q02** For #97 Roth IRA Calculator, what exact policy is approved for: 2025 publication is candidate evidence only; tax year, MAGI, compensation and qualification gates missing?

### #98 — Traditional IRA Calculator (retirement_finance_tax)

- **98-Q01** For #98 Traditional IRA Calculator, what exact policy is approved for: Deductibility, income/plan coverage, contribution caps and distribution taxation?
- **98-Q02** For #98 Traditional IRA Calculator, what exact policy is approved for: Contribution permission differs from deductibility; year, coverage, basis and distribution rules missing?

### #120 — Income Tax Calculator (tax_payroll)

- **120-Q01** For #120 Income Tax Calculator, what exact policy is approved for: Taxable base, deductions/credits, filing status and bracket/rate rules?
- **120-Q02** For #120 Income Tax Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #121 — Take-Home Pay Calculator (tax_payroll)

- **121-Q01** For #121 Take-Home Pay Calculator, what exact policy is approved for: Pay frequency, withholding versus final liability, benefits and deductions?
- **121-Q02** For #121 Take-Home Pay Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #122 — Gross-to-Net Salary Calculator (tax_payroll)

- **122-Q01** For #122 Gross-to-Net Salary Calculator, what exact policy is approved for: Gross-pay inclusions, payroll deductions and withholding convention?
- **122-Q02** For #122 Gross-to-Net Salary Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #123 — Net-to-Gross Salary Calculator (tax_payroll_numerical)

- **123-Q01** For #123 Net-to-Gross Salary Calculator, what exact policy is approved for: Forward tax/payroll model, inversion tolerance, discontinuities and search domain?
- **123-Q02** For #123 Net-to-Gross Salary Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #124 — Payroll Tax Calculator (tax_payroll)

- **124-Q01** For #124 Payroll Tax Calculator, what exact policy is approved for: Employee versus employer scope, contribution ceilings and benefits?
- **124-Q02** For #124 Payroll Tax Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #125 — Sales Tax Calculator (tax_payroll)

- **125-Q01** For #125 Sales Tax Calculator, what exact policy is approved for: Taxability, exemptions, destination/origin sourcing and inclusive/exclusive prices?
- **125-Q02** For #125 Sales Tax Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #126 — GST Calculator (tax_payroll)

- **126-Q01** For #126 GST Calculator, what exact policy is approved for: Jurisdiction, registration, supply classification, inclusive/exclusive basis and credits?
- **126-Q02** For #126 GST Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #127 — VAT Calculator (tax_payroll)

- **127-Q01** For #127 VAT Calculator, what exact policy is approved for: Place of supply, exemptions/zero rates, registration and input credits?
- **127-Q02** For #127 VAT Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #128 — Capital Gains Tax Calculator (tax_payroll)

- **128-Q01** For #128 Capital Gains Tax Calculator, what exact policy is approved for: Cost basis, holding period, asset class, allowances and loss offsets?
- **128-Q02** For #128 Capital Gains Tax Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #129 — Dividend Tax Calculator (tax_payroll)

- **129-Q01** For #129 Dividend Tax Calculator, what exact policy is approved for: Dividend type, residence, withholding and imputation/foreign credits?
- **129-Q02** For #129 Dividend Tax Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #130 — Self-Employment Tax Calculator (tax_payroll)

- **130-Q01** For #130 Self-Employment Tax Calculator, what exact policy is approved for: Employment status, net earnings base, social contributions and deductions?
- **130-Q02** For #130 Self-Employment Tax Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #131 — Freelancer Tax Reserve Calculator (tax_payroll)

- **131-Q01** For #131 Freelancer Tax Reserve Calculator, what exact policy is approved for: Estimate versus withholding target, profit base, prior payments and jurisdiction?
- **131-Q02** For #131 Freelancer Tax Reserve Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #132 — Corporate Tax Estimate Calculator (tax_payroll)

- **132-Q01** For #132 Corporate Tax Estimate Calculator, what exact policy is approved for: Entity type, residence, profit adjustments, size bands and reliefs?
- **132-Q02** For #132 Corporate Tax Estimate Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #133 — Property Tax Estimate Calculator (tax_payroll)

- **133-Q01** For #133 Property Tax Estimate Calculator, what exact policy is approved for: Relation to master #34, assessment date, exemptions, caps and taxing authority?
- **133-Q02** For #133 Property Tax Estimate Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #135 — Tax Marginal Rate Calculator (tax_payroll_numerical)

- **135-Q01** For #135 Tax Marginal Rate Calculator, what exact policy is approved for: Statutory bracket versus effective marginal rate, benefit/credit phase-outs and boundary behavior?
- **135-Q02** For #135 Tax Marginal Rate Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #136 — Salary Sacrifice Calculator (tax_payroll)

- **136-Q01** For #136 Salary Sacrifice Calculator, what exact policy is approved for: Jurisdiction, benefit type, contribution limits, employer treatment and eligibility?
- **136-Q02** For #136 Salary Sacrifice Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #137 — Bonus Tax Calculator (tax_payroll)

- **137-Q01** For #137 Bonus Tax Calculator, what exact policy is approved for: Withholding versus annual liability, supplemental-pay method and aggregation rules?
- **137-Q02** For #137 Bonus Tax Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #404 — Target Heart Rate Calculator (exercise_clinical)

- **404-Q01** For #404 Target Heart Rate Calculator, what exact policy is approved for: Age-based versus measured HR/HR reserve, population applicability and intensity bands?
- **404-Q02** For #404 Target Heart Rate Calculator, what exact policy is approved for: AHA2024-08-12 is review date, not verified publication date. Population limits, measured-HR/HRR versus age method and rounding remain unselected?
- **404-Q03** For #404 Target Heart Rate Calculator, what exact policy is approved for: Qualified specialist review and separate owner mapping approval pending?

### #406 — Pregnancy Weight Gain Calculator (obstetric_clinical)

- **406-Q01** For #406 Pregnancy Weight Gain Calculator, what exact policy is approved for: Guideline, BMI bands, gestational timing, plurality and special populations?
- **406-Q02** For #406 Pregnancy Weight Gain Calculator, what exact policy is approved for: Continuous cutpoints and weekly gestational trajectory unapproved; do not round BMI before classification. CDCconsumer chart limits obesity display39.9 while MMWR footnote uses>=30; reviewer must choose target population?
- **406-Q03** For #406 Pregnancy Weight Gain Calculator, what exact policy is approved for: Qualified specialist review and separate owner mapping approval pending?

### #407 — Ovulation Calculator (obstetric_clinical)

- **407-Q01** For #407 Ovulation Calculator, what exact policy is approved for: Regular/irregular cycle applicability, luteal assumptions and window definition?
- **407-Q02** For #407 Ovulation Calculator, what exact policy is approved for: Fixed14days picks one point from approximate range; Jan15 is cycle-day15 when Jan1 is day1. Explicit counting policy and user-visible uncertainty needed; not evidence of exact ovulation?
- **407-Q03** For #407 Ovulation Calculator, what exact policy is approved for: Qualified specialist review and separate owner mapping approval pending?

### #410 — Sleep Calculator (sleep_clinical)

- **410-Q01** For #410 Sleep Calculator, what exact policy is approved for: Population, guideline/version, sleep latency, recommendation versus elapsed duration and uncertainty?
- **410-Q02** For #410 Sleep Calculator, what exact policy is approved for: No universal latency or90minute cycle justified. #518 only duration subtraction; age guidance and inverse scheduling absent. Named-timezone/DST and actual sleep versus opportunity policy needed?
- **410-Q03** For #410 Sleep Calculator, what exact policy is approved for: Qualified specialist review and separate owner mapping approval pending?

### #468 — Car Affordability Calculator (consumer_finance)

- **468-Q01** For #468 Car Affordability Calculator, what exact policy is approved for: Budget constraint, income/debt basis, insurance/maintenance/tax costs and financing terms?
- **468-Q02** For #468 Car Affordability Calculator, what exact policy is approved for: No universal affordability percentage, lender approval or insurance estimate selected?

### #469 — Auto Lease Calculator (consumer_lease_finance_tax)

- **469-Q01** For #469 Auto Lease Calculator, what exact policy is approved for: Money-factor convention, timing, cap-cost reductions, tax/fee treatment and rounding?
- **469-Q02** For #469 Auto Lease Calculator, what exact policy is approved for: Money factor formula must come from selected lease; cannot universally convert APR/2400?
- **469-Q03** For #469 Auto Lease Calculator, what exact policy is approved for: Base244.6875 rounds244.69 before adding12.25; totals over48 payments require residual/contract rounding policy, not blind multiplication of rounded payment?

### #470 — Lease vs Buy Calculator (consumer_lease_finance_tax)

- **470-Q01** For #470 Lease vs Buy Calculator, what exact policy is approved for: Lease contract, financing, mileage/penalties, terminal value and discounting?
- **470-Q02** For #470 Lease vs Buy Calculator, what exact policy is approved for: Matched horizon, mileage, taxes, buyout, residual ownership and fees unselected?

### #472 — Loan vs Cash Calculator (consumer_finance_numerical)

- **472-Q01** For #472 Loan vs Cash Calculator, what exact policy is approved for: Cash-flow dates, investment/discount convention, taxes, fees and horizon?
- **472-Q02** For #472 Loan vs Cash Calculator, what exact policy is approved for: Opportunity-return scenario not guaranteed; financing cash inflow/down payment and fees must reconcile?

### #485 — Carbon Footprint Calculator (environmental_accounting)

- **485-Q01** For #485 Carbon Footprint Calculator, what exact policy is approved for: Factors/dataset license, GWP version, activity coverage, scopes and double counting?
- **485-Q02** For #485 Carbon Footprint Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #488 — Heat Pump Savings Calculator (energy_engineering)

- **488-Q01** For #488 Heat Pump Savings Calculator, what exact policy is approved for: Annual heat boundary, seasonal performance, auxiliary use, tariffs and installation-cost scope?
- **488-Q02** For #488 Heat Pump Savings Calculator, what exact policy is approved for: Jurisdiction/effective rule pack and qualified reviewer approval remain unselected?

### #516 — GPA Calculator (academic_grading)

- **516-Q01** For #516 GPA Calculator, what exact policy is approved for: Institution/year scale, repeated courses, withdrawals, pass/fail, transfer credit and rounding?
- **516-Q02** For #516 GPA Calculator, what exact policy is approved for: Institution/academic year/eligible courses/repeats and final rounding unselected. Stanford4.3scale is one policy, not global normative GPA?
- **516-Q03** For #516 GPA Calculator, what exact policy is approved for: Qualified specialist review and separate owner mapping approval pending?

### #522 — Race Time Predictor (sports_numerical_modeling)

- **522-Q01** For #522 Race Time Predictor, what exact policy is approved for: Protocol/model, calibrated distances/population, exponent and uncertainty?
- **522-Q02** For #522 Race Time Predictor, what exact policy is approved for: Primary paper page2 supports generic exponent, not owner-selected/calibrated1.06for individuals. No validated uncertainty/domain chosen; mean pace must not replace predictor?
- **522-Q03** For #522 Race Time Predictor, what exact policy is approved for: Qualified specialist review and separate owner mapping approval pending?

### #526 — Training Heart Rate Calculator (exercise_clinical)

- **526-Q01** For #526 Training Heart Rate Calculator, what exact policy is approved for: Relation to #404, maximum-HR estimation, resting HR, zone boundaries and population?
- **526-Q02** For #526 Training Heart Rate Calculator, what exact policy is approved for: Depends on404model/identity choice; no independent HRR/training-zone thresholds established. Review date metadata correction also required?
- **526-Q03** For #526 Training Heart Rate Calculator, what exact policy is approved for: Qualified specialist review and separate owner mapping approval pending?

## Six source gaps

See `evidence-gaps.json`: #87 empirical/simulation safety model; #92 actual pension plan; #112 complete applicable overtime rules; #405 obstetric dating/redating; #408 validated dating uncertainty; #502 validated cooking-time thermal model. Endpoint tables cannot substitute for a cooking-time predictor.

## Preserved bounded support

#134 effective-tax ratio, #409 candidate adult CKD-EPI arithmetic and #530 candidate Kline absolute regression/conversion retain original evidence and limitations. These do not establish selected populations, applicability, engine binding or clinical/regulatory acceptance.

## Verification and provenance

Run `python3 docs/audits/specialist-technical-review-2026-10-26/verify.py` from repository root. Checks the exact authoritative 70-ID specialist set, all 540 catalog identities, group assignment, 424-record ledger hash, preserved source snapshots, approval/certification holds, seven independent proposal counterexamples and three bounded reference cases. Also replays all 70 retained witnesses (32 finance, 25 tax/business/energy, 13 clinical/other) in a disposable temporary directory. These are arithmetic checks, not actual-engine, normative-policy or clinical acceptance. No network or production connection.

`package-verification.json` records ZIP SHA256/CRC, every 136 manifest-covered member hash (137 entries), retained upstream hashes and exact-baseline source comparisons. Hashes establish integrity, not qualified authorship. Upstream source retrieval reports are historical evidence and were not freshly re-fetched. The complete USGA2024 text and live R&A revision are still unverified.

## Source artifact correction

All 36 cited finance source records have an extra trailing newline in the package snapshot. Each reported Git blob ID matches the authentic baseline. `package-verification.json` separates actual repository SHA256 from serialized snapshot SHA256; no substantive source difference was found.

## Verification results

13 checks pass, including seven negative integrity probes, seven corrected-proposal numerical witnesses, three retained bounded cases and replay of all 70 original witnesses. No application suites/build were rerun for this evidence-only change.

## Shortest approval path

1. Route the 54 exact policy question sets and six evidence requests through the existing 14 reviewer batches; preserve all 25 original group assignments. No outreach was performed.
2. Qualified reviewers disposition each of the seven corrected proposals and three bounded-support findings, signing exact ID, complete formula/domain, normative revision/effective dates, units/rounding, independent vectors and exclusions.
3. Owner resolves any remaining product mapping selections separately. Bind accepted contracts to immutable source/version; implement only separately demonstrated missing requirements, then execute applicable validation and existing lifecycle gates.

Frozen PR #1478 and newer owner-engineering PR #1479 remain unchanged. This branch starts from the explicitly requested #1478 baseline and carries no changes from or to #1479; the later 20 owner approvals remain effective and are not revoked by historical specialist records. All 14 private DRAFTs and rejected mappings #9/#442 remain untouched. No merge, deploy or production action.
