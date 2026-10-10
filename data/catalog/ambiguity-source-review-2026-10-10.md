# Catalog ambiguity source review — 2026-10-10

Offline evidence only. No alias, domain assignment, certification, or publication approval.

| Master ID | Domain | Title | Candidates | Decision |
| --- | --- | --- | --- | --- |
| 308 | Physics | Power Calculator | `power-calculator`; `power-from-work-calculator` | HOLD: overlapping formulas, unverified lifecycle and contract equivalence |
| 510 | Travel & Everyday | Travel Time Calculator | `travel-time-calculator`; `time-from-distance-speed-calculator` | HOLD: differing unit/input contracts |
| 222 | Math | Power Calculator | Separate Math catalog entry | Do not infer equivalence with Physics power |

## Implementation evidence

- `src/calculators/physics/catalog-batch-1.ts`: `power-calculator` is certified; finite work and positive time; P = W/t.
- `src/calculators/launch-portfolio.ts`: `power-from-work-calculator` also divides work by time; certification equivalence has not been established.
- `src/calculators/automotive/catalog-batch-1.ts`: `travel-time-calculator` is draft; km divided by km/h yields hours, excluding stops.
- `src/calculators/launch-portfolio.ts`: `time-from-distance-speed-calculator` divides generic distance by speed, requiring compatible units.

## Required before approval

Review per-slug master domain, source file, input and output units, validation, review status and lifecycle. Keep candidates separate until reviewed. Run the 540-row audited reconciliation only with complete reviewed mappings and shared-category overrides. Registry presence is not DB publication authority.
