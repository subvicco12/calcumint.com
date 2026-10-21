# Account schema preflight correction — RELEASE HOLD

Baseline draft #1462 at03df667e85e672c6e20848a6cc168f122df2e1ca. No historical migration or migration order is changed. This fixes release-check tooling, not production schema or an application writer.

## Demonstrated defect and correction

Baseline preflight returned ready=true with recorded migration history when country_code was integer NOT NULL DEFAULT7 and display_name integer. Presence did not establish compatibility. The fix compares catalog metadata against a checked-in canonical descriptor derived from actual001,009,029 and038 contracts. Actual002 is a disposable fixture prerequisite for038; it does not expand this account preflight into a billing audit.

Checks include relevant column types, nullability, defaults, identity/generated attributes, validated primary/foreign/check constraints, table kinds/owners/RLS, exact owner-policy predicates, client bypass/superuser flags and role memberships, effective table/column privileges (including inherited/PUBLIC grants), schema access and auth.uid EXECUTE. Preference columns and the existing five base profile columns are covered; this is not a contract for every later account/billing column, trigger or RPC. The expected PostgreSQL catalog descriptor is fixed, never regenerated from a production target or automatically refreshed at runtime.

A SQL adapter can use runAccountSchemaPreflight(queryRow,migrationEvidence), returning one plain row from the exported SELECT. Errors, denied/missing metadata, old presence-only rows and contract drift fail closed. The reader must have SELECT on both target tables to attest the descriptor. No role grants are installed by preflight. Raw database diagnostics are not returned in failure messages. Migration-history evidence remains a separate recorded/verified-equivalent decision: neither a descriptor match nor the label alone establishes both.

Strict comparison intentionally blocks semantically equivalent unreviewed policy/default/deparser/owner differences. PostgreSQL16.15 and17.11 agree for the actual repository fixture; other production differences remain owner-review questions. This is a necessary account contract gate, not proof of complete security or deployed function-body authenticity.

## Verification

- `node --test tests/billing/account-schema-preflight.test.mjs tests/billing/migration-inventory.test.mjs tests/billing/migration-fingerprints.test.mjs`:23 passed.
- `node tests/billing/account-schema-contract.postgres.mjs`:25 compatible, missing, incompatible and permission cases on pinned PostgreSQL17.11, no network or published ports.
- Same25 cases locally on PostgreSQL16.15. Existing required billing harness also invokes this shared case runner in a separate disposable database; its native25-case and29 HTTP-test baseline passed before the final additional membership/helper-denial cases. Required CI validates final integration.
- Typecheck, affected ESLint and `npm run build` passed. Build remains `next build --webpack`; generated build-only config changes were discarded.
- Tests cover wrong type/nullability/default, missing/unvalidated/wrong constraints, absent FK/PK/table, disabled RLS, permissive/incorrect policies, missing and excessive column/table/inherited privileges, SET ROLE membership, schema CREATE, missing helper execution, client bypass RLS, and actual catalog SELECT denial with sanitized fail-closed recovery.

One initial new unit assertion incorrectly treated the canonical empty-membership array as drift; it was corrected to inject an extra membership entry. Final focused suite passes.

## Evidence limits and acceptance

The referenced latest Work PostgreSQL17 upgrade package was not available in current attachments/artifacts. No claim is made to have reviewed it or reproduced its precise schema image. The defect was independently reproduced from checked-in code and canonical migrations, with real PostgreSQL17 regressions. Source hashes and results are in evidence.json.

Production remains UNKNOWN: authorized protected metadata, exact ledger reconciliation, immutable011 repair decision, duplicate-prefix order, proposed RPC/grant adoption, owner/specialist authority and operational checks are still required. Existing424-record ledger retains55 VERIFIED/330 PARTIAL/20 BLOCKED/19 UNKNOWN; only bounded evidence for RC-production-RLS is supplemented, without upgrading its status.

No production SQL, migration adoption, approvals, publication, certification, payment, merge or deployment occurred. Source PR #1462 is preserved. Next action: privately supply authorized protected account metadata and the Work upgrade package; compare against this contract and reproduce any remaining differences in disposable PostgreSQL before considering an additive migration proposal. Never overwrite the canonical descriptor merely to obtain readiness.
