# Independent Batch05 engineering review

A separate read-only reviewer inspected the new financial engine/contract modules and author test cases against PLAN.md and the preserved original evidence. The reviewer independently authored `financial-contracts-independent.test.ts` and ran actual engines, without editing production modules.

Nine independent tests cover all nine support IDs with nonzero25% discounting, negative amortization, original/capitalized/upfront costs, reserve return, negative equity, zero horizon, supplied budgets and decimal principal conservation. Expected results were derived separately from production calculations.

## Demonstrated defect and resolution

Important: ID21 rejected valid input where opening debts0.1 and0.2 were consolidated as0.3. Exact binary sum comparison demanded0.30000000000000004. The reviewer added a regression and reproduced RED (eight other independent tests passed; this one failed). Author independently reproduced it, then replaced only the economic principal-conservation check with existing decimal.js using a private400-digit context. This compares supplied decimal numeric values strictly, without a tolerance that could admit unexplained principal. The same regression rejects0.31. All47 new engine/UI tests passed after the fix; final54 real browser journeys passed.

The reviewer inspected the fix afterward and reran all nine independent tests: no outstanding Critical or Important findings. The additive CI step was reviewed as private browser acceptance with temporary evidence storage.

UI/fixture/browser static review found no Critical/Important finding. Both component tests passed in independent review. The author ran actual54 browser journeys; reviewer did not independently repeat Chromium acceptance. History browser assertions check retained identity; immutable nested snapshots and unit/structural checks cover deeper detachment. No minor finding was deferred as a release claim.

This is independent engineering review only. It does not establish full original product scope, current authoritative rule versions, provider/institution/jurisdiction applicability, competent financial/tax applicability approval, certification or publication. RELEASE HOLD remains active.
