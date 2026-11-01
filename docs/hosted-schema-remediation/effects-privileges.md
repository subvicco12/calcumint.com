# Hosted migration effects and privileges

Offline review only. No production queries or writes were performed by this analysis. The root supplied a read-only historical statement capture. Exact source/capture SHA256 preconditions, object identities, effective grant observations and model differences are in `effects-privileges.json`. Capture paths refer to private inputs; bodies are not published. No named migration is classified as applied merely because its name matches.

## Six unmatched repository migrations

| Repository migration | Captured object effect | Application requirement |
| --- | --- | --- |
| `009_country_preferences.sql` | `public.user_preferences.country_code` absent from COMPLETE columns catalog; therefore its column check/comment also cannot exist on that column | `src/app/account/actions.ts:39` upserts country; `src/app/account/page.tsx:9` reads it. Current UI operation requires remediation, but no replay is approved here. |
| `032_atomic_reviewer_qa_audit.sql` | `record_calculator_qa_decision(uuid,text,text,text)` absent | `src/app/admin/actions.ts:86` calls it. |
| `033_atomic_reviewer_assignment_audit.sql` | Both `assign_calculator_reviewer(uuid,uuid)` and `is_active_review_capable_admin(uuid)` absent | `src/app/admin/actions.ts:122` calls the assignment RPC; its helper is a migration dependency. |
| `034_atomic_lifecycle_transition_audit.sql` | `transition_calculator_with_audit(uuid,text,text)` absent | `src/app/admin/actions.ts:109` calls it. |
| `035_atomic_catalog_creation.sql` | `create_catalog_calculator_with_audit(text,text,text,text,text,jsonb)` absent | `src/app/admin/actions.ts:44` calls it. |
| `038_client_account_billing_privileges.sql` | Postcondition contradicted: anonymous table privileges remain across all four scoped tables; column privileges independently captured | Four-table candidate reviewed below. |

These prove missing or conflicting current effects within COMPLETE captured scope, not that each migration never ran. Missing function definitions also mean their intended atomic behavior and EXECUTE permissions are unavailable through those signatures. Source code requirements do not authorize replaying migration files. Existing proposal comments and approval requirements remain controlling.

## Hosted-only hardening

Read-only history supplies actual bytes for version `20260915105311`, `production_function_privilege_hardening`. Its recorded statement revokes EXECUTE on all then-existing public functions from PUBLIC/anon/authenticated, regrants 13 named application/helper functions to authenticated and grants all public functions to service_role. This establishes the recorded SQL's intended effects, not an exhaustive historical object inventory or durable current rights. Exact statement UTF-8 SHA256 is recorded separately from the metadata MD5. Recomputing the original `md5(array_to_json(statements)::text)` framing yields `ec320414588139493252e8db6a241d11`, matching the original fingerprint. This validates captured historical statement bytes under that fingerprint; it does not validate current effects or authorize replay.

Current effective rights are measured independently. In particular, `refresh_admin_review_alerts()` is backend-only after repository `013` semantics; `org_role(uuid)` still permits authenticated/service_role execution in the capture. That helper participates in policy evaluation, so copying a model revoke without dependency review could break access. Trigger-function API execution and trigger invocation are different mechanisms. No blanket function ACL replacement is proposed.

## Privilege decision against application requirements

The model is a comparison fixture, never the approval authority. Common hosted/model effective-grant rows differ in 113 table, 188 column, 63 sequence and 16 function cases. JSON includes exact differences and both unmatched ID sets. Missing rows are not interpreted as denied grants. Provider-owned auth objects and ownership remain excluded.

| Scoped object | Explicit reviewed allowlist basis | Limitation |
| --- | --- | --- |
| `profiles` | Authenticated SELECT supports account page and `src/lib/account-persistence.ts:8`; retain UPDATE(display_name) from existing `038` proposal | No current display-name writer was established; retaining this existing column allowance needs explicit owner review. No profile INSERT/DELETE or plan UPDATE requirement established. |
| `user_preferences` | Authenticated SELECT plus INSERT/UPDATE supports account read and upsert including user_id/conflict key; owner RLS must remain | Country column is separately missing. Table privileges alone do not repair it. |
| `subscriptions` | Authenticated SELECT supports account billing state | No direct client billing write requirement established; backend service role must remain untouched. |
| `billing_customers` | Authenticated SELECT retained from existing `038` proposal | No direct current account-page caller established. Explicit owner review must confirm this retained allowance. |
| All four tables | No anonymous client use established in account paths; revoke table and column privileges for PUBLIC/anon, then restore allowlist | RLS alone does not block TRUNCATE. Inherited paths require effective postchecks and rollback rather than silent partial success. |

`effects-privileges.sql` is an **unconditionally aborting offline review draft**, retaining the exact `038` transaction contents with only its `BEGIN` moved before the guard. An execution client that continues after the guard error remains inside the aborted transaction. It is not executable approval and must not be applied by a migration runner. JSON lists byte-hash, fresh-capture, ownership, dependency, behavior-test and explicit approval prerequisites. The SQL changes no service_role grants, owners, RLS or provider objects. Its inherited-grant checks intentionally abort where direct revokes cannot enforce the target. Hash preconditions are offline review conditions, not automatically enforced by the draft SQL.

No sequence or function changes are proposed: all 63 sequence differences include rights that need direct-writer versus definer-trigger analysis, including service_role rights. Current application insert paths and policy helper calls prevent treating model denial as sufficient justification. Broad default ACLs likewise require separate future-object review.

## Validation

Run `node --test tests/hosted-schema-remediation/privileges/*.test.mjs`. Independent focused tests verify incomplete catalogs remain UNKNOWN, grant comparison cannot imply approval, source drift blocks review eligibility, and provider ownership is excluded. These offline tests do not establish PostgreSQL runtime permission behavior; existing `tests/billing/client-privileges.mjs` supplies the meaningful future database test contract (inherited rollback, column cleanup, authenticated upsert, anonymous TRUNCATE and service-role preservation). No database suite or build was run for this read-only analysis.
