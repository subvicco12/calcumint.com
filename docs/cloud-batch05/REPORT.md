# Cloud Batch05: private calculator contract integration

RELEASE HOLD remains active. No merge, deployment, production operation, live payment, certification or public calculator publication.

## Baseline and implemented outcome

PR1487 metadata and fetched `refs/pull/1487/head` both verified exact baseline **b983595a878353ad9afc5798bd003246be5c71a7**. Created isolated worktree `/workspace/work/calcumint-batch05`, branch `engineering/cloud-batch05-20261029`, directly from that commit. Prior Batch04 worktree, original `work` branch and all earlier committed work remain preserved. Hosted CI40849013977 SUCCESS is supplied completed evidence; it was not polled, repeated or monitored.

Implemented **nine complete private supplied-scenario contracts** with strict validation, bounded financing/cashflow traces, methodology, immutable version/source/dependency-bound export and actual-engine replay:

| Master ID, engineering support only | New private v1 ID | Functionality |
| --- | --- | --- |
|21|`private.financial.21`|Existing debts versus consolidation; principal conservation, explicit financed/upfront fees, capped payments, terminal debt and matched present costs.|
|32|`private.financial.32`|Rent versus financed purchase; initial equity, rent refund, running costs, terminal sale/selling costs/debt and discounted comparison.|
|36|`private.financial.36`|Rental collected income and NOI, separate financing/capex/unspent reserves, owner cashflows and exit equity.|
|43|`private.financial.43`|Holding-period ROI with all initial/interim/exit contributions and distributions, signed profit and null zero-denominator result.|
|46|`private.financial.46`|Flip profit including separate rehab, acquisition equity, finance, holding, sale costs and payoff exactly once.|
|49|`private.financial.49`|Mortgage/rental trace with interest, principal repaid, terminal debt, NOI/cashflow/reserve reconciliation and present cost.|
|468|`private.financial.468`|Purchase upfront/period cash needs against supplied budgets, first/max shortfall and separate exit-equity disclosure.|
|470|`private.financial.470`|Disclosed lease payments/upfront/end charges versus financed purchase and terminal sale; no money-factor inference.|
|472|`private.financial.472`|Financed versus all-cash purchase on matched running/sale assumptions, separate upfront costs and full traces.|

This is the largest selected coherent remaining financing/property group in the preserved50-case evidence. It derives product-specific ledgers rather than renaming generic components. Existing seven supplied contracts, three workflows, Batch03 profiles and Batch04 engine are reused/preserved. Selected scope excludes tax/depreciation, legal fee/lender policy, inferred rate conversion, invoice rounding and full original catalog acceptance. **Canonical completed calculator count remains0.** See METHODOLOGY.md and contract-assessment.json for exact scope and original unclosed decisions.

## Integration and parity

Each contract uses the same calculation path and precision for Free/Pro/Business. Exports contain validated inputs and recomputed actual-engine outputs; original source-observation hashes, profile version and immutable ledger-dependency version are pinned. Import rejects unsupported identity/version, altered input/output/source/dependency and unknown fields. Shared copy logic detaches/freezes nested snapshots and history. No plan enters exported mathematics.

The new private loopback fixture offers labeled input, method and source limits, full results/traces, invalid recovery, stale-result/export clearing,20-entry tab-local immutable history and real JSON downloads. It uses the existing Basic-authenticated reviewer server, with no public registry/route or production account/persistence change. Synthetic plan selection verifies mathematical parity, not subscription-provider acceptance.

## Fresh validation

| Check | Verified result |
| --- | --- |
|Original source evidence verifier|Exact50 identities,97 root/76 nested manifest entries,42 observation hashes;31 readable observations,9 missing-source cases and11 retained qualified cases; passed without inventing approvals.|
|New focused engine/UI tests|47 passed:36 author contract tests,9 independently derived actual-engine goldens and2 component tests.|
|Final full unit suite|`npm test -- --maxWorkers=2`, supported execution: exit0;761 passed files,2 skipped files; **5273 passed tests,4 existing conditional skips**,0 failures.|
|New actual Chromium acceptance|**54/54 journeys**:9 contracts×3 plans×320/1280px; trusted keyboard selection, actual downloaded JSON replay, cross-plan/viewport identical exports, input errors/recovery, stale results/history and labels/overflow; no unexpected requests or page errors.|
|Existing native Next acceptance|**62/62 journeys**, actual Next dev webpack, synthetic JWT-verifying identity, disposable DB; exit0 and all fixtures cleaned up.|
|Disposable PostgreSQL17.6/PostgREST security|Eight named HTTP/security checks plus schema/RLS/ACL dependency preflight; exit0. No production database used.|
|Node transport/readiness/evidence cleanup|20 passed,0 failed/skipped.|
|Launch guards|45 passed.|
|Calculator/rule-pack certification guards|15 passed; no certification operation.|
|Final full lint|Exit0;0 errors,28 existing warnings.|
|Final typecheck|Exit0.|
|Final `next build --webpack`|Exit0; compilation, TypeScript,37 static pages and traces completed.|
|Independent review|No outstanding Critical/Important finding after the demonstrated decimal defect was fixed; see INDEPENDENT-REVIEW.md.|
|Baseline preservation|1909 baseline files byte-unchanged; only existing changed file is four additive CI lines for new private browser acceptance. All eight protected authority hashes and five historical dependency hashes match. Catalog540 unique identities; acceptance ledger424 rows. All14 original private DRAFTs, SIP/Slope and historical versions unchanged.|

Dependencies were reused through a temporary local symlink, with Next16.3.5, Zod4.6.5, Decimal10.6.0, Vitest3.2.7 and React19.3.0 verified against committed lockfile. Dependency/configuration locks were not changed. Temporary symlink is removed before final delivery. Unit opt-ins remain unchanged; no test or security assertion disabled.

## Demonstrated defects and retained failures

Independent review found ID21's initial exact binary principal comparison rejected valid0.1+0.2→0.3 input. A separately authored regression failed; author reproduced the failure, then used a private400-digit decimal context for strict declared-decimal principal conservation. Unexplained0.31 remains rejected. Independent review confirmed the fix. All47 new tests and final54 browser journeys passed afterward. Financial calculations otherwise retain the declared finite unrounded arithmetic contract; no global Decimal state changed.

Initial engine/UI test runs failed before new modules existed. One initial UI assertion matched multiple RELEASE HOLD paragraphs; the assertion was corrected to allow both legitimate disclosures, without removing production warnings or behavior.

The first full run in default sandbox retained5251 passes/3 failed tests/23 skips with5 failed files and2 unhandled EPERM errors: preview-server suites `catalog-preview-server`, `draft-preview-server`, `final-rc-preview-security` could not listen on local sockets; `source-acceptance-evidence` and `source-driven-evidence` could not spawn Python/Node verifiers. Re-running the identical suite with supported execution permissions produced the clean5273/4 result above. No production code, timeout or assertion was changed to hide those environment failures.

Raw logs/reports/screenshots/downloads remain under `/workspace/work/cloud-batch05-evidence/`, outside Git: `red.log`, `ui-red.log`, `decimal-red.log`, `decimal-green.log`, `full-unit.log`, `full-unit-supported.log`, `browser-final.log`, browser/run-*/report.json, `next-runtime/next-runtime-report.json`, `security/security-report.json`, `transport.log`, `launch.log`, `certification.log`, `lint-final.log`, `typecheck-final.log`, `build.log`. These workspace artifacts are not claimed permanently hosted. Committed methodology, tests, source/gap register, integrity and implementation hashes travel with the branch.

## Remaining release blockers and delivery policy

All50 original owner/full-product, source-byte/normative-version/effective-period, canonical mapping, provider/institution/jurisdiction and qualified applicability decisions remain preserved. Tax/depreciation, retirement safety and institutional contribution/distribution rules are not inferred. Marketplace198/Etsy199 remain unimplemented as provider-specific schedules; no authenticated fee/effective-date evidence was supplied. Values and budgets are scenario inputs, not underwriting, investment guarantees or qualified advice.

Native identity acceptance uses a synthetic JWT-verifying provider, not GoTrue signup/recovery/refresh/MFA/email. Physical-device, real lender/provider, production-schema/platform and installed-equipment equivalence remain unverified. Engineering review does not close qualified applicability review. Certification/publication still require separate authority and explicit lifting of RELEASE HOLD.

Commit SHA/draft PR/CI receipt are reported after committing in delivery metadata, avoiding self-reference. Open a separate stacked draft against Batch04 branch, then perform exactly one new-head CI status check; report queued/running status without waiting. No completed CI monitoring or production operation is authorized.
