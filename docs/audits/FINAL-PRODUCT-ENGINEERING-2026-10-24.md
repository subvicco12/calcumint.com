# Final Product engineering candidate — RELEASE HOLD

Frozen PR #1467: `b85e845ecd11856f963c9f32af9634b8e4738293`. Work is isolated on `engineering/final-product-20261024`; no push, PR modification or production operation. Live GitHub PR verification confirmed the same OPEN draft head on 2026-10-24. The candidate preserves ancestry.

## Demonstrated defects corrected

| Integrated commit | Defect and regression evidence | Review |
| --- | --- | --- |
| `f4b0a2c` | API-key revoke and webhook disable accepted stale/missing rendered account context. Four red cases now reject before mutation; real forms supply the owner and fresh authentication is checked immediately before update. Organization and role restrictions remain. | Separate account lane reviewed; 40 focused tests passed. See BUSINESS-AUTOMATION-OWNER-BOUNDARY-2026-10-24.md. |
| `0732b8b` | Failed Paddle CDN elements were retained, so a later checkout mount awaited an event that could never recur. Both created/existing failed elements are removed; explicit subsequent checkout can fetch again. Two red cases now open checkout after replacement load. No automatic payment retry or entitlement relaxation. | Separate Business lane reviewed; 29 checkout tests passed. |
| `08a1803` | Supported INR/scientific labels exported as literal Unicode escape codes. Conditional licensed embedded glyphs and ToUnicode now preserve readable ₹/Ω/µ/° and exact raw values. Unsupported characters remain explicit, lossless escapes. | Separate Business lane reviewed; 24 PDF tests including independent Poppler extraction passed. See REFERENCE-EXPORT-UNICODE-2026-10-24.md. |

Lane-focused totals overlap: Business 59, account/history/billing 148, Reference Six/export/accessibility 58. They are not additive independent coverage counts. Every lane reproduced its defect before correction. No engine, mathematical contract, historical calculator snapshot, SQL migration, certification/publication authority or DRAFT lifecycle changed.

Additional test-only commits: `9584cd95ef0b4ed6039e580ec634eab03aa853c8` preserves the methodology assertion against actual decoded PDF text; `e327a84c45353d71ee485139e3851cecd396139b` waits for matching CDP download completion before reading exports, with two deterministic regressions and unchanged ten-second deadline/content assertions. The account lane independently reviewed the download helper with no findings.

## Acceptance reconciliation

Reuse the existing Final Master Blueprint requirement wording in the 424-row ledger, 540-catalog mapping, MASTER-PRODUCT-COMPLETION checkpoints, runtime-PDF evidence, independent sprint-P0 evidence and final-stress evidence. Earlier superseded gaps are not reopened as new defects. The source attachment itself is not newly authenticated in this workspace.

The ledger retains all 424 identities and statuses: 55 VERIFIED / 331 PARTIAL / 20 BLOCKED / 18 UNKNOWN. Only two obsolete “PDF remains untagged” gate cells are corrected; no approval or status is promoted. Tagged PDF implementation already existed at the frozen head. The new fix closes supported-label readability, not arbitrary-script typography, shaping or PDF/UA.

Reference Six, history, scenarios, immutable exports, billing sandbox, API/batch, embeds and account boundaries have bounded implementation/test evidence. No additional P0/P1 was demonstrated in this reconciliation after the three corrections. This is not proof of complete 540-calculator implementation or universal deployed acceptance. The catalog still contains owner/specialist identity and scope decisions; missing links are not permission to invent calculators. SIP v1's documented extreme-input fail-closed limitation, Mortgage period-policy decisions and BMI methodology/population decisions remain explicit; their versioned contracts are preserved. Fourteen unpublished DRAFTs remain unpublished.

## Validation

Final integrated results follow. The initial integrated full suite exposed an encoding-specific methodology test assertion; its content assertion is retained against decoded text. The first Reference Six run overlapped a Next build: automatic tsconfig changes forced Vite reload, and the download helper also read files before Chromium completed writing them. Both failed PDFs later had valid headers and EOF markers. These runs are preserved, not counted as passing evidence. A subsequent isolated run passed 36/36 even before the download fix. One completion-gated run was started before that runner released fixed port 4191 and failed setup; it is also retained and excluded. The final completion-gated run starts only after the prior runner exits. Private diagnostic artifacts are under `/workspace/.pr1467/final-product/`, outside Git. Runtime identity is synthetic; PostgreSQL/PostgREST are disposable. No production connection or credential use.

| Command / scope | Result |
| --- | --- |
| Frozen baseline full suite, four workers | 4,570 passed / four skipped; 705 files passed / two skipped |
| Final integrated `npm test -- --maxWorkers=4` | 4,582 passed / four skipped; 706 files passed / two skipped; exit 0 |
| `npm run test:launch` | 45 passed |
| `npm run test:certification` | 15 passed; guard tests only, no certification action |
| Browser fixture + CDP `node --test` | 12 passed, including bounded startup and cleanup |
| PostgreSQL17.6/PostgREST security | Eight checks passed plus schema-dependency preflight |
| Actual Next runtime | 25/25 passed; all disposable resources cleaned |
| Download completion regression | Two passed; premature read and stale-completion cases |
| Reference Six, final completion-gated harness | 36/36 passed, zero issues; exit 0 |
| `npm run build` (`next build --webpack`) | Passed; final application code |
| Typecheck, preserved config / final candidate | Passed |
| Full lint / changed final test files | Passed; 28 existing full-tree warnings, zero errors; changed files zero errors |
| Ledger identity/status + diff/ancestry checks | Passed; 424 records and status classifications preserved; frozen base is ancestor |


The native Next runtime run uses the integrated Business/Paddle source at `0732b8b`, before the isolated PDF-only correction; Reference Six download tests and the final full suite cover the subsequent PDF source. No hosted exact-head CI claim is made for this separate local candidate. Frozen-head 6/6 CI remains historical evidence only.

Validation scope: the webpack build used the final application source (`08a1803`); later commits change test code only. Next auto-generated tsconfig changes were restored, and typecheck was rerun against the preserved tracked configuration. Full lint passed with 28 warnings / zero errors. No hosted workflow was triggered or inherited as proof for the new candidate.

## Remaining gates and shortest path

| Gate | Classification / next owner action |
| --- | --- |
| Candidate integration | Review this separate branch and authorize its eventual integration; frozen PR was deliberately preserved. Run hosted exact-head checks on the selected reviewed candidate before release decisions. |
| Genuine Supabase identity, Paddle sandbox and authorized AI-provider acceptance | Provider/configuration evidence; validate real recovery/rotation/MFA, billing reconciliation and configured AI boundaries in an authorized isolated environment. No live-payment activation. |
| Current database compatibility and remediation adoption | Repository-model checks are not current-production equivalence. Reuse isolated engineering package `41e90c59842ebf5d44666b84410f5e3aaf7e7805` (948 model matches); authentic historical capture and current deployment remain separate. Owner-controlled adoption/rollback decisions required; no migration executed. |
| Mathematical/source/catalog authority | Owner/specialists must resolve existing SIP policy, Mortgage, BMI, review authorities and catalog mappings. No invented approvals, v1 replacement or new calculators. |
| Accessibility, performance, international typography | Supported-label defect corrected; independent PDF/UA, physical Android/TalkBack, controlled deployed performance and broader script/shaping remain unverified. These evidence gaps are not newly reproduced application defects. |
| Operational recovery and release | Existing recovery readiness is an external operational gate. Per owner directive no more backup or credential engineering was attempted. RELEASE HOLD remains. |

GO for review of the separately verified engineering corrections only; NO-GO for asserting the entire Final Product accepted or for production release. No remaining demonstrated P0/P1 application defect is silently waived. Complete the bounded external/authority gates, then select and validate one exact candidate; explicit release authorization remains necessary.
