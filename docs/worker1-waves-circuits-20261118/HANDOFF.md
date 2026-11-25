# Physics quantities private cohort

Baseline 49ea243b5be7e1ee9f3cd8af7f936ab784402cf7. The 540-row reconciliation (docs/publication540-shared/catalog/reconciliation-540.json) records these as registered implementations. The milestone requirements mark them as not newly assessed. The subsequent four-worker, construction, Worker 3 and statistics candidate lists exclude them. The roster excludes mechanics #302–311 and the nine Construction B IDs. Remote worker and coordinator refs were checked before edits. This branch adds only its own namespace.

| ID | Catalog title | Engine @1 | Bounded formula and units |
|---|---|---|---|
|312|Pressure Calculator|physics.pressure|F/A, normal force over area, Pa|
|313|Density Calculator|physics.density|m/V, mass density, kg/m³|
|314|Frequency Calculator|physics.frequency|N/t, supplied cycle count over elapsed time, Hz|
|315|Period Calculator|physics.period|1/f for positive frequency, s|
|316|Wavelength Calculator|physics.wavelength|v/f for supplied wave speed, m|
|317|Ohm's Law Calculator|physics.ohms-law|IR, V|
|318|Electrical Power Calculator|physics.electrical-power|VI with signed voltage and current, W|
|319|Voltage Calculator|physics.voltage|IR with signed current, V|
|320|Current Calculator|physics.current|V/R with positive resistance, A|
|321|Resistance Calculator|physics.resistance|V/I with nonzero signed current, Ω|

The private route adds Final presentation, unit-labelled fields, source-bound packets, owned account history, project scenarios, read-only legacy recovery, local batch and local JSON/CSV/PDF exports. Existing v1 engines and recorded results are preserved. Inputs use the existing decimal parser, reject incomplete or lossy values and impose a bounded nonzero magnitude floor of 1e-90 to protect this capture path from underflow. A valid mathematical zero remains valid. The #318 legacy numerical zero at 1e-200 V and 1e-200 A is reproduced only for historical verification. Historical verification is independent of current capture policy.

The retained engine source label is internal. Exact method applicability, external source provenance, SI conventions and the binary64 capture policy remain for competent review. #317 and #319 remain separate catalog identities despite their shared expression. Additional solving directions, AC impedance and safety sizing are outside the bounded reviewed implementation. Full Blueprint applicability requires individual adjudication. The worker did not add tuples to any shared Business capability list.

RELEASE HOLD ACTIVE.

## Validation

The 39 focused tests passed, including jsdom and mocked account composition. ESLint passed. The production webpack build and its TypeScript check passed. The separate native fixture used disposable PostgreSQL, GoTrue and PostgREST and real browser cookies over loopback. All ten IDs passed native Free, Pro and Business journeys with mobile layout, accessibility tree labels, keyboard recovery, owned history, and cross-account RLS. Pro and Business scenarios were recovered. All 30 native Pro exports were read back, and their bytes matched the retained digests. Unauthenticated and non-reviewer access were denied, and same-cookie Business revocation passed. The targeted #318 legacy v1 snapshot was replayed read-only, while fresh capture and stored version 2 were refused. The native runtime exception inventory was empty.

The receipt is isolated engineering evidence. Source approval, full canonical scope, precision, competent QA, central replay/source intake, shared Business adoption and integrated CI remain pending. All ten are advanced with qualification pending.
