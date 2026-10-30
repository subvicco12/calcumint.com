# Independent review: partial16 evidence audit and CI recovery

Reviewed the current branch against parent `9edc90078d6b356c5c2e5702daa4da68974a062d`: workflow split and aggregate gate, pinned prior workflow, source-package verifier/audit and focused guard tests. No calculator implementation or owner adoption is admitted. No outstanding Critical or Important findings.

## CI gate

The pinned `ci-at-9edc900.yml` exactly matches the prior Git blob. The original workflow triggers, concurrency and permissions are unchanged. Every original check step remains byte-for-byte in the new `checks` job, apart from moving the complete Production build step to the separate `build` job. Build receives the original checkout/Node22/npm-ci setup and the original build command/environment. Each verification job retains an independent 20-minute budget; existing step-level bounds remain intact.

The existing required job identity `validate` is retained as an aggregate. Its `needs: [checks, build]` and explicit `if: ${{ always() }}` ensure dependency failure/skipping does not silently omit the gate. Its shell succeeds only when both dependency result strings equal `success`. No continue-on-error, conditional check omission or replacement of an original verification command was introduced. Whole-workflow cancellation may prevent execution or cancel the aggregate; neither state supplies a successful required check.

Independent verification:

- YAML parses with exactly `checks`, `build`, `validate`; dependency graph/conditions and 20-minute budgets match the intended repair.
- All 53 focused Node guard tests passed, including 49 actual bash result combinations. Only success/success passed; failures, cancelled, skipped, timeout-like, empty and unknown strings failed closed.
- Byte-preservation and corrupted-archive rejection tests passed.
- The first restricted test attempt encountered child-process EPERM. The same tests passed when rerun with supported child-process permissions; assertions and test commands were not weakened.

This is a review of the proposed timeout recovery, not evidence that its new exact-head hosted run has succeeded or that each 20-minute verification budget is sufficient under future runner load. Hosted success must be observed separately. Prior cancelled timeout attempts remain unsuccessful admission evidence.

## Evidence integrity and admission

The supplied ZIP SHA256 is `d49d5a60737546dc8208ff5d1cbfb68740b3e153da3ca56501a7966f290fc1c3`. Independently checked its CRC and all 53 declared member hashes. The nested authority43 archive CRC and all 36 declared hashes also pass.

The capture register contains 48 records: 15 supplied same-path files verify by SHA/size; 33 omitted captures cannot be independently verified from this handoff. All 13 UK capture-index hashes and four supplied IRA readable-Markdown hashes verify. Extracted/normalized Markdown and structured-response hashes do not establish publisher-original byte identity. Golf summaries are not the omitted full rulebook extraction. The audit preserves these distinctions and does not promote omitted hashes into verified bodies.

The exact 16 IDs/titles match the retained 43-case authority register. Eleven have bounded source dispositions; five remain partial: #19, #120, #128, #129, #130. The ten conditional candidates are #9, #20, #23, #95, #97, #98, #112, #132, #199 and #204. All retain false owner-adoption, actual-engine-acceptance, canonical-source-acceptance, CI-alone readiness, certification and publication flags.

#527 has bounded research support but is not an admitted engineering candidate. National2026 adoption/amendments, Rule1.2 rights/authorization, eligibility/committee interpretation, PCC and expected-score algorithm/data contracts remain unresolved. Its normalized2024 rulebook evidence is not current national or product-rights approval.

The separate 13 policy and 13 qualified-applicability cases remain byte-equivalent to their prior case records. These cohorts and the 16 cases are disjoint, accounting for 42 identities; the preserved #485 component is separate. Candidate #485 native/source metadata is checked against its retained Git blob/file hashes. No #485 full-product promotion is inferred.

The direct offline source audit `--check` passed and reproduced zero calculator admissions. The audit's conditional queue is evidence for later decisions, not a grant to implement. Exact-head CI recovery success, explicit bounded owner adoption, immutable mapping and required applicability decisions remain gates. No mathematics, public aliases, historical engines, ledger statuses, certification or publication were changed by the reviewed repair. RELEASE HOLD remains active.

## Limits

No new publisher browsing, calculator QA, broad baseline rerun or hosted branch CI execution was performed in this independent review. Source authority and product adoption cannot be inferred from archive integrity, illustrative arithmetic, this CI repair or an instruction to evaluate prerequisites.
