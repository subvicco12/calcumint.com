# Independent scaled-validation review

No outstanding Critical or Important defect in the corrected reviewed validator/source binding. No canonical acceptance, certification, publication or release authorization follows from the validation reports.

## Demonstrated and resolved finding

`assertScaledGolden({value:0},{value:1e-8},1e-7)` passes. Thus a nonzero expected outcome can be erased into zero within the absolute window, despite the declared zero-exact policy and prior underflow boundaries. The reverse case (nonzero actual against expected zero) already rejects. An independently executed rejection regression was RED. The corrected matcher now requires exact comparison whenever either actual or expected value is zero, and rejects nonzero sign mismatches. The original regression is now GREEN; an additional independent two-direction sign-crossing regression also passes.

## Compatibility and evidence scope

Independent tests confirm79 unique adapters, unchanged revision1 packet exports and reader dispatch, exact selected identity/version enforcement, invalid-input evidence failure, all-plan artifact parity, source/ID/revision tamper rejection, and exact nonprimary field/type comparisons. All six owned independent tests now pass; combined author/independent run passes110 tests. Owned-file lint and both revision1/revision2 source-binding checks pass.

The revision1 binding bytes match the baseline Git blob exactly. The frozen433-file membership hashes to its original technical root and every recorded dependency is checked against its original SHA. New revisions therefore do not rewrite shipped revision1 receipts; the original modules remain the source of revision1 replay. Revision2 separately captures its implementation and literal JSON dependencies, with only its own self-referential binding explicitly excluded.

The collector preserves540 identities, reuses28 old private reports and adds51 declared-domain evaluations for79 total. Unselected records are reused, not newly verified. Canonical acceptance remains zero;43 authority blocks remain. #528 is explicitly caller-supplied gross-MET arithmetic with clinical, activity-selection, physiology and safety applicability unapproved. Neither pinned local technical sources nor tolerant scalar witnesses establish exhaustive numerical correctness or publisher applicability.

Broader historical QA, browser journeys, current-head CI and providers were not independently repeated at this checkpoint. RELEASE HOLD remains active.

## Final UI, compatibility and CI follow-up

No new Critical or Important defect found in the79-adapter UI source. Restore reinstates selected adapter, complete input and original packet; input/adapter edits clear stale results. Original revision1 history is loaded through the version-dispatch reader, without migration or writes to the original storage key. Explicit Save copies the selected packet into the separate revision2 store. Corrupt storage blocks writes, downgrade retains readable records, and resource limits do not automatically delete old history. Account/provider acceptance is explicitly excluded.

Independently reran112 focused validation/governance tests, both Python frozen-source mutation/compatibility tests and all53 CI guards: all passed. The new mandatory revision2 source/evidence/browser step is appended after the original build and revision1 checks. Full-array CI assertions require exact original steps plus exact prior and new additions; the always-running required aggregate still demands both verification jobs succeed, with unchanged20-minute budgets. No assertion or lifecycle gate is bypassed.

The parent's114 representative browser journeys, three history/scenario workflows, full6259-unit result and Node22/24 campaigns are separate reported evidence, not independently repeated by this reviewer. Representative-family browser coverage and supplied-MET arithmetic do not establish complete canonical products or clinical applicability. Current-head hosted CI remains the final engineering gate; RELEASE HOLD is unchanged.

## Closed revision2 source membership

Independently reran all three Python source guards successfully after revision2 membership was frozen. The433-file revision1 root remains `08b7111db6ea7ab06d40d8d3294451f586115287d29c4f6b4e63cf20e54cd692`; the439-file revision2 root remains `449e38c3ee46d751e086919d4d567c0d73eee972bfe492fd5a8aa39c40b2720d`. Both membership preimages and current dependency bytes pass their source checks. The saved original revision1 glob verifier is byte-identical to the baseline Git script; tests demonstrate its additive-file failure alongside the frozen verifier's additive compatibility and old-file rejection. All six independent packet/tolerance tests pass again. Freezing membership changes verification policy for future additions, without changing these source roots or packet version dispatch. No new Important finding.
