# Private source-profile integration

Baseline PR #1483: `902f1ef9266fd70bfa2e01abba66971a712f202d`.

All 23 component-supported identities are reconciled in `integration-register.json`. Seven explicit bounded engineering profiles are now available through the existing authenticated reviewer directory and lookup; the public registry, APIs, publication authority and original 14 private DRAFTs are unchanged. These are proposed private contracts, not adopted canonical mappings or acceptance of each full catalog calculator.

| Catalog ID | Private profile | Scope and remaining limit |
| --- | --- | --- |
|81|Supplied deposit balance projection|Explicit effective period returns and begin/end deposits; no account/tax rules or retirement adequacy.|
|85|Supplied withdrawal balance projection|Explicit requested withdrawals with capped payment; no inflation, benefits, tax or sustainable withdrawal claim.|
|86|Supplied balance exhaustion events|Separates first exact-zero and first shortfall within supplied horizon; no lifetime or safety inference.|
|126|IRD-observed price arithmetic|Explicit historical observation profile, NZD and .15; inclusive/exclusive price only, no current-law, eligibility, returns or credits.|
|469|Disclosed lease-base arithmetic|Explicit capitalized cost, residual, total rent and count; unrounded base, no money factor, taxes or invoice rounding.|
|488|Supplied useful-heat savings balance|Explicit system/period, efficiency, SCOP, tariffs and auxiliary energy outside SCOP; no installed savings or ETL eligibility.|
|516|Weighted eligible grade points|Explicit caller-selected policy/version, scale and eligible points/credits; no institutional symbol, repeat, exclusion or program policy.|

All have distinct `private.source.ID` identities, `private-source-ID` slugs, technical version 1 and draft state. They reuse unchanged PR #1483 components. The register pins definition, shared-component/dependency and numerical-fixture hashes and gives exact input/output fields, units, limits and per-ID unresolved gaps. Finite numbers, bounded work, strict schemas and no unknown fields; raw unrounded IEEE-754 results, no statutory or institutional rounding policy adopted. Profile126 deliberately requires the caller to name the archived observed illustration; it is not a current tax calculation service. Source observations have no publisher-byte hashes and are not promoted to source completeness.

The other 16 cases (21,32,36,43,46,49,80,84,125,127,134,198,199,468,470,472) remain unintegrated. Generic ledger reuse is insufficient for their distinct accounting, statutory, provider or model contracts. Exact reasons and original gaps remain in each row; no missing-engine inference follows from this decision. All 23 full-calculator acceptances remain pending. Original qualified-review requirements and full-product branches are preserved.

Access uses the existing `requireDraftAccountAccess`, verified Supabase user, active platform role and account-session boundary. Source definitions are absent from public registry dispatch and only available in the private reviewer lookup. Directory rows explicitly label proposed limited scope; full canonical adoption and publication remain pending. Ordinary accounts and revoked roles cannot obtain reviewer input controls through the authenticated page.

Independent literal/rational examples run through the actual `runCalculator` and immutable snapshot pipeline. Browser journeys exercise directory navigation, every example, actual JSON/CSV/PDF downloads, exact snapshot/version preservation, 320/1280 layouts, invalid input focus/recovery and revocation denial. Numerical comparisons allow only floating representation tolerance; downloaded JSON must equal the actual captured output exactly. Earlier historical versions, 540 catalog identities, the 424-record acceptance ledger, prospective governance and frozen candidates remain unchanged.

Reproduce focused tests with `npm test -- src/calculators/private-source-definitions.test.ts src/calculators/private-source-integration.test.ts src/calculators/private-source-register.test.ts src/app/account/calculators/source-integration.test.tsx`; native browser acceptance uses `node scripts/test-next-runtime-browser.mjs` with existing isolated PostgreSQL/PostgREST/Chromium infrastructure. Test results and exact-head hosted CI are recorded in the draft PR; no production resources are used.

Shortest publication path: finish the unresolved full per-calculator contracts and applicable source/profile evidence; establish source-byte/revision/applicability provenance and canonical identity/version/dependency bindings; run independent full-engine goldens and complete retained qualified decisions; satisfy authorized QA/governance and explicit release authorization. Private preview availability alone grants no certification or publication. RELEASE HOLD remains active.
