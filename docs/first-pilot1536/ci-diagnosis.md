# PR 1536 Batch21 CI diagnosis

Baseline: `6d2960c2fac7817741b08877ebd3b611720923b7`.
CI run: `42405500802`.

The Batch21 evidence check passed. The browser's last announced journey was
`scientific-notation-calculator`, width 360. About 30.766 seconds later the
console reported an unqualified CDP `Internal error`. The existing CDP transport
omitted the failed command from that error. The workflow did not upload the
Batch21 report, so the original CI operation and primary failure cannot be
established from the available evidence.

A separate, reproducible harness defect can hide that primary failure: the catch
block writes `report.error`, then awaits a screenshot without handling screenshot
failure. A screenshot rejection replaces the acceptance error in the console.
The regression test injects a primary input-command timeout and a secondary
screenshot `Internal error`: the old implementation reports the latter; the
corrected implementation rethrows the original error and records screenshot
failure separately. This establishes diagnostic masking, not the cause of the
original CI failure.

Batch21 now records the active calculator and viewport, identifies the browser
operation and its first argument, preserves the original exception as `cause`,
and prints/persists the acceptance failure before attempting a screenshot.
Screenshot errors are secondary receipt data. Browser commands are attempted
once; assertions, input interactions, origin restrictions, and timeouts retain
their existing behavior. Shared CDP and production sources are unchanged.

Local baseline Chromium 154 passed the original CI failure point and completed
256 journeys before a script request failed with `net::ERR_NETWORK_CHANGED`.
The first local run with pinned Chrome 156 failed at cost-per-person, width 360,
with the same explicit network error. These local failures coincided with root
agent Docker fixture network changes and are preserved as failures. They do not
reproduce the CI `Internal error`.

Evidence retained in the execution workspace:

- `/tmp/pr1536-ci-failure-extract.log`: original CI final step excerpt.
- `/tmp/pr1536-browser-red.log`, `/tmp/pr1536-baseline-report.json`: local baseline failure.
- `/tmp/pr1536-pinned-browser.log`, `/tmp/pr1536-pinned-browser/report.json`: first pinned run failure.
- `/tmp/pr1536-diagnostic-red.log`: injected masking reproduction before correction.
- `/tmp/pr1536-diagnostic-green.log`: four passing diagnostic regression tests.

A subsequent run with Docker networking quiescent reproduced the CI symptom
sequence after 112 completed journeys. At scientific-notation-scale, width 360,
the first hydration `Runtime.evaluate` timed out after 30 seconds; the diagnostic
screenshot then failed with `Internal error`. The corrected handler preserved both
errors. This identifies the primary operation in the local reproduction, while
the original CI primary report remains unavailable.

Chromium file logging plus process RSS sampling showed renderer RSS around
560–670 MiB rather than unbounded growth; cgroup OOM counters remained zero and
shared memory was available. That instrumented run passed the original failure
point, so cumulative OOM is unsupported.

The old hydration predicate also had an independently demonstrated correctness
gap: already valid Pro controls from a preceding document satisfied readiness,
as did matching controls while the document was still loading. The new predicate
requires the exact requested URL, completed document load, a mounted fixture
identity for the requested slug, actual Pro state, and calculator controls. Two
regressions fail with the old predicate and pass with the corrected predicate.
This strengthens navigation readiness without extending timeouts or retrying
failed browser operations. It does not establish that stale DOM caused the
original CI hang.

Additional retained evidence:

- `/tmp/pr1536-pinned-quiescent.log`, `/tmp/pr1536-pinned-quiescent/report.json`: unconfounded timeout plus secondary screenshot failure.
- `/tmp/pr1536-chrome-renderer.log`, `/tmp/pr1536-renderer-resources.jsonl`: browser/process observations.
- `/tmp/pr1536-readiness-red.log`, `/tmp/pr1536-readiness-green.log`: two readiness regression tests.

The full corrected-readiness run still timed out after 279 completed journeys,
at square-calculator, width 1440; screenshot again returned `Internal error`.
The readiness correction therefore does not resolve the target lifetime failure.
The original same-target run with file logging completed all 318 journeys and
652 blank-input checks, confirming that this failure is intermittent.

The harness now retires each browser after 20 successfully completed independent
journeys. This is a deterministic lifecycle boundary, never a response to failure.
Every retired session must pass the existing browser-error and unauthorized-network
assertions before the next session starts; request counts are accumulated. The
cross-viewport result baseline remains outside the lifecycle, and the full cohort,
input, account, snapshot, keyboard, overflow, and scenario checks are preserved.
A failed journey aborts immediately and cannot be replayed. Three lifecycle tests
verify exact sequence/coverage, no failure replay, and preservation of previous
session verification errors.

Additional evidence: `/tmp/pr1536-final-pinned.log` and
`/tmp/pr1536-final-pinned/report.json` preserve the corrected-readiness failure;
`/tmp/pr1536-lifecycle-red.log` shows all three lifecycle tests failing when
session retirement is removed.

Final exact pinned Chrome 156.0.8078.47 validation with `BATCH21_SCENARIO_UI=1`
passed all 318 journeys across 159 cohort entries at 360/1440 widths, including
652 blank-input checks and all scenario workflows. The process exited zero.
The successful receipt is `/tmp/pr1536-lifecycle-pinned/report.json`; hashes and
source binding are recorded in `ci-validation.json`. All nine focused diagnostic,
readiness, and lifecycle tests passed. No production or shared CDP sources changed.
