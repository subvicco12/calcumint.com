# Owned project workflow completion — RELEASE HOLD

Baseline: frozen PR #1474 `2c43610bbbf8ecb7a0c53c575f24025c5254998d`. Separate branch `engineering/final-workspace-20261025`; earlier candidates remain untouched. Existing ledger and completion evidence are reused; this is not a new portfolio audit.

## Language-scope ruling

The available requirements establish currency/unit localization without changing mathematics (BP-0475-0475), regional preferences and bounded PDF glyph support. The implemented UI remains English (`html lang=en`); the existing de-DE/fr-FR choices are regional locale options, not translation catalogs. Browser hi-IN/fr-CA country hints resolve to existing English India/Canada defaults and do not establish additional script support. Arbitrary input strings and PDF language-tag syntax likewise do not establish translated interfaces or shaping support. No additional RTL/Indic/CJK requirement or remaining typography P0/P1 was demonstrated in this bounded reconciliation; no language or font scope was invented.

The selector could not represent its existing en-CA/en-AU country defaults. Those two options now appear, and the label is “Regional locale.” Country locale/currency/unit rules are unchanged. The former typography blank-fixture timeout remains retained, unconfirmed evidence; this batch does not reopen or claim to solve it.

## Completed engineering

- `/account` exposed only twelve projects, ten history records and twenty scenarios globally. Those display bounds made an older project unreachable and could make its captured scenarios disappear from the preview despite no paid project cap. `/account/projects` now browses metadata in pages of twenty; project detail pages independently page scenarios filtered by both authenticated owner and project. Cursors bind owner, collection, project and page size, preserving creation timestamps and ID ties. This is bounded output, not a claim of indexed large-account performance or transactional snapshot pagination.
- Generic owned history/reader pages now hand off an arbitrary older history ID through project pages to the existing atomic scenario-copy action. The server still rechecks owner and paid entitlements, reads owned project/history rows, validates the recorded snapshot and requires the original request UUID acknowledgment. No engine evaluation, current-version substitution or split-write fallback is introduced. Private DRAFT handoffs remain on their reviewer contract; private scenario reopen links retain `/account/drafts`.
- Project pages preserve all-plan owned reads and existing owner cleanup permissions; paid save/rename gates remain. Invalid or unavailable plan data hides mutation controls rather than masquerading as Free. Successful mutations refresh the new directory/detail routes as well as the existing account view; unconfirmed RPC results do not become acknowledged completions.
- Valid maximum-length project metadata exposed a real 320px layout defect: the detail page scroll width was 11,567px. Scoped wrapping now preserves original names/descriptions while keeping both directory and detail within 320px/1280px. Real Chromium checks find zero unlabeled controls and activate next-page navigation with keyboard Enter. Saved-name casing is preserved.

Relevant existing requirements: BP-0551-0551 (projects group calculations), BP-0327-0330 and BP-0768-0771 (saved work/projects), plus existing owner-isolation requirements. No new Free quota, project cap, language authority or acceptance status is invented.

## Validation and provenance

| Scope | Result |
| --- | --- |
| Integrated focused suite | 74 passed |
| Final full unit suite | 4,735 passed / four existing skips; 720 files passed / two skipped |
| Independent code review | No important/critical findings; independent 24 focused tests passed |
| Native Next/PostgreSQL17.6/PostgREST | 36/36 journeys; zero browser exceptions; complete cleanup |
| New native workflow evidence | 26 projects; target outside recent12; 21 project-scoped scenarios plus 25 newer scenarios elsewhere; history outside recent10 copied as exact Slope v1 input/output/result1.999; one acknowledged record; owner/project cursor replay, session change, downgrade reads and CA/AU persistence |
| Responsive/keyboard regression | Red 11,567px at 320; green directory/detail scrollWidth 320 at 320 and 1265 at 1280; zero unlabeled controls; keyboard next-page verified |
| PostgreSQL HTTP security | Eight checks plus schema preflight passed |
| Browser transport | 13 passed |
| Launch/calculator guard tests | 45 + 15 passed; no certification action |
| Lint/typecheck | Passed; lint retains 28 existing warnings/zero errors |

`next build --webpack` passed; generated tracked configuration changes were restored and the preserved-config typecheck is recorded separately. Hosted exact-head results belong to the final draft PR checkpoint after completion; no earlier candidate CI is inherited as current acceptance. Existing typography extraction/raster/fallback tests remain unchanged and ran within the full suite.

The native fixture opts into the existing guarded ATOMIC-ACCOUNT-HISTORY proposal only in disposable PostgreSQL. It verifies the unchanged original guard rejects, removes exactly that guard, records the source SHA256 and models conditional authenticated privileges without disabling RLS/triggers. The separate security fixture retains its original default. This is real local SQL/HTTP/action evidence against a repository model, not current production compatibility, reviewed deployment ownership or migration adoption.

Artifacts and retained red probes are outside Git at `/workspace/.pr1467/workspace-sprint-20261025/`. Independent review also cleared the fixture isolation, RPC acknowledgment assertions, wrapping fix and keyboard/layout helper. No production credentials or provider operations were used.

## Remaining gates

All 424 ledger identities/statuses, immutable mathematical contracts, historical calculator versions and fourteen unpublished DRAFTs are unchanged. No new calculator or SQL migration/proposal was added. Large-account index/performance evidence is unmeasured; no additional confirmed application P0/P1 remains in this reviewed scope. Genuine hosted providers, specialist/catalog authority, physical Android/TalkBack, independent PDF/UA, deployed performance and current database/recovery/adoption gates remain separate. The existing paid creation policy is preserved rather than guessing a Free project quota from broad ledger wording.

No production writes, migrations, merges, deployments, live payments, certification or publication. RELEASE HOLD remains active.
