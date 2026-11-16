# Updated b7 exact-head source critical-path diagnostic

One root-authorized advisory attempt, original seven CLI files/concurrency2/owned150000ms, at clean opening and closing b7a7c176cf6a2349a468d10ce30c25552835de5e. All seven original physical module hashes were unchanged. The previously smoke-validated instrumentation only adds file lifecycle logging and replaces current.test.mjs's execFile import with strict argument/options/callback/return-ChildProcess forwarding. Child source proofs do not inherit the loader or NODE_OPTIONS. No repository source changes, deadline increase, test retry or P0 probe occurred.

The run FAILED its original outer150s budget:150086.061ms including owned cleanup. Buffered TAP contained96PASS/0FAIL and no final summary. Those96 printed case durations sum135475.954ms, comprising seven application cases50009.616ms and the current owner's first89 cases85466.338ms. Summed test times overlap across files and are not the parent wall time. Prefix96 alone hid a genuine child failure.

## Genuine nested failure and barrier

Scope child8 started86.624s and was terminated by the unchanged30000ms child limit after30053.517ms (SIGTERM,killed=true). It printed no TAP or stderr before termination. This is one observed child timeout, not ten observed assertion failures or ten skipped controls. Scope's ten planned cases have no completed passing receipt here. The parent buffers reporting until every mandatory result is collected, so this failure never reached the96-case prefix before the outer timeout.

Preload child9 started86.640s and completed101.059s, all6PASS. The22 fixed light children ran101.076–104.560s, all passed. Their work consumed3.484s; the freed lane then waited12.107s for scope to settle. Heavy work began116.681s. Thus the actual light-only lane still leaves a measured12.1s idle barrier and did not keep scope within30s under the full original seven-file overlap.

Historical-group ran51.032–112.966s; it overlapped26.342s of the scope lifetime. Diagnostics then ran113.131–139.831s and overlapped the remaining3.536s. These lifecycle intervals establish overlap, not a measured causal CPU attribution or proof of lock waiting. Both sibling files passed.

## Factory and tail

Nested60case proof ran2.228–31.301s (29.073s wall), all60PASS under45000ms. Factory personal4 ran38.169–84.065s (45.896s), all4PASS under60000ms; four companions all passed by52.974s. Mandatory cold availability ran85.952–86.622s, all5PASS with its original eight-worker contract. Factory lane had no current-owner child after52.974s until personal completed84.065s; no scheduling change is proposed by this diagnostic.

Expected47 asynchronous launches=nested1+factory5+mandatory41. At deadline42 launched,40 callbacks completed. One callback failed (scope); all39 other completed callbacks succeeded with zero typed TAP failures/skips/cancellations. Of mandatory41,34 completed:33pass files/270passed controls plus the scope timeout;2active files/16planned controls and5unlaunched files/36planned controls remain. All332planned mandatory controls remain in the roster; this run is incomplete and failing.

Heavy timings: Stage6 4.393s, runtime auxiliary15.642s, API anchor7.944s, retainedStage7 7.808s, current26 9.397s, unchanged raw current32 10.010s, transport23controls4.356s. Lineage child39 started146.095s and was active at150s; negative-current-src child42 started149.781s and was active. Unfinished exact identities:

- tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs — active-killed-by-outer150;9 planned cases
- tests/parallel-source-20261110/source-lock-scope.test.mjs — not-launched;9 planned cases
- tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs — not-launched;5 planned cases
- tests/next-engineering-20261115/source-private-git-lifecycle.test.mjs — not-launched;6 planned cases
- tests/milestone100-20261114/source-stage8-runtime-current-selection.test.mjs — not-launched;7 planned cases
- tests/next-engineering-20261115/source-lineage-native-contract.test.mjs — active-killed-by-outer150;7 planned cases
- tests/next-engineering-20261115/source-clone-availability.test.mjs — not-launched;9 planned cases

## Seven-file lifecycle

| File | Start seconds | Exit seconds | Code |
|---|---:|---:|---:|
| application-successor.test.mjs | 0.340 | 50.369 | 0 |
| current.test.mjs | 0.368 | active at150s | None |
| git-reader.test.mjs | 50.591 | 50.915 | 0 |
| retained-vitest.test.mjs | 140.070 | 140.092 | 0 |
| source-object-lock.test.mjs | 140.517 | 146.125 | 0 |
| retained-vitest-diagnostics.test.mjs | 113.131 | 139.831 | 0 |
| historical-group.test.mjs | 51.032 | 112.966 | 0 |

All six siblings exited0 by146.125s, so only current.test.mjs was active at deadline. The previous f490 Stage6/common-lock plateau no longer appears: Stage6 finished121.074s, well before source-object-lock started140.517s. The actual common-directory lock test ran140.517–146.125s and overlapped raw current32/transport/lineage windows. Raw current32 sampled subtree CPU rose continuously~1core (3.100CPU-seconds at140.037s→8.900 at146.070s), with no earlier Stage6-style multi-second plateau. This trace does not show a new lock bottleneck or record native lock acquire/release events; do not weaken locks based on overlap alone.

746external200ms/proc samples record sanitized module basenames without environment or inline code. CPU figures are advisory aggregation, not exact rusage. Local cpu.max400000/100000 allows four CPUs; queue worker counts are not hardware counts. Owned PGID2254020 has no live members after cleanup. Ten orphan zombies remain underPID1, recorded in summary; they cannot consume CPU and were not silently claimed reaped. Cleanup emitted two preserved-lock ENOENT notices for already-absent temporary directories; original result records them transparently in session output.

Artifacts: result.json,input-manifest.json,command.json,events.jsonl,processes.jsonl,critical-path-summary.json,file-timeline.csv,child-timeline.csv,mandatory-plan.csv,prefix96-timings.csv,raw-current32-lock-overlap.csv,all42childstdout/stderr. This is advisory critical-path evidence, not qualification. All20 remain IMPLEMENTED_NOT_QUALIFIED;baseline81;RELEASE HOLD ACTIVE.
