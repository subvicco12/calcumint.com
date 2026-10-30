# #485 native-source electricity component

RELEASE HOLD. Private auxiliary engineering only: no merge, deployment, production database changes, payments, certification or publication. The full Carbon Footprint Calculator remains CONTRACT_BLOCKED.

## Baseline and preserved evidence

Branch `engineering/authority485-20261030` starts at verified PR1492 head `f7912be103b596b5b8bf4a325667fd2e5a2cb30d`. Its exact-head CI41030930879 SUCCESS was verified earlier in this task; completed CI/baseline QA was not repeated.

The supplied authority ZIP SHA256 is `5d608c2e26262da2a5edc3c540a081ea0c829f2b4be4e8f3d52abb70b73c61e7`. CRC and all36 manifest-member hashes pass. All43 identities/titles match the baseline:1 SOURCE_RESOLVED research specification,16 partial,13 policy-dependent and13 qualified-applicability cases. The #485 specification content hash matches `084831055ef62fd70a652482bea25cb3beecc08d0059a71ca7cfa226ff5050c0`. These archive checks verify supplied consistency, not an external digital signature. Research files, pending owner choices and retained qualified-review requirements remain unchanged.

The native gate was previously blocked because both workbooks and all31 research captures were omitted from the authority packet, while supported-proxy downloads returned403. The user then supplied the two native files. No network/TLS bypass was used. Native inspection now resolves the original-data requirement for this specific component.

## Native files, revisions and selected cells

| Native publisher filename | Bytes | SHA256 |
|---|---:|---|
|ghg-conversion-factors-2026-full-set.xlsx|2109334|b5c4f2f86cdc74707337b2fb013b44ded189a1b528f5e29ea99856ba65ae0205|
|ghg-conversion-factors-2026-flat-format-revised.xlsx|515426|a9a455ab396dae226d510c7be6233748416d490c41a5d20f3dc7a0c45feecd5e|

Both native ZIP CRCs pass. The GOV.UK publication links use these filenames, record publication11June2026 and public update31July2026, and say the June full set was unchanged by the July flat-file missing-data correction. The files were supplied by the user; an independently downloaded publisher checksum or publisher-byte authentication is not claimed.

Full `UK electricity!E25` and revised `Factors by Category!J3066` agree. The flat row ID is `7_400_4000_5_1`; scope is2, activity UK electricity generated, input kWh, output kgCO2e. Full cellsA25:D25 and E24:H25 establish the labels and gas components. Published component factors0.12943+0.00067+0.00086=0.13096; these are already CO2e, not raw gas masses for another GWP multiplication.

Both selected numeric cells store OOXML`0.13095999999999999` with native number format`0.00000`. Apply the published five-decimal factor`0.13096`, not the serialization tail as extra precision. The verifier preserves both representations explicitly. Full sheet versionD6 is1/yearF6 is2026; revised flat Front page C5/C13 is1.2 and C14 records10July2026 internally. That internal date is distinct from the31July public update.

Full `Introduction!A38` says factors labelled2026 apply to calendar2026 activity data and describes other reporting-year approaches. This component deliberately supports calendar2026 only; it does not select majority/blended fiscal-year policy. `UK electricity!A8/A12/A22` establish owned/controlled sites, purchased grid electricity, Scope2 location-based use and multiplication by the reporting-year generation factor. Introduction A34/A35 establish CO2e units/AR5 100-year GWP already embedded.

Revised flat J3070 is genuinely missing (empty cell), while J875 is a genuine numericzero. The offline parser preserves None versus`0`, rejects a missing factor and never fills a blank withzero. It verifies hashes before parsing, evaluates no formulas and uses no floating-point conversion. `python3 scripts/verify-uk-2026-electricity-source.py --check` reproduces the native binding exactly.

## Implemented component and restrictions

`private.component.uk-electricity-scope2-location.2026`, version1, is an unregistered private auxiliary component related to catalog485. It is not a replacement or accepted mapping for the full calculator. The existing540-row reconciliation and all43 CONTRACT_BLOCKED classifications remain byte-identical. `component-manifest.json` records this supplementary status separately.

Strict input requires the exact profile, year2026, countryUK, purchased-grid/owned-controlled-sites activity, unitkWh, Scope2 and location-based basis. Quantity is a nonnegative decimal string up to1024characters. No binary float conversion occurs: BigInt rationals compute kgCO2e=kWh×0.13096 and tonnes=kg/1000. Exact decimal output is retained without intermediate/display rounding; this is exact relative to the published factor, not physical measurement accuracy. Original broad-footprint display policy remains unadopted.

Wrong years/regions/units/boundaries, market-based/onsite/Scope3 inputs, caller factors (including blank/zero), additional GWP conversion, exponents/nonfinite values and unknown fields reject. All other footprint activities, household/company/lifecycle totals, inventory completeness, statutory obligation and qualified/permitted-use applicability remain unresolved. No adverse classification is cleared by schema validation.

Exports deep-copy/freeze the complete source binding, methodology, governance,input and exact output. Replay recomputes the selected immutable version and compares the complete envelope. This rejects tampering with native hashes, scope, factor metadata, version or results; it is not a digital signature or authentication of the caller's activity facts. Free/Pro/Business calculations and exports are identical. The authenticated local fixture provides labelled responsive inputs, tab-local detached scenarios/history and actual JSON downloads; it performs no account writes.

## Validation and independent review

72 focused tests passed:20 author engine tests,27 independent numerical/replay/boundary tests,2 native verification tests,3 UI tests and20 existing snapshot regressions. Independent witnesses cover beyond2^53 integers, tiny fractional quantities and both1024-character quantity limits. The initial native subprocess test hit restricted-sandbox python3 spawnEPERM; the supported-permission rerun passed without assertion changes.

18 browser journeys passed (3 exact quantities×3 plan selections×2 widths), with exact decimal results, actual downloads/replay, detached history/restore, invalid syntax, forged activity-year rejection, source/native/proof authentication, POST/origin restrictions, labels and overflow checks.8 isolated security checks plus schema/RLS preflight,20 transport checks,45 launch guards and15 certification guards passed. Lint:0 errors/28 existing warnings. Typecheck and next build --webpack passed (37 static pages). Completed full baseline/Windows QA was not repeated.

Independent review separately verified native cells/CRCs/hashes, raw-versus-published precision, revision distinctions, missing-versus-zero and exact engine/UI behavior. No outstanding Critical/Important findings. The reviewer did not independently repeat browser/security/build campaigns. `verification.json` binds final receipts; `integrity.json` proves preservation. All2004 existing files except additive CI wiring are unchanged, including540 identities,424 acceptance records,14 original DRAFTs and historical SIP/Slope/math versions.

## Attribution and remaining gates

Source: Department for Energy Security and Net Zero, [Greenhouse gas reporting: conversion factors2026](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026). The methodology title/copyright pages state Crown copyright2026 and Open Government Licence v3.0 except where otherwise stated. `licence-extracted.json` is explicitly a three-page tool extraction, not native PDF bytes or a complete third-party-rights review. Attribution, source dates and exclusions travel with every export.

The native-source selection and bounded arithmetic are verified. Full Carbon Footprint scope, inventory boundary, additional activities, canonical mapping, rounded display policy, qualified applicability/reporting obligations and licence/permitted-use review remain separate blockers. The original43 authority cases,13 qualified-applicability cases and retained11 review requirements are not adopted, certified or published by this work. RELEASE HOLD remains active.
