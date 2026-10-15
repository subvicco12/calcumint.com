# Analytical result boundary readiness

Completion ledger — 12 October 2026 IST. Independent review proposal stacked on #1382 (`19aaedfa4380160e9ad7c863720c572dc8903436`). Source drafts remain unchanged; cumulative release review order remains #1379 → #1380 → #1381 → #1382 → this proposal. Main baseline: `caffafe639350ca0c2c2cf33ae1f099294f5af54`.

## Completed engineering

Shared scenario and sensitivity panels previously dereferenced malformed arrays/rows, skipped sparse entries during validation, and could crash. Goal Solver and analytical labels/units could also pass malformed display metadata to React. Dense runtime shape guards now contain invalid optional analysis with accessible alerts. Existing empty-array behavior and Free/applicability entitlements remain unchanged. Valid numeric values, signs, units, actual scenario inputs and order are preserved; no financial thresholds, formulas, recalculation or new approvals are introduced.

Sensitivity previously spread all values into Math.min/Math.max, producing a RangeError for 150,000 finite points. Its complete-data domain now uses iteration. More than 25 analytical rows use bounded pages; sensitivity chart and table share a page, with explicit range/total announcements and keyboard Previous/Next controls. Small datasets retain their existing layout. Replacement arrays reset paging synchronously, including returning to a previously seen array. This is input identity handling, not an invented async stale-result protocol.

A browser transition exposed repeated state updates from newly allocated invalid-data empty arrays; stable empty data and a paged-valid → invalid → original-data regression prevent that loop.

## Evidence

52 focused tests across seven files pass: shared panels, malformed analytical boundaries, actual Reference Six interactive analysis integration, Mortgage aggregate analysis and account snapshot/export boundaries. Tests prove a valid core stays visible when nonfinite optional raw analytics is rejected by the account snapshot, and Pro/Business JSON/CSV export the complete original 51-point array despite 25 visible rows. Account auth/persistence are mocked; no database writes occur. A presentation-only shape failure does not imply rejection of independently valid raw JSON output.

Actual Chromium at 320/1280 pixels checks keyboard paging, three invalid analysis alerts, recovery/page reset, bounded meters and no page overflow. It bundles real components/CSS; it is not a deployed-route or screen-reader certification.

## Remaining release requirements

Framework/accessibility owner review is required. Financial specialist approval and protected HOLD/review evidence remain unknown; no approval is granted or waived. Reused counts remain 574 registered engines, 226 code-certified candidates and 209 previously verified published manifest entries, not a fresh publication audit. Mortgage period output remains blocked on the specialist decisions documented in the existing package. Certification, publication/RLS authority, engine identity/version, formulas and production gates are unchanged. No merge, deployment or publication occurred.

No local full build, installation or extra workflow dispatch. Exact-head mandatory CI and measured Actions runtime are recorded in the draft PR. Billed Codex usage is unavailable.
