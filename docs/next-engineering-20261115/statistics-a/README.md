# Statistics A private engineering handoff

Release hold active; engineering only. Branch `engineering/next-statistics-a-20261115`, based on `7629d5a0`. No push, PR update, production change, canonical count change, existing-engine edit or shared integration edit is part of this lane.

Owned runtime export: `statisticsAContracts` in `src/lib/calculator-factory/completion/next-engineering-statistics-a.ts`. It uses the shared `createEngineeringContract` helper and reuses unchanged v1 exports. IDs and tuples:

| ID | Export | Engine ID | Slug | Version |
|---|---|---|---|---|
| 284 | zScoreCalculator | statistics.z-score | z-score-calculator | 1 |
| 285 | confidenceIntervalCalculator | statistics.confidence-interval | confidence-interval-calculator | 1 |
| 286 | sampleSizeCalculator | statistics.sample-size | sample-size-calculator | 1 |
| 287 | probabilityCalculator | statistics.probability | probability-calculator | 1 |
| 288 | permutationCalculator | statistics.permutation | permutation-calculator | 1 |

[Source bindings](source-bindings.md) give per-ID formula applicability, assumptions, capture restrictions, historical behavior and precision limits. [The manifest](evidence/manifest.json) binds six retained primary-textbook excerpts with source URLs, retrieval date/observation timestamp, and SHA-256. The connector did not provide individual scrape completion timestamps, so the record explicitly distinguishes the UTC retrieval date from a subsequent observation timestamp. There are no formula-source retrieval gaps; inherited critical constants' full decimal precision is not independently certified.

The three added capture restrictions reject collapsed confidence interval endpoints, endpoint proportions producing zero-observation planning results, and probability outputs that lose positive contributions or violate event bounds. Historical verification bypasses these new restrictions and checks the complete immutable original output, including steps. No output field is transformed, clipped, omitted or recomputed by this lane.

Validation commands, run from this worktree:

```sh
npx vitest run src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts
npx vitest run src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts src/lib/calculator-factory/completion/next-engineering-core.test.ts
npx eslint src/lib/calculator-factory/completion/next-engineering-statistics-a.ts src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts
```

- `validation/red.log`: initial test-first failure because the implementation module did not exist.
- `validation/red-guards.log`: implementation without validators, 4 expected assertion failures and 57 passes; demonstrates CI collapse, both planning endpoints and tiny-event collapse were accepted before the guards.
- `validation/green.log`: final 62 lane tests plus 2 shared core tests passed (64 total), exit code 0. Includes original-domain replay, unknown slug/version, exact field shape, output/steps tampering, independent textbook constants, zero/endpoint cases and integer overflow boundaries.
- `validation/eslint.log`: owned-file ESLint passed, exit code 0.
- A Python hash verification checked all six manifest hashes and source URL bindings successfully. No full test suite, build, publication, or release command was run.

Disposition: ready for coordinator review and integration/source qualification under the active release hold. Canonical admission, historical certification and publication remain pending.
