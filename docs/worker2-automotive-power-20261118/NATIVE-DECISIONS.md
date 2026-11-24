# Automotive power native acceptance and authority decisions

**RELEASE HOLD ACTIVE.** The native exercise targets `8d0c1df303ff8b2551e73aa1fe742f70e1fcc5ca` and reuses its 21 focused tests and six account-action journeys. Browser coverage exercises the reviewer-only route with real GoTrue login and Next SSR cookies on disposable PostgreSQL and PostgREST. It uses loopback transport and an unchanged webpack production build with publication fixtures disabled. Organization revocation exercises the existing shared project route, independent of whether these two calculators are admitted to shared Business delivery.

| Decision | #475 Horsepower | #476 Engine Horsepower |
|---|---|---|
| Exact engine | `automotive.horsepower`, `horsepower-calculator`, v1 | `automotive.engine-horsepower`, `engine-horsepower-calculator`, v1 |
| Applicability and unit convention | Conversion of supplied nonnegative kW to mechanical hp. Approve this narrow convention or specify a separately identified conversion for other horsepower units. | Supplied nonnegative torque in lb·ft (pound-force feet) and positive rotational speed in rpm. Approve the intended torque and speed measurement context and mechanical hp output. No vehicle performance, wheel-to-crank or measurement correction is modeled. |
| Retained numerics | Multiply by 1,000 and divide by 745.6999 W per mechanical hp. The 550 ft·lbf/s convention with exact international foot, pound and standard gravity gives about 745.69987158 W, so the retained conversion is rounded. Determine acceptance tolerance and output rounding separately from the binary64 packet. The historical record at 1e-70 kW remains valid for replay outside the bounded current profile. | Multiply torque by rpm and divide by 5252. Under the 33,000 ft·lbf/min mechanical convention and rotational work per turn of 2π times torque, the unrounded divisor is 5252.113122…. The v1 approximation alone increases positive results by about 0.002154%. Decide whether that approximation and any independent rounding or tolerance are acceptable. A different divisor requires a separately identified version. |
| Source review | The fetched NIST SP 811 table confirms the factor and distinguishes other horsepower conventions. Approve applicability and bind the reviewed source revision and units to the exact identity. | The fetched dyno article confirms the 5252 equation in its measured-torque context. Approve applicability and whether 5252 meets the required scope and precision. |
| Blueprint scope | Approve exact mapping for the broad “Horsepower Calculator” label and decide whether conversion only satisfies the canonical input/output and feature contract. | Approve exact mapping for “Engine Horsepower Calculator” and decide whether supplied torque and rpm suffice or other methods require separately governed identities. |

Publisher-body observations, retrieved November 18, 2026 through Firecrawl:
- NIST SP 811 Appendix B.8 returned HTTP 200 from a cached extraction dated November 18, 2026 at 15:45:24 UTC. Its mechanical row reads “horsepower (550 ft · lbf/s) (hp) | watt (W) | 7.456 999 | E+02”. It separately lists boiler, electric, metric, U.K. and water horsepower. [NIST table](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8)
- Hot Rod’s “How to Read a Dyno Sheet” returned HTTP 200 from an uncached extraction. The June 1, 1998 article identifies uncorrected torque in lb-ft and states “Horsepower = rpm x torque divided by 5252”. A dyno how-to supports the equation in that context and leaves acceptable precision and formal calibration authority open. [Hot Rod article](https://www.hotrod.com/how-to/reading-dyno-sheet)

[Prior evidence and declared publisher links](EVIDENCE.md). All authority decisions remain open. Native browser acceptance is not provider, deployment or publication authority. Business team writes, API, embed and durable batch delivery require separate adoption. Preserve historical v1 bytes and replay bindings under any later change.

Reproduction from the branch root with Node 22, Chromium, the repository dependencies and the pinned local Docker images:

```sh
export WORKER2_POWER_BROWSER_ARTIFACTS="$(mktemp -d /tmp/worker2-power-browser.XXXXXX)"
node tests/worker2-automotive-power-20261118/native-browser.mjs
python3 tests/worker2-automotive-power-20261118/export-readback.py "$WORKER2_POWER_BROWSER_ARTIFACTS"
```

An initial browser run completed the Free #475 journey and stopped on a transient restore message assertion after #476 rendered. The final harness checks the restored fields and result instead of relying on feedback text across a state change.

The [combined native receipt](../../tests/worker2-automotive-power-20261118/native/receipt.json) preserves three separately attributable stages with identical fingerprints for 2,143 application files. The plan stage passed all six journeys before the unknown-version message was masked by production React. The historical stage verified read-only v1 recovery, refusal of v2 and the historical JSON download before the project page had finished checking its session. The revocation stage waited for that existing boundary and passed foreign project denial, same-session member revocation, retained owner access and revoked-reviewer save denial. Neither the source engine nor application code changed. Unknown-version denial remains generic in production and does not provide version-specific recovery guidance.

[Independent export readback](../../tests/worker2-automotive-power-20261118/native/export-readback.json) checks all seven native byte hashes, v1 identity and result parity across JSON/CSV/PDF, tagged PDF structure, and exact historical JSON. PDF/UA conformance and hosted equivalence are outside these checks.
