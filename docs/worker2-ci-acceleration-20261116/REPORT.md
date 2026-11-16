# Independent CI and acceptance acceleration — Worker 2

This bounded investigation reproduced the publication assertion, API/UI deadlines and source-child deadline at Worker3 code `419d56c17ca72dae58132aa00c7424b07477aa6c`. It delivers an unapplied, literal-tested publication selector patch and reproducible performance diagnostics. No existing application or verification source changed. **All20 candidates remain implemented-not-qualified; RELEASE HOLD ACTIVE.**

## Ownership and isolation

Worktree `/workspace/worker2-ci-acceleration`, branch `engineering/worker2-ci-acceleration-20261116`, based exactly on the supplied Worker3 code SHA. Before changes, both code/evidence trees were checked for the new Worker2 paths (none existed), and Worker3's changed-file sets were recorded in `receipts/worker3-owned-*-paths.txt`. The four directly implicated shared files are changed on Worker3's code branch. No release of ownership was available, so all existing files remained read-only. The only proposed existing-file correction is a `.patch` artifact; its test applies to a temporary copy outside any active worktree.

No Worker3 branch, PR1538, calculator implementation, exact source/version binding, historical engine, deadline, negative security/auth assertion, Git source guard, genuine-auth source or canonical count was modified. No full local suite, hosted CI dispatch, auth/browser acceptance, production operation, merge or deployment was launched.

## Root causes and exact affected files

| Failure | Reproduction and cause | Exact relevant files |
|---|---|---|
|Publication source-reference assertion|Original standalone case fails with actual174c42d1 versus expected1f4b9885. Current admitted receipt-fixture records supersede the sprint fixture, but the local preflight selector omits `sourceStage10ReceiptFixture`. It therefore chooses a stale guardRef even though the correct ref/path/blob/hash is available.|`tests/source-lineage-bootstrap.test.mjs:45`; `tests/milestone100-20261114/source-preflight-stage8.mjs:51`; receipt capture `docs/next-engineering-20261115/source/guard-capture-receipt-fixture.json`; producer `tests/next-engineering-20261115/source-admission-receipt-fixture.mjs`.|
|Source-acceptance job timeout|Hosted job exhausts its unchanged20-minute budget during a serial unfiltered suite. Source-proof wrappers consume a substantial fraction of that budget and already have nested timeout failures. Original focused Node22 reproduction independently hits150000ms child limit (150109ms observed), including a60359ms personal child failure and Stage9 child timeout inside the factory queue. This is proof-work amplification/insufficient measured execution budget, not evidence that assertion failures passed or that stdout froze.|`.github/workflows/ci.yml:101–135`; `vitest.config.ts` maxWorkers1; `src/lib/parallel-source-evidence.test.ts` first150000ms child; `tests/parallel-source-20261110/current.test.mjs:157–182` personal60000ms/Stage915000ms queue; `tests/completion-first-20261112/personal-stage.test.mjs`; `tests/four-worker-integration-20261115/source-stage9.test.mjs`.|
|API proof exceeds5000ms|Original targeted Vitest case fails; advisory real-proof execution also exceeds limit. Successful trace shows413 Git calls /7376ms subprocess time; mutable status, HEAD/root and index checks dominate. Object/tree priming is already implemented and cannot remove this remaining work. No failed numerical/API output assertion was observed in the completed advisory body.|`src/lib/five-full-contract-evidence.test.ts` genuine-five-API case; `tests/next-cohort-20261110/source/runtime-evidence-batch-api.mjs`; `tests/next-cohort-20261110/source/retained-runtime.mjs:493–602`; `tests/parallel-source-20261110/core.mjs`; Stage8/Stage10 proof dependencies.|
|UI/PDF proof exceeds5000ms|Original targeted Vitest case fails; its body hashes five retained source claims through the original per-read resolver and executes complete current proof work. Successful trace shows377 Git calls /6356ms subprocess time, again dominated by mutable observations. This case checks retained UI/PDF evidence, not a live browser/render operation.|`src/lib/five-full-contract-evidence.test.ts` visible-interface/PDF case; `tests/next-cohort-20261110/source/retained-runtime.mjs:497–527`; `docs/five-interface-qa-20261109/browser.json` source-hash roster; Stage8/Stage10 proof dependencies.|

Hosted evidence is retained verbatim from Worker3's evidence branch and exact run43734620606. The GitHub connector independently confirmed actual job/step outcomes: source-acceptance cancelled during unit tests; publication-factory failed in the six-candidate step; build/checks/full-product succeeded; aggregate failed. The commit-runs connector filters PR events and returned no runs for this workflow_dispatch execution; the explicit run-id job lookup established its actual status. No CI job was rerun.

The hosted log contains378 completed outer file records (375 pass,3 fail),924331ms summed body durations. Those counts exclude nested TAP durations and omit undiscovered/uncompleted results. The source job was1215s from start to cleanup, and its unit log spans approximately1164s. Roughly240s beyond recorded outer bodies includes collection/transformation/other overhead and cannot be assigned entirely to one unmeasured mechanism. The previous green baseline job already spent1090s in unit tests. No CPU, network, missing-object, lock-corruption or transport-hang cause is invented from wall time alone.

## Corrective artifact and safe-optimization boundary

`publication-selector.patch` prepends only the already governed receipt fixture to the existing priority selector. Five selector tests reproduce the bad join, prove the proposed exact Git records, reject wrong refs/unknown paths, preserve the old fallback and apply the **literal patch** to a disposable baseline copy. The literal-patch check was added following independent review. Full acceptance after application is **not claimed**: the owner must admit the exact guard successor and rerun all original source/negative tests. The original branch still correctly reproduces the failure.

The new profiler merely wraps `execFileSync` for timings/counts and forwards original arguments, options, return values and errors. It neither caches outputs nor removes calls. Unit tests confirm binary output, duplicate execution, thrown errors and hosted-log parsing without nested-TAP double counts. It does not replace a source-integrity guard.

The advisory probe transpiles the unchanged API/UI file, redirects its test-framework import to equivalent Node assertions and executes the selected original synchronous callbacks with their actual dependency modules at original URLs. It records2920ms collection,10055ms API and8352ms UI; assertions pass. These values are diagnostic, not original Vitest acceptance or a new deadline. Raw trace `receipts/external-profile-success/subprocess-*.json` separates collection/API/UI. Collection already primes59 Git calls (2241ms subprocess time). API has only one ls-tree, two diffs and one cat-file subprocess left; UI has one ls-tree and two cat-file calls. Adding another immutable tree cache is not supported as a solution to several seconds of excess mutable proof work.

No safe additional optimization with a demonstrated deadline win was established. Opening/closing proofs, supplied-reader observations, native index/status/HEAD fences and per-read physical checks cannot be treated as redundant simply because their argv repeat. Existing adversarial callbacks can mutate or restore state at those boundaries. A new owner-reviewed lifecycle design may be investigated, but blanket current-verdict reuse, deadline increases, case removal or replacing genuine authentication are not proposed.

## Targeted receipts

| Run | Actual result |
|---|---|
|Original standalone publication source case|Failure,25026ms; exact hosted ref mismatch (`publication-red.log`).|
|Original API/UI Vitest cases, Node24.19.0|Both fail5000ms limits,9419ms and8137ms (`api-ui-baseline.json`).|
|Original API/UI Vitest cases, Node22.23.4|Both fail5000ms limits,9186ms and8273ms (`api-ui-node22-profiled.json`). Parent preload trace had zero calls and is not used for cost attribution.|
|Original source child case, Node22.23.4|Failure,150109ms (`source-child-node22.json`), nested TAP retained in failure messages.|
|Original-body advisory profile, Node22.23.4|Selected assertions pass, original deadlines not enforced by this diagnostic (`external-profile-success/proof.json`). Original Vitest failures remain failures.|
|Worker2 patch/profiler/analyzer tests|7 pass /0fail (`diagnostics-patch-artifact.log`).|
|Focused lint|Exit0 (`lint-artifact-final.log`). A CommonJS-preload-only require-import style exemption is documented; no acceptance assertion or source policy was waived.|

Retained diagnostic failures: initial advisory adapter lacked `toContain`; the next run was correctly refused because concurrent new receipt files changed complete Git status; a parent-only preload did not instrument Vitest workers; initial lint reported CommonJS import style. Final probe outputs were moved outside the worktree, the assertion adapter was completed, and the final diagnostic/lint tests passed. None is hidden or converted to an acceptance pass. Profiles containing an empty or partial trace are not used for final attribution; see `profile-success-summary.json` only.

Original targeted commands (use an external output directory and run sequentially):

```sh
node --test --test-name-pattern='standalone exact bootstrap' tests/source-lineage-bootstrap.test.mjs
node node_modules/vitest/vitest.mjs run src/lib/five-full-contract-evidence.test.ts -t 'retains genuine five API|retains visible-interface' --reporter=json --outputFile=/tmp/worker2-api-ui.json
node node_modules/vitest/vitest.mjs run src/lib/parallel-source-evidence.test.ts -t 'executes fresh current-source' --reporter=json --outputFile=/tmp/worker2-source-child.json
node --test tests/worker2-ci-acceleration-20261116/selector.test.mjs tests/worker2-ci-acceleration-20261116/diagnostics.test.mjs
```

Use the pinned Node22 path recorded in HANDOFF.md for comparable runtime. No test timeout or job limit was raised. Dependencies were reused only for focused diagnostics; no dependency/lockfile update was made.

## Remaining blockers and intake

Owner-governed admission and full targeted validation of the publication guard correction remain required. API/UI, nested-source and whole-job budgets remain unresolved. No new calculator, source, authenticated, full-product or hosted qualification is claimed. See HANDOFF.md for conflict-free intake: only new Worker2 paths are committed; the existing-file patch is an unapplied owner handoff, not a silently modified Worker3 source.
