# Mixed-category HOLD decision authorities (2026-10-11)

This is a read-only governance triage, **not** a certification, master mapping, specialist sign-off, or publication authorization. Authoritative source: `data/catalog/master-catalog-2026.csv`, `data/catalog/mixed-category-review-ledger.partial.json`, and source contracts recorded there.

## Verified ledger baseline

- Effective mixed-category review entries: **140**.
- **73 approved**, **67 HOLD**, **0 missing**.
- HOLD entries remain HOLD until an authorized adjudicator resolves identity, contract and any required specialist review.

## Explicit master-owner decisions

| Source slug(s) | Canonical candidates | Required decision |
| --- | --- | --- |
| `power-calculator`, `power-from-work-calculator` | Math **222** and Physics **308** both titled *Power Calculator* | Choose authoritative domain/identity for each implementation, or retain separate noncanonical slugs; do not conflate distinct input contracts. |
| `distance-calculator` | Geometry **277** and Travel & Everyday **511** both titled *Distance Calculator* | Resolve which domain and distance semantics the signed speed × time implementation represents. |
| `travel-time-calculator`, `time-from-distance-speed-calculator` | Travel & Everyday **510** *Travel Time Calculator* | Adjudicate two implementations against one master identity; distinguish km/kmh moving time from generic compatible-unit time. |
| `pace-calculator` | Health & Fitness **402** *Pace Calculator*; Sports **521** *Running Pace Calculator* is a different title | Decide whether generic time/distance with no enforced sport units satisfies master **402**; require applicable health specialist review before any regulated/health positioning. |
| `tip-amount-calculator`, `bill-with-tip-calculator` | Personal Finance & Household **116** *Tip Calculator* | Specify whether canonical result is tip amount, bill total, both, or a separate product; do not infer equivalence. |
| `discount-amount-calculator`, `sale-price-calculator` | Personal Finance & Household **117** *Discount Calculator* | Specify canonical output(s): discount amount versus final price. |
| `markup-price-calculator`, `margin-amount-calculator`, `profit-margin-calculator` | Business & Accounting **141** *Markup Calculator*, **139** *Gross Margin Calculator*, **144** *Profit Calculator* | Decide exact output unit and cost scope for each canonical identity; signed markup and excluded costs need explicit treatment. |
| `battery-runtime-index-calculator` | Technology & Computing **380** and Energy & Environment **482**, both *Battery Runtime Calculator* | Resolve domain/title collision and unit contract; simple capacity/load is not automatically a validated battery runtime. |
| `solar-daily-energy-calculator`, `solar-simple-payback-calculator` | Energy & Environment **481** *Solar Panel Calculator*, **480** *Solar Payback Calculator* | Decide whether simplified production and undiscounted payback are sufficiently scoped or require distinct noncanonical identities. |

All other HOLD slugs with no exact canonical title likewise require an explicit master-owner mapping, scope decision, or decision to keep outside the canonical master. An apparent similarity of formulas is not authorization.

## Specialist decision queues

- **Financial/business/property:** `solar-simple-payback-calculator`, `profit-margin-calculator`, `margin-amount-calculator`, `markup-price-calculator`, `cost-per-square-unit-calculator`, `tip-amount-calculator`, `bill-with-tip-calculator`, `discount-amount-calculator`, `sale-price-calculator`. Review calculation scope, user-facing claims, assumptions and applicable financial-risk requirements; not every generic arithmetic tool necessarily needs a regulated specialist.
- **Health/fitness:** `pace-calculator` needs a health-domain identity and scope determination before specialist sign-off is considered satisfied.
- **Food safety:** `brine-salt-calculator` must not be presented as food-preservation safety guidance; `dough-piece-weight-calculator`, `dough-total-weight-calculator`, `ingredient-from-bakers-percent-calculator` require food-domain scope review where relevant.
- **Energy/automotive:** `road-trip-fuel-calculator`, `road-trip-fuel-cost-calculator`, `fuel-cost-per-100km-calculator`, `liters-per-100km-to-us-mpg-calculator`, `us-mpg-to-liters-per-100km-calculator`, `ev-trip-energy-calculator`, `solar-daily-energy-calculator`, `solar-simple-payback-calculator` need units, assumptions and claim scope adjudication; financial claims require applicable specialist review.
- **Scientific/engineering:** `ideal-gas-pressure-index-calculator`, `resistivity-index-calculator`, `heat-energy-calculator`, `occupancy-density-calculator`, `battery-runtime-index-calculator` require domain-appropriate scope/units review. In particular, geometry factors are not resistance, gas indexes are not pressure, and occupancy density is not a code limit.

## Decision evidence required

For each candidate: record canonical master ID (or explicit noncanonical disposition), exact source slug and path, validated inputs and output units, intended user-facing claim, decision-maker and review evidence, any applicable specialist approval, and separate certification/publication gate outcome. **Do not update `decision` to `approved` or publish from this document.**
