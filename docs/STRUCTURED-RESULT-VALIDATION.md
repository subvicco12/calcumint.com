# Structured result presentation validation

Completion ledger — 12 October 2026 IST. Review proposal only.

This independent change stacks on #1381 (`abe49dd24ca136bc0074b29106107b67e164e95d`), which stacks on #1380 and the cumulative #1379 proposal. Source drafts remain unchanged. Main baseline is `caffafe639350ca0c2c2cf33ae1f099294f5af54`.

## Completed engineering scope

Both shared result presentations previously displayed NaN/Infinity as ordinary results and could throw on malformed primary results or optional arrays. Shared inspection now rejects invalid primary/metric data with an accessible unavailable state. Invalid optional composition, ranges, series, schedule, warnings or trust data are contained locally while valid core values and unaffected disclosures remain visible. Numeric chart coordinates and range bounds must be finite; no financial bounds, range ordering, totals or new reconciliation tolerance are inferred.

Schedule validation preserves the existing declared metadata and terminal reconciliation rules and their actionable diagnostics. Legacy column alignment and plan entitlements are unchanged. The normalized adapter rejects missing primary and nonfinite core data; it does not claim complete runtime validation of every malformed normalized input.

Tests cover both renderer recovery on Free/Pro/Business, malformed arrays and sparse points, numeric coordinates/rows/bounds, finite zero/negative/tiny/string values, source immutability, normalized interoperability and actual account action rejection/recovery for the same nonfinite raw payload. Optional presentation-only errors do not invalidate independent valid raw engine exports. Account auth and persistence are mocked; no database writes occur.

Actual Chromium smoke at 320 and 1280 pixels verifies both renderers, keyboard recovery, local alerts, opened trust disclosures and no page overflow. The smoke bundles the real components and stylesheet; it is not a deployed route or screen reader certification.

## Release boundaries

Blueprint result reconciliation, cross-plan parity and Reference Six obligations are addressed only within this presentation boundary. Existing formulas, certified definitions, publication authority, RLS and specialist approval gates remain unchanged. Reused inventory: 574 registered engines, 226 source-code certified candidates, 209 previously verified anonymous published manifest entries. These are separate counts, not new approvals or a fresh database audit. Protected specialist/HOLD evidence remains unknown. Mortgage period outputs remain blocked on the financial decisions in the existing specialist review package.

Review requires the shared framework/accessibility owners. Financial specialist approval, certification activation, publication, merge and deployment are not performed or waived by this change.
