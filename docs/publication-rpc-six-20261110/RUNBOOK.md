# Six held publication RPCs: bounded qualification overlay

This overlay adds isolated engineering evidence to the unchanged adoption1528/adoption1535/publication540 packages. RELEASE HOLD remains active. It does not approve any calculator, certify evidence, install a production function, or grant execution authority.

Use the exact six signatures and source SHA256 values in `qualification.json`; observed invoker/owner/EXECUTE facts are in `receipt.json`. All six preserve table RLS. The tightly scoped reviewer lookup helper is a separate definer dependency, not an invoker-to-definer conversion of these RPCs. Authenticated EXECUTE alone does not authorize a call: current active platform role, row policies, evidence authority triggers, and authoritative publication gates still apply. Service-role EXECUTE availability is recorded rather than assumed; a role without an authenticated subject is not an approved human reviewer.

## Dependency order and held adoption

1. Retain authentic read-only metadata/dependencies and compare against the unchanged `docs/adoption1535/package/source-pins.json` and exact guarded apply preimage. The isolated projection is not a current hosted capture. Any drift is an abort, not permission to regenerate an expected hash.
2. The existing composed apply installs the adoption1528 core in source order: QA032, reviewer033 (including its target helper), lifecycle034, creation035, exact-v1 inventory proposal, then the date/final-row/P0 and trigger-ACL corrections. The publication540 batch addon follows only that core. Do not independently activate the six functions or omit the gate successors.
3. Keep `docs/adoption1535/package/guarded-target-apply.sql` and its unconditional hold untouched. Only the separately authorized operator/window may perform any target adoption. This runbook supplies no remote executor or hold-removal command.
4. A controlled operation must verify the exact postimage, provider schema-cache discovery, existing writer compatibility and a genuinely authorized least-privilege caller. Fixture JWTs and synthetic passing rows are not transferable approvals. Do not publish any unapproved cohort as a smoke test.
5. On a failure, abort the whole transaction and confirm no DDL/data effects. A connection loss after commit is ambiguous: capture exact metadata and audit/row state before deciding whether anything should be retried. Do not replay creation, QA or assignment blindly.
6. Exact unchanged composed reverse is `docs/adoption1535/package/guarded-target-reverse.sql`. It has its own unconditional hold and exact postimage precondition. Reversal restores known-defective predecessors, so keep the release/workflows held and coordinate writer drain. It does not undo legitimate application rows or retract already delivered responses. Metadata drift means stop and obtain a reviewed recovery successor, not use CASCADE or force the reverse.

## Retry semantics

- `create_catalog_calculator_with_audit`: no idempotency token. Same unique key/slug retry conflicts. Reconcile existing exact row, pending QA and creation audit before accepting it; do not translate every unique conflict into success.
- `record_calculator_qa_decision`: state upsert, but each accepted call appends an audit event. It is not audit-idempotent; inspect existing decision/audit after an ambiguous response.
- `assign_calculator_reviewer`: accepted repeat updates/appends another assignment audit. Reconcile before retrying.
- `transition_calculator_with_audit`: compare-and-set expected lifecycle. Same-expected concurrent/repeated call becomes stale after the first success. Inspect exact lifecycle and audit to distinguish successful first delivery from unrelated movement.
- `prepare_catalog_inventory_drafts`: exact matching v1 identities may be reused, with missing QA healing and an operation job record. It is not an all-version provisioning API;383@2 cannot be created by changing the version argument. Retained rehearsal proves identical retries/concurrency without duplicate creation audit.
- `publish_calculator_batch_with_audit_v1`: exact immutable certified snapshot and authoritative gates. A successful batch makes the same snapshot stale. Re-read and reconcile lifecycle/audits after an ambiguous response; never manufacture new accepted evidence merely to retry.

Retained prior acceptance covers addon atomic rollback, opposite-order concurrency, bounded lock timeout, exact metadata/ACL refusal, provider hooks, core/addon late failures, draft retries and guarded reversal. New bounded checks do not repeat those campaigns. The first new harness run used an incomplete publication envelope and stopped at schema validation; the second tried to JSON-decode a legitimate empty void response. Both failed harness logs are retained. No SQL/product defect was inferred; the final producer supplies a complete binding envelope and handles empty successful responses.

## Remaining operator boundaries

Actual deployed SHA and writer compatibility; named operator/observer/recovery owner; privileged/external writer roster and pause/drain control; backup/restore readiness; target metadata/default-ACL/provider-hook reconciliation; transaction/DDL exclusion and supported cache recovery; separate explicit activation authorization; and exact competent per-calculator decisions remain outside this fixture. See the existing `docs/adoption1535/operator-checklist.json` for responsible roles and null actual identities. No new named assignment, signoff or production readiness is inferred here.
