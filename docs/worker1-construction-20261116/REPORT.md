# Worker 1 — construction readiness cohort

Baseline: `8296454dc7244205ef4cf0b6e0b41c38f90af20f`.
Isolated branch: `worker1/high-readiness-20261116`.
RELEASE HOLD ACTIVE. No canonical/engineering qualification, certification or publication is granted by this task.

## Roster and ownership — recorded before product code

| Catalog ID | Canonical title | Immutable engine | Primary unit |
|---|---|---|---|
|343|Concrete Calculator|engineering.concrete / concrete-calculator@1|m³|
|344|Square Footage Calculator|engineering.square-footage / square-footage-calculator@1|ft²|
|345|Paint Calculator|engineering.paint / paint-calculator@1|L|
|346|Flooring Calculator|engineering.flooring / flooring-calculator@1|m²|
|348|Tile Calculator|engineering.tile / tile-calculator@1|tiles|
|349|Drywall Calculator|engineering.drywall / drywall-calculator@1|sheets|
|350|Lumber Calculator|engineering.lumber / lumber-calculator@1|board feet|
|354|Gravel Calculator|engineering.gravel / gravel-calculator@1|m³|
|355|Asphalt Calculator|engineering.asphalt / asphalt-calculator@1|kg|
|356|Excavation Calculator|engineering.excavation / excavation-calculator@1|m³|

All ten are outside the retained 61 + completed 20 = 81 qualified union, Worker3's #284–291/#300/#329/#333–342, physics #322–325/#327, and the 43 retained identity/scope blockers. The owner confirmed exclusive Worker1 reservation of #343–357 and that Worker2/Worker3 do not overlap. Final selected IDs are #343/#344/#345/#346/#348/#349/#350/#354/#355/#356. Current remote ownership must still be rechecked before intake.

Exclusive Worker1 file boundaries:

- `src/lib/worker1-construction-20261116/**`: cohort binding, bounded current capture, immutable snapshot verifier and authenticated delivery adapters/tests.
- `src/components/worker1-construction-20261116/**`: shared Final UI/workflow composition and target-specific accessibility/recovery tests.
- `src/app/admin/worker1-construction-20261116/**`: protected private integration route and server-action facade.
- `tests/worker1-construction-20261116/**`: isolated numerical/source/auth/browser acceptance only.
- `docs/worker1-construction-20261116/**`: roster, exact evidence and coordinator handoff.

No edits to existing mathematical engines, central registries/dispatch, source manifests, canonical ledgers, existing worker files, active migrations or PR1538. Any required shared dispatch/SQL extension is an explicit coordinator boundary, never inferred as installed.

## Implementation design

Reuse the existing immutable construction engines, source/formula objects, shared Final result presentation, factory workflow packets, download/scenario helpers and atomic authenticated account actions. Add one bounded cohort adapter and private typed interface, not ten duplicate engines. New captures retain raw decimal text and binary64 provenance and refuse subnormal/overflow results without changing historical v1 mathematics. Historical verification is separate from new-capture policy.

Prioritize actual missing exact-version replay, precise field units, authenticated history/scenario recovery, source-bound exports, explicit input-boundary refusal and responsive controls. Existing Business storage excludes these tuples: retain fail-closed behavior and report any unadopted Business capability explicitly. No commercial quota, applicability waiver, reviewer approval or structural-design methodology will be invented.

Validation: test-first targeted engine/packet/replay cases, independent rational/dimensional goldens, accessible UI and exports, authenticated local PostgreSQL/GoTrue/PostgREST where runtime permits, lint/typecheck. Reuse unchanged baseline evidence; no redundant full-catalog campaign.

## Reservation clarification — before replacement implementation

Owner confirmation reserves #343–357 exclusively for Worker1. The earlier provisional #359–361 are excluded from the final handoff. Their valid implementation/evidence is preserved locally at `worker1/construction-pre-reservation-20261116` / `2d0adeb745bb52a9e2bed80218d82f0efe9ac6dd`; no calculator was promoted. #345/#348/#349 replace them in the final ten. The updated roster above was recorded before implementing these three replacements.

## Final implemented result

Tested source commit: `3ddc5ee49d659fc9e7150ffdb1ff790ca085726e`. Final machine-readable per-ID receipt: `acceptance.json`. All ten remain **unpromoted** pending integrated qualification; no canonical/certification/publication approval is asserted.

| IDs | New application functionality | Remaining distinction |
|---|---|---|
|343,344,345,346,350,354,355,356|Typed dimensional inputs; finite-normal capture boundary; existing immutable v1 engine and shared Final presentation; authenticated history/owned scenarios; JSON/CSV/PDF with explicit units; immutable replay, batch row recovery, keyboard/mobile operation|Shared dispatch/source intake and Business tuple adoption remain uncompleted; full Blueprint/source/competent review not inferred|
|348,349|Same workflows plus exact normalized-input ceiling refusal witness and safe-integer capture protection|Legacy v1 returns199 where the retained mathematical formula has ceiling198. No engine/output substitution: new capture refuses the mismatch and historical verification preserves199. A reviewed immutable correction/adoption is still required for full-domain availability|

Other demonstrated defects fixed: current-capture underflow refusal no longer prevents viewing valid historical zero snapshots; read-only historical results preserve the original value and unit. Draft edits invalidate pending restore requests, including before the first calculation. Pro/Business historical JSON export retains the original snapshot, not a fabricated new packet.

## Exact validation

- 51 targeted tests passed across3 files, zero failures/skips; independent dimensional goldens, boundaries, strict packet/version/tamper rejection, scope-limited historical verification, local Pro/Business export/scenario parity, authenticated-action composition and UI recovery.
- 30 genuine isolated PostgreSQL17/GoTrue/PostgREST journeys: all10 identities independently exercised as Free/Pro/Business through the actual private Next page and existing atomic account actions. Persisted history, stable-request deduplication, foreign-account RLS denial, Pro/Business scenario save/recovery, mobile width/AX labels, blank-input stale-result removal and trusted keyboard recovery passed. Business owner context was read successfully; exact-tuple writes/native jobs remain explicitly blocked.
- 30 native Pro export downloads (JSON/CSV/PDF for each identity) completed and were read back. CSV has compiled input/result units; `pdftotext` verifies PDF title and exact unit, including superscripts. JSON retains unchanged source-bound replay packets. Local Business export parity uses the same verified helper; this is distinguished from genuine Pro download evidence.
- All2,099 copied source/configuration fingerprints match final authoring and compiled bytes, with no lower publication-reader fixture. `next build --webpack`, including full-program TypeScript, passed. Full-context standalone typecheck also passed before the final targeted changes; the final webpack run typechecked the final source.
- Lint:0 errors,1 unused-import warning in the test harness. No assertions, deadlines or quotas were weakened.
- Nine-path exact source proposal passes current bytes/Git object/parent-chain verification, plus every-path tamper, capture corruption, dirty/unknown source, whole-predecessor/HEAD reversion and symlink negatives under the existing actual common-directory availability lock. It is **not activated** in central source authority.
- Independent software review found two recovery defects, reproduced them with failing tests and verified their fixes; final review found no blocking issues. AI software review is not competent human acceptance.

The initial sparse authoring checkout omitted retained JSON imports; full disposable validation restored the complete baseline context without changing compiler settings/imports. The first browser harness stopped on CDP serialization of a DOM readiness object; boolean readiness fixed the harness. Both receipts are retained. The earlier provisional roster and successful evidence remain preserved separately and are not counted as acceptance for the final reserved ten. No redundant full-catalog unit campaign was run; exact-head mandatory CI belongs to controlled coordinator integration.

## Coordinator-owned interfaces and blockers

1. Review/pin `source-policy.json` / `source-successor.json` for exactly these9 new SRC paths; retain all existing authority and historical captures. Current source code derives only from the verified baseline plus isolated namespaced additions.
2. `verifyConstructionSnapshot(raw)` returns `{catalogId,engineId,engineVersion,scope,snapshot}` for the exact ten forward v1 tuples. Add explicit closed slug/version dispatch if accepted; do not substitute current capture execution for old snapshot verification.
3. `constructionWorkflows(id)` and `verifyConstructionPacket` use the explicit `worker1-construction-20261116.1/<engine>@1` namespace. A generic factory integration must preserve that namespace or add a separately source-bound caller adapter; never relabel old packets to bypass identity checks.
4. Existing team snapshot storage, native API/embed, metered jobs and webhook allowlists do not contain these ten tuples. Shared/SQL owners must prepare and validate exact compatibility/grants/RLS/concurrency/audit extensions before activation. This worker exposes only authenticated existing Business project context and a truthful capability hold.
5. Full canonical scope, source applicability, applicable advanced-analysis requirements and competent source/formula/precision/QA decisions remain unadjudicated. No specialist exemption, reviewer appointment or approval is invented. #348/#349 additionally need reviewed version-safe resolution of legacy ceiling defects if the full intended domain is to be supported.
6. Run controlled integrated full regression and all five mandatory exact-head jobs plus aggregate before any scoped engineering promotion. Worker1 does not modify the81-count overlay, canonical540 ledger or PR1538.

No textual shared-file conflicts: all product files are under the reserved Worker1 namespaces. The owner confirmed #343–357 are exclusively assigned to Worker1; current remote worker references were checked and showed Worker2 physics/CI and Worker3 recovery lanes, with no contrary construction assignment observed. Recheck against any later handoffs at intake.

**RELEASE HOLD ACTIVE.** No production SQL, migration activation, merge, deployment, credential change, certification, publication or billing activation. Six held publication RPCs and all existing source evidence remain unchanged.
