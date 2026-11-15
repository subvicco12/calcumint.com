# Frozen API batch transport audit

Frozen source: `bba13b6128b51b27b9aca1e77dc20e11ee24ba53`; fixed26 source code remains `29bbd941128fe79c825450f0541f630b45b995d8`. Inspected and profiled an isolated detached worktree `/tmp/calcumint-api-frozen-bba13`, with existing node_modules linked. No tracked source changes. Live source-owner edits were excluded.

Node22.23.4 advisory probe uses the same exact52 declared paths and unchanged `withRuntimeEvidenceBatch`. This probe reads each checked path once; it is not the original Vitest acceptance case. Git batching requires an unsandboxed child in this environment; an earlier sandbox attempt timed out on its first cat-file batch and was discarded.

## Exact subprocess evidence

Successful profile: `/tmp/calcumint-api-exact-profile-2303312.json`; output `/tmp/calcumint-api-frozen-probe.log`.

- Opening full proof: 4644 ms; checked callback: 145 ms; closing full proof: 2219 ms.
- 472 Git subprocesses, 5288 ms summed child time.
- 121 live symbolic HEAD calls: 893 ms.
- 72 supplied current-src status calls: 880 ms.
- 48 native current-src status calls: 563 ms.
- 48 native index-flag calls: 394 ms.
- 48 native root calls: 330 ms.
- 26 common-dir lookups for actual object locks: 173 ms.
- 25 origin checks: 169 ms.
- Four immutable cat-file batches: 958 ms.
- All 34 diff requests and all 20 ls-tree requests have unique argv and execute once. An additional persistent immutable tree-query cache therefore does not remove those calls in this probe. This corrects the earlier proposal based only on aggregated command categories.
- The only repeated raw immutable misses were three full-OID bootstrap commit requests called twice, about 66 ms in total. No additional 1.5 seconds of redundant immutable subprocess work was established.

Live native root, current index flags, status, actual HEAD, supplied provider observations and closing proof cannot be replaced with cached verdicts. Opaque providers must preserve their current operation/refusal order.

## Same-process warm measurement

`/tmp/calcumint-api-frozen-warm-probe.log` records two identical full batches in one process. Both retain their complete opening and closing proofs.

| Batch | Opening | Callback | Closing | Total |
|---|---:|---:|---:|---:|
| First | 4788 ms | 119 ms | 2236 ms | 7143 ms |
| Second | 2013 ms | 96 ms | 1962 ms | 4071 ms |

This supports an availability warm-up strategy while keeping every full proof inside the original five-second case. It does not establish that the existing bulk-prime function alone reproduces the second-batch time: the first batch also warms unique immutable diff/tree and full-OID/path lookups.

## Concrete source-owner proposal

In `tests/next-cohort-20261110/source/retained-runtime.mjs`, provide a zero-argument, default-private-reader availability initializer which calls existing `primeRetainedImmutableObjects(readFileSync, git)`, then marks a separate batch-availability flag only after success. In the already opted-in `runtime-evidence-batch-api.mjs` facade, call that initializer at import/collection, then export `withRuntimeEvidenceBatch` as before. The batch beginning can avoid duplicate transport when the new flag is set, while retaining every original source proof. Preserve the default per-read entry points: the existing `immutableObjectsPreloaded` also suppresses `preloadRetainedImmutableObjects`, which includes an authority proof, so setting it at collection would alter those default paths before a real batch starts.

The initializer must not invoke `verifyCurrentRuntimeContext`, `proveNamedCurrentContext`, or any successful source admission; must not cache/return admitted maps or proof verdicts; and must not accept caller transports or arbitrary paths. The case retains its full opening and closing proof, live state checks, assertions, closed52 declaration and original5000ms limit. Source26/TS needs no new edit. Authority capture/admission belongs to the source owner.

After implementation, validate the actual original five-second test. The 4071ms advisory second-batch result is evidence for investigation, not acceptance or a timing guarantee. Release hold, production and canonical counts remain unchanged.
