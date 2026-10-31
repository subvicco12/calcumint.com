# Batch16 genuine-auth business integrity investigation

Status: **software prepared; review-only successor; active application and hosted schema remediation BLOCKED**. No historical SQL, production schema, active application RPC path, or original19-group default run is changed. Opt in with:

```sh
BATCH16_AUTH=1 GOTRUE_FULL_ARTIFACTS=/tmp/batch16-auth-results node tests/gotrue-full-schema/acceptance.mjs
```

Use the project's exact dependencies and Node22. The pinned GoTrue2.197.0 / PostgreSQL17.6 / PostgREST12.2.3 fixture creates only an internal disposable Docker network. The opt-in runner keeps the original19 groups and adds10 groups. A successful characterization means a defect was **demonstrated**, not that historical behavior met acceptance criteria.

Observed legacy defects:

- Two distinct real JWT invitation redemptions, stopped after their seat reads by a test-only advisory-lock barrier, both consume the final seat: six members result.
- Two simultaneous redemptions of one token both succeed and append two joined audit records.
- A valid local tenant writer can reference a known foreign project UUID from a client row; shared rows likewise accept foreign project or client UUIDs.

The test first proves the unchanged successor SQL rejects execution. Its bytes are hashed in the receipt; only an in-memory copy has its explicit leading guard removed inside the disposable model. The successor locks the organization before rechecking/locking the invitation, serializing redemption across distinct invitations and duplicate redemption of one invitation. Composite foreign keys bind project/client references to their row's organization. The isolated successor then admits exactly one final-seat request, admits a token once with one audit, rejects all three foreign-reference paths, and retains positive same-tenant links. It does not enter the application migration sequence or change the existing review bundle.

Actual genuine-auth negatives also show an unchanged access JWT loses admin write authority after role demotion and tenant visibility after membership removal; a deleted invitation cannot be redeemed; a foreign owner cannot issue another tenant's invitation or delete its members. Global GoTrue logout rejects refresh-token reuse. An already issued access JWT remains valid until expiry: this is an explicit boundary, not session revocation acceptance.

## Remaining compatibility and adoption gates

Concurrent invitation issuance is still a non-atomic application preflight. Direct membership writers, privileged external writers and owner transfer paths do not participate in the successor's organization lock. Existing-member invitation role updates retain the old contract and require an explicit owner policy disposition; the existing identity trigger only fences user/organization identity. No unconditional owner immutability policy is invented here. The original suite verifies admin RLS cannot demote an owner, which does not prove all SECURITY DEFINER flows share that fence.

Before adoption: obtain an authorized current schema/ACL/function/ledger capture; inspect incompatible existing cross-tenant references without deleting or rewriting user data; reconcile effective grants/ownership and all participating writers; review invitation issuance and existing-member semantics; verify supported delete behavior and application compatibility; assign actual deployment/rollback identities and owner approval. The new SQL is review material and deliberately cannot run unchanged. It is not a complete concurrency protocol or permission to deploy.

`schema-descriptor.mjs` exports a read-only, business-scoped catalog query with definitions, RLS policies, constraints, triggers, ACLs, effective client table grants and relevant role memberships. The receipt embeds before/after local descriptors and SHA256 fingerprints. `compare-schema.mjs` compares two authorized exports using canonical object ordering, reporting differing sections and both hashes:

```sh
node tests/batch16-auth/compare-schema.mjs model.json authorized-capture.json
```

Equal descriptors establish equality only in this declared catalog scope; they do not establish capture provenance, authentication of the source, full schema/ledger equivalence, data compatibility, hosted auth/gateway behavior or production acceptance. No authentic raw capture is available in this workspace, and no hosted comparison was executed. The connected Supabase project discovery tool required an unavailable connection link identifier; no credentials were searched and no production writes occurred.
