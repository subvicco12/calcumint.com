# Current26 proof-lifecycle assessment

No demonstrated safe, narrow fourth current-observation reuse change was identified. This is a read-only architecture assessment, not a performance qualification.

Coordinator-reported actual API results under the unchanged 5000ms deadline: 6298ms, then 5262ms after immutable availability setup, then 5220ms after fixed immutable tree priming. The c33 UI/PDF test measured5164ms against5000ms (previously4548ms). These failures remain failures; no qualification is booked. Authentication passed with setup21.2s/test3374ms. Timings here are coordinator observations, not independently rerun benchmarks.

`withRuntimeEvidenceBatch` in `tests/next-cohort-20261110/source/retained-runtime.mjs` performs a complete `verifyCurrentRuntimeContext()` in both begin and end, retaining actual HEAD/status fences and per-read physical/current-byte checks. Opening and closing are different trust boundaries around arbitrary synchronous callback code. Sharing an admitted map or native observation across them would remove the closing proof's ability to discover changed source, capture, index, root or HEAD.

`verifyCurrentRuntimeContext` reaches `proveNamedCurrentContext`, private Stage8/9/10 proof construction and final stability verification. Stage10 native observations bracket supplied reader/Git/preload callbacks. An invocation-local lifetime alone does not make those callbacks mutation-free: a callback can alter or restore metadata, captures or physical source. Blanket reuse of current status, HEAD, roots or proof verdicts across nested checks would weaken existing transient-mutation refusals.

Earlier reviewed optimizations already removed immediate callback-free canonical handoff duplication, reused immutable private projections while rerunning fresh mutable proofs, and cached only immutable full-OID query bytes. The latest private transport fixes query root, diff configuration, pathspec interpretation and replacement-object semantics; it does not cache mutable observations. Original opening/closing proofs remain inside the timed operation.

A further optimization would require identifying one exact callback-free boundary and proving that its omitted observation is redundant, including existing adversarial-provider tests. This review did not identify such a boundary with a demonstrated timing benefit. There is no basis to claim that broad proof sharing preserves every original observation.

Recommendation: retain unchanged tests, assertions and deadlines. If actual full-suite/hosted execution does not pass them, record IMPLEMENTED_NOT_QUALIFIED and keep engineering80+0 unchanged. A later optimization can be separately designed and measured; do not infer qualification from warm microbenchmarks or permit a cached current verdict merely to meet5000ms.
