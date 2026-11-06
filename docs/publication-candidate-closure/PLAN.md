# Approved six-contract implementation execution

Goal: implement independently supportable full-scope feature increments from approved OWN01–08 targets, with private exact-revision artifacts and no registered version/routing changes.

Existing design: docs/full-six/input/contracts, direct owner approval retained in docs/full-six/REPORT.md. Historical proposed/PENDING fields do not revoke implementation authority.

Parallel ownership:
- Slope: src/lib/full-six/slope*, typed modes/domain/units/inverses and independent witnesses.
- Volume: src/lib/full-six/volume*,15solids, supported inverses/units/domain and independent witnesses.
- Graph/Plotter: src/lib/full-six/graph*, bounded approved grammar and resource-safe plotting/analysis as actually implemented.
- Statistics: src/lib/full-six/statistics/advanced*, approved descriptive/transform/target branches and existing worker integration where safe.
- Integration: private UI, exact-revision replay/scenario/export, focused browser, decision/reviewer evidence packages.

Each lane reads the exact per-ID source contract, adds meaningful failing tests, implements and validates locally. Shared units/formatting/historical engines are preserved. No application or mathematical adoption is inferred from module existence. After integration: unit/security/certification/source guards, lint/typecheck, one webpack build, focused browser, independent review, coherent commit/draftPR and one boundedCIcheck. No production writes, certification, publication or merge.

Review focus: zero/degenerate classification; cancellation and stale result rejection; singular/ill-conditioned domains; exact decimal provenance and units; unknown-version/tampered replay. Missing full-scope branches must remain explicitly incomplete.
