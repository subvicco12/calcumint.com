# Private energy and mobility cohort

**RELEASE HOLD ACTIVE.** Base `49ea243b5be7e1ee9f3cd8af7f936ab784402cf7`. This lane is separate from the completed automotive handoff at `c26742fb18539cd762fd7f8b17a338283e85e321`.

Selection used the [canonical 540-row trace](../blueprint-reconciliation/blueprint-to-540.json), [overlay](../canonical-calculus/engineering-overlay-540.json), and coordinator records for the [prior qualification intake](../coordinator-worker3-20261117/validation/qualification-candidate.json) and [retained 111 overlay](../statistics-integration-20261117/qualification-candidate.json). Each selected row has one registered v1 candidate, no recorded bounded profile, and no declared fixture discrepancy. Exact IDs and slugs were checked against existing factory/delivery registrations and prior scoped cohorts. Worker 1's observed waves/circuits (`eb1299a9`), mechanics (`462b5405`), construction (`1ca43924`) and statistics assignments are outside this cohort. Worker 3's observed construction (`a802d36d`) and everyday/sports (`56553c47`) assignments and file sets are outside it. The new files use a dedicated Worker 2 namespace. The three engine modules are read-only dependencies.

| ID | Exact retained engine | Independent numerical and refusal witness | Remaining applicability decision |
|---|---|---|---|
| 459 | `automotive.fuel-economy@1` | 200 km / 16 L → 12.5 km/L; zero fuel refused | Approve distance per litre as the intended canonical convention and input scope. |
| 460 | `automotive.gas-mileage@1` | 165 mi / 6 US gal → 27.5 mi/US gal; zero fuel refused | Approve US gallons and whether imperial or metric conventions need a separate identity. |
| 461 | `automotive.trip-fuel@1` | 250 km at 7.5 L/100 km → 18.75 L; negative distance refused | Approve constant entered consumption and use as a quantity estimate. |
| 462 | `automotive.ev-charging-cost@1` | 12 kWh at 75% efficiency and 0.25/kWh → 4 supplied currency; zero efficiency refused | Approve battery-side input, efficiency and flat-rate model, currency labeling and policy for taxes or tariffs. |
| 463 | `automotive.ev-charging-time@1` | 24 kWh / 8 kW → 3 h; zero average power refused | Approve the measurement side and intended meaning of supplied average power. |
| 464 | `automotive.ev-range@1` | 72 kWh at 24 kWh/100 km → 300 km; zero consumption refused | Approve usable energy and a single entered average consumption convention. |
| 478 | `energy.appliance-running-cost@1` | 750 W for 4 h at 0.125/kWh → 3 kWh and 0.375 supplied currency; negative runtime refused | Approve constant entered wattage, runtime and a flat common-currency rate. |
| 479 | `energy.home-energy-consumption@1` | 250 W, 8 h/day, 14 days → 2 kWh/day, 28 kWh, and 3.5 at 0.125/kWh; 25 h/day refused | Approve average power and explicit period, including the retained fractional-day input and primary-result selection. |

Retained declared sources are [FuelEconomy.gov](https://www.fueleconomy.gov/) for #459–461, [DOE AFDC EV guidance](https://afdc.energy.gov/vehicles/electric.html) for #462–464, and [DOE appliance energy estimation](https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use) for #478–479. These inherited links provide context. Publisher-body provenance, normative applicability and exact source admission remain decisions. No canonical mapping is inferred.

The reviewer-only workbench supplies the missing Final presentation and distinct input/output labels and units, including secondary energy/cost outputs. It reuses verified workflow packets, bounded local batch, plan-gated scenario and export controls, and the existing atomic account operations. Live account actions recheck the session, reviewer role, plan where relevant and owner/project bindings. Unsupported or foreign records return controlled denial; verified v1 records outside current bounded capture remain separately readable. The engine code, original results and EV six-decimal rounding are retained. The independent numeric witnesses are bounded examples, not full-domain or precision approval.

Remaining gates for all eight include Blueprint mapping, approved scope and precision, publisher-body review and central source admission, competent QA and hosted equivalence, and separate authorization for shared Business storage, API, embed and durable batch. The browser’s Business membership check uses the existing shared project route; that does not grant these identities team delivery.

The compiled baseline factory registry returned 111 entries and its native delivery allowlist returned 106. Intersection with the eight selected IDs was empty in both. Immutable SHA-256 bindings:

- `src/calculators/automotive/catalog-batch-2.ts` — `6b0463fd727ee335e73a9ef87193d38e2cbd222d57e6b641860d848eedf48632`
- `src/calculators/energy/catalog-batch-1.ts` — `43eab5317a4a9d92975d5a747d3c99f7105cbffc7f747d9909a3cd91f076fe48`
- `src/calculators/energy/catalog-batch-2.ts` — `1eaba45a2f79407ad7828a98089d7b4c2d8ad5197fcb1b71138a3fc549366b67`

The [focused receipt](../../tests/worker2-energy-mobility-20261119/focused-receipt.json) records 22 tests and passing focused lint. The [native receipt](../../tests/worker2-energy-mobility-20261119/native/receipt.json) records 24 journeys across Free, Pro and Business using native Chromium login, Next SSR cookies, genuine disposable PostgreSQL, GoTrue and PostgREST, and a normal production webpack build. Per-ID checks include 390 px layout, accessibility tree labels, blank-input refusal and keyboard recovery, owned history restore and idempotent save, foreign history denial, Free export/scenario refusal and paid scenario save/restore plus foreign scenario denial. On the existing Business project route, the same session lost access after organization revocation while the owner retained access. An already-open reviewer session lost save authority after revocation. Publication fixtures were disabled.

The [independent export readback](../../tests/worker2-energy-mobility-20261119/native/export-readback.json) verifies 24 actual Pro downloads by byte hash and matches every numeric output across scoped JSON, CSV and tagged PDF, including secondary outputs. The downloaded artifacts are retained with their invocation identifiers. This is local disposable evidence, with PDF/UA and provider equivalence unverified.

Reproduce with Node 22, Chromium, Poppler and the pinned local Docker fixture images:

```sh
export WORKER2_MOBILITY_BROWSER_ARTIFACTS="$(mktemp -d /tmp/worker2-mobility-browser.XXXXXX)"
node tests/worker2-energy-mobility-20261119/native-browser.mjs
python3 tests/worker2-energy-mobility-20261119/export-readback.py "$WORKER2_MOBILITY_BROWSER_ARTIFACTS"
```
