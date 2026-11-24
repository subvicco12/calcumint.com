# Exact non-production hosted qualification decision package

**Prepared, not granted. No registration, protected configuration or dispatch has occurred. RELEASE HOLD ACTIVE.**

- Repository: `subvicco12/calcumint.com`.
- Frozen authority/qualification commit: `b2c84b5296f85d97d77c6604334b6d64f1a0a2a5`.
- Exact tree: `b3081a3e2dd3a10b0d5c4545e74fbefe9f8ddd79`.
- Workflow: `.github/workflows/solo440-hosted-qualification.yml`; blob `af6bc1f8eb1bbe7601ed4ae837e48ac6803ac292`.
- Existing unchanged policy: `aa6b7a18f8dd89c6d4cf01a3aa1514a1c5a5f5ff`; SHA-256 `16564fc8612e87a282195193e539b5e9d44d2fd94c88f9ee9b6ea9f19c73008c`.
- Exact application/fixture: `bab4fd87e91309b15cce9600d81ec523f645f158`; tree `dac8a76d9ad2745e673d3194ec9da0b37905b6bb`.
- Complete source archive: `hosted-source.tar.gz`;1,034,795bytes; SHA-256 `257bf0017446c81f8039ea432e01b8daee49c99f610b2e8b5dcb34d3cb3799b2`.

## Minimum authorized resources and jobs

| Job | Resources | Bound and purpose |
|---|---|---|
| `postgres-contract` | One standard GitHub-hosted runner; one provider-managed PostgreSQL17.6 pinned service |10minutes; qualification-only SQL claims,12 concurrent clients, replay/replacement/nonce/attempt controls, lost acknowledgment recovery, restricted permissions, actual client network partition. No source admission. |
| `mass426-authenticated` | One standard runner; existing digest-pinned PostgreSQL17.6, GoTrue2.197.0, PostgREST12.2.3 services; pinned Node22.23.4 executable, lockfile dependencies, Chrome and pdftotext |20minutes; unchanged #426 driver,3 synthetic authenticated plan journeys and3 native JSON/CSV/PDF readbacks. Application UID/GID65534, no supplemental groups/no-new-privileges, sanitized environment, Docker access refusal, no provider credentials. |
| `provider-readback` | One standard runner; existing restricted environment, existing Drive read credential and read-only job GitHub token |10minutes; current owner/adoption/run/protection readback only. No grant consumption. |

All services publish only loopback ports. Synthetic accounts and fixture signing material are local test inputs, not new platform credentials. No VPS, production database, permanent authority service, public tunnel, paid infrastructure expansion or new platform credentials are permitted. GitHub-hosted services are cleaned up by their job lifecycle. Current package tests one PostgreSQL store on one runner; **it does not authorize or claim cross-host qualification**.

## Required future operations, in order

1. Register only the exact workflow blob above through a separate provider-compliant default-branch PR/review path. Preserve PR1538. Honor every required provider review; no self-approval, bypass actor or disabled rule. Verify Hostinger Auto-deployment OFF before any separately authorized default-branch write.
2. Create `engineering/solo440-owner-v2-execution` at the exact frozen authority SHA only if absent. If it exists at another SHA, stop for a separate decision. Do not overwrite it. Apply approved protection to that new ref only; leave rulesets27851420/27907165 and both frozen refs unchanged.
3. In existing environment `calcumint-source-bootstrap-runtime`, allow exactly the new execution branch and set only `CALCUMINT_SOLO440_HOSTED_WORKFLOW_SHA=b2c84b5296f85d97d77c6604334b6d64f1a0a2a5`. Keep historical workflow SHA variables and credentials unchanged. Current readback allows only the frozen runtime branch, so execution is presently blocked.
4. After the above readbacks and an explicit one-run authorization, execute exactly:

```bash
gh workflow run solo440-hosted-qualification.yml \
  --repo subvicco12/calcumint.com \
  --ref engineering/solo440-owner-v2-execution
```

Run attempt must be1. A rerun, source change or remediation requires a new exact-head decision. Independently read back workflow/run/job IDs, exact head, actor, attempt and conclusions, then archive artifacts with hashes. The workflow ID/run IDs do not yet exist for this unregistered/unexecuted package; none are invented.

## One bounded authorization statement for owner decision

> Authorize provider-compliant registration of workflow blob af6bc1f8eb1bbe7601ed4ae837e48ac6803ac292 from commit b2c84b5296f85d97d77c6604334b6d64f1a0a2a5/treeb3081a3e2dd3a10b0d5c4545e74fbefe9f8ddd79, and one attempt-one non-production run of its three named qualification jobs, with exact fixture bab4fd87e91309b15cce9600d81ec523f645f158 and reviewed source archive SHA-256257bf0017446c81f8039ea432e01b8daee49c99f610b2e8b5dcb34d3cb3799b2. Permit only the specifically listed new-ref protection, exact environment branch allowance and exact workflow-SHA variable operation needed for that run, after the existing provider review requirements are satisfied. Reuse only the named existing credentials, pinned images, ephemeral job services and synthetic accounts. Do not advance frozen refs or modify rulesets27851420/27907165. This grants no PR1538 merge, unrelated merge, broad host Docker socket access, source admission, activation, production SQL, deployment, certification, publication, cross-host store exposure or RELEASE HOLD removal.

This proposed statement does not itself authorize anything. No actual source grant is requested. A real cross-host qualification additionally needs a nominated existing approved non-production PostgreSQL endpoint accessible from two independent runners, exact identity/access controls and already authorized credential references. No such endpoint is identified, and job-local services or exported database snapshots cannot substitute for it.
