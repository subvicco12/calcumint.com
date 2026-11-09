# 439 — Torque Converter decision packet

Status: **bounded PRIVATE engineering complete within the declared software contract**; full canonical engineering not established. This is not a catalog count promotion. All decisions below are **PENDING / UNSIGNED**.

## Source facts already solved

Retained UCUM 2.2 supplies conventional pound-force `4.4482216152605 N`, international foot `0.3048 m` and international inch `0.0254 m`. Their exact moment factors are:

| Unit | Exact N·m | Nearest binary64 | Bits |
|---|---|---|---|
| lbf·ft | `3389544870828501/2500000000000000 = 1.3558179483314004` | `1.3558179483314003` | `3ff5b16e29369c65` |
| lbf·in | `1129848290276167/10000000000000000 = 0.1129848290276167` | `0.1129848290276167` | `3fbcec92e19e25dc` |

The private proposal rounds these source factors independently. Registered `conversion.torque@1` retains its old `1.3558179483314` foot factor and old divide-by-12 inch expression. Neither historical result is rewritten. Private ID `conversion.torque.source-factor-private`, revision `private-source-fixed-factor-20261109.1`, has no allocated registered successor.

The offered units are N·m, kN·m, lbf·ft and lbf·in as scalar moments of force. Equal dimensions do not turn this into an energy/work converter, force-times-lever-arm solver or vector-torque model.

## Implemented contract and evidence

Strict supplied-Number/raw-input semantics, signed scalar values, normalized JSON zero and the existing `2^-970 <= |x| <= 2^990` nonidentity nonzero bound apply. Every finite identity input is preserved. The existing ratio-first nearest-factor method has conservative relative bound `gamma4 = 4u/(1-4u)`, `u=2^-53`; exact-decimal and unrestricted full-domain claims are excluded.

Reused mathematical evidence: **16 directed pairs / 288 signed witnesses**, including the retained ordinary-scale twelve-inch geometry checks, within the shared 1,224-case qualification. The shared 35 workflow/component tests and this ID's **three native plan journeys** demonstrate real Final output, local immutable A/B/history and strict source/revision-bound JSON recovery/download. These existing artifacts are bound by the machine packet, not rerun or relabelled as competent approval.

## Exact actions required

- **Product/contract owner:** confirm scalar moment conversion and the four offered units, with no work/energy or vector/lever-arm model. Identify any genuinely required additional workflow instead of silently extending this method.
- **Competent mechanics/metrology/numerical reviewer:** adjudicate conventional-force/international-length applicability, independently rounded foot/inch factors, supplied-Number semantics, domain and the gamma4 proof against the intended accuracy requirement.
- **Method decision owner, with that review:** retain v1 with an explicit accepted approximation/domain, or select the distinct nearest-source proposal. The independent nearest factors are the engineering recommendation; no canonical tolerance or adoption is approved here.
- **Authorized identity/version owner, after selection:** allocate and adopt an exact registered tuple and version-safe replay path, preserving v1 snapshots and readers. A private implementation revision is not a registered technical version.
- **Applicable QA owners:** complete the selected contract's account-backed history/scenario, professional export, batch/API and full offered-scope accessibility/performance checks where applicable. Local JSON replay is not that account acceptance.

No demonstrated defect remains in the declared private calculation/replay/workspace scope. The unadopted public/account adapters and remaining applicability/QA decisions prevent a full catalog-engineering completion claim. No new private database framework, canonical promotion, certification or publication is authorized.
