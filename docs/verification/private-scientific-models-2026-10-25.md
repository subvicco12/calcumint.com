# Private scientific model engineering acceptance

Reviewed baseline PR #1477: `621086cb75b25cbecdd601f5f407d79936d7e12f`.
Separate branch: `engineering/scientific-models-20261025`. No frozen branch changes.

Five catalog identities, three shared private kernels:

| Master IDs | Profile | Independent numerical evidence |
| --- | --- | --- |
| 491, 539 | Pinned UCAR/Unidata MetPy heat index; explicit F/C, RH percent; 80–112°F private review guard | Seven independently published rounded regression cases, Celsius reference and five standard-library Decimal 40-digit witnesses |
| 495, 536 | Official SSC approximate geometric solarpos; north/east positive coordinates, explicit UTC instant, 1950–2050 | Seven independently computed pvlib 0.13.1 SPA geometric cases; largest recorded zenith difference 0.005672°, azimuth 0.006297° |
| 535 | Fixed-offset civil-day crossings of geometric solar center -0.833° | Three independent SPA root references; largest recorded event difference 2.683 seconds |

These are recorded-case numerical results, not uniform model accuracy or physiological applicability guarantees. Sources, immutable commits, license notices and oracle reproduction commands are retained in `docs/evidence/heat/PROVENANCE.md` and `src/calculators/science/solar/PROVENANCE.md`. The independent SPA generator also reproduces the published Reda/Andreas apparent-zenith example to 0.000001°; production is compared separately using geometric conventions. Both oracle generators were rerun successfully and solar JSON fixtures compared byte-for-byte.

A deterministic red diagnostic exposed hidden sub-minute polar excursions. Before correction, 2024-12-21 at latitude 67.39769781352459°, longitude 0° falsely returned polar-night although the modeled peak exceeds -0.833° between minute samples. A complementary June 21 case at latitude 65.73296145375297°, longitude 180° falsely returned polar-day. Regression tests assert the intervening extrema and neighboring samples. A conservative 0.15° sampling uncertainty now returns `grazing` when continuous day/night cannot be established. It does not fabricate event timestamps. Full UTC-interval guards reject year-boundary offset spillovers before searching; the exclusive final supported endpoint is handled safely.

Local validation passed: 4,855 unit tests (four existing skips); 49 new kernel/binding tests included; launch guards 45; certification guards 15; lint zero errors/28 existing warnings; typecheck; `next build --webpack`; eight isolated PostgreSQL/PostgREST security checks; three browser-fixture and ten transport tests; 36 Reference Six journeys; 42 actual Next runtime journeys including five private scientific identities, unsupported inputs, role revocation and account replacement. Build-generated tsconfig changes were restored and the preserved configuration typechecked again. No deadlines, assertions or security protections were weakened.

Independent read-only reviews found no remaining blocking numerical/integration findings, including the polar uncertainty bound and private authorization/publication isolation. Hosted acceptance is recorded on the separate draft PR for its exact final head; this document does not itself claim a hosted conclusion.

The successor 540-row manifest is `data/catalog/scientific-models-2026-10-25/manifest.json` (CSV alongside). Zero currently missing confirmed families means private bounded implementations exist for the demonstrated gaps. It does not approve canonical catalog scope: 90 model/policy decisions and two unsupported mappings remain. The three numerical-calculus diagnostic example expectations remain explicitly unverified; analytic answers alone do not justify changing binary64 diagnostic strings or adaptive estimator values. Prior reconciliation evidence is preserved.

The original 14 private DRAFTs, public registry (574), SIP v1, Slope v1, historical versions and all 424 ledger records are unchanged. Master CSV SHA-256: `3616153c285011c042bfe1ccf2b2244159649ce9a07ff7749504e35398cb0c90`; ledger SHA-256: `6bea776d2721a99a1cc0d757929ab1ac9e957c0863ac2cba3ac408446df417c1`.

RELEASE HOLD remains active. No public registration, certification, publication, production access/write, migration, merge, deployment or live payment. Original NOAA evidence and heat applicability review, specialist/identity decisions, hosted-provider/device/PDF-UA acceptance and current production database/publication authority remain separate external gates.
