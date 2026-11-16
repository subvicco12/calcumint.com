# Worker 2 independent CI handoff

**RELEASE HOLD ACTIVE.** No calculator promotions or certification/count changes. Worker3 code and evidence branches and PR1538 were not modified. No full local or hosted CI was launched.

Target code: `419d56c17ca72dae58132aa00c7424b07477aa6c`.
Evidence read: `4a895fcb` on `engineering/next-cohort-evidence-20261115` (full exact readback in receipts).
Worker2 branch: `engineering/worker2-ci-acceleration-20261116`. Return the final remote SHA separately after push/readback.

## Publication corrective patch — owner application required

`publication-selector.patch` changes only `tests/milestone100-20261114/source-preflight-stage8.mjs`: prepend `capture.sourceStage10ReceiptFixture` to its existing successor selector. The capture/current source record already points at `174c42d16f0eaad9ced52069a17c239d73337b4d`; the old selector incorrectly falls through to SprintFixture at `1f4b9885c7f483c5ec2282e50d72a1fefe3e4a19`.

The patch was **not applied to any existing Worker3-owned file**. Seven targeted diagnostic tests pass, including applying the literal patch to a disposable baseline file copy and requiring that its only change equals the tested selector. The selector tests check actual ref/path/blob/length/hash/live-byte joins, unknown paths, wrong references and unchanged legacy fallback.

Worker3/coordinator must integrate this through the independently governed exact source-successor mechanism. The existing file is admitted immutable guard source: applying the diff without a reviewed capture/authority succession is expected to be refused. Do not replace an old capture, hardcode the new reference as an unconditional expected value, remove the equality assertion or treat these selector tests as full source acceptance. Then rerun the original `tests/source-lineage-bootstrap.test.mjs` and original43-case publication group with their original guards and deadlines.

## Performance findings — no current-state cache patch

- Original publication assertion reproduced locally,25026ms to failure; exact same refs/stack as hosted.
- Original targeted API/UI cases fail their5000ms limits. Node24:9419/8137ms; Node22 profiled original Vitest run:9186/8273ms. The attempted preload instrumentation did not reach Vitest's worker (its parent trace has zero calls), so that run supplies timing/failure evidence only.
- Original Node22 source-proof child fails at150109ms. Retained TAP records personal child60359ms and Stage9 child deadline failure inside `current.test.mjs`'s bounded child queue. Full seven-suite completion was not reached. The trace contains successful assertions before cancellation; it is not a missing-Git-object or deadlock diagnosis.
- Hosted source-acceptance was cancelled at the unchanged20-minute job budget. Its log has375 passed and3 failed completed outer files,924331ms summed outer test-body durations, and no full-suite summary. `parallel-source-evidence.test.ts` alone consumed357115ms, execution recovery95162ms and first-five engineering108931ms. Remaining wall time includes collection/transform/other overhead; it is not all attributed to one cause.
- Advisory execution of the unchanged transpiled API/UI test bodies, with equivalent Node assertions and real original proof dependencies, passes assertions but takes10055/8352ms. This is **not Vitest acceptance**. Its external-output trace records413/377 Git calls and7376/6356ms summed subprocess time. Both API opening and closing source proofs remain present. The UI runs its original per-read proof path.
- Worker3 already implemented immutable object and fixed tree-query priming in `primeRuntimeEvidenceBatchObjects`. Reimplementing the earlier archived proposal would duplicate completed work. Successful trace collection spent2241ms on59 Git calls before the body. Only a few diff/tree/blob calls remain inside API/UI; bulk immutable caching cannot be claimed to erase the measured mutable-status/HEAD/index cost.

Do not reuse an admitted map or mutable observation across callback/closing boundaries. No safe additional redundancy removal with a demonstrated deadline win was identified. Source lifecycle or scheduling work requires owner review and the existing mutation/refusal suites; increasing deadlines, pruning cases, bypassing genuine auth or broadening cache trust is not proposed.

## Reproduce without measurement interference

Use pinned Node22 available at `/workspace/.pr1467/sprint/node-v22.23.4-linux-x64/bin/node` in this environment, or the same version elsewhere. Original commands are listed in REPORT.md. Run timing-sensitive targets sequentially, and direct outputs outside the source worktree. The proof deliberately compares complete Git status: a Worker2 diagnostic attempt wrote new receipt files during a batch and was correctly refused. That failure is retained and no guard was weakened.

Advisory profiler invocation (use an already created external output directory):

```sh
WORKER2_PROFILE_DIRECTORY=/tmp/worker2-profile node --require ./tests/worker2-ci-acceleration-20261116/profile-subprocesses.cjs tests/worker2-ci-acceleration-20261116/original-proof-probe.mjs > /tmp/worker2-profile/proof.json
```

The probe transcodes the exact unchanged test source and substitutes only the test registration/assertion framework; dependencies still execute at their original URLs. It is diagnostic scaffolding and must not replace an acceptance test or its deadline. It never returns a cached proof verdict.

## Conflict-free intake

Only new `docs/worker2-ci-acceleration-20261116/` and `tests/worker2-ci-acceleration-20261116/` paths are committed. Every existing shared path was treated as owned, because it is changed on Worker3's branch or is part of its frozen proof dependency graph; no released ownership confirmation was received. Use Worker2's new-path commit(s) for the handoff, then let the source owner apply/admit the separate patch. Do not merge or update Worker3's branch automatically.

Remaining blockers: owner-governed publication guard admission; API/UI and nested source deadlines still failing;20-minute job still unqualified; an optimization preserving all fresh mutable observations has not been demonstrated. Hosted qualification and all20 candidate dispositions remain unchanged.
