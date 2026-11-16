# Worker 1 — construction readiness cohort

Baseline: `8296454dc7244205ef4cf0b6e0b41c38f90af20f`.
Isolated branch: `worker1/high-readiness-20261116`.
RELEASE HOLD ACTIVE. No canonical/engineering qualification, certification or publication is granted by this task.

## Roster and ownership — recorded before product code

| Catalog ID | Canonical title | Immutable engine | Primary unit |
|---|---|---|---|
|343|Concrete Calculator|engineering.concrete / concrete-calculator@1|m³|
|344|Square Footage Calculator|engineering.square-footage / square-footage-calculator@1|ft²|
|345|Paint Calculator|engineering.paint / paint-calculator@1|L|
|346|Flooring Calculator|engineering.flooring / flooring-calculator@1|m²|
|348|Tile Calculator|engineering.tile / tile-calculator@1|tiles|
|349|Drywall Calculator|engineering.drywall / drywall-calculator@1|sheets|
|350|Lumber Calculator|engineering.lumber / lumber-calculator@1|board feet|
|354|Gravel Calculator|engineering.gravel / gravel-calculator@1|m³|
|355|Asphalt Calculator|engineering.asphalt / asphalt-calculator@1|kg|
|356|Excavation Calculator|engineering.excavation / excavation-calculator@1|m³|

All ten are outside the retained 61 + completed 20 = 81 qualified union, Worker3's #284–291/#300/#329/#333–342, physics #322–325/#327, and the 43 retained identity/scope blockers. The owner confirmed exclusive Worker1 reservation of #343–357 and that Worker2/Worker3 do not overlap. Final selected IDs are #343/#344/#345/#346/#348/#349/#350/#354/#355/#356. Current remote ownership must still be rechecked before intake.

Exclusive Worker1 file boundaries:

- `src/lib/worker1-construction-20261116/**`: cohort binding, bounded current capture, immutable snapshot verifier and authenticated delivery adapters/tests.
- `src/components/worker1-construction-20261116/**`: shared Final UI/workflow composition and target-specific accessibility/recovery tests.
- `src/app/admin/worker1-construction-20261116/**`: protected private integration route and server-action facade.
- `tests/worker1-construction-20261116/**`: isolated numerical/source/auth/browser acceptance only.
- `docs/worker1-construction-20261116/**`: roster, exact evidence and coordinator handoff.

No edits to existing mathematical engines, central registries/dispatch, source manifests, canonical ledgers, existing worker files, active migrations or PR1538. Any required shared dispatch/SQL extension is an explicit coordinator boundary, never inferred as installed.

## Implementation design

Reuse the existing immutable construction engines, source/formula objects, shared Final result presentation, factory workflow packets, download/scenario helpers and atomic authenticated account actions. Add one bounded cohort adapter and private typed interface, not ten duplicate engines. New captures retain raw decimal text and binary64 provenance and refuse subnormal/overflow results without changing historical v1 mathematics. Historical verification is separate from new-capture policy.

Prioritize actual missing exact-version replay, precise field units, authenticated history/scenario recovery, source-bound exports, explicit input-boundary refusal and responsive controls. Existing Business storage excludes these tuples: retain fail-closed behavior and report any unadopted Business capability explicitly. No commercial quota, applicability waiver, reviewer approval or structural-design methodology will be invented.

Validation: test-first targeted engine/packet/replay cases, independent rational/dimensional goldens, accessible UI and exports, authenticated local PostgreSQL/GoTrue/PostgREST where runtime permits, lint/typecheck. Reuse unchanged baseline evidence; no redundant full-catalog campaign.

## Reservation clarification — before replacement implementation

Owner confirmation reserves #343–357 exclusively for Worker1. The earlier provisional #359–361 are excluded from the final handoff. Their valid implementation/evidence is preserved locally at `worker1/construction-pre-reservation-20261116` / `2d0adeb745bb52a9e2bed80218d82f0efe9ac6dd`; no calculator was promoted. #345/#348/#349 replace them in the final ten. The updated roster above was recorded before implementing these three replacements.
