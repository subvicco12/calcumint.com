# Construction B acceptance completion

Implementation baseline: `1ca43924c2e389f160f74e74b5eb8b40063969e8`, branch `worker1/construction-b-20261118`.

Acceptance ownership: Worker3, isolated branch `engineering/worker3-construction-acceptance-20261118`. Changes belong to this evidence directory and `tests/worker3-construction-acceptance-20261118/`, plus construction-owned fixture types and the demonstrated restore-confirmation fix with regression tests. Original v1 engines/capture/account contracts, shared Business delivery files, physics files and coordinator integration/CI harness remain unchanged.

The existing32 tests are retained with byte/hash bindings in `implementation-bindings.json`. A production-build TS2352 failure required a type-only fixture correction:14 affected tests were rerun and passed. The genuine browser then found a disappearing restore confirmation caused by packet/key changes. Five new regression tests cover JSONB ordering, intentional scenario restore and late draft/profile/owner changes; these and nine original portal tests pass. Nine unchanged account-composition tests are reused. Type-erased JavaScript equality is recorded in `fixture-type-repair-equivalence.json`. The new producer exercises previously missing genuine authentication/RLS/native-browser/download boundaries. It uses existing internal Docker fixtures and the existing Next production-build runtime with `conditionalPublicationFixture:false`. No repository certification reader is replaced. The private admin route is unchanged, as are its real server actions, CSP and application sources. Fixture plans/admin access/membership setup is local test arrangement, not a reviewer attestation or billing acceptance.

Run from the repository root with the locked dependencies and the existing immutable Docker images installed:

```sh
WORKER3_CONSTRUCTION_ARTIFACTS=/tmp/construction-b-acceptance node tests/worker3-construction-acceptance-20261118/auth-browser.mjs
```

External database selector variables are refused. The producer creates only uniquely named disposable internal Docker resources with no published database/auth ports. Browser screenshots, native AX output, completed native downloads, request metadata and redacted receipts are retained. Execution credentials stay in memory. Production-equivalence is UNKNOWN; the local schema is the repository model plus its pre-existing reviewed guarded bundle adopted only in the disposable fixture.

Each calculator remains **IMPLEMENTED_NOT_QUALIFIED** until its full applicable engineering contract, source/precision decisions, coordinator admission, integration and exact-head CI are satisfied. A passing browser or local schema test alone does not qualify an identity. Existing engine `reviewStatus` metadata does not establish canonical acceptance.

| ID | Immutable engine v1 | Remaining source/precision decision |
|---|---|---|
|347|engineering.roofing|Review gable-equivalent area, slope/roofing-square and supplied waste assumptions; ft² convention; binary64 sqrt/product envelope and suitable tolerance.|
|351|engineering.stair|Review supplied target-riser model, exact entered-decimal ceiling refusal versus historical tolerant v1 result; no code-compliance approval.|
|352|engineering.fence|Review supplied panel-width/waste model and whole-panel ceiling; corner/gate/site interpretation excluded; historical tolerant v1 preserved.|
|353|engineering.decking|Review face-area coverage and supplied waste; no spacing, cuts or structural design inference; decimal-ceiling/historical distinction.|
|357|engineering.wallpaper|Review supplied usable coverage, pattern/cut/waste applicability and exact ceiling; historical tolerant v1 preserved.|
|358|engineering.insulation|Review stated coverage and waste, whole-pack ceiling and historical tolerance; thermal/specification performance excluded.|
|359|engineering.pool-volume|Review rectangular plan and supplied average depth, m³ model, binary64 product limits and precision; not surveyed irregular-pool capacity.|
|360|engineering.water-tank|Review rectangular internal dimensions, m³ capacity and binary64 product limits; no wall thickness, headspace or operating capacity inference.|
|361|engineering.pipe-volume|Review circular internal diameter/cylinder model, π approximation and binary64 product precision; not flow, pressure or nominal-pipe sizing.|

NIST SI citations support dimensional/unit conventions; they do not independently approve estimation assumptions, manufacturing coverage or building-code applicability. Source version/admission and competent review must be supplied through the authorized project process, without fabricated signatures or automatic blanket NA decisions.

Shared Business construction storage, API/embed grants, metered jobs and webhooks are not enabled here. The existing generic Business reader is tested for current membership and revocation; that is not shared-delivery qualification. Generic coordinator replay/registry admission is not silently installed. Canonical adoption, complete applicable QA, exact-head integration CI, production compatibility and separate release authority remain gates. No merge, production modification, certification or publication. RELEASE HOLD ACTIVE.
