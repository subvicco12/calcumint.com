# PR1533 exact-head CI repair

Baseline PR1533: `c26912b1799805d3b0a8ff5f4f991b19a5303fe8`. CI42328864630 failed only publication-factory; source-acceptance, full-product, checks and build passed. Failed job128270470738, step “Native registered Business API and embed acceptance”, assertion tests/native440/acceptance.mjs:24:881: expected200, received503 `{error:"Embed audit unavailable"}` on initial grant issuance. Full decoded failing-step evidence retained.

## Exact cause and correction

The fixture committed new native grant/audit DDL, sent `NOTIFY pgrst,'reload schema'`, then immediately executed grant issuance. SQL commit/notification are not an acknowledgement of PostgREST cache readiness. Pinned isolated PostgreSQL/PostgREST proof demonstrates table existence and GET200 while cached OpenAPI lacks the table, INSERT404 `{}`, and briefly missing RPC/PGRST202 after notification. Error codes are recorded as observed; this is not mislabeled PGRST204/205.

The unchanged real issuance path maps that cold-cache persistence error to503, preserving fail-closed audit requirements. Acceptance now explicitly reproduces cold-cache issuance failure, then uses a bounded, loopback-only, read-only OpenAPI handshake for every required grant/audit column and exact RPC argument contract. It fails on transport/permission/HTTP errors or deadline. Only after readiness does an independent issuance request still have to return200. Grant-writing POSTs are never polled/retried, and no security check or success assertion is relaxed. The actual publication gate and production CSP remain intact.

## Demonstrated broader throttling correction

A route-level red test demonstrated authorized malformed JSON returned400 before any quota call. Authorized valid-grant JSON/schema/domain/size/UUID refusals now pass through the existing atomic request quota and durable attribution before a4xx response. The selected key's existing per-minute/monthly values remain authoritative; no new commercial limits or entitlements. Missing/invalid request UUIDs receive a server UUID for metering. Quota/audit failures deny delivery rather than returning unmetered results.

Audit rows represent metered requests, including refusals, not exclusively successful calculations. Unreadable bodies normalize to null; a repeated usable UUID with the same normalized refusal may replay. Valid JSON/valid UUID replay/conflict and current-authority checks retain the existing semantics. No raw secret, token, input or result is persisted in this audit.

Invalid signatures, foreign origins, absent publication authority and unauthorized accounts still fail before metering; no quota owner can be invented for untrusted traffic. Page GET and grant-management issuance are not silently assigned calculation quotas. General preauthentication/edge and management-route abuse policies remain explicit operational applicability questions; no universal DoS protection is claimed.

## Acceptance and governance

Original conversion.frequency immutablev1,634 witnesses,6 precision refusals, genuine history/Business projects/scenarios and immutable export/replay evidence remain reusable. No engine/formula/version/source/reviewer records or guarded SQL adoption/reversal bytes changed. Existing mandatory CI numerical/security/certification guards remain required.

Targeted production-mode browser and applicability evidence, cold-cache proof, unit/guard/build receipts and independent engineering review are retained with the delivery. Local samples are not production/mobile SLOs; scoped keyboard/contrast/reduced-motion/layout evidence is not a full WCAG or assistive-technology certification. Canonical scope/source/formula/competent QA and applicable lifecycle decisions remain pending. Newly canonical-complete0; newly publication-eligible0; newly published0.

Production adoption remains blocked by original authenticated schema/writer/DDL-freeze/recovery/provider/secret prerequisites and separate explicit authority. No package activated. RELEASE HOLD active: no production writes, migration activation, merge, deployment, certification promotion or publication.

Exact resulting SHA and final hosted conclusion are bound in the canonical Drive delivery checkpoint to avoid a self-referential source commit.

## Local targeted results

8,013 unit tests passed,4 existing skips;52 Node guards including9 readiness cases;12 production-mode acceptance groups passed in125s. Actual malformed/missing-ID requests on a configured rate2 witness key consume two request units/audit rows; subsequent embed and API requests return429. Scoped Tab/focus/Enter error-and-recovery, reduced-motion(auto scroll,1e-5s durations), three opaque text contrasts(15.99:1), and four local response samples(129,98,85,103ms) passed. No productionSLO or full WCAG certification inferred. A new keyboard test initially supplied incomplete CDP key data; independent native-button red/green proof justified adding native keycode13/text, preserving all assertions.

AI technical review found no blocking defect; it does not supply competent formula/source/QA approval. Existing numerical and authenticated workflow evidence remains retained.
