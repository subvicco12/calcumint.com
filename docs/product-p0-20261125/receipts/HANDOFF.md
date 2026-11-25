# W2-PUBLIC-INTERFACES — Worker 3 intake

Revision 4 allocated #508, #513–515, #519–521, #523 and #524. All nine registered v1 slugs lacked a matching public interactive caller on the locally available retained candidate. No published route was recorded for any in the retained portfolio. The shared CalculatorPage still requires ready publication state. No route, publication, engine or private workflow change is in this commit.

Reported W3 head ae0a9abb1a1b09733f94c7ac8aee0114a47a2820 was unavailable in this checkout. Base is exact retained private acceptance execution 15829bca2931e13d0aa777f178e8c944515585c6, tree c86683addd0400129d299da5c7a30650f28811aa. Fetch engineering/worker2-public-everyday-20261125 from public-everyday.bundle after restoring that prerequisite. Verify commit 1dd4018bfdb1aa4a75860c516dc84d395dfbfb0a and tree f785e8431658d35ffe527c19e1a9964239fe5656. The retained cohort blob at base is 26499a52bac827f285047a217e527f091da8fc01. Reconcile it and source paths on integrated W3 head.

The only committed paths are src/components/everyday-public-20261125/calculator.tsx and its focused test. The separate worker3-dispatch-request.patch passed apply-check against the retained base, remains unapplied, and is routing wiring for W3 review. Existing engine registry already contains the nine definitions. Do not weaken getPublicCalculatorRoute or add a fallback that bypasses publication state.

| Catalog ID | Immutable engine and intended anonymous calculation |
|---|---|
| 508 | travel.trip-cost@1, entered transport, lodging, food and other in one currency |
| 513 | travel.hotel-cost-split@1, equal split of an entered hotel total |
| 514 | travel.group-expense-split@1, equal split of an entered expense |
| 515 | travel.tip-split@1, supplied percentage applied to bill then split |
| 519 | travel.household-utility-cost@1, supplied amounts in one billing period |
| 520 | travel.moving-cost@1, non-overlapping entered move costs |
| 521 | sports.running-pace@1, decimal min/km |
| 523 | sports.cycling-speed@1, average km/h |
| 524 | sports.swimming-pace@1, decimal min/100 m |

10 focused component tests passed. Browser receipt covers nine isolated 320px Chromium journeys with trusted keyboard entry and submit, deterministic changed-input result, blank refusal and focus recovery, nonempty 44px targets and no horizontal overflow. The harness is browser.mjs; copy it to tests/worker3-everyday-sports-20261118/public-interface.local.mjs within a disposable checkout and run node tests/worker3-everyday-sports-20261118/public-interface.local.mjs /absolute/path/to/browser-receipt.json. Use existing Node ≥22, lockfile deps and Chromium. It is loopback only and has no account fixture.

Retain the prior private acceptance and historical replay unchanged, including fractional v1 historical split packets; new capture requires whole people. Original receipt: https://github.com/subvicco12/calcumint.com/blob/79aa285a42acfaaa40147883d10d52dd5724b06e/docs/worker3-everyday-sports-20261118/accepted/receipt.json . No private authenticated suite repetition is requested if dependencies match.

W3 to verify dispatcher on the exact integrated candidate and prove unavailable/unpublished routes still fail closed, governance-allowed harness routes render the new UI, unchanged v1 history/replay and applicable account/export gates still hold. Remaining competent per-ID applicability and precision decisions from the retained handoff are unchanged. No ledger promotion, certification, dispatch, deployment or release follows. Ledger 274; RELEASE HOLD ACTIVE.
