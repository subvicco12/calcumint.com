# Operator qualification and exact attestation handoff

Release held. Authorized pilot and batch are empty. The retained minimum conditional proposal is #218 / launch-square-calculator / square-calculator / v1, with acceptance false. No appointment, canonical decision, production attestation, credential custody or execution authority is supplied here.

Run from the reviewed repository checkout:

```sh
node tests/milestone60-20261113/operations.mjs
node --test tests/milestone60-20261113/operations.test.mjs tests/adoption1535/package.test.mjs tests/execution-recovery-20261109/operations-preflight.test.mjs
node scripts/adoption1535/inventory.mjs --check
```

These commands use local files only. The qualifier hashes the immutable source pins in `attestations.json`, verifies unchanged composed apply/reverse and transitive pins, checks preservation of all ten unsigned controls, validates the retained fixture receipt and runs the existing operator reference assessment. A successful offline qualifier is software qualification, never GO. It deliberately has no activation or connection arguments. The retained 2026-11-07 rehearsal is a 19-check finite synthetic fixture, not a newly executed rehearsal or production recovery qualification.

For factual references, use a separate local nonsecret copy of `docs/execution-recovery-20261109/operations/operator-references.json` and run:

```sh
node tests/execution-recovery-20261109/operations-preflight.mjs /path/to/local-nonsecret-reference-record.json
```

This intentionally exits 2 for either blocked outcome. Each field is null or exactly `{ "responsibleParty": "actual accountable identity", "evidenceRef": "receipt:opaque-reference" }`. Supported opaque prefixes are vault/change/receipt/repo/ticket. Never put secret values, tokens, connection strings or secret-derived hashes in records. All fields present means only that syntax is ready for independent operator adjudication. Do not overwrite the retained unsigned template to manufacture evidence.

`attestations.json` binds all evidence to base commit `2d5d105892134f8af46fc2a02edd5932c431b845` using SHA256 and Git blob. Resolve each path with `git show <baseCommit>:<path>` if the working file drifts. Drift is STOP and a separately reviewed successor; never update expected hashes to force a match. These byte bindings authenticate no person or current production claim.

| Actual control | Precise evidence and decision still required | Retained executable/reference material |
| --- | --- | --- |
| appointment-and-contract | Actual competent independent reviewers, appointment and exact version/source/formula/precision/QA decisions. Preserve #440 appointment handoff; no rediscovery substitutes for appointment. | completion-wave operations release-candidate and exact review paths therein |
| operators-and-window | Change authority names actual operator, independent observer, recovery, DB/provider and writer/deployment custodians; scope, start/end, abort and resume responsibilities. | adoption1535/RUNBOOK.md; operational-thirteen checklist |
| writer-ddl-freeze | Each custodian attests complete live writer roster, control-plane capability, pause/drain/exclusion and individually ordered resume; DB/provider owner covers DDL/default ACL/event hooks and auth-role changes. Actual freeze occurs only in authorized window. | adoption1535/writer-inventory.json and RUNBOOK section 3; reference keys writerRoster, ddlFreezePlan, pauseDrainResume |
| backup-restore | Recovery owner supplies actual production checkpoint/time/scope/retention/access, separately approved restore destination, measured restore receipt and accepted RPO/RTO with data/metadata invariants. | execution-recovery operations PROCEDURE.md and restore-receipt.json; reference keys backupCheckpoint, testedRestoreReceipt. Existing same-cluster synthetic restore is insufficient. |
| credential-custody | Custodians attest opaque vault/config references, least privilege, readiness and rotation/recovery for chosen paths; native/Business only when selected. | adoption1535/runtime-secret-custody.json; credentialCustody |
| deployed-source-and-clients | Deployment owner binds actual runtime bytes/commit and every participating RPC/SDK client and auto-main control to exact selected package. | adoption1535/RUNBOOK.md and writer-inventory.json; deployedCommit, rpcClientCompatibility. Completed Hostinger build metadata alone does not bind all runtime clients. |
| target-preimages-dependencies | Operator plus observer attest exact live metadata, signatures, bodies, owners, ACL/RLS/default ACL, dependencies, data and provider/cache behavior in approved frozen window. | adoption1528/target-metadata.json and expected-postimage; adoption1535 source-pins and unchanged composed package; publication540 expected-postimage. Compare like projections only. |
| versioned-cohort-adoption | Canonical authority signs exact accepted engine/slug/version/source/contract subset; operator reconciles existing rows and supported lifecycle path. | release-candidate exact tuples. Core create has no version argument and inventory supports v1; neither provisions 383@2. No direct version edits. |
| activation-reversal-withdrawal | Distinct authorities approve exact held apply, reverse and withdrawal scope/bytes; preserve abort conditions and ambiguous-commit reconciliation. | adoption1535 composed apply/reverse and RUNBOOK recovery sections; reversalAuthority, withdrawalAuthority. Reverse restores known-defective predecessors, retains rows and does not withdraw publication. |
| postimage-observation-resume | After separately authorized operation, operator/observer record exact postimage, automatic cache/API discovery, role-negative gates and preserved rows/audits; each custodian signs individual resume and closure. | adoption1535 RUNBOOK and retained fixture receipt, with new real post-operation receipts required. No unapproved publication smoke test. |

The single v1 pilot still needs all applicable shared infrastructure controls, real exact-tuple decisions and separate adoption/publication/recovery authority. A larger batch additionally needs each member's exact snapshot/source/contract decisions and supported version-adoption path, atomic subset validation and refreshed immutable snapshot after any successful publication. Business/native/account packages are conditional on the accepted contract; they are not universal prerequisites for a simple calculator pilot. Private/unadopted 323/324 and unsupported 383@2 cannot be silently included.

On ambiguous commit, keep writers paused under actual authority and reconcile exact schema metadata plus catalog/QA/audit/job state before deciding retry/reverse. Creation conflict is not success; QA/assignment retries repeat audits; lifecycle uses expected-state CAS. Apply is core then addon in the unchanged composition; reverse is addon then core against exact expected postimage. Backup restoration, withdrawal and native containment are separate decisions. Never remove unconditional holds, use CASCADE, grant service publication execution or regenerate preimages as part of this handoff.

Remaining software questions are offline package/byte/reference qualification, answered by the commands above. Production truth about clients, freezes, restore relevance, custody and postimage can be measured by software only in the actual authorized environment/window; accountable humans must supply scope, control-plane access, acceptance and signatures. Neither a local pass nor a fresh bounded read-only metadata match can supply those acts.

Retained fresh observations are copied byte-for-byte with checksums in `fresh-observation-links.json`: at 2026-11-13 12:29:11.543289 UTC the read-only seven-relation projection was `56b55a34c29d2c0dc60863da60df510d5a70d962edbc6582591ba025a756c3f1`, matching the held predecessor, and all six exact held RPC signatures were absent. Null grants for absent functions are not execution denials. At 12:32:57 UTC Hostinger reported a completed main build `caffafe639350ca0c2c2cf33ae1f099294f5af54` and enabled auto-main configuration. Use the corrected receipt, which retains original bytes and explicitly corrects the PR1537 baseline to `a955cdad7019a645b7ed2950299d0603ba1784a7`. These observations do not bind actual serving process bytes, every client, freeze, backup or authority. No repeated provider query was made in this lane.

The retained optional lineage test initially stopped at Node `spawnSync git EPERM` under the default sandbox. Running unchanged tests with the existing Node22 runtime and required child-process permissions resolves that environment failure. The initial integrated run then reports 16/18 passing, with two lineage cases blocked by in-progress completion/physics.ts source-binding drift. This is a real integration gate, not an operations attestation or a passing test; rerun after source bindings settle. Seven focused operations/package/reference tests pass separately.
