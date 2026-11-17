# Current held-predecessor compatibility

Source HEAD inspected: 120b4043a763c5262491bcb15b46d9dd32c89ac2. This continuation refreshes only the exact held core metadata preimage and established scoped dependency projections. No mutation or activation occurred.

The exact preimage projection is [adoption1528 production-readonly.sql](../adoption1528/production-readonly.sql), imported by the retained adoption1535 runbook and embedded in its held apply guard. It scopes seven publication tables, columns, functions/definitions/ACLs, triggers, constraints, indexes, policies, provider auth helpers and function default ACLs. The final COMMIT in this READ ONLY capture was replaced with ROLLBACK; no projection expression was changed.

Authenticated observation **2026-11-08 18:49:13.421454 UTC**, actor postgres, transaction_read_only=on, returned exact PostgreSQL metadata_json text. SHA256 of its UTF-8 bytes is **56b55a34c29d2c0dc60863da60df510d5a70d962edbc6582591ba025a756c3f1**, exactly the held core predecessor. The accompanying aggregate counts **209** published catalog rows. See [original receipt](hosted-core-receipt.json) and [observation](hosted-core-observation.json). No individual application/auth rows were collected.

This is a current exact match of that complete core projection; it is not an entire database audit, migration-history equivalence, expected adopted postimage, source/QA approval, row preservation proof or execution authorization.

At **18:49:43.148153 UTC**, a second authenticated READ ONLY capture reused the established adoption1535 dependency expressions, omitting the already observed RPC and transaction/session samples. [Query](hosted-dependencies-readonly.sql), [receipt](hosted-dependencies-receipt.json), and [observation](hosted-dependencies-observation.json) retain the result. All four projections compare exactly with historical adoption1535 dependencies.json:

| Projection | Count | Comparison |
|---|---:|---|
| Incoming foreign keys | 4 | Exact equal |
| Literal table-reference function candidates, definition hashes included | 13 | Exact equal |
| Role capabilities | 30 | Exact equal |
| Provider event-trigger registrations (identity/event/enabled/owner) | 6 | Exact equal |

These two captures are separate snapshots, not a shared frozen window. Literal reference search cannot prove dynamic or external writer completeness. Event-trigger registrations do not refresh the separate provider callback definition/body capture. No backup/recovery, DDL or concurrent-writer freeze, credential custody, or operator identities are established. The earlier six-RPC absence, scoped effective grant matrix and Hostinger deployed-source binding remain separately dated observations and were not re-queried.

The prior **fresh core preimage missing** evidence gap is now closed at this timestamp. Remaining minimum safe action belongs to DB/provider, deployment, scheduler/keyholder and recovery custodians: provide named controls and recovery/custody references, reconcile actual deployed writers, review held apply/reverse compatibility and obtain separately scoped authority. Re-capture exact preconditions inside any later approved window; current compatibility does not guarantee future compatibility. RELEASE HOLD remains active.

Verification was limited to parsing retained receipts, hashing the exact server-produced metadata text, and comparing the four dependency arrays with retained evidence. No build, test suite, browser, Docker, grant, migration, secret access or mutating RPC ran.
