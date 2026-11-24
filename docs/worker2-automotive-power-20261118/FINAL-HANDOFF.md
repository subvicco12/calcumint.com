# Automotive power coordinator handoff

**RELEASE HOLD ACTIVE.** Remediation base: `5a9a119473c4ac9da7902ecef86d6f1a663bb5d9`.

The production defect is preserved in the [original browser receipt](../../tests/worker2-automotive-power-20261118/native/plan-pass-receipt.json): an owned unsupported record was refused, but the rendered feedback showed minified React error #441. The account recovery path now returns a data-free unsupported status only after confirming current reviewer, owner and, for a scenario, project access. Foreign or missing records use the same unavailable status. The client supplies fixed recovery text. It clears any prior read-only recovery panel on refusal. Exact v1 snapshot verification still runs on supported records. No engine, account entitlement or publication control changed.

| ID | Source applicability and authority decisions |
|---|---|
| #475 `automotive.horsepower@1` | NIST SP 811 identifies mechanical horsepower (550 ft·lbf/s) separately from metric, electric and other variants. Approve the conversion-only scope, permitted input sign/domain, the retained rounded factor 745.6999 W/hp, result tolerance and display rounding, and the mapping of the broad Blueprint title to this exact contract. Preserve the older 1e-70 kW v1 record independently of bounded capture. |
| #476 `automotive.engine-horsepower@1` | The retained dyno article gives torque in pound-force feet and rotational speed in rpm, with mechanical horsepower computed using 5252. Approve the measured-torque/RPM context, domain, approximation and tolerance, and mapping of the Blueprint title to this method. The unrounded mechanical divisor is about 5252.113122, so using 5252 contributes about +0.002154% relative bias on positive results. A different divisor would require a separate version decision. |

[Publisher observations, conversion derivations and full scope decisions](NATIVE-DECISIONS.md). Publisher retrieval supports the retained formulas and leaves canonical approval and precision policy open.

Reuse the prior [six native plan journeys and seven original download readbacks](../../tests/worker2-automotive-power-20261118/native/receipt.json), [independent export readback](../../tests/worker2-automotive-power-20261118/native/export-readback.json), and [21 focused tests and account evidence](EVIDENCE.md). The remediation reruns only the affected Chromium recovery paths on a clean production webpack build with real local GoTrue, PostgreSQL, PostgREST and SSR cookies. Full hosted equivalence, source and registry admission, canonical scope, shared Business delivery, and publication approval remain separate gates.

To rerun only the affected paths, use Node 22 and the pinned local fixture images:

```sh
WORKER2_POWER_BROWSER_STAGE=history \
WORKER2_POWER_BROWSER_ARTIFACTS="$(mktemp -d /tmp/worker2-power-version.XXXXXX)" \
node tests/worker2-automotive-power-20261118/native-browser.mjs
```

The [targeted receipt](../../tests/worker2-automotive-power-20261118/version-remediation-receipt.json) verifies owned v2 history and scenario refusal, v1 recovery, and foreign denial for both IDs. The historical #475 Chromium download was byte-identical to the archived original. No duplicate export payload is needed.
