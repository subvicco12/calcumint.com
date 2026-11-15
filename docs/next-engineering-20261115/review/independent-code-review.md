# Independent next engineering cohort review

Reviewed `/tmp/calcumint-next-review.diff` against baseline `3ccdd6d026ca0ec51063ff4501901ac92e8ace6a`, the design and implementation plan, current integration files, immutable source engines, and retained evidence manifests. Read-only review: no repository changes or broad test-suite rerun. Parent separately owns source admission, hosted CI, Business qualification and release disposition.

## Finding

**Important — ID287's capture guard accepts a probability union rounded to certainty.**

Location: `src/lib/calculator-factory/completion/next-engineering-statistics-a.ts:51–53`.

Concrete execution reproduced directly against the TypeScript adapter:

```ts
statisticsAContracts.find(r => r.catalogId === 287)!.execute({
  probabilityOfA: '0.999999999',
  probabilityOfB: '0.999999999',
});
// output.eitherIndependent === 1
```

Both probabilities are strictly below one, so independent union probability is strictly below one: its complement is `(1-a)*(1-b) > 0` (approximately `1e-18`). The existing validator detects contributions lost when union equals the larger input, but misses saturation to one. The complete immutable output and its steps therefore present `P(A or B) = 1` as an accepted new capture, despite the cohort's endpoint refusal approach for IDs290/300. Reject this case in the capture validator while preserving original v1 historical replay; add capture-refusal and historical-preservation coverage. Parent was notified and requested the original worker implement this fix. This report records the reviewed pre-fix state; it does not claim the fix has been verified.

## Other review observations

- No critical finding or second important functional defect identified in this review.
- All20 selected IDs match the canonical inventory's named calculators:284–291,300,329,333–342. Adapter identities come directly from the correct immutable engine objects; no aliased titles or excluded identity was added by this diff.
- Strict numeric conversion rejects incomplete, lossy and underflowing raw decimals before engine validation. The common capture bounds keep arithmetic products in the reviewed chemistry formulas finite/normal, except exponential decay, which has its explicit capture guard. Combinations use the immutable BigInt calculation; permutation intermediate results are required to be safe integers.
- Historical validation calls the original schema/engine independently of capture-only numerical and applicability restrictions. Exact identity/version, exact input fields, complete structured output and recorded steps are compared; all four snapshot keys are required and extras/accessors are rejected by the snapshot copier.
- The analysis component verifies its packet before presentation, keys local state by packet and plan, clears sampled/target state on candidate-field/text changes, forward-verifies restored candidates, and exposes all immutable output fields. Candidate targets assert only exact engine-output equality, and the finite-search limitation is explicit. Baseline form edits clear the packet in the reused workbench.
- SHA-256 checks passed for every retained evidence file listed in statistics-A, statistics-B and chemistry-A manifests, and for every chemistry-B manifest text in `source-captures.json`. This confirms local retained-byte consistency, not external authenticity or source admission. Formula/unit applicability is consistent with the reviewed models and explicit limitations.
- ID291's source and runtime scope honestly distinguish the mathematical normal-distribution definition from the unqualified erf coefficients/global error. Its ±4 cutoff and finite point tests are explicitly described as engineering scope, not an error certificate. IDs285/286 similarly disclose that textbook formula evidence does not certify all digits in the inherited critical-value table. These disclosures should remain qualification limitations, without being converted into confirmed counts.
- Type-check union-shape repair and the native automation expected-ID-list update were reported by the parent during review. No full-suite/hosted-CI or authenticated-Business claim is made by this report.

## Scoped fix verification — 550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f

**The ID287 finding above is resolved in the reviewed fix.** Compared the adapter and regression-test changes from `cb652516` to `550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f`. The added capture condition rejects `a < 1 && b < 1 && eitherIndependent === 1`, without changing the immutable engine or historical replay implementation.

Independent runtime checks passed against the current tree:

- `a=b=0.999999999`: new capture throws the precision-collapse error.
- The same immutable v1 input/output still has `eitherIndependent:1`, and historical verification returns that full snapshot unchanged.
- The genuine endpoint `a=1,b=0.5` remains accepted with union1.
- The precise new Vitest regression passed:1 passed,62 unrelated tests skipped (`next-engineering-statistics-a.test.ts`, test name `interior-event union rounded to certainty`).

Also reviewed the explicit sample/witness union correction in `next-engineering.ts` (parent identifies commit `3674ec4b`). `EngineeringWitness` requires a numeric value and packet, while the refusal alternative requires an error and has absent value/packet; the target filter's type predicate matches its runtime exact numeric comparison. Independent checks produced the intended success and refusal shapes for molality candidates `4,-1` and selected only the successful exact-output witness for target2. This correction introduces no observed behavior regression. A broad TypeScript check was not repeated by this reviewer; the coordinator owns its existing check.

This was a scoped fix verification only, with no repository edits or broader review/test repetition. There are no outstanding important findings from this review after this fix. Source-admission, complete CI and authenticated Business qualification remain separate gates.

Release hold remains active; this review conveys no certification or publication authority.
