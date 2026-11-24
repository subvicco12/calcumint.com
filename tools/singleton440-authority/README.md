# Fixed two-path source authority successor (review candidate)

This is additive to the unchanged fa6e158 bootstrap. It grants no authority by its presence on this isolated branch. No admission or activation has been performed.

`nomination.json` is frozen in policy commit 0aef2ad47c61a60f05d5ec407b20cdfe5a5c232f. Its digest binds the two predecessor/successor source images, retained unchanged exact-stage verifier and immutable engine. `authority.py` rejects every candidate except 1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e and tree 209982b9a81d7bf9f4783228505b5a274563391f. No earlier fb91016 approval is accepted as a new authorization.

## Offline qualification

Run `python3 -B -m unittest discover -s tools/singleton440-authority -p test_authority.py`. Run `node tools/singleton440-authority/verify-checkout.mjs /exact/singleton/checkout`. `qualify-checkout.py` makes disposable clones and exercises source mutation, unrelated files, symlinks and wrong-head refusals. Its fixture repository path is local to the recovery workspace. These runs do not call provider APIs or issue live admission receipts.

## Reviewed execution boundary

The new workflow definition exists only as engineering source on this isolated branch. It has not been registered on the default branch, dispatched, or installed on the protected execution ref. It uses the existing environment `calcumint-source-bootstrap-runtime`, existing Drive token and pinned runtime provisioner without changing them. Only GitHub and Google Drive reads, read-only source fetch, local verification and receipt artifact upload are present. There are no production endpoints, SQL, activation functions or deployment steps.

The operator must be `subvicco12`; a different independently configured reviewer must approve the exact executor commit on a separate authority-review PR (never PR1538). New independently configured values are `CALCUMINT_SINGLETON440_WORKFLOW_SHA`, `CALCUMINT_SINGLETON440_REVIEWER` and `CALCUMINT_SINGLETON440_REVIEW_PR`. The existing frozen A7 workflow variable and approval remain unchanged. Registering this workflow, advancing the existing protected ref to the frozen executor, setting these values and executing one reviewed dispatch require separate explicit authorization. No operation has been performed here.

`execute.py` authenticates a new exact owner comment in existing document 1KU7fGtv86RQz_n3HCdl9HscTyN2Z7SlXz8U8EF3f3MY and an approved review through provider APIs. It pins executor SHA, exact policy commit/blob, package/archive, candidate/tree, operator, distinct reviewer/review ID, run ID/attempt=1, one nonce and a maximum 600-second authorization window. Authorization is checked again after exact mutable-source verification. A nonce is atomically consumed before issuing a source-only receipt. A failed retry needs new explicit authorization. A new run cannot reuse an old run's authorization, even on a fresh runner.

The protected environment gate can hold the queued run while the owner supplies its run-bound authorization. A generic chat statement is insufficient for the executable gate. `owner_comment` is the ID of the newly authored comment, supplied as workflow input; it carries no credential. Reviewer body begins `INDEPENDENT REVIEW EXACT SINGLETON440 AUTHORITY` plus canonical `review_binding` JSON. Owner body begins `AUTHORIZE EXACT SINGLETON440 SOURCE ADMISSION ONLY` plus canonical authorization JSON. Exact tuple templates belong in the frozen handoff, with run/time/nonce fields filled for that one run.

Receipt path: `$RUNNER_TEMP/singleton440-replay/admission-receipt.json`; artifact name `singleton440-source-admission-receipt`. It binds exact package, archive, policy, executor, candidate, authorization digest and run. A source-only admission receipt has `admitted:true`, `activated:false`; fixtures have `simulation:true,admitted:false`. SHA-256 detects changes but is not a signature or independent attestation. Read back the provider's exact run/job/actor/head and artifact before relying on it. No current CI source consumer or historical pin is changed by this package. Any later consumption/activation remains separately governed.

## Still required

Independent review of the new Python authority, executor and workflow; provider-path security review; protected environment/runtime readback and execution authorization. The unchanged verifier has not been represented as a new independent review. Local Node/Git tests do not claim the existing hosted pinned Node/Git were available locally. Abort on any identity, digest, source, reviewer, owner, freshness, runtime, context or replay failure. No fallback to A7 or weaker source assertions is allowed.
