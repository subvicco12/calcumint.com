# Controlled publication infrastructure adoption — held runbook

Baseline PR1535 / ee3d0a70cf5a908ce3588bb02b67bbb86576a8a7. This is a reviewable change package, not production authorization. RELEASE HOLD active. No command below connects to production or removes a hold. Production execution, deployment, certification and publication each need their separately scoped authority.

## Scope and first cohort

The sole composed SQL change is the existing seven-table publication core plus its exact-version atomic batch addon. Apply is one transaction: core then addon. Reverse is one transaction: addon then core. No account, membership, billing, quota, native embed or other family package is silently included. Those dependencies are selected only if the independently adjudicated delivery contract needs them.

There is currently **no approved publication cohort**. Retained first review pool N1:370,371,372,373,374,423,424,425,427,428,430,432,433,434,438,440. Take the first actually accepted subset, preserving exact catalog/engine/slug/version/contract/source/deployed implementation bindings. Never manufacture a certified row or use a fixture QA pass. All16 have pending competent/full-contract decisions. OWN-427 is closed and unchanged.

## 1 — Offline package integrity and isolated recovery rehearsal

From the exact reviewed checkout, with the existing dependency cache and approved local Docker runtime:

```sh
node scripts/adoption1535/package.mjs --check
node scripts/adoption1535/inventory.mjs --check
node --test tests/adoption1535/*.test.mjs
node scripts/adoption1535/package.mjs --rehearse
```

`--check` verifies all pinned constituent and transitive source hashes, the generated apply/reverse bytes and transaction shape. `--rehearse` uses only the pinned disposable PostgreSQL17.6/GoTrue/PostgREST fixture. It rejects DATABASE_URL, SUPABASE_DB_URL, PGHOST, PGSERVICE and PGDATABASE and accepts no connection argument. Do not remove legitimate production credentials from an operator shell to trick this test; run it in a separate isolated test workspace. There is no activation mode or remote executor.

The19 rehearsal checks cover default abort even with a continuing client; role/isolation/metadata/provider ACL/overload refusal; late addon failure after core installation rolling back everything; exact postimage/reapplication; genuine JWT role denials, draft/QA/assignment/review workflows; concurrent same drafts; atomic QA/audit failures; direct-published and unready-certification refusal; late reverse rollback; and preservation of all209 explicitly synthetic published sentinels and all model rows. These are not actual competent approvals or production acceptance.

## 2 — Read-only target reconciliation

Use the established authorized CalcuMint connection/project zpwpstsvztyshcnwdfye. Never paste credentials into chat. Execute only the reviewed READ ONLY captures (`docs/adoption1528/production-readonly.sql` and `evidence/dependencies-readonly.sql`) using supported authenticated access. Retain original results and hashes; do not silently normalize unexpected definitions.

Observed 2026-11-07 18:54:09 UTC: core metadata SHA256 **56b55a34c29d2c0dc60863da60df510d5a70d962edbc6582591ba025a756c3f1**, exactly the held core predecessor;209published. Observed 18:56:17 UTC: all requested overloads of the five RPCs below and the atomic batch RPC are absent. Four incoming FKs,13 literal-reference function candidates,30 role capability records and six provider event triggers are recorded. Literal references are not a complete dynamic/external writer inventory. Source/QA and reviewer data approval is not implied by metadata compatibility.

| Missing RPC | Retained source and purpose |
|---|---|
| record_calculator_qa_decision |032: atomic governed QA decision/audit and inherited alert dependencies |
| assign_calculator_reviewer |033: atomic assignment/audit under existing role/RLS rules |
| transition_calculator_with_audit |034: atomic lifecycle/audit, existing gate still authoritative |
| create_catalog_calculator_with_audit |035: protected draft creation with audit/pending QA |
| prepare_catalog_inventory_drafts |Retained sprint20 proposal: exact-v1 atomic draft/QA/audit/job preparation |

The source-bound core also retains the reviewed date/final-row/dependency/trigger-ACL successors. The batch addon adds certified→published exact-snapshot orchestration; it cannot certify or fabricate evidence. Source list and complete target hashes are in `package/source-pins.json`, the composed SQL, and rehearsal receipts. The core projection and addon projection differ; never compare unlike hashes as equivalent. Final addon postimage is an isolated-derived expectation, not an observed production adoption.

Incoming FK/source/QA/reviewer/alert dependencies, RLS, table/column/function/default privileges and provider controls remain exact preconditions. Retain all provider-owned grants; no broad revocation is authorized. No migration-history entries are written or inferred. A later execution requires fresh source/schema/data reconciliation during its approved window; a match observed now cannot establish future quiescence.

## 3 — Writer, deployment and DDL control record

Fill the factual owner/control references in `operator-checklist.json`; do not turn UNKNOWN into VERIFIED by naming a role or setting a boolean. `writer-inventory.json` pins11 known repository paths and their transaction boundaries. The deployed application SHA, enabled scheduler version and actual service/keyholders still require operator evidence.

In particular:

- The scheduled service publisher `src/app/api/internal/admin/publish/route.ts` uses ADMIN_WORKER_SECRET plus service-role access and directly updates lifecycle outside the new authenticated owner/admin batch RPC. Do not grant that service role new EXECUTE privileges or claim it now uses the atomic batch. Identify its scheduler/keyholder and pause/drain it through an approved control, or keep adoption blocked.
- The scheduling action updates publish_at and records its audit in separate requests; it is a known path outside the new batch. Identify and freeze it for this change. No new scheduling policy or service-writer exemption is invented.
- Freeze admin single/bulk creation, source insertion, QA decisions, reviewer/lifecycle changes, alert refresh/resolution and owner bootstrap. Include direct SQL operators, provider/event-trigger/default-ACL DDL, external jobs, credential holders and auth/role changes affecting referenced reviewers. Repository identity is not deployed identity.

Before requesting an execution authorization, name the adoption operator, independent observer, recovery operator, DB/provider custodian, deployment owner, scheduler/service-key custodians and backup/restore owner. Supply their control-plane capability and pause/drain/resume plans, proposed window and tested recovery references. Actual pausing, DDL freeze and transaction drain occur only in a separately approved window. This distinction avoids requiring unauthorized production changes merely to request authorization.

An empty session/lock/prepared-transaction sample is not a freeze. The six provider event-hook identities/tags/definition hashes are retained in evidence/provider-hooks.json; the four extension-only hooks have no matching operation in this package. The two captured PostgREST callbacks perform catalog iteration and transactional NOTIFY only; their exact bodies and registrations are reproduced in the fixture, including automatic RPC discovery and aborted-DDL cache refusal. Actual provider role attributes and complete hosted internals are not reconstructed; operator compatibility review remains required. ACCESS EXCLUSIVE locks can temporarily delay target readers; no zero-downtime guarantee is inferred from local rollback. No command here terminates production sessions, revokes roles, disables triggers, rotates keys or changes provider controls. Inability to name/freeze every relevant privileged writer means STOP.

## 4 — Recovery, preservation and secret custody

Before execution, record an operator-approved recoverable backup/checkpoint, its identifier/time/scope, restore access, independently tested restore receipt, recovery decision owner and retention policy. Specify pre/post data invariants: current catalog rows and exact engine/version tuples, all existing209 publications, source/QA/audit/job rows and historical user data. Preserve original540identities,424ledger records,14private DRAFTs,43authority cases and all immutable engines. Never delete incompatible legacy data to force a precondition to pass.

Use `runtime-secret-custody.json`. Core schema adoption requires approved operator DB authentication; it creates no app secret. Existing public Supabase configuration and actual deployed-source compatibility need verification. Native API/embed account/quota packages and EMBED_SESSION_SECRET are conditional dependencies, not blanket prerequisites for540 ordinary routes. Secret names observed in masked hosting metadata do not prove custody, readiness, rotation or installation. Collect vault/configuration references and responsible identities only—never values, key hashes derived from secrets, credential files or production tokens.

## 5 — Separate authorization decision

Submit the exact source SHA, composed SQL hashes, current read-only preimages, preserved-row invariants, reviewed writer/freeze and recovery plans, custodian records and isolated receipts. Obtain separately scoped adoption and reversal/recovery authority. This packet is **engineering-review-ready**; the currently unnamed operator/writer/recovery/custody evidence means it is **not ready to request unconditional ready-to-execute authorization**. A conditional change review can start now. A freeze is an execution-time condition after the window is approved, not proof supplied by this document.

The files remain unconditionally held. A later authorization must identify a separately reviewed activation artifact and exact bytes derived from these sources; this runbook deliberately supplies no flag, credential or automated hold removal. The present instruction does not authorize generating or executing production activation SQL.

## 6 — Conditions during any later authorized operation

Maintain the approved writer/DDL hold throughout fresh preflight, application, exact postimage verification and smoke tests. Serialize operators. The composed transaction itself enforces postgres, READ COMMITTED,3-second lock and30-second statement timeouts, exact pre/post metadata and no-CASCADE reversal. Any refusal requires ROLLBACK/disconnection and a retained freeze; never edit expected hashes, swallow errors, skip a gate or commit a partial state.

After interruption, first perform a fresh read-only capture. If the full predecessor is still present, a separately approved retry may be considered. If the complete expected postimage is present, adoption succeeded; do not reapply. A partial/unknown/drifted image is STOP and independent investigation. Positive rehearsal is not permission to operate production.

A later authorized schema reversal uses the composed exact-postimage reverse, restoring addon then core atomically while preserving rows. It restores known-defective predecessors, so keep critical writer traffic held and obtain recovery signoff. It is not automatic rollback of any future committed publication; lifecycle withdrawal requires fresh exact state, original audited paths and separate authority. After reversal/reapply, require exact metadata and row invariants again.

Only after separately approved deployment/role/RLS/PostgREST schema-cache compatibility and negative authorization checks may the adoption change be signed off. Verify all existing209 routes/discovery/sitemap stay intact. No QA decision, source approval, certification, publication or native secret activation is part of the schema smoke test. A later first eligible cohort still needs complete competent per-ID decisions, the actual certified state, correct repository version and separate release-wave authority.
