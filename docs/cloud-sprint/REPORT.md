# Cloud engineering evidence — 2026-10-28

RELEASE HOLD remains active. No production operation, migration, merge, deployment, live payment, certification or public product publication.

## Baseline activation and recovery

Activated local `engineering/cloud-final-20261028` at exact baseline `68526b5377c762a4f8e5fe96bbd4d7f10510cec8`, with a clean tree. Its parent is Windows engineering commit `589689e9a43ff8eecab72791bc8b4f81177a8ae6`; both that commit and cumulative starting commit `902f1ef9266fd70bfa2e01abba66971a712f202d` pass local ancestor checks. Original `work` remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. No additional worktree, reset or force update was used. Delivery SHA/PR/hosted status are recorded in the subsequent receipt and final delivery message.

The task's managed environment reports desired/observed revision 1, running/connected, enforced network policy, three configured runtime variables ready. Actual network commands require the supported additional network capability; default sandbox socket creation fails EPERM. With that capability, managed proxy `proxy:8080` works unchanged, TLS verification stays enabled and Git fetch succeeds. No alternate route was introduced.

## Implemented calculator engineering

Three new **private engineering workflows**, each version 1, with strict schemas, bounded work and closed actual-engine export/replay:

| Engineering support ID | Workflow | Added behavior |
| --- | --- | --- |
| 469 | `private.workflow.disclosed-lease` | Disclosed depreciation/rent-charge base payment, uniform caller-disclosed additional charge, aggregate charge and payment reconciliation. Retains unrounded 244.6875 base and 256.9375 total in the Federal Reserve observation scenario; does not infer invoice rounding, money factor or tax rules. |
| 488 | `private.workflow.heat-costs` | Baseline/core/auxiliary energy, both operating costs, savings and fixed-demand break-even electricity tariff. Explicit null when electric energy is zero; negative savings retained. |
| 82, from the other 27 methodology cases | `private.workflow.target-trajectory` | Linear finite supplied-return/cashflow trajectory with a target at each identical period boundary, first target crossing, exact-zero and insufficient-withdrawal events, shortfall amounts and trace. No retirement age/target/safety model inferred. |

The seven Windows contracts and their dependencies are reused unchanged. New replay checks workflow identity, schema version, calculator slug/version, exact dependency IDs/versions, input and recomputed output; unknown fields, forged values and unsupported versions fail. Exports are detached and deeply frozen. JSON object ordering is immaterial; array order remains significant.

The private reviewer UI provides labeled JSON input, method/source/limitations, stale-result invalidation on edits or failures, explicit local snapshot capture, a 20-entry tab-local history, clear-history action and actual versioned JSON download. It uses no account API or persistent browser storage and is not imported by public routes/registry. Browser tests exercise trusted keyboard selection, mobile/desktop, invalid/recovery cases, actual download replay and saved-history detachment. New CI wiring runs these journeys after the existing pinned Chromium setup.

Added independent actual-engine witnesses and immutable export checks for **all 23** preserved component-support IDs: `21,32,36,43,46,49,80,81,84,85,86,125,126,127,134,198,199,468,469,470,472,488,516`. These pin supplied scenario arithmetic only. Generic ledger inputs do not establish distinct product accounting or provider/eligibility rules.

**New canonical calculators accepted/completed: none.** Private workflow engineering completed: the three IDs above. Full per-calculator scope/applicability remains pending; this batch does not relabel arithmetic as full acceptance. The remaining 26 methodology cases outside the 23 receive no invented functionality or acceptance claim.

## Fresh verification

| Check | Result |
| --- | --- |
| Full `npm test -- --maxWorkers=2`, corrected source | Exit 0; 754 passed files, 2 skipped files; 5,129 passed tests, 4 conditional skips, 0 failures |
| Independent reviewer focused verification | 71 passed: 42 workflow, 24 case-cohort, 5 UI tests |
| New actual Chromium workflow acceptance | 6/6 journeys; 320px/1280px × 3 workflows; actual downloads replayed, no unexpected traffic or page errors |
| Disposable PostgreSQL 17.6 + PostgREST HTTP security | Exit 0; eight named HTTP/security checks plus schema/RLS/ACL dependency preflight passed |
| Actual native Next browser acceptance | Exit 0; 62/62 journeys passed; Chromium, Next, synthetic identity and disposable database cleanup complete |
| Node transport/evidence/browser cleanup | 20 passed, 0 failed/skipped |
| Launch guards | 45 passed |
| Calculator/rule-pack certification guards | 15 passed; no certification action |
| Lint | Exit 0; zero errors, 28 existing warnings |
| Typecheck | Exit 0 |
| `npm run build` → `next build --webpack` with supported execution capability | Exit 0; compiled, TypeScript finished, 37 static pages and traces complete |
| Protected authorities/history | All eight protected hashes and five historical dependency hashes match. Catalog: 540 unique IDs; ledger: 424 records. All 1,866 baseline files except the intended CI workflow are byte-unchanged. |

The four normal-suite skips are existing catalog opt-ins requiring master-CSV/inventory-output parameters or reviewed mapping evidence; they were not disabled or introduced here. Independent integrity checks above count the actual preserved CSV/ledger bytes. This report does not convert skipped checks to passes.

## Failures retained and review

Initial new engine/UI test files failed to load before implementation existed. Independent review reproduced a lease cancellation error; its added regression failed, then passed after compensating all original base terms together. The first full suite ran while that fix was being developed and recorded 5,128 passes/1 failure/4 skips. The complete corrected suite above was run afterward; the earlier failure is preserved.

The first webpack attempt in the default sandbox failed `Could not parse output from TypeScript's --showConfig`. Diagnostic reproduction found the spawned TypeScript CLI returned exit 0 with empty captured stdout; direct CLI output was valid. With supported additional network execution permission, the identical Next helper captured 89,589 bytes of valid configuration and the complete build passed. No source, dependency, Next configuration or assertion was changed for this environment failure.

Review also corrected stale-download reuse by creating a unique run directory, and strengthened the URL-revocation assertion. Independent review found no remaining Critical/Important issues; see INDEPENDENT-REVIEW.md. Source/dependency hashes and retained per-case blockers are in workflow-inventory.json; original-authority checks are in integrity.json.

Raw logs/screenshots/downloads are retained privately under `/workspace/work/cloud-final/`, outside Git. Relevant logs: `workflows-red.log`, `ui-red.log`, `review-cancellation-{red,green}.log`, `full-unit.log`, `full-unit-final.log`, `browser-final.log` and `browser/run-*/report.json`, `postgres-security.log`, `next-runtime/next-runtime-report.json`, `node-transport.log`, `launch.log`, `certification.log`, `lint.log`, `typecheck-final.log`, `build.log`, `build-supported.log`. These cloud workspace artifacts are not claimed to be permanently hosted; committed summaries/hashes travel with the branch.

## Reproduction

```sh
npm test -- --maxWorkers=2
node tests/workflow-review/browser.mjs
NEXT_RUNTIME_ARTIFACTS=/tmp/calcumint-security node tests/next-runtime/security.mjs
NEXT_RUNTIME_ARTIFACTS=/tmp/calcumint-native node scripts/test-next-runtime-browser.mjs
node --test tests/next-runtime/cdp.test.mjs tests/next-runtime/navigation-ready.test.mjs tests/next-runtime/browser-fixture.test.mjs tests/windows-evidence.test.mjs tests/windows-browser-cleanup.test.mjs
npm run test:launch
npm run test:certification
npm run lint
npm run typecheck
npm run build
```

Use supported network execution permission for Git/loopback/Docker and this environment's build subprocess capture. Keep managed proxy/TLS protections. Database harness uses pinned PostgreSQL 17.6/PostgREST images on disposable internal networks, with no production database URL. Browser fixture requires Chromium and per-run Basic authentication established by its harness.

## Remaining blockers and claim limits

- All original source-byte, governing revision, jurisdiction/effective-period, issuer/provider/plan/institution, canonical mapping, complete product-scope and qualified-review blockers remain. Archived observations are not new publisher-byte captures.
- Native Next acceptance uses a synthetic JWT-verifying identity provider, explicitly **not GoTrue**. Signup, recovery, refresh rotation, email, MFA and external identity acceptance remain unverified. No production database was substituted.
- Physical devices, installed heat performance, lender/provider sandboxes and production-schema/platform equivalence remain unverified.
- The original Windows raw evidence ZIP/receipt/manifest/logs remain outside Git and are not independently attested by this cloud run. Windows completed work was reused, not recreated.
- 540 catalog identities, 424 acceptance records, SIP v1, Slope v1 and all 14 original private DRAFTs remain unchanged. Publication/certification authority and RELEASE HOLD are unchanged.
