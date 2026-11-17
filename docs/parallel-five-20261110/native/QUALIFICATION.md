# Held native18 exact-cohort successor

`contract-successor.sql` extends the preserved native13 candidate with only 369 (`technology.cidr`), 375 (`technology.raid-capacity`), 380 (`technology.battery-runtime`), 381 (`technology.ups-runtime`) and 387 (`technology.password-entropy`), all at version 1. Original 383 remains version 2. No commercial quota constants, ownership, grants, RLS policies, integrity triggers, delivery leases or existing evidence functions change. Two existing functions receive explicit tuple-map additions; three existing check constraints receive those same exact tuples.

The SQL remains held by `UNAPPLIED_PARALLEL_FIVE_NATIVE_SUCCESSOR`. It requires the exact predecessor chain through `docs/next-cohort-native-20261110/contract-successor.sql`, postgres session/current identity and READ COMMITTED. After acquiring table locks, it checks a captured full native schema fingerprint, including native function definitions/owners/ACLs and native table owners/ACLs/RLS/columns/checks/indexes/policies/triggers. A mismatch refuses the transaction. This is disposable candidate-model evidence, not captured production equivalence or SQL activation authority.

`contract-reverse.sql` remains held by `UNAPPLIED_PARALLEL_FIVE_NATIVE_REVERSE`, binds the exact adopted schema fingerprint, and refuses if any durable new-five grant, usage or job exists. It never deletes audit records or disables integrity triggers. With historical-only records it restores original13 function sources and exact original CHECK creation statements. Reusing deparsed CHECK output was found to flatten PostgreSQL's nested OR expression tree; the final reverse uses the original preserved SQL lines and verifies the original fingerprint exactly.

## Observed fixture proof

Run `node tests/parallel-five-native-20261110/contract.postgres.mjs` with authorized local Docker access. `--capture` additionally reconstructs held candidate files from actual isolated PostgreSQL source captures; ordinary mode asserts checked-in artifacts equal independently reconstructed candidates. The fixture reuses the existing pinned PostgreSQL/GoTrue/full candidate schema helpers and creates no exposed database port or production connection.

The final isolated run passed nine checks, recorded in `receipt.json`:

- All original13 exact jobs succeed; all new5 fail before adoption. Historical data contains 13 jobs, one grant and one durable usage row.
- Source drift rejects adoption; intact holds reject; forward reapplication rejects without mutation.
- Successful reverse restores the exact original schema fingerprint and byte-identical nonempty historical rows. Reverse reapplication rejects. Forward adoption succeeds again from that restored preimage.
- All new5 exact jobs complete with stable duplicates; wrong version/engine, unrelated IDs and untrusted roles reject.
- All new5 embed grants consume protected quota and replay the same durable request.
- Reverse refuses populated new-five durable evidence without deleting or mutating it.
- Every unchanged function source and all table metadata other than the intended checks remains exact.

`preimage.json` retains pre/post full schema captures, fingerprints and predecessor artifact hashes; `receipt.json` binds successor/reverse hashes. ESLint and syntax checks pass. The lower publication reader is synthetic true only inside the isolated SQL fixture; job outputs are fixture literals. Therefore these checks establish protected SQL admission, integrity and rollback behavior, not numerical correctness, real publication acceptance, webhook dispatch or certification. Existing acceptance/source-binding/active migration artifacts remain unchanged. No build, commit, production write or SQL activation occurred in this lane.
