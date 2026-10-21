# Scenario reporting and isolated Business acceptance — RELEASE HOLD

Baseline: cumulative draft #1465, b885fa15c137b4474467d839f5fd8a4fff39f3ff. Source PRs remain intact. No engine, registry, technical version, migration, connection or publication changes.

## Implemented

- Existing A/B/C workspace now offers a comparison report, output differences from A, signed vector charts and separate JSON/CSV/PDF report downloads. Original scenario-set fields remain unchanged; new captures can include optional immutable methodology text. Legacy captures without it remain readable. Full captured inputs/outputs/notes/context remain immutable and version-bound; reports never re-run formulas.
- Reports validate the complete capture set before serialization. Missing/nonnumeric baselines, changed label/unit contexts and overflowing differences are explicitly unavailable; original finite values and per-capture labels/units remain visible. No unit/currency inference or conversion. Nested schedules remain complete in report evidence/appendices rather than receiving invented column semantics.
- Charts require at least two comparable numeric captures with explicit display labels. Normalized geometry can conceal tiny differences; exact signed values remain in text/table/exports. UI field pagination bounds rendering without sampling exports.
- Shared PDF serializer supports full paginated tables, repeated headings and vector bars, with report/trust sections before complete raw appendices. Long labels retain their full original text with bounded continuation headings. Document title/language metadata and numeric text alternatives improve navigation/extraction; this remains an untagged PDF, with PDF/UA conformance UNVERIFIED. Latin-1 font/explicit Unicode escape limitations remain. Current registry sources/formulas enter scenario PDFs only if the captured technical version matches; Slope v1 is not annotated using current v2 definitions.
- Existing scenarios/exports entitlements gate report actions: Free is locked; Pro/Business receive identical reporting mathematics. Invalid current inputs do not destroy earlier valid captures; failures retain captures for retry. Existing account-boundary orchestration remains unchanged.
- Final trust-content review reproduced missing capture methodology in scenario reports and missing Mortgage excluded-cost text in normal PDF context. New optional capture-bound methodology preserves existing BMI/Mortgage warnings without rewriting historical captures; four red-to-green regressions verify preservation, legacy compatibility and later-UI isolation.
- Added isolated Business browser harness and mandatory CI step. Actual Business pages/actions and embed component/formula/session/event/lead handlers run against synthetic auth/storage. No product fixes were needed in the exercised Business journeys.

## Verification

- 198 focused scenario, account lifecycle, reference integration and PDF/export tests passed across16 files. New report model, PDF adapter and UI cases cover A/B/C, signs/tiny values/-0, changed units, missing/nonnumeric values, overflow, corrupt/duplicate/mixed-version captures, historical source binding, full1200-row retention, plan restrictions and failed-download retry. PDF serializer cases include all rows/columns, extreme geometry, long headings and report-first ordering.
- 36 actual Reference Six Chromium journeys passed at320px/1280px across Free/Pro/Business, zero issues. Paid journeys capture A/B/C, independently compare captured outputs with registered deterministic engines, verify differences and actual JSON/CSV/PDF downloads. Existing schedules, invalid-input recovery, keyboard/account behavior and cross-plan headline parity remain tested.
- 29 isolated Business Chromium journeys passed;210 allowed loopback requests,0 external requests,0 unhandled browser exceptions. Covers all five role matrices; rejected reads/retry; organization/project/client creation; seat cap; API key scope/quota validation/hash/disclosure/revocation and role recheck; actual embed consent/analytics handlers; original-evidence uncertain retry; changed consent and stale-version rejection. Actual application CSS declarations checked at320/1280, with Tailwind import excluded. See tests/business-browser/README.md for exact fidelity.
- Typecheck and affected lint passed after fixing demonstrated fixture/type-narrowing failures.15 certification-check tests passed; passing tests do not grant certification. `npm run build` passed using unchanged `next build --webpack`.
- External PDF inspection (`pdfinfo`, `pdftotext`) confirmed valid untagged reports, report-first reading order, exact signed/tiny values and terminal raw rows. No PDF/UA or assistive-device claim.
- Final exact-head automatic CI is recorded on the draft PR; no unchanged workflow was manually rerun.

## Acceptance and remaining gates

The424-record ledger remains55 VERIFIED /331 PARTIAL /20 BLOCKED /18 UNKNOWN. Bounded evidence is added to existing PARTIAL requirements; complete portfolio/deployed acceptance is not established. No new calculator engines; all14 private DRAFTs remain unchanged, unregistered, uncertified and unpublished. Registered SIP v1, unpublished SIP v2, Slope v1 and historical results remain unchanged.

Full Next RSC/hydration/routing fidelity, Tailwind utility fidelity, physical Android/TalkBack, live authentication/payment/provider behavior, deployed RPC/RLS enforcement, persistent API metering and seat concurrency remain unverified. Synthetic RPC outcomes do not prove atomic persistence, exactly-once delivery or production readiness. Production database/migration/Neon transition remains separately deferred by owner direction. All unverified authority requests and Mortgage/BMI specialist decisions remain UNKNOWN/BLOCKED.

## Next substantial application batch

1. Broaden report typography/accessibility only with verifiable fonts/tagging and assistive-reader evidence; preserve exact raw appendices.
2. Add full isolated Next-runtime Business acceptance with synthetic transport, extending account/recovery and API metering paths without production access.
3. Reuse existing identity/specification queues for genuinely eligible non-YMYL DRAFT engines; no speculative identities or approvals.
4. Collect owner/specialist authority separately; database rollout, providers and physical devices remain distinct release gates.

No production writes, migrations, merges, deployments, live payments, certification or publication changes. RELEASE HOLD remains active.
