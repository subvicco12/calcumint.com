# Exact hosted-schema adoption preparation — 2026-11-06

Starting PR1528 HEAD was verified as `804028a913ee33021b14e67d0f40ee7893d896b6`. CI42197550649 **FAILED**: publication-factory lacked the pinned Docker images for the newly added provisioning fixture; full-product parsed an empty, unfinished scenario-report download. Checks, build and source-acceptance passed. The failed candidate is not described as a green baseline.

## Verified engineering corrections

| Defect / dependency | Verified correction | Production disposition |
| --- | --- | --- |
| Fresh publication-factory runner lacks PostgreSQL/GoTrue/PostgREST images | Derive all three immutable image pins from the existing fixture and pull them before acceptance. A contract regression fails before this fix. | CI-only change; successor CI still requires exact-head observation. |
| Report destination is readable before download completion | Require complete, stable JSON with no Chrome temporary download, under the original10-second deadline. Six real-filesystem tests and54 actual browser journeys pass; schema/replay assertions remain unchanged. | No calculator formula or production behavior changed. |
| Hosted audited QA, assignment, transition and draft-creation RPCs are absent | Compose exact source-bound032–035 definitions with current draft provisioning in one guarded transaction. Genuine JWT runtime tests exercise their combined behavior. | Not installed; missing functions remain a real hosted blocker. |
| Original bulk writes can partially persist, omit creation audits and leave jobs processing | Reuse1528's atomic draft RPC; verify selected20 staging, pending QA/audits, retry/concurrency and injected rollback against reconstructed hosted metadata. | Proposal only; no hosted rows or policies changed. |
| Hosted malformed date patterns / optional-date NULL handling; validation of old rather than final state; non-draft INSERT and dependency races | Reuse the unchanged date, final-row and P0 successors. Combined installation and retained40-case publication mutation/concurrency acceptance pass. | Guarded and unactivated. |
| Authentic default function privileges grant clients EXECUTE on new trigger-only helpers | Reproduce the six inherited client grants, then apply a ninth, narrow source that revokes only PUBLIC/anon/authenticated execution on those new trigger-only functions, following existing migration027. All service_role grants and default privileges remain unchanged; genuine trigger flows still work. | New correction outside active migrations; no provider or table privilege revocation. |

No existing source SQL, historical mathematical engine, saved-history/replay, catalog identity, acceptance record or source/reviewer decision was rewritten. OWN-427 remains approved Option A. No source meaning or specialist approval was inferred.

## Actual target reconciliation

The final authenticated capture is from project `zpwpstsvztyshcnwdfye`, observed `2026-11-06 14:43:07.87206+00`, actor postgres, transaction read-only on. It covers seven relevant tables, all their columns/constraints/indexes/policies/ACLs, relevant functions/triggers, auth.uid/auth.role controls, and postgres global/public function default ACLs. Earlier scoped captures are retained as evidence of the dependency expansion, not substituted for the final capture.

The target still has209 published governed records. Both the audited admin RPCs and new draft-preparation RPC are absent. Bulk jobs retain INSERT/SELECT-only policies; the package deliberately needs no UPDATE policy. `raise_failed_qa_alert` writes admin_alerts, so that table and its unique index are included rather than assuming the six-table projection was complete. Provider-managed service-role defaults are preserved.

This is a scoped metadata reconciliation, not a new540 inventory, fresh209-URL audit or full production/auth-data acceptance. Provider internals outside the declared controls and all privileged external writers remain outside this proof.

## Exact reversible proposal

`package/guarded-target-apply.sql` and `package/guarded-target-reverse.sql` contain unconditional aborts **inside** their transactions before locks or DDL; there is no activation switch or production executor. Nine exact source bindings are in `tests/adoption1528/plan.json`: eight unchanged reviewed constituents and the narrow new trigger ACL correction.

The apply binds the authentic target preimage, requires the captured postgres owner and READ COMMITTED, locks scoped tables in stable order, refuses existing target names/overloads and verifies the expected postimage before COMMIT. It adds12 functions,6 triggers and3 constraint-trigger metadata entries, replacing only the existing publication predicate. No country, membership, account ACL or active migration changes are composed.

The reverse binds a **derived expected target postimage**, not an observed production postimage. It drops only exact introduced triggers/functions without CASCADE, restores the original predicate and retains every scoped application row, including newly staged drafts/audits/jobs. It preserves provider/default controls. Returning to a known-defective predecessor proves technical reversibility only: critical workflows must remain held, and recovery needs separate authorization.

One exact host/local PostgreSQL formatting difference is enumerated: the existing source URL CHECK deparses nested AND parentheses on the host and a flat equivalent AND locally. No arbitrary normalization is allowed. The target-derived postimage preserves the authentic constraint string and transplants only locally proven deltas. A target compiler discrepancy must cause postcondition refusal and transaction rollback, not silent acceptance.

Independent function/default-privilege DDL is not serialized by table locks. Separately authorized DDL quiescence, a fresh target metadata/data audit, known participating writers, application/version compatibility, recovery planning and explicit activation authority remain prerequisites. The UUID-only publication predicate does not itself assert an expected immutable engine version; orchestration must retain exact version/contract/source/QA binding, and this package does not claim every privileged writer is covered.

## Acceptance and independent review

The composed PostgreSQL17.6/GoTrue/PostgREST fixture reconstructs captured metadata and default grants and passes16 checks: hold/isolation/drift refusal, atomic late-failure rollback, client-trigger-ACL RED/GREEN, genuine JWT denial,20 exact-v1 draft rows/300 pending checks/20 creation audits, retry/concurrency, failure rollback, audited assignment/QA-alert/review workflow smoke tests, unready certification/direct-publication refusal,209 explicitly synthetic published preservation sentinels, and row-preserving reversal/reinstallation.

The existing exact-source publication suite additionally passed40 cases, including positive/negative date rules, final-persisted-state validation, OLD/NEW dependency mutation, both writer commit orders and unsupported isolation refusal. Its synthetic passing decisions are test fixtures, not approval of actual calculators. No real calculator was certified or published.

Independent review passed11 focused Node tests, regenerated apply/reverse bytes and confirmed artifact hashes, transaction holds and scope restrictions. It found no blocking issue. Final regression and exact delivery receipts are recorded in `validation.json` and the Drive checkpoint.

## Coordination and first cohort

ChatGPT Work's immutable independent matrix was retrieved directly from canonical Drive, ID `12Cee8Ym1O-gRpdyxepE84vpx-xAHTYB0`, SHA256 `0d43a33072875d75665d5542384a3be22a9505b5626d78abebd088ca1c4e186e`. It reviews a94a963; engine bytes are unchanged, so its source facts can be reused without claiming it reviewed this new infrastructure implementation. The original matrix is not edited.

- Factual source support:14 families; another4 have rounded literals requiring precision adjudication.
- Remaining factual source gaps: #424 international-acre definition and #425 exact US-liquid gallon/quart source chain.
- Formal source acceptance remains pending for all20. Canonical scope and complete QA are not promoted. No new owner product question is invented; OWN-427 remains closed.

The first **infrastructure staging cohort** is the existing20:370,371,372,373,374,423,424,425,427,428,429,430,431,432,433,434,437,438,439,440. They are tested as pending drafts, not certified records. A useful first review priority is the14 fact-supported families listed in `work-coordination.json`; this does not make them release candidates automatically.

**First genuinely publication-eligible cohort: empty. Newly publication-eligible:0. Newly live:0.** Work must supply governed per-ID canonical/source/precision/QA and qualified-applicability decisions. Operators must separately resolve target adoption/recovery and release authorization. Possession of this reversible package grants none of those approvals.

RELEASE HOLD remains active. No production writes, migrations, certification promotions, merge, deployment or publication occurred.
