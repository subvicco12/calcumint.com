# 429 — Pressure Converter decision packet

Status: **bounded PRIVATE engineering complete within the declared software contract**; full canonical engineering not established. This is not a catalog count promotion. All decisions below are **PENDING / UNSIGNED**.

## Source facts already solved

Retained UCUM 2.2 defines `[psi] = [lbf_av]/[in_i]2`. Its conventional pound is `0.45359237 kg`, standard gravity is `9.80665 m/s²`, and international inch is `0.0254 m`. Thus the exact psi factor is `8896443230521/1290320000 Pa`; the nearest binary64 is `6894.757293168362`, bits `40baeec1ddf70f99`. No new source retrieval or mathematical decision is needed to establish that relationship.

Registered `conversion.pressure@1` retains `6894.757293168`. The private ID is `conversion.pressure.source-factor-private`, revision `private-source-fixed-factor-20261109.1`; no registered successor is allocated. The offered private units are Pa, kPa, MPa, bar, standard atmosphere and psi. Bar and standard atmosphere retain their exact declared source definitions; this is not a gauge-to-absolute offset model.

## Implemented contract and evidence

The scalar signed input is an exact supplied Number, not an exact real decimal. The existing raw parser refuses digit loss/unfinished input; zero is explicitly valid and JSON-normalized. Nonidentity nonzero input uses `2^-970 <= |x| <= 2^990`; finite identity inputs are exempt. Factors are independently nearest binary64 literals, with ratio-first evaluation and relative forward bound `gamma4 = 4u/(1-4u)`, `u=2^-53`, against supplied Number times the exact source ratio.

Reused mathematical evidence: **36 directed pairs / 648 signed witnesses** within the retained shared 1,224-case qualification. The shared 35 workflow/component tests and this ID's **three native plan journeys** demonstrate controlled units/raw fields, actual Final rendering, immutable local history/A/B, exact source/revision replay, JSON download and atomic tamper refusal. Source hashes and exact packets are bound in `criteria-decisions.json`. No new tests were run for this decision packet.

## Exact actions required

- **Product/contract owner:** choose fixed scalar pressure-unit conversion with the listed units/exclusions as the offered contract, or identify actual additional requirements. Do not infer gauge/absolute reference conversion from a pressure unit selector.
- **Competent metrology/numerical reviewer:** adjudicate the retained UCUM mapping and conventional-force interpretation; review the existing nearest-factor/rounding proof, supplied-Number interpretation, range and raw-text policy against the intended accuracy requirement. A source equation does not choose the acceptable product error budget.
- **Method decision owner, with that review:** either retain v1 with an explicit accepted approximation/domain record, or select the changed-method proposal. The engineering recommendation is the source-derived nearest-factor proposal; this is not approval or allocation.
- **Authorized identity/version owner, only after selection:** allocate the exact successor tuple and adoption/replay mapping, preserving v1 history. Do not write the new factor into v1 or label the private transport revision as a registered version.
- **Applicable QA owners:** decide and demonstrate the required account/history/scenario, CSV/PDF, batch/API, accessibility, performance and other shared workflows for that selected contract. Account-backed new-method workflows are not implemented by the browser-local proposal.

No demonstrated defect remains inside the declared private calculation/replay/workspace scope. Public new-method routing/account adapters and full-scope QA remain intentionally unimplemented or unestablished pending the method/feature decision. This is not a reason to build a second private persistence system. No canonical, certification or publication promotion is granted.
