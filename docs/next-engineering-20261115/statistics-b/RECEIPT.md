# Statistics B lane verification receipt

Date: 2026-11-15 UTC. Branch: engineering/next-statistics-b-20261115. Base: 7629d5a0. Worktree: /workspace/calcumint-stats-b.

RELEASE HOLD ACTIVE. Implementation is private engineering completion evidence. Publication/certification and canonical counts remain pending. No push performed.

## Changed files

- src/lib/calculator-factory/completion/next-engineering-statistics-b.ts
- src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts
- docs/next-engineering-20261115/statistics-b/SOURCES.md
- docs/next-engineering-20261115/statistics-b/source-retrievals.json
- docs/next-engineering-20261115/statistics-b/nist-combinations.md
- docs/next-engineering-20261115/statistics-b/nist-binomial.md
- docs/next-engineering-20261115/statistics-b/nist-normal.md
- docs/next-engineering-20261115/statistics-b/openstax-bayes-excerpt.md
- this receipt

## Verification

TDD red: first targeted Vitest invocation failed because ./next-engineering-statistics-b did not exist. Test module was created before the contract implementation.

Final focused Vitest invocation:
```
npx vitest run src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts src/lib/calculator-factory/completion/next-engineering-core.test.ts src/calculators/statistics/catalog-batch-3.test.ts src/calculators/statistics/catalog-batch-4.test.ts src/calculators/statistics/catalog-batch-4-probability-boundaries.test.ts src/calculators/statistics/catalog-batch-4-boundaries.test.ts
```
Exit 0; 6 files / 56 tests passed (new lane 20, shared core 2, existing batch3 11, batch4 11, probability boundaries 6, other boundaries 6).

Focused ESLint:
```
npx eslint src/lib/calculator-factory/completion/next-engineering-statistics-b.ts src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts
```
Exit 0, no diagnostics.

TypeScript: `npx tsc --noEmit --pretty false` exit 0, no diagnostics. Repeated after final source edits, exit 0.

Source artifact hashes were independently recomputed using Python hashlib.sha256 and compared to all four manifest digests; all matched.

## Dispositions

289: private contract ready within exact integer engine limits.
290: private contract ready for independent fixed-p Bernoulli model and nonsubnormal, nonsaturated positive PMF results; exact degenerate boundaries retained.
291: private contract ready only for disclosed approximation, |z|≤4 and finite normal positive density/nonsaturated tails. Coefficient provenance and global error bound remain unqualified; this lane makes no certification claim.
300: private contract ready for supplied complementary-hypothesis probabilities, positive evidence and nonsaturated interior posterior.
All: historical forward replay retains original v1 schemas and results; new capture policies do not constrain historical agreement. All structured outputs retained. Parent owns registry/UI/native/history integration and remote push.

Not run: full repository tests, build, authenticated UI flows or production checks. Focused engine/capture tests, lint and project TypeScript do not establish release authorization.
