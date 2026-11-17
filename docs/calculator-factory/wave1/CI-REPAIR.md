# Exact-head CI scheduling correction

This is a successor to the immutable [wave report](REPORT.md) and [local validation snapshot](validation.json). Their recorded bytes are retained. RELEASE HOLD remains active.

PR #1538 head `07cea5ec95b83134f71245100a1d04ef7db862cf` ran CI **43192412275**. Checks, build, full-product and publication-factory passed; source-acceptance failed and aggregate correctly failed. Source-acceptance reported 9,355 passes, two failures and four existing skips.

One failure is reproduced: `five-full-contract-evidence.test.ts`'s genuine-API-source case took **5,755 ms under overlapping workers**, exceeding its unchanged 5,000 ms limit. Alone it passed in **3,931 ms**. The exact nested source-suite CI failure cannot be attributed conclusively because its old wrapper deleted the TAP report; the same inner suite passed all 91 cases in the controlled overlapping reproduction. That uncertainty is retained rather than described as a proven flaky assertion.

The correction makes the already full-tested **single outer-worker schedule explicit in `vitest.config.ts`**. All 9,357 tests previously passed with that effective setting; no test include, assertion, skip, test timeout, subprocess limit or mandatory CI job is removed or relaxed. The five CI jobs still execute independently. Failure diagnostics now rethrow with the retained TAP contents and original cause.

The scheduler is admitted as an exact predecessor/successor context: [descriptor](../unit-scheduler-successor.json), predecessor `9ad7e75641322696f75a018e53513c8158c39870`, successor `b3f0844e8ec09010464afa3ea33306bc4f384c41`. The existing source-authority case proves that the only config insertion is the worker setting and its comment. The config, descriptor and current-source closure are independently pinned in capture37. Historical captures31–36 and stages1–5 remain unchanged.

Verification at `b119e1bb084a0484bc7901f254d8881bdcdd27d6` (see the exact full source ref in the external checkpoint): 100/100 source guards; normal Vitest invocation **without a worker CLI override** passed both affected files, 12/12 tests, including the 91-case source child. The formerly failing API case took **4,300 ms**, within its unchanged limit. Typecheck and targeted lint passed. Independent AI engineering review found no important defect and granted no certification.

Application formulas, UI, authenticated paths and mathematical results are unchanged from the fully locally tested numerical-boundary successor. Its 9,357-pass full regression, 16 local browser checks and 66 genuine local account-RPC observations remain the application evidence. A new exact-head full hosted run is required; this document does not claim it has succeeded.

Confirmed engineering overlay remains20; this wave adds0 full engineering completions, canonical approvals, certifications or publication-eligible calculators. The 540 dispositions remain0 certified,2 review pending,495 partial and43 blocked. The [remaining work](remaining-work.json) and [unsigned review queue](review-queue.json) remain applicable. No production operations occurred.
