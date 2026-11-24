# #397 exact-scope owner and competent nutrition review

Proposal commit `65366c224207bf1498b6bd5f9ead9d99229a920a`, tree `cb6f5082d3dffb28d44d03fb34dd2da34b46f67d`. Existing prototype and three passing tests are reused. The immutable canonical v1 candidate still returns protein grams only. Preserve v1 calculation and historical replay for every existing saved result.

## Owner scope decision

Approve or revise a supplied-input arithmetic model for total energy over any caller-selected interval, without nutrient or intake recommendations. Accept positive total energy from 0.001 through 100,000 kcal, exact decimal percentages in [0,100] at up to three fractional digits and an exact 100% total. Decide whether the proposed decimal and energy limits fit the intended audience. Outputs bind each of protein, carbohydrate and fat to its allocated kcal and grams. The model derives no default ratio or personal goal.

Approve the normative units and display precision. Exact fixed-point allocations represent kcal to eight decimals; grams use positive half-up rounding to three decimals, with declared 4/4/9 kcal/g factors. Individual displayed gram values are presentation values and need not round-trip to their exact allocated energy. Testable example: 2,000 kcal at 30/40/30 gives 600/800/600 kcal and 150/200/66.667 g. Zero shares give zero. Confirm refusal for excess precision, negative or nonfinite input, percentages outside range, missing/excess fields and incomplete sums.

## Competent review decision

A qualified nutrition reviewer should record name, credentials/role, date, source edition, reviewed commit/tree and PASS, REVISE or REJECT with method rationale. Review applicability of general Atwater energy factors, domain boundaries for the intended population and purpose, presentation and source attribution. The factors are an arithmetic convention and may differ from food-specific usable energy, label values, fibre, sugar alcohol and other components. Include no treatment, adequacy, weight-change or clinical suitability claims.

Review references include the general energy-factor method in 21 CFR 101.9(c)(1)(i)(B), and the source reference carried by v1. Source applicability is an independent decision, including whether labeling rules are relevant to the selected educational use. 
[General factors reference](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/section-101.9)

## Governance after decisions

An approved new canonical version needs separately authorized allocation and exact-source review. Bind the adopted version to new captures only. Add distinct display, persistence, exports and replay evidence against its exact frozen checkout, including v1 historic roundtrips. Existing v1 must remain independently addressable and verify original bytes. No scope approval, allocation, activation, certification or publication has been recorded.
