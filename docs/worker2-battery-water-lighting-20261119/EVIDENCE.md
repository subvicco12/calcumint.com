# Private battery, water and lighting cohort

**RELEASE HOLD ACTIVE.** Isolated from coordinator head `49ea243b5be7e1ee9f3cd8af7f936ab784402cf7`. The preceding energy and mobility handoff remains at `faaa6c0b97ca985406cf59d26437530313c129db`.

The [540-row reconciliation](../blueprint-reconciliation/blueprint-to-540.json) records one exact v1 candidate per ID. A compiled registry check confirmed object identity with the registered engines and no overlap in the 111 existing factory entries. Worker 1 calendar (`f146b080`) and Worker 3 food quantity (`e05323f5`) were checked again at selection. The four IDs are outside those assignments and the retained mechanics, circuits, construction, statistics and everyday/sports assignments. Only dedicated Worker 2 paths are added.

| ID | Engine and v1 unit contract | Independent calculation and refusal | Remaining scope decision |
|---|---|---|---|
| 482 | `technology.battery-runtime` / `battery-runtime-calculator` / 1. Wh, W and supplied efficiency to hours. | 1200 Wh × 75% ÷ 300 W = 3 h; zero load and efficiency over 100% refused. | Approve average-load and efficiency measurement assumptions, capacity definition and intended use. A unit reference does not validate battery discharge prediction. |
| 483 | `engineering.battery-storage` / `battery-storage-calculator` / 1. Daily kWh and backup days, adjusted by supplied DoD and efficiency, to nominal kWh. | 6 kWh/day × 2 days ÷ (75% × 80%) ≈ 20 kWh; zero DoD and efficiency over 100% refused. | Approve system boundary, discharge and efficiency assumptions, fractional backup days, and nominal vs usable energy. The model makes no equipment, power rating or installation decision. |
| 486 | `launch-water-usage-calculator` / `water-usage-calculator` / 1. One supplied volume unit per minute, multiplied by minutes. | 7.5 supplied units/min × 12 min = 90 supplied units; negative flow refused. Zero flow retains zero. The 1e-50 capture boundary passes; the legacy 1e-70 result remains verifiable read-only. | Approve the constant-flow scope and whether a separately governed conversion profile is required. v1 supplies no basis to label the result litres or gallons. |
| 489 | `energy.lighting-energy` / `lighting-energy-calculator` / 1. Whole lights, W per light and hours, output kWh. | Eight 25 W lights × 5 h = 1 kWh; fractional quantity refused. One million lights accepted at the retained boundary; one million plus one refused. | Approve identical fixed load and common run-time scope, excluding dimming and standby. |

Historical v1 verification is independent of new capture bounds. The route keeps a distinct private source revision and checks exact snapshot identity and output. Binary64 results and steps are retained, including ordinary rounding; the private bounded inputs use magnitudes at most 1e50 and nonzero magnitudes at least 1e-50, then the original input schemas. No new tolerance, commercial rounding rule or precision certification is inferred. Approve precision and output policy per ID before adopting a successor or broadening scope.

The private Final workbench adds history/scenario recovery, bounded local batch and JSON/CSV/PDF exports. Server actions recheck live reviewer access, owner and project ownership, and paid scenario entitlement. Foreign and missing records share an unavailable response. Unsupported versions receive no record content. Any canonical registry or replay dispatcher admission must preserve exact versions. Shared Business storage, API, embed and durable jobs require separate adoption. The existing Business project membership check is independent of delivery for these identities.

Immutable engine SHA-256 bindings:

- `src/calculators/technology-computing/catalog-batch-2.ts` — `d352f40f8aef2cbd22afd8c09e577f28fc4eda1b925a928ec65c1ea25f4393d7`
- `src/calculators/engineering-construction/catalog-batch-3.ts` — `c771e0b347e2150fa4144e0b1e1e11eb8d009eb0887dcc5eb35e53e1fe849c92`
- `src/calculators/launch-portfolio.ts` — `dfb7ffe1547cf96f7608a11e3ef03a95cc8186ce91760dc3bf8754995cff868f`
- `src/calculators/energy/catalog-batch-3.ts` — `2a7cd952c5e0ed4619ec5fa254efc0d94e2d15ae94dc42d6adf972932f3e3ea0`

Publisher observations retrieved November 19, 2026:

- **#482:** [NIST Handbook 44 Appendix D](https://www.nist.gov/document/2026-nist-handbook-44-appendix-d) returned HTTP 200 and defines Wh as energy at one watt average power for one hour. This supports the unit cancellation only.
- **#483:** The retained [NREL 90582 URL](https://www.nrel.gov/docs/fy24osti/90582.pdf) failed DNS resolution in retrieval. The [DOE OSTI copy of Technology Tips for Solar + Storage](https://www.osti.gov/servlets/purl/2417620) returned HTTP 200 and discusses energy capacity, discharge duration, and hours of autonomy at average load. It provides context for the user-supplied backup duration and does not establish adoption of the exact combined DoD and efficiency formula.
- **#486:** Retained source is the internal launch formula review. The dimensional identity is valid for constant supplied volume per minute and duration in minutes. There is no external source-mapped unit selection in the retained record.
- **#489:** The [retained DOE Energy Saver page](https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use) returned HTTP 404. The [DOE Energy Efficiency in the Home worksheet](https://www1.eere.energy.gov/education/pdfs/efficiency_energyinhome.pdf) returned HTTP 200 and uses item count, wattage and run time, with watt-hours divided by 1,000. That supports the limited identical-load energy method. Review replacement source admission independently.

[Focused receipt](../../tests/worker2-battery-water-lighting-20261119/focused-receipt.json) records 25 tests and focused lint. The [Chromium receipt](../../tests/worker2-battery-water-lighting-20261119/native/receipt.json) records 12 Free, Pro and Business journeys using native login, SSR cookies, and genuine disposable PostgreSQL, GoTrue and PostgREST. The production webpack build passed with no lower publication fixture. Each ID passed mobile width and accessibility labels, keyboard recovery, owned history save/restore, foreign history denial and the expected plan gates. Paid scenarios saved/restored and denied foreign reads. On the existing Business project route the same session lost access after membership revocation and the owner retained access. A separate reviewer revocation denied save on the already-open private route.

[Export readback](../../tests/worker2-battery-water-lighting-20261119/native/export-readback.json) verifies all 12 native Pro downloads by hash and reconciles every numeric output across JSON, CSV and tagged PDF. #486's v1 output has no steps field and none was introduced. PDF/UA, publisher replacement admission, canonical mapping, numerical policy, competent QA, hosted equivalence and shared Business delivery remain open.

Reproduce with Node 22, Chromium, Poppler and the pinned disposable Docker fixtures:

```sh
export WORKER2_RESOURCE_BROWSER_ARTIFACTS="$(mktemp -d /tmp/worker2-resource-browser.XXXXXX)"
node tests/worker2-battery-water-lighting-20261119/native-browser.mjs
python3 tests/worker2-battery-water-lighting-20261119/export-readback.py "$WORKER2_RESOURCE_BROWSER_ARTIFACTS"
```
