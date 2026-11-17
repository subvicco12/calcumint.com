# Exact factory successor proof

`verifyExactStage` accepts an **independently governed** policy, not a candidate-generated policy. Root integration must bind this helper, capture SHA256, predecessor commit, future frozen code commit and finite path list through its cap32/33 authority before calling it. This primitive does not itself grant authority or canonical acceptance.

Capture shape: `{kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef,codeRef,rows:[{path,predecessor,current}]}`. Records are `{path,ref,blob,bytes,sha256}`; predecessor is null only for additions. Rows and policy paths must exactly match Git's NUL-separated source diff order. Existing mathematical engines cannot change. The proof snapshots HEAD, verifies code ancestry, rejects any later source change and any dirty/untracked source, and checks both immutable record objects and live regular files. There is no mutable proof cache.

Keep original revision31 arrays and historical hashes. Add the stage to current resolution, not the historical view. Every newly added source needs a dependency graph edge. `objects.mjs` provides availability only, after independent policy authorization; all adapters lock the actual repository common directory. It does no network work on import.
