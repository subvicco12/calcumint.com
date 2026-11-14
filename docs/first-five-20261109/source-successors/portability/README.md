# PR-ancestor helper portability overlay

The original local helper capture5dc04a0b91d807f72843d3d5c8cc868c26a35e07 was cherry-picked into the existing PR as4467b5960ce73cd7851332f7248e4d2673dad70b. Direct local Git comparison established identical blob958188aab571cadcdb1e5d27af618a25355da9ab and SHA256b1f1c087026cd35877878533384cd17c2c14b2dfb6b69882727ad27d437be293. Original capture documents remain unchanged historical facts.

The two active metadata references now use integrated4467; local5dc is not an active intermediate or bootstrap requirement. Former eecc helper bytes remain in the existing intermediate chain. No helper/application bytes, historical claims, known receipt hashes, guard algorithm, budget or acceptance assertion changed.

Three new focused tests first failed the active-ref/provenance expectations, then passed after the metadata-only correction. They verify absence of unpublished5dc from active completionSourceRefs, exact integrated bytes matching the original capture recorded in this overlay, historical predecessor admission with current proof, source-reversion refusal and integrated provenance substitution denial. They do not require the original local commit object, so shallow remote checkouts need only integrated PR history.

A separate read-only full-repository ancestry check verified all42 current completionSourceRefs are ancestors of inspected PR head8ed333510b767caa0afc58d34b7eefbf1eabdce7. This fact is retained in ancestor-check.json; the check is not imposed on depth-one CI ancestry traversal, where shallow boundaries hide relationships. The existing exact-source fetch mechanism still requests immutable integrated refs.

Commands:

    node tests/first-five-20261109/lineage-portability.test.mjs
    node tests/first-five-20261109/crossed-dependency-source.test.mjs

Both modules passed3 tests each. One sandbox ancestry attempt hit spawnSync git EPERM; approved read-only retry verified all42. Red/green focused logs are retained. No branch or remote push was performed; this isolated checkout is detached. The prior automatic-review rejection of a new remote evidence branch is respected; no alternate remote publication path was attempted.
