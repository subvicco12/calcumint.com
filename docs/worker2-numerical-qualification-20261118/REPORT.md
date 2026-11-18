# Bounded numerical qualification

RELEASE HOLD ACTIVE. This evidence branch starts at physics remediation commit `4b871e8854dfefbe27db19e98aa13a24014b540c`. It adds only tests and this report. The prior candidate code is pinned at `3267b4bf2afac70a5d8cd92162f4a6175b56ff24`. [Remediation evidence and provenance](../worker2-physics-20261116/REPORT.md).

| ID and historical identity | Reproduced evidence | Decision still required |
|---|---|---|
| #322 `physics.capacitance@1` | At charge `2^-1074`, voltage 4 yields zero, voltage 2 ties to even zero, and voltage 1 yields the minimum subnormal. Negative charge preserves negative zero at the tie. An evaluation reorder cannot represent a smaller nonzero quotient in binary64. | Compatible charge, voltage and capacitance units, signed Q/V applicability and final-zero policy. |
| #323 `physics.coulomb-force@1` | With both charges 1e-200 and distance 1e-100, the prior private result is two binary64 steps below the isolated one-round result. The independent oracle passes for the retained operands. | Medium and point-charge scope, force sign, units, constant precision and tolerance. The two-step difference establishes no approved tolerance violation. |
| #324 `physics.projectile-motion@1` | Speed 2^300, angle 2^-1074 and gravity 1 produce zero in the prior private path and approximately 7.1563e-145 in the isolated candidate. The existing bounded tiny-angle approximation and replay refusals pass. | Unit and level-ground launch model, endpoints, approximation and rounding policy. |
| #325 `physics.free-fall@1` | Gravity 2^-1074 and time 2^100 yield zero historically. Deferring rounding produces the representable exact result 2^-875. | From-rest and constant-gravity scope, units, zero-gravity and final-zero/refusal policy. |
| #327 `physics.angular-velocity@1` | The same subnormal quotient boundary holds for displacement divided by elapsed time. | Angle/time/output units, signed average scope and final-zero policy. |
| #298 `statistics.coefficient-of-variation@1` | v1 implements SD/abs(mean). Equal positive unit scaling leaves the value unchanged (2/10 and 20/100); shifting the mean alone changes it (2/20). Signed mean matches positive magnitude. MIN/MIN is finite, while 1/MIN refuses overflow. | Determine ratio-scale and meaningful-zero applicability, signed magnitude convention, near-zero policy, scope owner and version choice before opening a successor. |

The #298 engine file is byte-identical between the Worker 2 statistics evidence at `556ca86b38e9f1f28973df07b832ed863f86b4ed` and coordinator statistics integration at `49ea243b5be7e1ee9f3cd8af7f936ab784402cf7`. Worker 1's recorded cohort is #292–295. The coordinator explicitly holds #298 in `docs/statistics-integration-20261117/source-scope-review.json`. Target separation supplies evidence about overlap and leaves the actual ownership decision unresolved. Direct retrieval of the NIST EDA and Dataplot coefficient-of-variation pages returned HTTP 403. The scale tests establish arithmetic properties only.

The three candidate identities remain separately named and require independent source admission, authorized adoption and exact-version delivery evidence. All five physics dispositions remain partial. #298 remains blocked. The existing engine behaviors and source bindings are preserved.

## Reproduction

Run each command from the branch root. The latter two use real Git subprocesses for provenance checks. An initial restricted run hit EPERM on nine Git assertions. The permitted rerun passed all assertions.

```sh
node node_modules/vitest/vitest.mjs run --config tests/worker2-numerical-qualification-20261118/vitest.config.ts # 3 passed
node node_modules/vitest/vitest.mjs run --config tests/worker2-physics-20261116/vitest.config.ts # 156 passed
node node_modules/vitest/vitest.mjs run --config tests/physics-qualification-20261115/qualification.vitest.config.ts # 15 passed
```
