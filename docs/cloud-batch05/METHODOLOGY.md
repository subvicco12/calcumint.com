# Private financing and cashflow methodology

Implemented engineering support IDs:21,32,36,43,46,49,468,470,472. All definitions are new private v1 entries under `private.financial.<id>`, outside public registry/routes. Original definitions and original14 private DRAFTs are unchanged. These are complete implementations of the supplied scenarios below, not acceptance of every branch of the original catalog products.

## Authority and numerical contract

Reuse `data/catalog/source-driven-2026-10-27/engineering-register.json` and its original50-case input ZIP. `scripts/verify-source-driven-evidence.py` verifies original archive bytes,97 root/76 nested manifest entries, all42 source-observation record hashes, disjoint50/9/11 cohorts and pending decisions. No archived bundled scripts executed. All50 original source URLs, observation classifications and unclosed gaps are preserved in contract-assessment.json.

The selected existing observations cover CFPB debt-consolidation and closing-cost context, Investor.gov compound-interest mathematics, IRS rental-expense context and vehicle financing context. They support only declared supplied-value accounting and period mathematics. No retrieved page is promoted to a current governing revision, publisher-body hash, legal rule pack or qualified applicability decision. No marketplace/Etsy source or effective schedule was inferred. No new external policy was adopted.

All inputs require a common currency label, an explicit identical period, and `scope: supplied-cashflows-no-tax`. Money is finite0..1e12, rates are fractional effective rates0..1 for each supplied period (not APR), schedules are0..600 periods and consolidation has1..20 existing loans. Objects reject unknown fields. Horizon mismatches, debt greater than purchase price, unexplained consolidated principal and uncollected rent above scheduled rent fail closed.

Financing charges interest before the explicitly requested end-period payment; actual payment is capped at debt plus interest. Unpaid interest remains debt; negative principal repayment is shown. No fees or minimum payments are invented. All new models reuse existing finite/underflow/overflow guards and compensated summation; comparative present values invoke the immutable supplied-ledger definition v1. Outputs are unrounded IEEE-754 engineering numbers, not cent-rounded lender invoices. The economic principal-conservation check alone uses exact declared decimal arithmetic, avoiding binary equality artifacts. No global Decimal configuration is changed.

## Product contracts

| ID | Complete private scenario |
| --- | --- |
|21|Compare supplied existing-loan traces with supplied consolidated-loan trace over an identical horizon; new principal must equal old opening debts plus explicitly capitalized fee. Upfront fee is a separate period0 outflow. Terminal debts are included once; left-minus-right cost favors consolidation when positive.|
|32|Compare rent upfront/payments less terminal refund against purchase initial equity/upfront costs, running costs, financing and terminal sale. Opportunity cost enters only through the supplied discount rate; no second opportunity-cost deduction. Positive left-minus-right favors buying.|
|36|Calculate collected rent, NOI, separate actual debt service, capex, unspent reserve transfer and owner cashflow for every period, plus exit assets/debt. No tax or depreciation output.|
|43|Calculate holding-period profit and return using all actual equity injections as denominator, including negative interim cashflow and exit deficit. Distributions include positive interim cashflow and positive exit equity. Zero denominator gives null; no IRR or annualized return inferred.|
|46|Calculate flip profit from explicit acquisition equity, closing/upfront costs, separate period rehabilitation and other costs, actual financing payments, sale proceeds/costs and remaining debt. Loan advance is excluded from acquisition equity and principal payoff counted once.|
|49|Reconcile full mortgage trace with rental NOI, capex, reserves and exit equity; report principal repaid (possibly negative), debt and discounted net cost.|
|468|Compare purchase initial cash needs with supplied available cash, and each recurring outflow with a supplied period budget. First/max deficit and Boolean relate only to these limits; terminal equity/payoff is shown separately and excluded from budget testing. No underwriting or maximum affordable price inferred.|
|470|Compare disclosed lease upfront/periodic/end charges against financed purchase and supplied sale assumptions. No fee schedule, money factor or tax inference. Positive left-minus-right favors buying.|
|472|Compare financed purchase versus all-cash with separately supplied upfront costs and otherwise identical running costs and terminal sale assumptions. Positive left-minus-right means greater financed cost.|

Purchase initial cash=price−opening loan+upfront costs. Sale net equity=gross supplied value−selling costs−terminal debt. Selling costs enter the dated ledger once as an outflow, with gross terminal value as an asset. Rental reserves are strictly unspent ring-fenced cash: contributions reduce distributable cashflow, stay assets and return exactly once on exit. Capex is separately funded; spending reserves would need another explicit contract. Negative equity is retained, never clipped into profit.

Present cost=sum(outflow[t]/(1+r)^t)+(terminalDebt−terminalAsset)/(1+r)^H. Outflows are signed; rent/owner distributions are negative costs. Same period/horizon/currency is required. Discount rate is a supplied scenario assumption, not a guaranteed investment return. Horizon0 is immediate settlement, not a perpetuity.

## Immutable exchange and review

Closed exports pin private profile identity/version, original source-observation hashes and ledger dependency ID/version, validated inputs and actual-engine output. Import rejects non-JSON objects/accessors/cycles/nonfinite data, unknown fields, unsupported identities/versions and any mismatch on re-execution; object key order is immaterial and array order is significant. Shared snapshot copying detaches and deeply freezes results/history. Free/Pro/Business call one identical engine and export no plan-specific values.

Private loopback review offers methodology/source limits, labeled JSON input, full trace, invalid-input recovery, stale-result invalidation,20 tab-local history entries and real downloaded snapshots. It performs no account writes or persistent browser storage. Real Chromium acceptance replays downloaded files through the actual engine and checks cross-plan/viewport equality. This does not establish subscription-provider or production identity acceptance.

## Preserved blockers

All original owner/full-scope, governing revision/effective period, source-byte, canonical ID/version/full-SHA mapping, provider/institution/jurisdiction and qualified applicability questions remain open. The model does not select tax/depreciation regimes, lenders, legal fees, lease rules, investment returns, valuations or affordability policy. Full retirement/institutional/tax/payroll/provider contracts stay separate. Canonical completed count remains0. RELEASE HOLD remains active.
