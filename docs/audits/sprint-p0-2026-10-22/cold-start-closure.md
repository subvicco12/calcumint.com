# Hosted cold-start investigation — development evidence only

PR #1467 investigation started from `ae84b48a842b3e0347cd92854c18fcb59cadea2b`, a descendant of sprint base `71261465c877eab27e48c70605dd5435d87eda77`. Sprint H0 remains 2026-10-22 16:42:22 UTC. The same-owner auth fixture correction is preserved. No application, mathematical contract, calculator, SQL or publication source is changed.

## Demonstrated failure and scope of root cause

Original exact-head CI run **39820033548**, job **119968567032**, failed the first Chromium launch in the SDK continuity regression: `No Chromium CDP`. All eight later transport tests passed. Lint, typecheck and eight disposable database security checks passed; downstream runtime/unit/browser/build stages were skipped. Five companion workflows passed.

A separate diagnostic branch preserves instrumentation and experiments without advancing the PR or rerunning its exact-head CI. Linux phase/resource evidence reproduces the hosted startup failure on the **same Ubuntu image 20261021.345.10 and Chromium 156.0.8078.0**:

- Run **39825426788**, image job **119987335586**: readiness file absent initially; endpoint at **18,972 ms**; target creation aborted at **20,010 ms**. Chromium repeatedly had process state `D` and wait channel `folio_wait_bit_common`. I/O pressure reached approximately 70%; CPU cgroup throttling remained zero. Browser CPU time was small relative to elapsed time. The process was waiting for file-backed pages, not completing SDK authentication.
- Run **39826007575**, ambient image job **119989361191**: no endpoint before **20,048 ms**, reproducing the original failure class. On the same runner image, fresh pinned-package job **119989361394** reached all CDP domains at **1,917 ms** and passed **9/9** transport tests.

The verified defect class is an environment dependency: cold disk/page-in stalls in the runner's ambient browser fixture exhaust the shared startup budget before application verification can run. D-Bus warnings alone were not proof of a D-Bus root cause. These observations do not identify an Azure storage implementation bug or establish that all browser versions have identical I/O behavior.

## Controlled experiments and rejected treatments

| Diagnostic run | Experiment | Result |
| --- | --- | --- |
| 39824259389 | Ambient snapshot vs stable, older October 18 image/browser 155 | Both passed; first startup 7.85 s / 7.25 s, with file-page waits. Not parity with failed image. |
| 39824839379 | Unchanged launch vs sequential asset reads inside the original deadline, October 12 image/browser 155 | Both passed, 15.28 s vs 17.71 s. Sequential reads did not help; rejected. |
| 39825426788 | Ambient image vs bounded full-directory materialization | Ambient launch failed; copy exceeded its separate 60 s bound. Copy treatment rejected. |
| 39826007575 | Ambient image snapshot vs freshly extracted, checksum-pinned Chrome 156 package | Same October 21 runner image; ambient failed, pinned passed 9/9 at 1.92 s. |
| 39826652006 | Installed stable vs pinned stable; binary hashes recorded after launch | Installed 156.0.8078.47 on October 21 image passed at 7.11 s. Pinned same-version binary on October 12 image passed at 2.24 s. Binary SHA-256 matched across those two executions; differing runner images prevent treating timing differences as a pure same-host comparison. |

No diagnostic failure was retried until green. Each run changed a named experimental condition on independent ephemeral runners. The optional treatments are not integrated into the PR. The stressed invitation interaction was not changed: ordinary Chrome 156 runtime acceptance passes that journey, and it is unrelated to pre-CDP startup.

## Narrow correction

CI now provisions a fresh isolated **Chrome 156.0.8078.47** fixture from a fixed HTTPS package URL and verifies SHA-256 **`6c92cd22e90c6e3e255d782991543fa2091db8614e8536a971a7433a5c4d7ac8`** before extraction. It runs no package installation scripts, performs no privileged installation, and launches no warm-up browser. Download and extraction have finite bounds; CI provisioning has a four-minute step deadline. A download, checksum or extraction failure fails the job and removes the partial fixture; no fallback or retry hides the failure.

All four browser stages reuse this single `CHROMIUM_PATH` rather than rediscovering an unversioned image snapshot. Every browser process still has its normal fresh profile. CDP's shared **20-second startup deadline**, command deadlines, SIGTERM/SIGKILL handling, profile removal, actual SDK/auth assertions and owner-isolation guarantees remain unchanged. Dependency extraction normally populates file cache; this validates first-process startup after fixture provisioning, not an empty physical page-cache benchmark.

Startup diagnostics record profile creation, readiness-file state, endpoint, target creation, WebSocket/domain readiness, process exit and cleanup. Resource sampling is opt-in, retains at most 24 samples, and gives each proc/cgroup read a 100 ms abort bound. No environment dumps, URL parameters, cookie values, bearer tokens or SDK user data are recorded. The existing never-ready-launcher regression now additionally requires phase evidence and process termination, retaining its original cleanup assertions.

## Validation and remaining gates

Local Chrome 156 checks passed **9/9 transport**, **8/8 PostgreSQL/PostgREST security**, and **25/25 actual Next runtime journeys**, with full cleanup. Three isolated installer negative-path regressions cover download failure, real checksum rejection and extraction failure; rejected fixtures return no executable path and leave no partial installation. Phase-evidence regression was observed red against the original driver and green with diagnostics. The fixed package URL independently reproduced the expected package hash.

The final exact-head checkpoint is recorded separately after the candidate commit so this document does not assert a self-referential SHA or an unobserved green CI result. Inspect every stage and all six workflow conclusions. Network availability for the pinned public package is an explicit CI fixture dependency; an outage remains a visible failure.

Ledger statuses are unchanged: **55 VERIFIED / 331 PARTIAL / 20 BLOCKED / 18 UNKNOWN** across 424 records. The previously documented stress-only invitation timeout, authenticated production/CSP acceptance, real provider lifecycle, formal PDF/UA and device/performance evidence remain separate gates. No certification or publication status is promoted. RELEASE HOLD remains in force.
