# Native recorded download acceptance repair

CI run 42443455982, job 128617354344, failed at the recorded JSON filename poll after the real authenticated history and Business scenario steps passed. The original test passed unchanged in a local full run with Chrome 156; the exact CI scheduling sequence was not captured, so its precise cause remains inferred.

The source establishes a concrete race: `useCalculatorPlan` initially returns Free and loads the authenticated profile asynchronously. Recorded export controls remain disabled until that profile grants exports. Engine verification is independent of plan loading. The historical CDP `click` dispatches trusted mouse input without waiting for an enabled control; clicking a disabled export returns successfully without starting a download. Polling a directory afterward cannot distinguish this missed gesture from cancellation or incomplete transfer. A deterministic Chrome regression reproduces that silent disabled click with zero application handler invocations.

The repaired acceptance waits for the hydrated export control to become enabled before its single trusted click. A separate browser-level CDP connection subscribes to native download lifecycle events before the click, requires the exact suggested filename, tracks its GUID, rejects cancellation, and requires the completed event and exact bytes in a fresh per-invocation directory. Chromium names the file by GUID. Existing exports cannot satisfy the check; a download held by browser security cannot produce a passing completed-file assertion. No automatic retry or dangerous-download acceptance is implemented. The bounded lifecycle wait is diagnostic, rather than a filename-poll extension.

The targeted real-Chrome regression checks the disabled-click reproduction, eventual enabled single click, stale-file exclusion, unique GUIDs for repeated exports, native completed bytes, and rejection of a mismatched suggested filename. Separate injected-socket checks require bounded setup failure for an unanswered command, socket error or socket close, without issuing the user click; command timers are cleared on response and cleanup. The genuine Next acceptance retains all existing authentication, numeric snapshot, scenario ownership, engine agreement and cross-account denial assertions. Production application, SQL, numeric engines and shared historical CDP harness are unchanged.

Local commands (Chrome 156.0.8078.47, Node v24.19.0):

```
CHROMIUM_PATH=/tmp/calcumint-ci-browser.vNVmwJ/opt/google/chrome/chrome node --test tests/next-runtime/recorded-download.test.mjs
CHROMIUM_PATH=/tmp/calcumint-ci-browser.vNVmwJ/opt/google/chrome/chrome FREQUENCY440_NEXT_ARTIFACTS=/tmp/frequency440-download-green-final node tests/frequency440-acceptance/next.mjs
```

Original full-run evidence: `/tmp/frequency440-download-red/receipt.json` (all five original checks passed). Patched full-run evidence: `/tmp/frequency440-download-green-final/receipt.json`; the two `download-*.json` receipts include native begin/progress events, exact filename, GUID, output path and bytes. These local fixture results do not establish production compatibility or publication approval.
