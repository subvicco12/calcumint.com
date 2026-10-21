# Database compatibility and owner decisions

**RELEASE HOLD.** Bounded cumulative review of #1460 baseline `8956ac526450ba66eed536fcf74055403164221d` found no new important database/RPC integration defect. #1451 head `39e14f9` is already an ancestor and adds no candidate delta. This document authorizes no SQL application or rollout.

## Evidence and limits

Reuse #1460's 42-migration / 8-proposal inventory, 11 combined-boundary cases, and 20 HTTP cases covering 42 private roundtrips. The checked-in [disposable results](../migration-contract-2026-10-20/disposable-results.json) record the modeled migration lanes and combined cases; [inventory](../migration-contract-2026-10-20/inventory.json) identifies the files. No fixtures were rerun for this review. Exact final-head CI belongs to the consolidated RC evidence.

Raw fresh installation remains **blocked** by the unterminated dollar-quoted body in `011_b8_free_save_quotas.sql`. The passing candidate-fresh fixture omits 011 and substitutes guarded `20261020-v1-legacy-save-quota-repair.sql`; the candidate-upgrade fixture models an installation omitting 009 and uses a fixture-only corrected 011. These are explicit test models, not evidence of hosted migration history or permission to rewrite it. The additive repair restores legacy behavior only; atomic history/quota protection requires the separate account-history proposal.

Production schema, ledger, function owners, effective grants, role inheritance, protected JWT/RLS behavior and privileged writer coverage remain **UNKNOWN**. Anonymous observations cannot establish them. Disposable success does not prove global atomicity or remove RELEASE HOLD.

## Covered writer boundaries

| Writer family | Reviewed boundary | Owner coverage still required |
| --- | --- | --- |
| Billing webhook | Shared RPC account fence, profile lock, immutable ownership and receipt/completion transaction | External profile/subscription/customer/fence/receipt writers must participate or invalidate; resolve provider freshness and legacy receipts |
| History and workspace | JWT-bound save RPCs and table guards share the profile row lock with billing downgrade; tuple update rejects stale higher-isolation snapshots | Inventory imports, maintenance jobs and trigger bypass |
| Ordinary API and batch | `consume_business_api_quota(uuid)` retains its existing caller signature while the proposal replaces its body; both quota and batch take the API-key lock before fresh usage counts and hold a profile plan lock | Adopt both proposals together; every direct `api_usage_events` debit must use the same lock; retain request-unit semantics |
| Embed capture | Version/owner checks and lead, consent, receipt and enqueue commit together | External webhook delivery remains outside the local transaction |
| Membership | Helper gates, OLD/NEW owner checks and immutable membership identity | Owner transfer remains multiple primitives; approve maintenance actor auth context |
| Admin catalog, QA, assignment and lifecycle | Role-gated authenticated RPCs commit effects and audit together | Verify internal role gates and effective deployed role hierarchy |

The profile lock coordinates the reviewed entitlement checks and billing downgrade. It does not certify every service-role, console or maintenance writer. Ordinary API authentication still calls the same quota RPC signature; adopting the replacement changes serialization without requiring a new caller signature.

## Ordered owner decisions

1. Capture read-only hosted schema/ledger fingerprints, function definitions and owners, fixed search paths, effective table/column/function ACLs, inherited roles, and maintenance writers. Approve a filename-and-hash manifest; duplicate numeric prefixes are not unique migration identities.
2. Reconcile `009_country_preferences.sql` and actual `country_code` presence. Decide the fresh/upgrade treatment of broken `011_b8_free_save_quotas.sql` and guarded `20261020-v1-legacy-save-quota-repair.sql`. The repair refuses an existing contract; compare it rather than replacing or marking historical 011 applied automatically.
3. Preserve `013_production_rpc_privilege_hardening_v2.sql`. Adopt `API-RLS-HELPER-EXECUTE.sql` only after definition/ownership review: authenticated receives `is_org_member(uuid)` and `has_org_role(uuid,text[])`; `org_role(uuid)` stays internal. `MEMBERSHIP-ADMIN-FENCING.sql` depends on that helper state.
4. Preserve `029_account_rls_auth_initplan.sql` owner predicates and both files in each pair: `032_atomic_reviewer_qa_audit.sql` / `032_business_builder_rls_auth_initplan.sql`; `033_atomic_reviewer_assignment_audit.sql` / `033_pro_workspace_rls_auth_initplan.sql`; `034_atomic_lifecycle_transition_audit.sql` / `034_billing_webhook_event_privileges.sql`; `035_atomic_catalog_creation.sql` / `035_split_overlapping_write_policies.sql`. Retain their predecessor definitions and policies in the approved full-stack order.
5. Verify service ledger access separately from 034's client revokes. Review `038_client_account_billing_privileges.sql` table and column ACL clearing, inherited-privilege aborts, display-name update allowlist and owner preferences upsert. Client denial tests establish neither service grants nor function ownership.
6. Approve the guarded proposal graph: billing, account history, API quota plus batch, embed, helper execution and membership fencing. Confirm all relevant writers use the required locks/fences, trusted definer ownership and execution gates. Keep proposal guards until separately authorized. Decide deployment order and application/RPC availability together; missing RPCs fail closed.

## Rollback and final verification

Before any separately authorized rollout, capture exact pre-change definitions, owners, ACLs, policies, triggers and data/receipt retention requirements. Approve object-specific rollback and application compatibility against that capture. Restoring an unlocked quota function or removing profile guards while concurrent writers remain active would discard the reviewed boundary; a schema reversal alone is not a safe compatibility argument. Preserve immutable receipts/completion evidence and assess partial application transactionally. No destructive rollback, blanket CASCADE or live repair is authorized here.

With unchanged SQL and callers, no additional local fixture replay is justified. Run the native suite once at the final candidate head, including existing combined PostgreSQL and real HTTP lanes. If signatures, grants, role predicates, lock order or writers change, rerun the affected isolated boundary cases before making a new compatibility claim.
