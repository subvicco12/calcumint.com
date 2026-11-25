# Proposed fresh recovery authorization — NOT GRANTED

The original authorization was consumed by run 45537165821, attempt 1, at b2c84b5296f85d97d77c6604334b6d64f1a0a2a5. No retry or rerun of that run is permitted. No actions below have been performed.

## Frozen engineering source

Source commit: d93f3b4b986401ca7bae91961360985818bbc7b8
Tree: f319ae36f84f9a6c2085154546a9629b01b6f731
Workflow: .github/workflows/solo440-hosted-recovery.yml
Git blob: 15639a8c571914ceb4302c3bf930551aff52f4c1
SHA-256: bf90a09043aa1429566c505b2238be4b44352d249feac82437efa5742e20440c
Scoped source archive: recovery-source.tar.gz
Archive SHA-256: 7ab8f79dbd192d56f9c7eb07c78dd31a4794880fb0b3aeab2cb99ceef10cc28c
Archive recipe: git archive --format=tar.gz SOURCE .github/workflows/solo440-hosted-recovery.yml tools/solo440-v2 tools/singleton440-authority docs/hosted-recovery-20261125
The archive contains exact code-commit paths, not this subsequent authorization handoff.

Fixture remains bab4fd87e91309b15cce9600d81ec523f645f158 / dac8a76d9ad2745e673d3194ec9da0b37905b6bb, archive SHA-256 257bf0017446c81f8039ea432e01b8daee49c99f610b2e8b5dcb34d3cb3799b2. No engine, driver, authority policy, nomination, source verifier or PostgreSQL contract modification.

## Unresolved precondition

The original provider endpoint and HTTP status were discarded by the old adapter. The exact failing API/permission or Google credential condition remains unestablished. All nine sequential endpoint accesses must remain required. No new credential, credential replacement, scope expansion or administrator permission change is justified by the available evidence. A future owner decision must explicitly accept diagnostic uncertainty or first establish the existing credential's applicable read access through an approved mechanism; this document does not silently assume provider success.

## Exact future registration/configuration proposal

1. Review only the new workflow addition on a fresh branch from then-current main. Require blob 15639a8c571914ceb4302c3bf930551aff52f4c1, SHA-256 bf90a09043aa1429566c505b2238be4b44352d249feac82437efa5742e20440c, exactly one added file and no unrelated changes. Verify Hostinger Auto-deployment OFF, applicable checks and reviews before any separately authorized merge. No registration PR created for this recovery.
2. Create exactly proposed-ruleset.json, targeting only refs/heads/engineering/solo440-owner-v2-recovery-execution, active, no bypass. Verify the lock before creating the branch at d93f3b4b986401ca7bae91961360985818bbc7b8. If locked creation is refused, stop; never disable or bypass protection. Existing 28001423/27851420/27907165 and refs remain unchanged.
3. In calcumint-source-bootstrap-runtime add only engineering/solo440-owner-v2-recovery-execution to existing branch allowances. Create only CALCUMINT_SOLO440_RECOVERY_WORKFLOW_SHA=d93f3b4b986401ca7bae91961360985818bbc7b8; stop on an unexpected existing value. Preserve all historical variables, including CALCUMINT_SOLO440_HOSTED_WORKFLOW_SHA.
4. Preserve existing CALCUMINT_BOOTSTRAP_DRIVE_TOKEN without extraction/change. It must authenticate the exact adopted owner and permit userinfo, Drive about and exact adoption-comment GET. Job token remains contents:read/actions:read plus metadata; applicable endpoint access must be confirmed, not bypassed. No speculative permission increase is included. Official GitHub permission metadata blob 686475ba5c572048f3cf8da38a5206e2dc9324f6 confirms these declared permissions cover all required GitHub GET endpoints; see provider-permissions.md.
5. After fresh owner authorization and all preconditions: exactly one dispatch, no inputs, by subvicco12 on the new protected ref, attempt 1 only. Zero prior runs, exclusive dispatcher, no retry on ambiguous response, authoritative run reconciliation; no atomic cross-dispatch lock is claimed.

Proposed command, NOT EXECUTED:

    gh workflow run solo440-hosted-recovery.yml --repo subvicco12/calcumint.com --ref engineering/solo440-owner-v2-recovery-execution

Only jobs: mass426-authenticated (20 minutes), provider-readback (10 minutes). Total 30 configured runner-minutes. PostgreSQL job is omitted because its exact unchanged implementation already passed; the original 12 receipts remain part of the combined evidence. Neither job-local nor independent-client evidence establishes cross-host durability.

Expected receipts: mass426-authenticated-acceptance includes mass426-setup.json, socket-isolation.json, receipt.json and actual JSON/CSV/PDF bytes/readbacks; solo440-provider-readback includes either full verified readback or fixed-category/status refusal JSON. Failure receipts never count as acceptance. Require both individual SUCCESS conclusions and full per-calculator evidence before any #426 ledger credit. Original three-job run remains failed; no claim of aggregate success across a single run.

## Proposed owner statement

“I acknowledge that the original qualification authorization was consumed by run 45537165821 attempt 1. Subject to resolving or explicitly accepting the documented provider diagnostic uncertainty, verifying exact source d93f3b4b986401ca7bae91961360985818bbc7b8 / tree f319ae36f84f9a6c2085154546a9629b01b6f731, workflow blob 15639a8c571914ceb4302c3bf930551aff52f4c1 / SHA-256 bf90a09043aa1429566c505b2238be4b44352d249feac82437efa5742e20440c, the scoped archive checksum, and all deployment/protection/review/credential preconditions, I authorize only the exact one-file registration, new recovery-ref protection/environment configuration described here and one no-input attempt-one dispatch on the new protected ref. I accept the explicit exclusive-dispatcher/zero-prior-run/no-retry/reconciliation procedure. The maximum configured budget is 30 runner-minutes; the successful PostgreSQL artifact is reused. I do not authorize changes to frozen refs/rulesets, new or replaced credentials, source admission, activation, production SQL, deployment, certification, publication or cleanup. RELEASE HOLD remains active.”

This is proposed text only; it does not establish owner approval or resolve provider access.
