# Windows engineering sprint — Batch 01

RELEASE HOLD remains active. No push, merge, deployment, production write, migration, payment, certification or publication is authorized or performed.

Starting branch: `engineering/windows-final-20261027`.
Starting SHA: `902f1ef9266fd70bfa2e01abba66971a712f202d`.
Ending implementation SHA: pending the requested QA-closure commit. The dated QA-closure section supersedes the earlier resume status below.

## Baseline and independent PR reconciliation

Initial worktree was clean, including untracked files. Node `24.22.1` satisfies package engine `>=22`. `npm.cmd ls --depth=0` succeeded without missing top-level packages; the existing installation and lockfile were reused. Windows PowerShell and `npm.cmd` were used. Python, Docker and GitHub CLI were absent from PATH. Installed Chrome was used for browser checks. A portable official Python 3.12.8 runtime was subsequently downloaded into ignored `.windows-tools/python` to run the original tests unchanged; no system installation or package dependency change was made.

Read-only GitHub PR metadata and local `git merge-base --is-ancestor` checks established exact heads/bases for all 17 draft PRs. Fifteen heads are ancestors of the starting SHA. #1471 and #1472 are not. See [pr-heads.json](pr-heads.json) and [pr-reconciliation.json](pr-reconciliation.json).

- #1471 remains separate: its public-only two-calculator mode deliberately changes product availability and is not a Final Product integration default.
- #1472's CIDR adapter, presentation, UI, numerical tests and private browser fixture were adapted locally. Existing catalog-preview support was retained. No Git merge was performed; CIDR remains reviewed and non-public.
- #1467–#1470, #1473–#1483 are already ancestors, including independently developed #1480 through the existing merge in #1481. They were not cherry-picked again.

The full original Blueprint attachment is unavailable. Recorded governing requirements and the prospective, non-production-effective governance amendment were read. The protected catalog, acceptance ledger, historical formula/version files, original 14 private drafts and existing publication authority were preserved. Passing arithmetic does not amend those authorities.

## Exact calculator scope and completion claims

PR #1483 advanced exactly these **23 component-support cases**:

`21, 32, 36, 43, 46, 49, 80, 81, 84, 85, 86, 125, 126, 127, 134, 198, 199, 468, 469, 470, 472, 488, 516`.

Seven new **private supplied-input scenario contracts** are implemented: `private.supplied-price-factor`, `private.supplied-ledger-comparison`, `private.supplied-balance-projection`, `private.supplied-ratio-percent`, `private.supplied-lease-base`, `private.supplied-heat-balance`, `private.supplied-weighted-mean`. Each has strict bounded input schemas, explicit units/timing/domain, formulas/limitations, independent numerical examples, actual-engine execution, and detached deeply frozen versioned exports. Export re-execution rejects forged output or an unrecognized definition. Nested unknown keys, nonfinite values, mismatched periods, out-of-horizon flows and excessive work fail closed.

The seven contracts support the 23 IDs above; they do **not** resolve each original calculator's pending canonical scope, accounting, tax, provider, institutional, applicability or source contract. Exact **newly accepted canonical calculator IDs: none**. Claiming all 23 complete would contradict their preserved evidence. The completed CIDR renderer integration concerns master ID **369**, implementation `technology.cidr`, version 1; it does not grant canonical acceptance, certification or public availability.

See [contract-inventory.json](contract-inventory.json) for complete private input schemas, formulas, examples, titles, support bindings and dependency hashes. Original seven component implementations and their historical hash-bound evidence remain unchanged.

## Demonstrated Windows defects addressed

- `core.autocrlf=true` changed hash-bound working-copy bytes. `.gitattributes` now preserves LF text across Windows checkouts while keeping historical CSV bytes unchanged; the optional repair script changes CRLF only and retains historical CRLF CSVs. Existing expected hashes were not changed.
- The Final renderer inherited machine-specific numeric grouping. Explicit `en-US` formatting preserves the established English UI convention across server/client hosts, including IPv4 `/0`; numeric authority is unchanged.
- Offline source-driven archive verification required Python. A Node verifier now preserves pinned SHA256, CRC, manifest, 50/9/11 cohort, pending-status and 42 observation-hash checks without extraction, bundled script execution or network access. The original Python verifier is retained.
- Private preview credential mode bits did not enforce owner-only access on Windows. A fresh credential directory now receives an owner-SID-only Windows ACL before the secret is written. IPC supports graceful Windows test-parent shutdown and credential removal; Unix mode and signal assertions remain in place.
- Temporary runtime fixtures use Windows directory junctions instead of privileged symlinks. Chrome readiness-file reads tolerate transient Windows sharing locks. The quiet-stderr startup test no longer requires `/bin/sh`, and the inherited-bus fixture can use a Windows named pipe.
- Private preview dependency discovery is explicit and bounded. Local tool downloads and verification artifacts are excluded from watching/serving; source access, per-run authentication and read-only method protections remain intact.

## Tests and outcomes

Current resume command results are recorded in the dated section below. Earlier implementation results follow for provenance. Local detailed logs/artifacts are in ignored `docs/windows-sprint/evidence`; generated secrets and portable tooling are excluded from Git.

Verified during implementation:

- Targeted private-contract/evidence/CIDR/display checks: 35 passed.
- Portable archive verification regression tests: 2 passed, including tamper rejection.
- Original Python source-acceptance and private preview security checks: 15 passed.
- CIDR browser: six journeys, mobile/desktop × Free/Pro/Business, all passed; four boundaries and four invalid/recovery cases per journey, keyboard access, trust disclosures, entitlement and overflow checks; no unexpected traffic or page errors.
- Launch guards: 45 passed. Calculator/rule-pack certification guards: 15 passed.
- Lint: zero errors, 28 pre-existing warnings. Typecheck passed.
- Historical build claim corrected on resume: `build.log` ends at collecting build traces and contains no exit code or diagnostic. It does not prove success. The owner reported exit 1. Next's mandatory TypeScript configuration update is retained.

Initial runs exposed newline/hash failures, Python absence, Unix fixture assumptions and default locale differences. Those results are retained locally, not described as passes. The dated resume section below supersedes the earlier pending unit results and identifies browser/transport validation gaps.

## Engineering blockers

- Disposable PostgreSQL/PostgREST HTTP security and actual authenticated Next runtime journeys require Docker or an equivalent isolated database fixture. Docker is unavailable. The native security command was attempted and failed `spawnSync docker ENOENT`; no production database was substituted.
- Linux pinned-browser installer tests depend on `/bin/sh`, `dpkg-deb` and the Linux package format. Installed Windows Chrome is used for relevant browser journeys; Linux installer acceptance remains a hosted/Linux task.
- Physical-device, real authentication, provider sandbox and production-equivalent persistence acceptance cannot be inferred from synthetic browser fixtures.

## Resume verification — 2026-10-28

The original `evidence/build.log` contains successful compilation, TypeScript and 37-page generation, then stops at collecting build traces. It contains no error or exit-code record. The reported original exit 1 is therefore preserved as a failure with an undetermined cause; the earlier report's unsupported exit-0 assertion has been corrected. No source change is justified solely by that truncated log.

A fresh, non-overlapping `npm.cmd run build` reproduced exit 1 with a concrete diagnostic: `src/lib/draft-preview-server.test.ts(55,29)` and `(55,75)`, TS18047, `child.stdout` / `child.stderr` possibly null. The existing IPC stdio configuration selects a nullable child-process type. Added an explicit runtime guard requiring both pipes before listeners are attached. This fixes the demonstrated build defect without optional chaining away the test's output capture. Evidence: `build-resume-20261028.log`, `typecheck-resume-20261028.log`.

Additional exact resume changes:

- `scripts/draft-preview.mjs`: append an independent random suffix to each server's temporary Vite cache path. PID plus fixture alone collides when two servers run in the same process. The regression first failed on equal paths (`cache-red-resume-20261028.log`). Authentication remains independent per server; optimizer discovery stays bounded; no-store, origin, host, read-only method and source-access protections remain unchanged. Temporary cache cleanup is not added by this change.
- `src/lib/draft-preview-server.test.ts`: require distinct same-process cache paths while retaining the previous-token rejection; add the non-null pipe guard; correct the obsolete shared-cache comment. Retain the existing 15-to-60-second credential-readiness increase and 90-second CLI test budget. This is a polling deadline for local startup, not an application request timeout, cache TTL, credential lifetime or relaxed assertion. The successful CLI check took 16.999 seconds in the final focused run, supporting the larger startup budget on this machine.
- `src/components/registered-value-trust-integration.test.tsx`: recognize CIDR's Final renderer status and Methodology heading within the full 51-definition cohort. Retain exact engine output, calculator identity/version, scenario metadata, labels, every registered formula and every source assertion. The original cohort failure was reproduced by the preserved background partition run; all five tests now pass.

Existing private-contract/CIDR implementation was reviewed and retained, rather than recreated. Seven supplied-input contracts remain private; the 23 support bindings remain noncanonical and unauthorized for publication. CIDR retains reviewed identity/version, total-address semantics, boundary behavior and source trust; no certification status is promoted.

Fresh completed checks:

| Check | Result | Evidence under `evidence/` |
| --- | --- | --- |
| Private contracts, CIDR adapter/UI, certification/rule-pack guards | 45 tests passed, exit 0 | `focused-resume-20261028.log` |
| Preview authorization/cache/CLI and complete trust cohort | 14 tests passed, exit 0 | `integration-resume-20261028.log` |
| Portable evidence verification and owned-browser cleanup | 4 tests passed, exit 0 | `node-regressions-resume-20261028.log` |
| Typecheck after nullable-pipe fix | exit 0 | `typecheck-resume-20261028.log` |
| Serial `npm.cmd run lint` | exit 0; 0 errors, 28 warnings | `lint-serial-resume-20261028.log` |
| Final `npm.cmd run build` → `next build --webpack` | exit 0; compilation, TypeScript, all 37 static pages and build traces completed | `build-final-resume-20261028.log` |
| Existing background unit partitions, preserved to completion | 5,053 passed, 1 failed across 8 partitions; failed trust cohort subsequently passed above | `unit-partitions/all-exits.json`, `part-1.json` through `part-8.json` |

Exact focused commands (each from the existing Windows worktree; logs preserve output):

```powershell
node node_modules/vitest/vitest.mjs run src/calculators/private-supplied-contracts.test.ts src/calculators/final-framework/cidr-final-renderer-migration.test.ts src/components/cidr-tool.test.tsx src/calculators/launch-certification.test.ts src/calculators/rule-packs.test.ts --maxWorkers=2
node node_modules/vitest/vitest.mjs run src/components/registered-value-trust-integration.test.tsx src/lib/draft-preview-server.test.ts --maxWorkers=1 --testTimeout=30000
node --test tests/windows-evidence.test.mjs tests/windows-browser-cleanup.test.mjs
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

At the earlier resume cutoff, no simultaneous builds were started. The first fresh build exited before the final build began. Existing evidence was not overwritten; resume logs use separate filenames. The four changed resume files were still uncommitted at that cutoff: this report, the preview script, its security test, and the registered-value trust integration test. All other pre-existing modifications and background work were retained. No production operation, merge, deployment, payment, certification or publication was performed. RELEASE HOLD remains active.

The first cache-fix run retained all security checks but timed out in the default five-second two-server test (8 passed, 1 timed out). A rerun with `--testTimeout=30000` passed all assertions; no test assertion was removed. Measured memory availability during concurrent work was 365,176 KiB physical and 1,026,704 KiB virtual. Only this resume's first lint process was stopped to reduce contention (recorded exit -1); existing background work was not stopped. Subsequent lint/build are serialized. The focused success is not represented as a completely rerun all-green 5,054-test suite.

At that earlier cutoff, historical browser and transport failures remained QA gaps: `reference-browser-clean.log` reports 2 issues across 36 journeys and a Windows Crashpad EBUSY cleanup error; `transport-final.log` includes a missing CDP fixture `child.json`. Their closure is recorded separately below; the original failures remain intact.

## Windows QA closure — 2026-10-28

New evidence lives in ignored `evidence/qa-closure-20261028/`; none of the earlier evidence was overwritten. Real browser suites and builds run serially. The normal trust cohort ran separately from the one-worker complete unit verification. No Docker installation or production substitute was used.

### Demonstrated issues and corrections

1. **Reference Six document readiness.** The original failing BMI/Business/320 and break-even/Business/320 captures show an empty `interactive` document, `hasReference: false`, and source modules still loading. The first unchanged serial reproduction passed 36/36 (`reference-red.log`; its filename does not imply failure). A second cold-cache run reproduced three instances of the same failure on loan EMI/Free/320, SIP/Free/320 and loan EMI/Business/320 (`reference-final.log`, exit 1). These are not demonstrated formula or plan-entitlement defects. `Page.navigate` acknowledges a committed navigation before deferred module evaluation finishes. The runner now enables CDP lifecycle events and requires DOMContentLoaded for the exact new loader before starting its existing 20-second UI assertions. The document/module budget is 120 seconds, increasing total possible startup allowance from 20 to 140 seconds. There is no navigation retry, and a stale loader cannot satisfy readiness. A resource deadline or any subsequent UI/product/security failure still fails the journey. Regression tests enforce exact-loader selection and bounded missing-document failure. Final first run after this correction: 36/36 journeys, zero issues, exit 0 (`reference-lifecycle.log`); measured document loading was at most 8,099 ms in that run (`navigation-timings.json`). Every existing engine/headline, plan, export, network, recovery and accessibility assertion remains.

2. **Windows Crashpad cleanup.** The previous helper closed CDP, then force-terminated only Chrome's root process. On Windows that can leave renderer/Crashpad children holding profile files. A regression demonstrated that no graceful browser-close request was made (`cleanup-red.log`). The helper now sends one `Browser.close`, reserves its teardown reply handler, waits for its owned process to exit, then closes the channel and removes the unique profile. Bounded process termination remains a fallback for an unavailable/nonresponsive control channel. The former 20 filesystem-deletion retries were removed. Focused cleanup tests pass, including natural exit code 0 without a termination signal; the complete 36-journey browser run exited 0 after profile removal with no EBUSY error and no deletion retries.

3. **Missing CDP `child.json`.** The initial serial transport reproduction passed 10/10 (`cdp-red.log`). Deliberately delaying launcher JavaScript for one second while retaining the original 200 ms no-CDP deadline reproduced ENOENT deterministically (`cdp-delayed-red.log`): Node can be terminated before it writes a startup file. Failure diagnostics now retain the actual PID and unique profile owned by the parent, as successful startup diagnostics already did. The regression uses those parent-owned values, rather than assuming child JavaScript ran. It retains the 200 ms deadline and exact ESRCH process, ENOENT profile, failure-phase, absent-readiness and no-endpoint assertions. The delayed-launch regression passes without retrying or lengthening startup (`cdp-delayed-green.log`).

4. **Trust cohort under normal configuration.** `node node_modules/vitest/vitest.mjs run src/components/registered-value-trust-integration.test.tsx` passed all five tests with no worker, timeout or hook overrides (`trust-normal.log`). The exact 51-definition cohort, including CIDR's migrated rendering, remains asserted.

### Integrity and independent review

`protected-integrity.json` verifies 540 unique catalog identities, 424 acceptance records, all eight protected SHA-256 authorities, all five recorded implementation dependency hashes, and 76 SIP/Slope/private-draft historical files byte-for-byte against HEAD. The original Python archive verifier and portable Node verifier return exactly identical JSON (`portable-parity.json`). Review of substantive changes excludes generated `.next`, dependency, portable-tool, temporary credential, ignored evidence and downloaded browser artifacts from the engineering commit. The intentional contract inventory and PR reconciliation are retained as review evidence, not new acceptance authority.

The exhaustive `tracked-byte-audit.json` compares Git blob hashes for all 1,842 tracked files against starting HEAD `902f1ef9266fd70bfa2e01abba66971a712f202d`: 1,826 are byte-for-byte unchanged and exactly 16 contain the reviewed implementation/configuration differences. Thus the large original Windows status listing is not 1,784 substantive edits. Catalog data, acceptance ledgers, SQL migration history and historical formula/version files are not changed by the commit.

An independent read-only reviewer found no critical or important implementation issue. Their documentation note about the increased total resource-loading allowance was addressed explicitly in this report and `PLAN.md`. No canonical mapping, historical version, review status, certification or publication authority is advanced by these QA results.

### Final QA commands and results

The previously failed runs above remain part of the evidence, not replaced by their green runs. Final results under `evidence/qa-closure-20261028/`:

| Verification | Exact result | Evidence |
| --- | --- | --- |
| Complete applicable `src` unit suite | All 753 files executed in 8 serial partitions, one worker, default test/hook timeouts; 5,054 passed, 0 failed, 8 existing conditional skips; every partition exit 0 | `unit-all.log`, `unit-summary.json`, `unit-partitions/all-exits.json`, eight native Vitest JSON reports |
| Normal trust cohort | 5 passed, no worker/timeout overrides, exit 0 | `trust-normal.log` |
| Supplemental catalog opt-ins | 4 passed, 1 guarded skip, exit 0; executes the 3 available checks skipped by the normal suite | `catalog-opt-in.log`, `catalog-opt-in/` |
| Offline Node unit/security/evidence checks | 49 passed, 0 failed/skipped, exit 0 | `offline-node.log` |
| Final CDP transport | 10 passed, 0 failed/skipped, exit 0 | `cdp-final.log` |
| Final Reference Six browser | 36/36 journeys, 0 issues, strict loopback traffic, exit 0 including graceful profile cleanup | `reference-lifecycle.log`, `reference-lifecycle/reference-browser-report.json` |
| Final Business browser | 29/29 journeys, exit 0 including graceful profile cleanup | `business-final.log`, `business-final/business-browser-report.json` |
| `npm.cmd run lint` | exit 0; 0 errors, 28 warnings | `lint.log` |
| `npm.cmd run typecheck` | exit 0 | `typecheck.log` |
| `npm.cmd run build` (`next build --webpack`) | exit 0; compilation, TypeScript, all 37 static pages, build traces and route output complete | `build.log` |

The eight normal-suite skips were not introduced by this batch. Three can be enabled safely using the preserved repository CSV and an ignored output directory: 540-ID/domain coverage, source domain-count integrity, and an explicitly UNREVIEWED inventory export. They passed in the supplemental run. Its output reports 574 implementation entries separately from 540 master identities and sets mapping/publication/certification authority to false; it does not add catalog identities. The remaining five conditional checks require (1) a complete source-reviewed category mapping and slug-review ledger for audited reconciliation, and (2) Poppler for four independent PDF extraction/raster/metadata checks. Those are unmet prerequisites, not passes. No mappings or review authority were fabricated and no tests were disabled. Three Linux package-installer tests also remain outside this Windows run because `/bin/sh`/`dpkg-deb` are unavailable. Database/PostgREST and production-equivalent real-auth acceptance remain the separate environmental blockers listed above.

Exact complete-suite command: prepend the already present `.windows-tools/python` directory to this child shell's PATH, then run `node docs/windows-sprint/evidence/qa-closure-20261028/unit-runner.mjs`. The archived runner enumerates all `src/**/*.test.ts` and `src/**/*.test.tsx`, invokes native Vitest for each 100-file partition (last: 53) with only `--maxWorkers=1 --reporter=json --outputFile=...`, and retains native exit codes. It does not override test or hook timeouts, skip files, or retry failed tests. Each original default configuration is preserved. `unit-summary.json` validates all 753 file identities and all native exit/success results, and lists every conditional skip. `COMMANDS.txt` records the complete Windows reproduction commands, including explicit browser paths/artifact directories and all offline Node test files.

Supplemental command: set `CALCUMINT_MASTER_CSV` to the existing `data/catalog/master-catalog-2026.csv` and `CALCUMINT_INVENTORY_OUT` to the ignored QA `catalog-opt-in` directory, then run `node node_modules/vitest/vitest.mjs run src/calculators/catalog-full-evidence.test.ts src/calculators/catalog-inventory-export.test.ts src/calculators/catalog-master-integrity.test.ts --maxWorkers=1`. No audited-mapping output or review-ledger override is supplied.

### Local commit and owner package

All implementation checks above completed before staging. The requested engineering commit contains the preserved prior batch implementation plus these QA fixes and review documents; ignored raw evidence, tooling, caches, credentials and generated build output are excluded. The implementation SHA is recorded in a subsequent documentation-only receipt so the report can name an existing commit without a self-referential hash.

Staging encountered an existing zero-byte worktree `index.lock` (created at 04:36:41 local time). Process inspection found no active Git process, and the file was older than five minutes. It was moved intact into QA evidence as `stale-index.lock`, with path/timestamps/process check recorded in `stale-index-lock.json`; nothing was discarded. Staging then succeeded and `git diff --cached --check` passed. The staged change is exactly 41 reviewed files (16 existing implementation/config files plus 25 new source/review files), with no catalog data, acceptance ledger, SQL migration, historical version, generated build, dependency, credential or raw evidence file staged.

Owner package destination: `docs/windows-sprint/evidence/BATCH-01-QA-EVIDENCE-20261028.zip`, with adjacent `.zip.sha256`. The archive is generated after the report receipt commit and records both that HEAD and the engineering SHA in `review/RECEIPT.json`. It includes current QA reports, screenshots and synthetic downloads, exact command/runner records, original failure evidence, integrity audits, the reviewed source patch and commit metadata. `MANIFEST-SHA256.json` binds every payload entry. Packaging verifies ZIP CRCs and rehashes each entry before writing the archive checksum. No `.env`, browser profile, credential, dependency, `.next` or portable-tool directory is included. All previous local evidence remains preserved outside the archive as well. The archive/receipt are intentionally ignored rather than committed generated artifacts.

## External acceptance blockers

The unavailable original Blueprint attachment; canonical mapping/model selections; publisher-byte captures and complete applicable governing clauses; current jurisdiction/effective-period tax or statutory rules; issuer/provider/plan/institution contracts; qualified applicability decisions and genuine independent reviewer authority remain unresolved where recorded. The 424 acceptance records, 540 identities, historical SIP/Slope versions, original 14 private DRAFTs, 11 retained qualified cases, pending decisions and operational publishing gates are not promoted by this batch. The prospective review policy is not activated in production.

## Next substantial implementation tasks

1. Run pinned isolated database, RLS/transport and authenticated native Next journeys on an authorized Docker-capable Windows or Linux environment, using the exact reviewed head and preserved local changes.
2. Resolve per-ID full contract selections against substantive source clauses; then implement distinct calculator accounting/recurrences and actual-engine goldens for the selected 23-case profiles. Supplied ledger reuse alone cannot define these products.
3. Complete source/provider/rule-pack gaps for the other 27 cases in the 50-case package and preserve the separate 9 missing-source/11 retained-qualified cohorts. Do not manufacture rates, eligibility, denominator definitions or safety models.
4. Obtain genuine independent acceptance and the original Blueprint reconciliation before any later certification submission. Publication remains a separately authorized future action under RELEASE HOLD.
