# Fourteen-DRAFT acceptance — 20 October 2026

RELEASE HOLD. Cumulative baseline #1455 `6e697b98dc4d59d46a382a9e05f3c9a977bbb115` has passing five-workflow evidence; main verified `caffafe639350ca0c2c2cf33ae1f099294f5af54`. Existing #1441–#1455 changes and source PRs are preserved. No engine, registry, historical version, migration, billing or lifecycle changes.

## Acceptance matrix

| Capability | Status | Evidence / limitation |
| --- | --- | --- |
| Fourteen private forms/results/validation, applicable draw table and EV composition | VERIFIED | Existing 14-engine adapters; UI workflows and browser 320/1280 checks. No invented scalar charts or period semantics. |
| Free/Pro/Business mathematical parity | VERIFIED | Same engine outputs in existing 37 UI tests; no plan logic enters formulas. Entitlements govern actions separately. |
| Synthetic local save/reopen and immutable A/B/C JSON/CSV | VERIFIED | Existing history/UI tests and refreshed49-check Chromium run with30 completed downloads. Browser automation now sends an ephemeral reviewer credential before navigation. |
| Public home, directory/category, search, detail metadata/routes, related links, sitemap and publication manifest exclusion | VERIFIED | Actual surface tests reject all14 even with forged approved-slug sets. No DRAFT is in calculatorRegistry. No public registration was added. |
| Local preview authorization | VERIFIED | Per-run256-bit random Basic credential, exact loopback Host/Origin, read-only methods, no-store responses. All UI/source/Vite paths gated before serving. Invalid/previous credentials fail closed. CLI file0600 within directory0700; path-only output; SIGTERM cleanup tested. |
| Existing authenticated history/scenario action contracts | VERIFIED at mocked boundary | 53 new tests cover all14 snapshots, owner filtering/errors/version preservation and explicit analytics restrictions. This does not establish browser authentication or transport behavior. |
| Repository history/scenario RLS in disposable PostgreSQL | VERIFIED in stated fixture | Real14 serialized engine snapshots, unchanged migrations001/010/029/033, explicit modeled auth.uid and platform grants. Other owners see/copy zero; foreign ownership/project binding denied; history outputs stay unchanged; scenario rename retains snapshots; invalid versions/anonymous access rejected; failed scenario insert rolls back preceding history insert. Free downgrade denies writes while preserving own reads/deletes. |
| Authenticated private DRAFT UI and account-history reopen | BLOCKED / not implemented | Harness has no account client. Existing account list links to calculator search, not captured-input/output reopen. Existing action capability does not imply UI integration. Requires a private version-bound account workflow and isolated auth/HTTP acceptance. |
| Scenario re-evaluation/sensitivity | BLOCKED intentionally | Reviewed certified allowlists support only existing percentage/unit conversion contracts. All14 drafts reject re-evaluation/sensitivity. Metadata or local access does not authorize these features. |
| Production schema/grants/RLS equivalence, live authentication/PostgREST | UNKNOWN | No production access or experiments in this batch. Modeled local prerequisites do not attest deployed behavior. |
| Physical Android/TalkBack/password managers/interrupted-device downloads | UNKNOWN / UNVERIFIED | Chromium emulation and synthetic failure tests only; not device or accessibility approval. |

## Proven defects and corrections

1. **Retry focus race:** a pending passive focus effect could consume a newer retry interaction's restore flag before the old button unmounted. Existing isolated test passed; a React Profiler commit-phase fixture reliably reproduced expected retry button / actual body before the fix. Commit-aligned layout restoration fixes the root cause without changing auth or retry semantics. Existing user-focus preservation remains tested. No timeout inflation or assertion weakening.
2. **Unauthenticated local preview access:** loopback alone allowed any local caller to fetch UI/source. The private developer tool now requires a unique per-run reviewer credential on every request. No public auth/session system was added; owner/plan controls remain synthetic.
3. **CLI credential cleanup race found during testing:** Vite's SIGTERM listener can exit after close before asynchronous file deletion. A prepended handler removes the small private credential file synchronously before awaiting server close. The new CLI regression verifies permissions, no password in stdout, unauthorized denial, and directory/file removal.

## Private use and boundaries

Run `npm run dev:draft-preview`, open the printed loopback URL, and use username `reviewer` with the password in the printed owner-only temporary file. Read that file only in your authorized private terminal; never publish the password or expose the port. Each restart invalidates previous passwords. Basic authentication over plain HTTP is restricted to trusted loopback; it is not an Internet deployment design. Credential possession authorizes access to the developer harness, not a CalcuMint account or plan. The trusted Vite developer tool may serve allowed project source after authorization; env/.git/.aws/.codex and outside-root paths remain denied. SIGKILL/power loss cannot execute cleanup; any surviving0700/0600 file becomes invalid when that process exits.

For browser regression use `npm run test:draft-preview-browser` with installed Chromium; `CHROMIUM_PATH` and `DRAFT_PREVIEW_ARTIFACTS` can override paths. No credentials appear in report URLs. Downloads are paced for Chromium's burst limiter; the UI accurately reports a download request rather than guaranteed browser completion.

Run `npm run test:draft-persistence-postgres` against the existing local Docker daemon and pinned image. It refuses inherited remote Docker endpoints, image pulls and published ports, uses an internal network/tmpfs, and removes its container/network. A new path-scoped CI workflow explicitly pulls the pinned image then runs this isolated fixture. It never reads Supabase configuration. Database grants/auth.uid in the fixture are explicit assumptions, not inferred deployed permissions. Snapshot values derive from existing engines for persistence assertions; these are not newly independent mathematical golden vectors or certification.

## Calculator eligibility and owner decisions

No new calculator engines qualify. The existing245-entry Work package rebases to14 already implemented DRAFTs plus231 unresolved entries:173 financial/specialist,50 methodology/scope and8 existing/ambiguous. This is an implementation queue count, not an approved public crosswalk change. Master catalog540 and registry574 remain unchanged; crosswalk mapping authority remains distinct.

- **410 Sleep Calculator:** owner must choose bedtime/wake planning versus cycle scheduling, date/time scope and latency handling; clinical/empirical assumptions remain specialist-gated.
- **522 Race Time Predictor:** select model/exponent, supported distances, extrapolation limits and authoritative independent reference scope before implementation.
- **254 Root Finder:** existing engine; convergence/status and compatibility decision required, not a genuinely missing engine.
- **207/426/477/493/494/506/516/537:** existing or overlapping functionality requires explicit identity/scope decisions. Do not create duplicates or assign mappings from similar titles.

836 waiver authorities,210 source reviews,540 mapping decisions,12 HOLD dispositions and38 specialist reviews remain UNKNOWN absent authentic evidence. Mortgage/BMI and SIPv2 gates remain unchanged. Passing tests authorize none of these decisions.

## Checks and review sequence

246 affected focused tests include65 new regression/acceptance tests. Typecheck, affected lint, one local `next build --webpack`, refreshed49-check browser run and isolated PostgreSQL acceptance pass. Final exact-head CI is recorded on the draft PR; failures and retries must remain visible. No baseline full suite or unchanged SQL suite is redundantly run locally.

Review order: #1455 source experience → this cumulative acceptance/access/focus/RLS test batch → human keyboard/screen-reader and physical-device review → separately designed private authenticated snapshot reopen and version-bound analytics, if authorized. Public identity approval, specialist review, certification, publication authority and deployment stay separate. No production write, SQL application, merge, deployment or publication occurred.
