# Account history/scenario adoption and reversal

RELEASE HOLD active. The SQL files under package/ are complete transaction payloads with unconditional holds and exact runtime metadata assertions. They are executable in the provided disposable fixture acceptance runner. They are not authorized production migrations, and no remote executor, activation switch or active migration is provided.

## Exact scope

Four hosted tables: profiles, calculation_history, calculation_projects, saved_scenarios. Six new functions, three new BEFORE guards and one history cursor index come from the existing ATOMIC-ACCOUNT-HISTORY.sql, SHA-25618b3ca55203fdd7709cc4d632a23d6727081ee9a0269175d1e7c87763b0e712c. Existing quota triggers, owners, columns/column grants, table grants, RLS/policies, constraints, indexes, auth.uid/auth.role and function default ACL are retained.

Predecessor metadata SHA-256: af413dcb2f0806bcc29680f5c0a07cef138cc5948798f645e7ccc1f79288584a.

Source-derived expected postimage: 1b56153313fd6b8471658ac791834f634eb64d67bdd90bf6163a0d760b387249. This is an independently pinned complete metadata hash from isolated application of the retained source, not an observed production state. Added function bodies/full ACLs, trigger definitions and index definition are included; rewriting a claimed raw hash cannot authorize changes.

Source-bound filenames and byte hashes appear in receipt.json and the delivery manifest. Do not edit the original proposal or any publication package. No IF NOT EXISTS, arbitrary overload selection, CASCADE, destructive cleanup or migration-history insertion masks drift. Each direction uses READ COMMITTED, captured postgres owner, 3-second lock timeout, 30-second statement timeout, all four ACCESS EXCLUSIVE locks, and exact pre/post metadata assertions.

## What remains outside the transaction proof

An accountable operator must identify the deployed application SHA, direct SDK/PostgREST history/project/scenario clients, profile/billing entitlement writers, auth-user trigger, service-key holders, external jobs, DB/provider operators and independent function/default-ACL DDL. Fresh auth-user trigger/hash, logical role/schema grants and lexical function references are captured, but cannot identify every keyholder or dynamic writer. The retained publication audit and source inventory apply separately. Quiescence is **not established** by the observed absent locks/prepared transactions. There is no supplied operator freeze or production adoption authority.

Before any separately authorized adoption: verify source bytes and exact hosted projection again; coordinate the actual writer and DDL freeze; take a recoverable operator-approved backup/checkpoint; recheck all provider dependencies and legacy-data requirements under the same controlled interval. profiles plan must be known; existing snapshot shapes must be objects with valid identities; saved scenarios must belong to the project owner. These are refusal preconditions, not instructions to rewrite or delete historical records. Profile row-version fencing writes id=id during saves; CDC/realtime consumers and external billing writers must be reconciled independently. SQL does not prove formula correctness or canonical source approval.

The fresh aggregate observation found4 profiles with known plans,1 history with valid shape and0 saved scenarios. Those observations are neither immutable data preconditions nor customer-data inspection. Fresh runtime guards refuse incompatible legacy shapes/foreign bindings. Incoming captured FK is saved_scenarios.project_id to calculation_projects.id; auth.users relationships and its existing profile-creation trigger remain unmodified. anon/authenticated/service_role lack public schema CREATE; postgres and service_role bypass RLS. Captured broad SQL table grants and provider/external DDL remain distinct risks, not silently repaired.

## Isolation receipts

The fixture reproduces the exact four-table metadata, including profiles.display_name column UPDATE ACL and both hosted Free history triggers. It tests held/continuing-client denial, apply late-failure rollback, concurrent final Free slot, identical/conflicting retries, stale/foreign identities, Business scenario copy/retry, reverse late-failure rollback, malformed legacy-data refusal, exact reverse/reapply and preservation of application rows. Composition acceptance tests both apply/reverse orders with the guarded seven-table publication package. Its previously documented one-CHECK parser formatting distinction remains explicit; it is not normalized into a claim of complete provider equivalence.

## Recovery and deployment sequencing

Reversal drops only the new three triggers, one index and six functions, in dependency order, with exact postimage/predecessor assertions and no application-row deletion. It removes atomic safeguards and restores prior behavior, so technical reversibility is not an approved safe operational rollback. Retain writer hold and require separately authorized recovery. Requests written before reversal remain stored; reapplication recovers their same identities.

The publication and account scopes are metadata-independent except shared auth helpers/default ACL. Local composition does not establish independent-DDL quiescence. Neither package makes a calculator certified or publishable. Deployment must not enable candidate workflows against an unadopted RPC schema, and adoption must not be inferred from a local or hosted test pass. The publication date/final-row protections, exact engine/version/source/QA orchestration, canonical/source/reviewer decisions and release-wave authority remain separate prerequisites.
