# Worker 1 statistics cohort A — ownership before implementation

Baseline: `6fa8f87433ee8434d1d89aaf93deea0216eb17cb`.
Branch: `worker1/statistics-a-20261117`.

|Catalog|Title|Immutable registered tuple|Engine file|
|---|---|---|---|
|292|Correlation Calculator|statistics.correlation / correlation-calculator@1|src/calculators/statistics/catalog-batch-3.ts|
|293|Linear Regression Calculator|statistics.linear-regression / linear-regression-calculator@1|src/calculators/statistics/catalog-batch-4.ts|
|294|Weighted Mean Calculator|statistics.weighted-mean / weighted-mean-calculator@1|src/calculators/statistics/catalog-batch-4.ts|
|295|Percentile Calculator|statistics.percentile / percentile-calculator@1|src/calculators/statistics/catalog-batch-4.ts|

Authority: data/catalog/master-catalog-2026.csv exact rows. Engine sources retain the internal “CalcuMint deterministic statistics engine” label, not external applicability approval. Retained docs/calculator-first/publication-readiness-540.json records legacy live observations for all four, expressly not canonical acceptance or approval. Those historic observations are not fresh production inspection.

Exclusive new paths: src/lib/worker1-statistics-a-20261117/**, src/components/worker1-statistics-a-20261117/**, src/app/admin/worker1-statistics-a-20261117/**, tests/worker1-statistics-a-20261117/**, docs/worker1-statistics-a-20261117/**.
No edits to immutable engine files, shared registry/dispatch/admission, canonical ledgers, other workers or PR1538. Central source admission and Business capability/SQL adoption belong to the coordinator. No promotion.

Planned bounded work: strict decimal dataset capture with exact raw provenance; same immutable v1 calculations; numerical refusal guards with independent witnesses; immutable historical verification separate from capture limits; Final presentation; exact-version JSON/CSV/PDF and scenarios via shared helpers; owned account actions where safe. Competent source/formula/precision/QA decisions, full-scope applicability, genuine hosted qualification and shared Business delivery remain explicit prerequisites until demonstrated.

RELEASE HOLD ACTIVE.
