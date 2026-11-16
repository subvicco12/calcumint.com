# Bounded verification performance: NO_SAFE_OPTIMIZATION

**Result: NO_SAFE_OPTIMIZATION for the single candidate examined. Investigation stopped. RELEASE HOLD ACTIVE. Confirmed engineering overlay81 is unchanged.** This is not a claim that no conceivable optimization exists.

Baseline: previous Worker2 diagnostics `3723ef1b6a8b92aedba74eef81767c600ff87406`. The native observation kernel is read from Worker3's pinned source `419d56c17ca72dae58132aa00c7424b07477aa6c`, path `tests/next-engineering-20261115/source-stage10.mjs`. Live bytes are checked against the exact Git source before fixture construction. Remote code/evidence heads were observed unchanged at419d56c1/4a895fcb at investigation start. No Worker3 file, active branch, calculator, admission manifest, deadline, negative assertion or PR1538 was modified.

## One hypothesis, independent fixtures

The proposed reduction was to reuse native Git root/status-with-HEAD/index observations across later proof boundaries. No existing API/UI/source-child or hosted-CI diagnostics were repeated. No full suite or hosted CI was run.

The fixture extracts the literal `native(input)` and `nativeStatusHead(bytes)` function bodies from the pinned source, injects a disposable repository/root and fixture policy codeRef, and executes actual Git commands. The `fresh` mode runs all observations; the rejected `reuse` mode memoizes only the native root, porcelain-v2 status and index-flag calls. Supplied Git callbacks, final supplied HEAD comparison and real immutable object checks still execute. This is an isolated kernel experiment, not full Stage10 proof/admission or acceptance. It does not model the complete original native reader's existing immutable-query caches.

Each fixture is a newly created Git repository in `/tmp` with a committed source file and an ignored source path. All fixtures are removed in finally blocks. No application worktree, common Git directory or source-availability lock is used as a mutation target.

## Equivalence fails despite a measured speed gain

Two reproducible counterexamples reject the proposal:

1. After a clean observation, create `src/ignored.tmp`. Fresh native porcelain-v2 with `--ignored=matching` refuses the new ignored source. Reused native bytes remain clean; the still-fresh supplied porcelain query excludes ignored files and does not rescue the check. The rejected mode accepts.
2. A supplied status callback sets the real `skip-worktree` flag. Fresh native `ls-files -v` sees `S` and refuses it. Reused index bytes still say `H`, so the rejected mode accepts; a later supplied HEAD callback restores the flag before closing checks. A later clean observation cannot recover this lost refusal.

These tests **pass by requiring the unsafe acceptance to be demonstrated**; they do not label the optimized verifier safe. Other targeted cases preserve ordinary dirty-source and moved-HEAD refusals, recheck commit/blob content on every call, reject substituted object bytes, and hold a real `.git/index.lock`: an actual `git update-index` writer fails on that lock and neither mode removes or changes it. The immutable checks are fixture attestations added around the extracted native kernel, not a replacement for full production source proofs.

The paired profile uses Node22.23.4, four fresh repositories, alternating mode order and six observations per mode. The first cache fill is included. Median six-check times: **fresh207.210ms, reuse153.692ms**. Every pair records54 versus39 Git calls, including12 fresh immutable-object reads in each mode. Raw argv/call durations are in `receipts/profile.json`. This saving is rejected because equivalence failed. It is not evidence of meeting the API5-second, source-child or hosted20-minute limits.

## Targeted receipts and stop boundary

- `receipts/equivalence-corrected.log`:8 passed,0 failed,0 skipped;1212ms total. Tests cover honest agreement, ignored-source/index-flag counterexamples, dirty-source and HEAD observations, actual index-lock contention, blob substitution and commit substitution.
- `receipts/profile.json`: four paired samples with complete subprocess counts and durations; result explicitly NO_SAFE_OPTIMIZATION.
- `receipts/lint.log`: focused lint exit0. Three Node syntax checks exit0.
- Initial `receipts/equivalence.log` retains eight harness failures caused by a missing injected `headArgs` constant. The dependency injection was corrected; neither kernel body nor any safety assertion changed.

Reproduce from this branch with Node22 and Git available:

```sh
node --test tests/worker2-verification-performance-20261116/equivalence.test.mjs
node tests/worker2-verification-performance-20261116/profile.mjs
```

Only new `tests/worker2-verification-performance-20261116/` and `docs/worker2-verification-performance-20261116/` paths are delivered. These paths were absent from the pinned Worker3 tree before creation. There is **no corrective patch**, no proposed current-state cache and no acceptance promotion. Existing API/source-child/whole-job bottlenecks remain with Worker3; their present repair state was not requalified or inferred from this experiment. No additional hypotheses will be investigated in this task.
