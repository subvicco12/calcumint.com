# Final invitation stress diagnostic — RELEASE HOLD

Candidate: **b85e845ecd11856f963c9f32af9634b8e4738293**, PR #1467. These are evidence-only files on a separate branch; the frozen candidate is not advanced. The primary tracked worktree was clean; pre-existing generated `next-env.d.ts` remained untracked. The separate worktree uses an untracked dependency symlink, not source edits.

## Decision and narrow findings

**Qualified GO for Final Development Candidate/code freeze.** No application P0/P1 was reproduced in this bounded diagnostic. This is not a release, production, provider, certification or publication approval.

The historical 4× invitation-navigation timeout was **not reproduced** in either of two fresh isolated replays. Both ran the original frozen nine-journey prefix through invitation creation/acceptance, including anonymous/forged auth rejection, all five prior role journeys and project/client persistence. They did not restart unrelated audits or rerun the independent 66-test review.

| Replay | Runtime | Result |
| --- | --- | --- |
| run-4x-a | Node22.23.4, pinned Chrome156.0.8078.47, 4× renderer slowdown | 9/9, invitation created/accepted, complete cleanup |
| run-4x-historical | Node22.23.4, Debian Chromium154.0.8037.57, 4× renderer slowdown, lighter observations | 9/9, invitation created/accepted, complete cleanup |

Both recorded trusted, valid, focused email input and a trusted valid invitation submission. The historical-browser replay recorded the same-document `invite` navigation **985 ms** after submission, followed by acceptance and persisted membership. No invitation `invalid` event, uncaught browser exception or forbidden outbound request occurred. Assertions, startup/command/navigation deadlines, auth cookies and SQL/security behavior were unchanged. No cookie gap, outage, CPU background load or browser retry was injected.

The capable isolated environment had a four-CPU cgroup quota and 32 GiB memory limit. Minimum reported free memory exceeded 32 GB. Some cgroup CPU throttling occurred: cumulative throttled-time deltas **4,319,775 µs / 3,502,566 µs**, with 79/68 throttled periods. These counters are not wall-time percentages. I/O and CPU pressure files were unavailable; unavailable metrics do not establish absence of contention. Navigation/hydration long tasks and resource samples are retained.

**Historical classification remains unresolved:** neither a harness-overload root cause nor an application defect is established for the old failure. Its saved report/screenshot lacked input, target-hit, navigation and resource telemetry; they do not prove why the action failed to navigate. The clean successful replays are bounded counterevidence, not proof that the intermittent failure cannot recur. Do not mark the stress observation FIXED or promote ledger statuses from these passes.

## Observation and confidentiality boundaries

Only an external generated runner changed. Application and frozen harness sources were copied/read unchanged; the existing Next dev test-copy CSP deltas remain explicitly scoped (loopback synthetic identity origin and dev eval). Identity is the existing HMAC-verifying synthetic provider with real SDK/HTTP and disposable PostgreSQL/PostgREST, not live GoTrue.

Run A includes additional DOM snapshots and reads layout-sensitive `innerText`; it can perturb scheduling. Run B removes intermediate snapshot RPCs, reads `textContent`, and captures same-document navigation and request/response metadata without request bodies/headers. Both use observational listeners; neither prevents events or writes application state. All observer effects remain a diagnostic limitation. The original failed environment's Node version and contention state cannot be authenticated retroactively.

Committed JSON retains form validity/focus/lengths, sanitized route categories, cookie mutation phases, navigation and browser/CDP timing, and normalized resource counters. It excludes cookie/JWT/API-key values, invitation query/token values, form values, process argv/environment, kernel addresses, screenshots and server logs. Raw credential-redacted reports remain outside the checkout; hashes identify them. The manifest lists curated artifact hashes.

## Reproduction

Use an isolated source worktree at the frozen SHA with its dependencies installed, Node22.23.4, the managed local Docker daemon and the browser fixture indicated in the manifest. The generator rejects modified or untracked application/harness source paths. It generates a script outside the source checkout and does not edit the source.

```sh
python3 build-invitation-diagnostic.py "$SOURCE_ROOT" "$ARTIFACT_ROOT/invitation-runner.mjs" --light
STRESS_RATE=4 NEXT_RUNTIME_ARTIFACTS="$ARTIFACT_ROOT/replay" CHROMIUM_PATH="$BROWSER" node "$ARTIFACT_ROOT/invitation-runner.mjs"
```

Omit `--light` to reproduce Run A's observation configuration. Prefix the command PATH with the selected Node22 binary directory. Use isolated disposable fixtures only. The runner retains the original assertion timeout and exit-on-failed-journey behavior; it reports every outcome and cleanup. No whole-suite CI rerun is justified by evidence-only changes.

## Remaining external gates

Live isolated GoTrue/provider lifecycle and authenticated production-mode CSP; deployed database/RLS equivalence, migration adoption/rollback and privileged-writer review; authorized payment sandbox/activation decisions; physical-device/accessibility/PDF-standards validation and measured production performance; authoritative specialist/source decisions and final operational approvals remain separate gates. No production writes, migrations, merges, deployments, payments, certification or publication changes occurred.
