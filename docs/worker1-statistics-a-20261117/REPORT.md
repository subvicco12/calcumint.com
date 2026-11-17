# Statistics cohort A — isolated worker acceptance

Baseline `6fa8f87433ee8434d1d89aaf93deea0216eb17cb`; tested source commit `ad4d574296d4684a06f2efd99cf80600d166e3fc`; branch `worker1/statistics-a-20261117`.

## Delivered

Four exact catalog identities and unchanged registered v1 engines: #292 Correlation, #293 Linear Regression, #294 Weighted Mean, #295 Percentile. Ownership was recorded in ROSTER.md before implementation. New files remain under worker-owned namespaces only. No shared registry, source manifest, historical engine, canonical ledger or PR1538 edit.

Added a private authenticated-admin statistics page with comma-separated observations, strict decimal validation, Final results/metrics, accessible labels/errors, raw-text packet provenance, local scenarios/batch row recovery, JSON/CSV/tagged-PDF downloads, owned history/project scenarios and array-aware recovery. Uncertain history/scenario transport uses stable request IDs. Draft edits invalidate late restore responses. Legacy records that cannot satisfy current capture precision open read-only rather than being recalculated or silently replaced.

Three independently demonstrated v1 precision defects are refused only by the new private capture:

- #294: equal-weight `[1e50,1,-1e50]` produces v1 zero; exact normalized-input mean is 1/3.
- #293: X=`[10000000000000000,10000000000000002]`, Y=`[0,1]` produces v1 slope 0.25; the two-point slope is 0.5.
- #295: observations `[-1e16,1e16]`, percentile `50.00000000000001` produce v1 2; p is exactly 50 + 2^-47 in binary64, giving exact linear interpolation about 1.4210854715202004.

Exact rational witnesses check normalized binary64 inputs and refuse disagreement; they never replace engine outputs. Private relative-agreement threshold 1e-12 is explicitly a refusal boundary, not certification or a historical rounding change. Capture inputs retain the declared private bounds: zero or magnitudes 1e-50 through 1e50, comma-separated fields, at most 10000 observations per field, shared 64KiB packet / 100-row batch limits. Historical verification bypasses capture-only restrictions and checks exact v1 forward agreement. No engine successor or canonical methodology adoption is asserted.

## Actual validation

- Baseline statistics: 28 passing tests.
- Final affected category/workflow run: **63 tests / 7 files passed, no failures or skips**. Includes 14 cohort tests, 7 UI tests, 6 action-composition tests and 36 retained category/workflow tests.
- Genuine disposable PostgreSQL17 + GoTrue + PostgREST: **12 calculator/plan journeys passed** (four IDs × Free/Pro/Business). Actual atomic account actions, concurrent same-request idempotency, exact history/scenario persistence and replay, cross-owner RLS, foreign project denial, stale owner, forged output, missing session and Free scenario denial.
- Business owner/member reads, nonmember denial and immediate post-revocation denial passed; delivery remains explicitly unavailable for these tuples.
- Full-context TypeScript passed after restoring unchanged imported documentation omitted by sparse checkout. The initial sparse-context failure and its log are retained; neither application types nor guards were weakened.
- Targeted ESLint passed without errors or warnings. Red/green numerical and UI receipts retained.

The genuine action acceptance replaces server-cookie transport with a fixture SDK session and makes Next cache revalidation a no-op. It **does not replace authentication, authorization, SQL, RLS, quota policy or account mutation actions**. This is genuine authenticated database/action evidence, not native browser/cookie, hosted or production qualification. The UI evidence is jsdom; mobile browser and screen-reader journeys remain unexecuted. Local PDF/CSV/JSON helper validation is not a claim of native download readbacks. Full regression, webpack build and exact-head hosted CI remain integration prerequisites.

## Individual dispositions and remaining blockers

All four: **ADVANCED_NOT_QUALIFIED**, zero promotions. Detailed per-ID evidence is in acceptance.json.

#292 retains Pearson paired-observation scope; #293 retains ordinary least-squares y-on-x; #294 retains strictly positive paired weights; #295 retains the existing h=(p/100)(n−1) convention. The catalog establishes titles, and the engine metadata establishes current implementations; neither establishes complete canonical scope or external source applicability. Existing internal engine-source labels are retained, never represented as authoritative publisher evidence. The historical readiness register's legacy live observations are not fresh production verification or full canonical acceptance.

Coordinator-owned boundaries:

1. Review/admit the exact new source objects in source-bindings.json. No central admission is activated by this worker.
2. Bind `verifyStatisticsSnapshot` for exact slugs `correlation-calculator@1`, `linear-regression-calculator@1`, `weighted-mean-calculator@1`, `percentile-calculator@1` in generic historical replay, if accepted. Do not route historical records through the new capture guards or relabel retained packet namespaces.
3. Decide/review exact shared Business storage/native/job tuples and ACL/SQL prerequisites. Workspace reads do not authorize shared writes, API/embed grants, jobs or webhooks; all remain fail-closed. This worker makes no held SQL edits.
4. Run native browser/mobile/accessibility, native export readback, full regression, production webpack and exact-head hosted CI after integration.
5. Obtain competent full-scope, source/formula/precision and QA decisions. No source applicability, reviewer identity, specialist exemption, canonical acceptance, certification or publication approval is invented.

No production connection, writes, migrations, permissions, credentials, merge, deployment, certification or publication. **RELEASE HOLD ACTIVE.**
