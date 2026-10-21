# Slope consumer compatibility readiness — 2026-10-13

**Status: HOLD.** Read-only repository inspection; no runtime, registry, database, certification or publication changes.

## Verified application consumers

| Consumer | Verified behavior | Slope migration implication |
| --- | --- | --- |
| `src/app/api/v1/batch/route.ts` | Resolves **organization-owned custom calculators** by `calculatorId` and published version, parses `customCalculatorSchema`, runs custom calculator, writes batch job | This route is not a built-in Slope slug dispatch path. No direct integration required based on inspected code; separate external API consumers remain unverified. |
| `src/app/share/[token]/page.tsx` | Resolves share token to `custom_calculators`, published custom version and custom preview | This route does not decode built-in Slope snapshots. External/shared snapshot formats not ruled out. |
| `src/lib/scenario-reevaluation.ts` | Explicit complete-input allowlist of percentage and unit conversion; requires matching slug+version+review evidence | Neither Slope v1 nor v2 is eligible. Preserve HOLD. |
| `src/lib/calculation-snapshot.ts` | Copies and freezes calculator slug/version/input/output; finite JSON-domain values only | Original historical output must remain authoritative; reader validates and copies without recalculation. |
| `src/calculators/geometry/slope-versioned-compatibility.ts` | Strict isolated v1/v2 read-only decoder, no active routing | Unknown payload shapes fail closed. No automatic migration. |

## Remaining blockers and decisions

1. The active launch Slope and inactive Geometry Slope both currently declare **version 1**; the Geometry candidate must be deliberately versioned as **2** as part of a separately authorized atomic migration. This document does not change the engine version.
2. Browser storage, external clients, analytics, exports and historical metadata envelopes are not exhaustively inventoried. No claim of universal compatibility.
3. Owner-provided aggregate production SQL screenshots showed zero Slope records in inspected DB stores, but do not prove absence of other persisted payloads.
4. Preserve exact stored outputs; reject unknown top-level or mathematical fields rather than discard. Review real sanitized evidence before adding metadata support.
5. Before registry replacement: explicit runtime-integration authorization, full regression and production-build CI, publication/certification authority, and any required specialist review. No publication from registry activation alone.

**Decision:** isolated compatibility contract ready for further review; **runtime integration, version switch, registry replacement, scenario eligibility, certification and publication remain blocked**.
