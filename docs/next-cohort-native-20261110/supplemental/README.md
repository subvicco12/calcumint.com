# Supplemental preimage and live-lease fault injection

This is new evidence, not a replacement for the existing nine-check receipt, native packet, held SQL or frozen producer. The source is `tests/next-cohort-native-20261110/supplemental.postgres.mjs`. It passed five checks in a fresh disposable candidate PostgreSQL fixture:

1. Deliberately change a protected predecessor function body, then attempt the unheld fixture successor. Its source preimage refuses. Complete relevant function/constraint/table metadata and stored row snapshots remain identical to the injected state: no additional DDL or data change survives the rejection. Restore the original function definition.
2. Deliberately change a protected predecessor version constraint, then attempt the successor. Its constraint preimage refuses, again leaving the injected metadata and data unchanged. Restore the original constraint definition.
3. With both exact predecessors restored, the fixture successor succeeds. A second attempt refuses, leaving the adopted schema and rows intact.
4. Create two durable fixture jobs/events and claim one through the protected RPC. Observe one queued event, one leased event and one unfinished durable attempt. The intact disable hold rejects without changing that state.
5. Remove the hold only in the disposable fixture. Observe both events cancelled, cleared lease fields, the unfinished attempt failed with a completion timestamp, and the grant revoked. Protected dispatch/finish calls are denied. Stored job data, event payloads, IDs, attempt identities and grant identity fields remain byte-identical; no audit rows disappear.

`receipt.json` includes source hashes, producer hash and before/after snapshot digests. The source and constraint mutations are intentional fixture-only fault injections, not product fixes. The producer substitutes only the lower publication reader for synthetic fixture availability; its job results are declared fixture records. It sends no webhook, exercises no HTTP recall and makes no numerical, canonical, provider-equivalence or production qualification claim.

No production query/write, SQL activation, publication or certification occurred. The existing SQL and earlier evidence remain unchanged.
