# Chemistry B engineering receipt — 2026-11-15

RELEASE HOLD ACTIVE. Private engineering work only. No canonical acceptance, certification, publication, production, PR1538 or count changes.

Lane: `engineering/next-chemistry-b-20261115`, base `7629d5a0`. Only the chemistry B adapter, its test, and this evidence directory are owned here. Shared registry/UI/native delivery/history dispatch remain coordinator work.

| Catalog ID | Existing engine export / ID | Immutable version | Primary / unit |
| --- | --- | --- | --- |
| 338 | stoichiometryCalculator / chemistry.stoichiometry | 1 | value / mol |
| 339 | halfLifeCalculator / chemistry.half-life | 1 | value / same as initial amount |
| 340 | nernstEquationCalculator / chemistry.nernst-equation | 1 | value / V |
| 341 | beerLambertLawCalculator / chemistry.beer-lambert-law | 1 | value / dimensionless |
| 342 | titrationCalculator / chemistry.titration | 1 | value / mol/L |

All engines remain in `src/calculators/chemistry/catalog-batch-1.ts`. `chemistryBContracts` uses `createEngineeringContract`; all immutable outputs, including `steps`, are preserved. Input fields carry explicit units.

Capture assumptions are explicit in each contract: balanced-reaction positive coefficient ratios, constant first-order half-life, standard-state dimensionless activity Q, positive whole electron transfer count, the immutable R/F constants, decadic optical absorbance with compatible units and ideal optical conditions, and quantitative titration at equivalence with matching volume units. Fractional common stoichiometric coefficient rescaling is supported; electron count is restricted to positive safe integers.

For positive initial amounts, half-life capture refuses a subnormal or zero decay factor even if multiplication by a large initial amount would return a normal result. It also refuses subnormal/zero remaining amounts. True initial zero and elapsed time zero remain supported. The first normal boundary `2^-1022` is tested. Historical verification bypasses capture-only assumptions and bounds and reproduces the exact original v1 calculation, including original underflow-to-zero behavior and fractional electron counts.

`source-captures.json` retains nine actual Firecrawl source markdown texts, returned metadata, URL, observed UTC retrieval completion timestamp, and SHA256 over each exact UTF-8 text field. `source-manifest.json` binds those hashes to applicable IDs, formula support and specific evidence gaps. OpenStax Chemistry 2e supports stoichiometry, half-life, Nernst, dimensionless Q and titration; IUPAC supports Beer–Lambert and thermodynamic activity; NIST supports R/F prefixes and SI units. OpenStax section 6.1 was inspected but does not establish Beer–Lambert and is expressly excluded from supporting evidence. NIST's retrieved constant decimals contain ellipses; the manifest distinguishes the engine's fixed digits/truncated F from the displayed source precision. These sources support formula applicability, not measurement validity or release approval.

Verification receipts:

- Red: `npx vitest run src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts` — empty contract export yielded **22 failed, 5 passed**, as recorded in `red.log`. The five refusal tests can already throw against an absent contract; positive-path tests require the actual adapter. A prior missing-module probe was replaced with this assertion-level red receipt before implementation.
- Green: `npx vitest run src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts src/lib/calculator-factory/completion/next-engineering-core.test.ts` — **29 passed (27 lane + 2 core)**; see `green.log`.
- `npx eslint src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts` — exit **0**, `lint.log` is empty.
- `npm run typecheck` — exit **0**, no diagnostics; see `typecheck.log`.
- Nine retained source-text hashes and manifest bindings checked independently with Python `hashlib.sha256` — all match.
- An initially started `npm test` was terminated on coordinator instruction to retain targeted development scope and avoid concurrent nested full-suite source fixtures. Exit **143**; `full-tests.log` is a partial receipt, **not a full-suite pass**. Aggregate qualification remains coordinator work.

Independent numeric oracles: balanced coefficients `4*2/3 = 8/3`; three half-lives of 80 give 10; Beer–Lambert `15000*1.2*0.00002 = 0.36`; titration `0.1*40*1/(25*2) = 0.08`. Nernst goldens were calculated separately with Python Decimal at 55 digits using the engine's stated constant values: at E°=1.1 V, T=298.15 K, n=2, Q=10, E=1.0704203251565940767… V; Q=0.1 gives 1.1295796748434059233… V.

Tests also cover exact tuples, field inventories, units and source URLs; malformed/blank/missing/unknown fields; capture bounds; optical zero/negative factors; titration ratio/unit invariance; Q/electron/temperature boundaries; original-domain historical replay; and rejection of wrong versions/identities, tampered values/steps, and unknown historical input/output fields for every ID.

Disposition for all five IDs: private engineering adapter and focused evidence available. Shared integration and aggregate qualification pending; no certification/publication claim. Commit is handed to the coordinator for review and push; this lane does not push.
