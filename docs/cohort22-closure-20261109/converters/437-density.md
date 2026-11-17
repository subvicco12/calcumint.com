# 437 — Density Converter decision packet

Status: **bounded PRIVATE engineering complete within the declared software contract**; full canonical engineering not established. This is not a catalog count promotion. All decisions below are **PENDING / UNSIGNED**.

## Source facts already solved

Retained UCUM 2.2 defines the avoirdupois pound through 7,000 grains of 64.79891 mg, giving exactly `0.45359237 kg`. The international foot is 12 international inches, exactly `0.3048 m`. Therefore pound per international cubic foot is `28349523125/1769802912 kg/m³`; the nearest binary64 is `16.018463373960138`, bits `403004ba04035526`. The retained native source chain is sufficient for this factor; an international/survey-foot substitution is not proposed.

Registered `conversion.density@1` retains `16.01846337396`. The private ID is `conversion.density.source-factor-private`, revision `private-source-fixed-factor-20261109.1`; no registered successor is allocated. Its four units are kg/m³, g/cm³, kg/L and conventional lb/international-ft³. The method converts a supplied scalar density. It does not determine a material's density, temperature correction, composition or buoyancy.

## Implemented contract and evidence

The existing private contract uses supplied binary64 Numbers, independently nearest factors, ratio-first evaluation, normalized JSON zero, signed scalar values and strict raw-text/refusal semantics. Nonidentity nonzero input is bounded to `2^-970 <= |x| <= 2^990`; finite identical-unit conversion is exempt. Its conservative relative bound is `gamma4 = 4u/(1-4u)`, `u=2^-53`, against the exact source ratio and supplied Number. It is not an exact-decimal or unrestricted full-domain claim.

Reused mathematical evidence: **16 directed pairs / 288 signed witnesses** in the shared 1,224-case packet. The shared 35 workflow/component tests and this ID's **three native plan journeys** cover controlled inputs/units, actual Final output, immutable local history/A/B and source/revision-checked JSON recovery/download. The machine packet binds the artifacts and provenance; no numerical or browser sweep was rerun here.

## Exact actions required

- **Product/contract owner:** confirm that the offered product is scalar unit conversion with these four units and no material/temperature/composition model. If such a model is genuinely required, specify it separately rather than treating a unit factor as a material lookup.
- **Competent dimensional/numerical reviewer:** adjudicate conventional pound and international-foot applicability, the exact SI/liter relationships, nearest-factor proof, supplied-Number/raw-input semantics and bounded error/domain against the intended accuracy requirement.
- **Method decision owner, with that review:** retain v1 only with an explicit accepted approximation/domain, or select the distinct nearest-source proposal. The latter is the engineering recommendation, not an adopted method.
- **Authorized identity/version owner, only after selection:** allocate and adopt an exact successor tuple; keep every v1 result and reader unchanged. No private transport revision should masquerade as that allocation.
- **Applicable QA owners:** complete the selected contract's account/history/scenario, professional export, batch/API and full offered-scope accessibility/performance acceptance where applicable. Existing browser-local state is not authenticated account acceptance.

No demonstrated defect remains inside the declared private calculation/replay/workspace scope. New-method public/account adapters and broader QA are pending scope/adoption, not permission to duplicate persistence infrastructure. Canonical acceptance, certification and publication remain unapproved.
