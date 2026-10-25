# Supported PDF typography increment — RELEASE HOLD

Baseline: frozen PR #1473 `3a2571859b071d14b2bd9574577113fe4998472f`. Separate branch `engineering/final-typography-20261025`. Reuses the existing 424-record acceptance ledger and REFERENCE-EXPORT-UNICODE-2026-10-24 evidence; no broad audit or status promotion.

## Demonstrated corrections

1. Decomposed accents detached at the 88-cell paragraph and 19-cell table boundaries. Independent extraction reproduced an acute alone on the next line. The bundled font also gives combining accents a full cell advance; preserving slices alone cannot position them. Supported canonical compositions now render the existing composed glyph before measuring/wrapping, with nested PDF ActualText retaining the original decomposed code points. Paragraphs, table cells/padding, continuation labels and embedded ToUnicode mappings use the rendered width/glyph identity. Raw captures and JSON remain unchanged. Non-composable marks use explicit Unicode escapes instead of unsupported positioning. A supported base/mark fallback also works without Intl.Segmenter.
2. Latin-only PDF metadata treated a nonbreaking space as euro: independent `pdfinfo` read `Prix€EUR` for a `Prix\u00a0EUR` title. Nonbreaking spaces now use explicit Unicode in both PDF metadata and visible font mappings, avoiding PDFDocEncoding/WinAnsi disagreement.
3. Supported-font invisible format controls could be emitted invisibly despite the report's escape disclosure. Format controls including BOM and soft hyphen now use explicit escapes. No raw input is rewritten or mathematical value recalculated.

Eight new regressions cover composition/wrapping, original replacement text, unsupported marks/controls, normalized embedded glyph mappings and byte offsets, independent extraction, equivalent raster output, missing Segmenter support and NBSP metadata. Independent Poppler extraction/metadata checks passed; inspected raster artifacts show attached acute/macron glyphs. These are bounded synthetic evidence, not PDF/UA or physical assistive-reader acceptance.

Browser acceptance now captures decomposed accents, NBSP, unpositioned marks and invisible controls as actual scenario assumptions. JSON must retain the exact original notes; real downloaded PDFs must contain original replacement text and explicit NBSP mappings. Existing numeric-engine, plan, keyboard, layout, chart and export assertions remain.

## Verification

| Scope | Result |
| --- | --- |
| Full unit suite | 4,702 passed / four existing skips; 716 files passed / two skipped |
| Focused exporter/scenario/UI tests | 64 passed |
| Reference Six browser | Final instrumented run 36/36 passed; no issues |
| Launch/calculator guards | 45 + 15 passed; no certification action |
| PostgreSQL17.6/PostgREST security | Eight checks plus schema preflight passed |
| Browser transport | 13 passed |
| Full lint | Zero errors / 28 existing warnings; test-local reserved variable corrected |
| Typecheck | Passed; Next-generated tracked configuration restored after webpack build |
| Native Next runtime | 29/29 passed; zero browser exceptions; complete cleanup |
| `next build --webpack` | Passed |

Final exact-head hosted conclusions are recorded at the draft PR checkpoint after completion; no earlier green workflow is inherited as current-head acceptance.

The first Reference Six run passed 35 journeys, then loaded a blank final fixture and timed out without a captured application exception. It is retained and excluded from passing evidence. Subsequent navigation error checks, requested-slug binding and sanitized response/loading-failure diagnostics strengthen the harness without changing the 20-second deadline or adding retries. The isolated instrumented run passed all 36; the original timeout's cause is unconfirmed. No speculative application correction or claim of a resolved historical cause follows.

Independent review found no blocking issue in the exporter, fallbacks, PDF syntax/structure, source identity, browser assertions or subsequent diagnostics. Local artifacts, retained failures and the independent five-check/raster package are outside Git at `/workspace/.pr1467/typography-sprint-20261025/`; artifact hashes are recorded there.

## Scope and remaining gates

Relevant existing requirements: BP-0331-0334 (PDF exports) and BP-0396-0397 (professional exports consume the same structured result). All 424 ledger records retain their identities/statuses. No calculator source, engine contract, historical snapshot, migration or fourteen-DRAFT lifecycle changed. PR #1473 and earlier frozen candidates remain untouched.

This supports existing composed glyphs; it does not implement arbitrary mark positioning, RTL/Indic/CJK shaping, universal fonts or embedding of every standard-font run. Physical Android/TalkBack, independent PDF/UA, controlled deployed performance, provider acceptance, specialist/catalog authority and current database adoption/recovery remain separate gates. The scoped browser accessibility review found no demonstrated additional P0/P1; missing assistive-device evidence is not classified as an application defect.

No production access/writes, migrations, merges, deployments, payments, certification or publication. RELEASE HOLD remains active.
