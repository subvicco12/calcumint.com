# Read-only full-product hosted comparison

Compared exact f49065b2ff40abb6593a7e480033413b7e34899c run43855812996 (full-product PASS,17m10s) with7ebdf0412619b8414e8c20b091f4fd9872c41f03 run43864330963 (full-product cancelled,20m17s including cleanup). The check annotation explicitly states20m0s maximum exceeded. This is diagnostic evidence, not qualification.

Setup before first functional command increased34.081→37.360s. The source-fetch/availability step increased3.607→4.817s(+1.210s). Batch21 began775.842→1014.718s after the first job log(+238.876s). Setup cannot explain most of this increase. No logged clone command/timing permits attribution to561local availability refs; repeated downstream Git/clone cost is unmeasured.

Completed functional steps have identical logged commands and generally identical result-line counts, with broad elapsed-time increases. Largest completed step increase is Owner-authorized P0 implementation226.590→310.055s(+83.465s). Its205-case Node suite passed all205 on both heads with no skips/cancellations;174.742→235.038s. Five Git-bound cases account for the measurable case-time growth; all other200case absolute differences are≤9.068ms.

| Case | f490 seconds |7eb seconds | Increase seconds |
|---|---:|---:|---:|
| historical mathematical closure remains exact with explicit Git-bound caller and financial successors | 100.042 | 130.044 | 30.003 |
| src/app/business/api/page.tsx: caller successor verifies original and successor Git objects | 46.538 | 70.103 | 23.565 |
| src/app/business/api/page.tsx: tampered caller is rejected with original historical claim | 40.888 | 62.055 | 21.166 |
| src/app/business/page.tsx: caller successor verifies original and successor Git objects | 43.440 | 52.508 | 9.068 |
| src/app/business/page.tsx: tampered caller is rejected with original historical claim | 43.531 | 49.901 | 6.370 |

The four caller cases execute sequentially in caller-successor.test.mjs:174.397→234.567s, effectively setting that Node suite's critical path. The historical closure case in bindings.test.mjs runs in another file; its130.044s is below that235.038s critical path. Optimizing only historical closure would not remove the current sequential caller bottleneck.

Batch21 logged318 completed journey markers and a passing final summary on f490;7eb logged210 markers, exactly matching the first210 slug/width pairs, and no passing final summary. Matched first→210th marker span121.901→192.095s. These are partial cancelled-run observations, not a completed197-second Batch21 measurement. Batch22 and Six proposed target steps did not run on7eb. Preserve earlier valid functional receipts while requiring new mandatory full-product success.

Both used ubuntu26.04 image20261111.196.1,Node22.23.4,Chrome156.0.8078.47. Regions differ (southcentralus/westcentralus); no CPU/load metrics prove a hardware/network cause. Browser/setup source or runtime cause remains unproven.

## Exact Git-bound target and constraints

- tests/p0-decision-contracts/bindings.test.mjs:21 historical closure loops verifyDecisionBinding; Business paths dispatch via caller-successor.mjs to verifyCurrentBusinessCaller.
- tests/p0-decision-contracts/caller-successor.test.mjs:11–12 generates the four costly positive/tamper cases for Business page and Business API page. It also retains original-claim, rewritten-hash, reversion and fixed native-frequency provenance controls.
- tests/publication-workflows-20261109/business-caller-successor.mjs:395 default sourceGit uses raw execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:8MiB}), where root is fixed new URL('../../',import.meta.url). It is an args-only private default, not an inherited-cwd generic executor. No encoding/env/timeout parameter is declared.
- All75 literal currentSources records, historical commit/blob/hash bindings, HEAD object reads, physical bytes, order and currentRead tamper override must remain intact. Existing proveNamedCurrentContext runs once per verifier invocation on changed admitted source; do not memoize across invocations or reorder its assertion path. Supplied read/git callbacks must remain opaque and untouched.
- The helper is governed by runtime-current-anchor.mjs original blob cd940dc337c890d08f1df525ec9ef0960df4bcf1 / SHA6a7492fd97b62762afb61b7d5aff7c8157b1f19c1545698335049bc82631dd27. That verifier permits a successor only through complete verifyParallelSource admission, while retaining original Git bytes. Older next-five fixed anchors remain literal too. New additive admission would be necessary; do not rewrite old hashes or retained raw verifier bodies.

A possible future focused diagnostic is a read-only loader pair for one exact Business API positive case, changing only the private default constructor to existing privateGitBuffer with the identical fixed cwd (fileURLToPath), stdio and8MiB options. Compare every argv/result observation and existing assertion outcome. Keep unsupported queries on the existing direct fallback, with no retry, caching, new preload or caller callback adaptation. This has NOT been run and is NOT an approved code change. Existing helper has15s startup/180s relay bounds, whereas P0 cases have no explicit≤150s owned budget: task-specific bounded equivalence must be independently justified before adoption; do not claim global unbounded execFileSync equivalence.

No repository changes or new CPU tests were made for this comparison. Source115 recovery takes priority; root explicitly deferred the P0 probe.

Artifacts: summary.json,step-comparison.csv,p0-case-comparison.csv,parsed-steps.json and analyze.py in this directory. Durations use first logged step line→first next-step line, including small transition overhead. Cancelled windows are partial. Raw source log hashes are recorded in summary.json.
