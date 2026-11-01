# Publication mutation protection

Status: **nonproduction verified; activation and real acceptance blocked**. The final self-contained PostgreSQL17.6/GoTrue fixture passes 40 checks. Only synthetic catalog rows transition to certified/published. No actual calculator, reviewer or source approval is created. Original captured functions, migrations, date correction and prior final-row proposal remain unchanged.

The exact source-bound scoped fixture reproduces direct non-draft INSERT, committed QA reparent leaving its OLD published parent invalid, reviewer deletion/identity changes invalidating published references, and concurrent certification versus dependency changes. The new SQL remains transaction-guarded outside active migrations. It requires the exact lifecycle, corrected date predicate, prior final-row and dependency-function hashes, enabled/deferrable prior trigger definitions, expected QA validator trigger events and absent successor objects.

The additive protections are:

- Draft-only catalog INSERT. Existing transition authorization and certification gates remain authoritative.
- Deferred OLD QA parent validation after reparenting, retaining the captured NEW-parent validator.
- READ COMMITTED final-row validation for **every** certified/published risk class. A standard-risk repeatable-read transaction is demonstrated certifying from obsolete QA when isolation enforcement is only YMYL-specific. The corrected guard rejects that transaction and preserves a positive standard-risk READ COMMITTED path.
- YMYL final-row `FOR SHARE` on the referenced platform membership, followed by a separate predicate query. The lock is retained through COMMIT. Authority DELETE and active/role/user_id UPDATE guards coordinate with it under READ COMMITTED.
- Before every QA INSERT/UPDATE/DELETE, shared parent-row locks on OLD and NEW calculator identities in stable order. They conflict with catalog lifecycle/risk/reviewer UPDATE, so dependency changes and promotion cannot each validate an obsolete view. Existing deferred validators then check final committed parent state.

Persistent psql sessions plus observed `pg_stat_activity`/`pg_blocking_pids` barriers establish both commit orders for reviewer deletion, deactivation, role demotion and identity rewrite; QA reparenting; and source deletion. Promotion-first retains valid critical state and rejects invalidating mutation. Mutation-first permits the edit while the parent is review, then promotion waits, revalidates and rolls back. The check-only QA/promotion failure is reproduced with the new QA parent fence disabled only in a disposable test. Reviewer locks alone were insufficient for it.

Source concurrency remains protected by captured source/count/parent-update logic; no speculative source successor was added. Direct source reparent rejects, valid additional source insertion/label update/removal preserves derived count and final validity. Required QA DELETE rejects; optional standard-risk QA deletion/reinsertion succeeds while all required checks remain valid. Complete snapshots cover transaction rollback, including failed-QA alert rollback, explicit ROLLBACK and deferred COMMIT rejection. Unsupported snapshot isolation is rejected before a critical final state can persist.

Run without private inputs:

```sh
PUBLICATION_P0_ARTIFACTS=/absolute/outside/repository/publication node tests/p0-publication-business/publication/acceptance.mjs
```

Optional `HOSTED_DESCRIPTOR` verifies full private capture hash and exact scoped selection. Final pre-integration receipt: `/workspace/work/p0-publication-final-all-paths/receipt.json`; final CI-equivalent receipts are bound in validation.json. Artifact paths use the shared outside-checkout helper before containers start and support RUNNER_TEMP.

These tests do not approve source meaning, clinical/regulatory applicability, canonical identity/risk mapping or real reviewer qualification. They assume captured/additive triggers remain enabled. Privileged DDL/trigger bypass, arbitrary mixed-table writer schedules, provider operations and full hosted data compatibility remain outside the proof. Multi-row/mixed-parent deadlocks may safely abort a writer; retry/operational acceptance is an adoption prerequisite. No serializability or production equivalence is claimed. RELEASE HOLD remains active.
