# Independent review: native-bound UK2026 electricity component

Baseline: `f7912be103b596b5b8bf4a325667fd2e5a2cb30d`. Reviewed the current additive branch: native source binding/verifier and retained research package, exact calculator/schema/export/replay, private UI/history/import/export, browser harness and CI step. No outstanding Critical or Important findings. RELEASE HOLD remains active.

## Native provenance and gate

The earlier research ZIP alone did not satisfy the specification's original-workbook/native-cell gate. The two subsequently supplied originals now permit that gate to be checked for this bounded component:

- Full set SHA256: `b5c4f2f86cdc74707337b2fb013b44ded189a1b528f5e29ea99856ba65ae0205`.
- Revised flat SHA256: `a9a455ab396dae226d510c7be6233748416d490c41a5d20f3dc7a0c45feecd5e`.
- Independently checked both original attachment and retained native copies; ZIP CRCs pass. The retained research ZIP exactly matches its attachment, and all 36 declared member SHA256 hashes pass. Its 43 blocked identities/titles and proposed specification content hash were independently reconciled previously.
- Independently inspected workbook cells with a separate workbook reader and raw OOXML. Full `UK electricity!E25` and flat `Factors by Category!J3066` agree on the five-decimal displayed factor `0.13096`. Flat `A3066` is `7_400_4000_5_1`; adjacent cells establish Scope 2, UK electricity, Electricity generated, Electricity: UK, kWh and kg CO2e. Full row 25 identifies reporting year 2026.
- Full worksheet version is 1.0. Revised flat front-page version is 1.2; its native internal update date is 2026-07-10. This is distinct from the publication-page public update date 2026-07-31 and initial publication 2026-06-11.
- Both factor cells have number format `0.00000`. Raw OOXML stores `0.13095999999999999`; the implementation correctly uses published five-decimal precision and retains the serialization tail separately. Gas-component published factors `0.12943 + 0.00067 + 0.00086` sum to `0.13096` and are already expressed as CO2e; additional GWP multiplication would double-convert them.
- Revised flat `J3070` has an empty native cell without a numeric value; `J875` stores numeric zero. Independent raw-XML inspection confirms this distinction. The verifier rejects the blank as a factor and keeps genuine zero separate. The revision notice explicitly describes correcting unavailable data that had incorrectly been shown as zero.

User-uploaded bytes, publisher filenames/URLs and native contents are corroborated. No independent publisher download SHA, digital signature or equivalent authentication is established. Retained extracted publication/licence material is clearly labeled as extracted evidence rather than original PDF bytes. Attribution and OGL v3.0 with exceptions are stated; third-party rights and qualified inventory applicability remain separate.

## Numerical and scope review

The component uses integer/rational arithmetic on decimal strings, multiplies exactly by `13096/100000`, and divides exactly by 1000 for tonnes. It does not convert quantities through binary floating point or round intermediate/display results. The 1024-character quantity bound limits resources, not applicability.

The owned independent test file contains 27 passing tests. Literal Decimal-derived witnesses include `123.456` kWh, a quantity beyond JavaScript's safe-integer limit, very small decimals, leading zeros and long fractional quantities. Both 1024-character integral and fractional boundaries are checked. Unsupported syntax, floats, wrong profile/year/country/activity/unit/scope/basis, caller factors and extra GWP fields are rejected. Complete export metadata is detached/frozen; replay recomputes and rejects altered inputs, outputs, source or extra fields.

The permitted scope is only UK calendar-year 2026 purchased grid electricity at organisation-owned/controlled sites, Scope 2 location-based. Market-based figures, transmission/distribution and WTT Scope 3, onsite generation, other years/regions and other footprint activities remain excluded. No statutory reporting obligation or qualified organisational boundary is decided.

The full catalog #485 remains `CONTRACT_BLOCKED`; canonical mapping, full footprint completion, certification and publication are not granted. No public registry entry, alias, reconciliation promotion or prior engine/history change is introduced.

## Verification performed

- Independent numerical tests: 27 passed; owned test-file lint passed.
- Final focused author/independent engine plus UI run: 50 tests passed across three files.
- Direct offline native verifier `--check`: passed, reproducing the retained binding from workbook SHA/CRC, cells, formats, units, revisions, reporting year and missing-versus-zero checks.
- Independently rechecked retained native-file hashes/CRCs and research archive bytes/member hashes.
- UI/harness inspection confirms clear scope/governance text, labeled quantity/plan/import controls, edit-driven stale-result/export removal, immutable tab-local history, verified restoration, actual download/replay assertions and forged-boundary rejection.
- The browser harness specifies 18 journeys: three exact quantities × three plans × two widths, plus authenticated fixture/source/workbook/proof and method/Origin checks. This reviewer did not independently run that browser campaign or broad baseline/full QA.

No numerical or native-binding defect was demonstrated in this review. Implementation of this narrowly exposed private component is supportable on the inspected evidence; this finding does not release the whole Carbon Footprint calculator or waive its remaining source, applicability and lifecycle requirements.
