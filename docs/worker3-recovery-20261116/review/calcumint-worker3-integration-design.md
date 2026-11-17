# Read-only coordinator adoption design — APP freeze 50240fb

This is a proposed isolated integration design, not an implemented or qualified candidate. No repository edits, merge, ledger, PR, publication, certification or production action performed. Exact path inventory is in the adjacent JSON.

## Current scope and superseding source inventory

Root chose **own-branch recovery CI plus controlled coordinator handoff**. No PR source-union implementation is requested. The isolated Worker3 candidate is not PR-integrated. PR1538 head 8296454dc7244205ef4cf0b6e0b41c38f90af20f remains read-only; acceptance ledgers and production remain outside scope.

Final application freeze is `50240fb1d59a1f8d298718f85e58bd55b4b990c2`. Its 8 delivery SRC changes add 6 paths to the original26, yielding **current32** from 3cc. The dedicated source32 owner is admitting a new fixed32 successor while preserving original26. Compared with PR829's 9 SRC paths, only portal/business overlap; the future coordinator current-source union is therefore **39 = 32 + 9 - 2**, not the earlier33. Adjacent JSON contains the independently recomputed exact39 roster and new6 paths.

A future coordinator adoption into PR must construct a new fixed39 proof stage and retain **PR cumulative23, original Stage9 cumulative18, Worker3 current26 and Worker3 current32** histories. Existing26 and new32 prove only their exact own source trees; neither grants authority to a merged39 tree. This document is a handoff design, not evidence that fixed39 exists or passes CI. Source32 capture/code/guard identities must be taken from that owner's final admitted artifact, not inferred from APP freeze alone.

The historical design below has been mechanically updated to current39 terminology. Its proposed Stage11 file names are illustrative coordinator-only names, not requested work or an authorization to implement a source union. Own-branch native CI results must identify the actual recovery HEAD and must never be reported as PR829 or fixed39 qualification.

## Observed identities and incompatibilities

- Common current-source predecessor: `3ccdd6d026ca0ec51063ff4501901ac92e8ace6a`.
- Worker3 original recovery source: `419d56c17ca72dae58132aa00c7424b07477aa6c`; final APP freeze is `50240fb1d59a1f8d298718f85e58bd55b4b990c2`; historical fixed26 code is `29bbd941128fe79c825450f0541f630b45b995d8`.
- Read-only PR1538 head: `8296454dc7244205ef4cf0b6e0b41c38f90af20f`; its private-delivery code capture is at `b404b3361faf5896544fe2b5417057502d0bbff4`.
- Git name-only queries show 32 Worker3 src paths and 9 PR src paths from 3cc, with exactly two overlapping paths: `src/components/calculator-factory-portal.tsx` and `src/lib/calculator-factory/completion/business.ts`. Exact union is 39; exactly 7 PR paths are additional to current32.
- The earlier419/829 merge-tree observation found only portal conflicting in src and business auto-merging, plus15 guard/bootstrap conflicts. That observation is historical, not a fresh50240/829 merge result. A coordinator must re-evaluate conflicts against the actual final recovery tip; Git auto-merge is insufficient evidence of a coherent proof chain.
- PR Stage9 is cumulative23 (predecessor `dc8544422dbb4ebccfc96e03431e64ebcf871fc9`, code b404). Worker3 Stage10 projects to original Stage9 cumulative18 (predecessor dc854, original code `0eb375bc79c8331f4b6250848c64d9036831e20c`) through 3cc. These differ in policies AND verifier size assertions; auto-merging their shared `source-stage9.mjs` produces an incompatible combination. A union from dc854 would be 52 paths, not 39. Keep predecessor semantics explicit.
- At original419, `source-stage10.mjs` imports only fixed26 policy and independently checks physical native source equality against its codeRef. Neither supplying historical callbacks nor adding V49 refs can make it authenticate a 39-path current tree. Calling unchanged Stage10 on a projected union must fail; this refusal is correct.

## Recommended fixed successor

Use an isolated integration branch with both original tips retained as parents/ancestors. Do not modify or push PR1538. Resolve portal by preserving both private-delivery dispatch/flow and Worker3 dispatch/analysis; review business for both existing baseline behavior and the target 20. Do not rewrite calculators. Pin the eventual merge-resolution code commit M only after source audits/export findings settle. Any later src correction requires a newly pinned capture; do not predict M or its hashes.

Add, rather than widen existing policies:

- `docs/next-engineering-20261115/source/stage11-current39.json`
- `tests/next-engineering-20261115/source-stage11-current39-policy.mjs`
- `tests/next-engineering-20261115/source-exact-current39.mjs`
- `tests/next-engineering-20261115/source-stage11.mjs`
- `tests/next-engineering-20261115/source-stage11.test.mjs`

Use the literal 39-path roster in JSON, predecessor 3cc and exact M. Capture each predecessor/current blob, byte length and SHA256, plus immutable commit content/parent proofs for BOTH branches of the join. Do not pretend a merge DAG is one linear ancestry list: record two fixed parent-edge chains and prove the M parent headers, every included commit content address, exact tips, common predecessor, and the finite allowed source delta for each parent side. The source tree at current native HEAD must exactly equal M for all src, not merely for the 39 named files. Source-identical guard-only descendants of M are permissible only under unchanged native/delta proof behavior.

Retain all original23/24/26 Stage10 captures AND policies byte-for-byte, plus the source32 owner’s final fixed32 capture/policy and its exact retained26 lineage, including their historical refs. Retain PR cumulative23 capture/policy and original Stage9 cumulative18 capture/policy independently. Existing file-name collision means archive immutable original policy/module bytes under distinct explicitly authenticated retained paths or reference their immutable Git blobs; do not overwrite one policy while claiming both remain current. Validate both captures from their original fixed refs/hashes, their original roster, predecessor/code identities and every original record. Assert union39 = sorted(fixed32 paths UNION exact PR9 paths), two exact overlaps, seven exact PR additions beyond current32. Check each nonoverlap final blob equals its owning branch; require explicit reviewed final blobs for the two overlaps. Assert original Stage9 18 and PR23 proofs retain their original dc854 baseline; their immutable claims are not substituted with 3cc claims.

Do not modify `tests/calculator-factory-source-20261112/exact-stage.mjs` or loosen `source-exact-current26.mjs`. Retained verifiers may run literally in their detached original trees as historical audits; the fixed39 verifier owns validation of their immutable records in the integration tree. Native-bound old26 cannot be honestly reported as successfully proving the current39 workspace.

The new private Stage11 capability must gate all historical projection. It must retain actual `{read,git,root}`, original current native HEAD and private WeakMap/WeakSet identity. It can expose a fixed historical view at 3cc for original Stage9/Stage8 only after every current39 native/physical proof succeeds. Fresh stability calls must re-run complete native HEAD/status/index/physical source checks before delegated callbacks and after nested proof bodies. PR23 historical retention is a separate fixed immutable-record proof, not a forged live view of PR23's source tree. If active historical callers still enter Stage10, add a separately captured, finite, explicit Stage11 handoff adapter; never silently select a policy based on caller inputs or catch old26 failures and fall back. Preserve original26 verifier and literal historical tests.

## Authority integration ownership

Coordinate with the publication selector/additive-guard owner. Do not concurrently repair their selector files. A new independently captured guard overlay must combine V49 and Worker3 accepted histories and retain both capture lineages. Avoid replacing `accepted`, rebasing away V49, or treating changed source/guard bytes as ref-only joins. `source-stage8-current-ref-join.mjs` allows only THREE unchanged original byte identities; it cannot authenticate this source union.

Expected integration touchpoints, all requiring exact newly captured guard records if changed:

- `tests/four-worker-integration-20261115/source-stage9.mjs` and policy routing: keep original18 and PR23 identities distinct; integrate the new explicit Stage11 gate.
- `tests/parallel-source-20261110/{authority,core,bootstrap,current.test}.mjs`
- `tests/milestone100-20261114/source-stage8-guard-selection.mjs`, source-preflight-stage8.mjs, source-stage8-negative-current-src.mjs and their tests; source-stage8-live.test.mjs and negative-workflow.test.mjs.
- `tests/milestone60-20261113/{source-cold-preflight.test,source-stage7-live.test}.mjs`
- `tests/completion-first-20261112/personal-stage.mjs`
- `scripts/fetch-source-lineage.mjs`
- Add one new capture installer and independent accepted/bootstrap overlay for the integration stage. Keep every existing V49 and Stage10 accepted array, independent digest, capture and fixed-path assertion intact. Extend only named ownership slots with exact records; no generic all-path ownership.

Bootstrap fetch union must include exact refs from V49, Worker3 Stage10, original18, PR23 and the new join edges/capture/guard refs. Native cold verification must demonstrate availability without relying on the developer's populated shared object store. Transport optimization belongs to the infrastructure owner and must preserve full immutable Git bytes and fresh native mutable queries.

## Gates before qualification or adoption claims

1. Confirm PR head remains the pinned read-only 829 identity; confirm baseline 81 and private #226 behavior from source/behavior evidence, not count arithmetic. Keep target20 ids exactly 284–291, 300, 329, 333–342. Potential 101 is not acceptance.
2. Resolve export-audit findings before pinning M. Any source fix changes final blobs/capture; preserve actual final ownership proofs.
3. Source-join test matrix: altered capture, every current source substitution/reversion, unexpected source, dirty/ignored/untracked src, index flags, symlinks including same-byte paths, false root, supplied/native HEAD disagreement, HEAD movement before callbacks and during final check, missing immutable object/parent, forged parent/commit/blob/path, callbacks serving authentic old tree instead of actual native tree, caller-supplied extra policy/allowlist, retained23/24/26/32 or PR23 tamper, and stale/private capability substitution. Both original branches must reject their own old source when substituted into the reviewed final overlaps.
4. Verify exact39 positive and immutable retention first, then native cold/full CI under root CPU scheduling. Keep existing security negative callback tests. Preserve Stage8/Stage9/Stage10 refusal assertions; assertions naming a genuinely changed live successor need additive successor assertions while literal originals remain covered in their historical context.
5. Native required CI on the new isolated branch and exact qualified HEAD is necessary for an own-branch CI qualification claim. Review actual job conclusions and logs; local verification, workflow dispatch, cached old-head results and inherited PR green checks are insufficient.
6. Coordinator handoff may report code/capture refs, exact source roster, negative controls, test artifacts and outstanding limitations, but is not coordinator adoption, accepted-ledger authority or publication authority. Do not write an existing acceptance ledger or claim 101 accepted. Merge, production deployment, certification and publication stay outside scope.

## Practical choice

The fixed39 design would require a new integration proof stage. Root has chosen to deliver the repaired Worker3 own-branch CI qualification attempt and this controlled adoption handoff separately. No fixed39 implementation is requested. Do not claim a merged current-source union is authenticated by existing fixed26, own-branch fixed32 or PR V49 alone.
