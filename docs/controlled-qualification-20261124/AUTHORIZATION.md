# Final hosted qualification authorization preflight

**PREPARED FOR OWNER REVIEW — NOT AN AUTHORIZATION. RELEASE HOLD ACTIVE.**

This package changes no implementation. Authority `b2c84b5296f85d97d77c6604334b6d64f1a0a2a5` / tree `b3081a3e2dd3a10b0d5c4545e74fbefe9f8ddd79` and fixture `bab4fd87e91309b15cce9600d81ec523f645f158` / tree `dac8a76d9ad2745e673d3194ec9da0b37905b6bb` remain fixed.

The machine-readable exact operations are in `operations.json`, SHA-256 **`58a0916909667760d866baf279b2f4befc57f055778300b881fd97bba4d37677`**. Source archive SHA-256 remains `257bf0017446c81f8039ea432e01b8daee49c99f610b2e8b5dcb34d3cb3799b2`.

## Verified immutable workflow and original authorization

- Path: `.github/workflows/solo440-hosted-qualification.yml`.
- Git blob: `af6bc1f8eb1bbe7601ed4ae837e48ac6803ac292`.
- SHA-256: **`64dd55015c77e30270db84514fe856da7a9f4050128671b5a92b8ee44c7e45de`**.
- Byte-identical review copy: `registration-workflow.yml`.
- Original immutable AUTHORIZATION.md: https://github.com/subvicco12/calcumint.com/blob/56ebaf736982d08fa9f33852fb628d63c51fbdf8/docs/socketfree-20261124/AUTHORIZATION.md
- Original SHA-256, independently retrieved through authenticated GitHub: **`312a97950f63e24fe42529ca4ebcd748deb4f0fafd1846881c625012b1d8276f`**. It is unchanged. This final preflight adds explicit settings and operational limitations for review.

## Exact registration PR and proposed settings — not applied

The proposed separate PR is titled **Register held socket-free #440/#426 qualification workflow**, from `engineering/worker3-hosted-qualification-registration-20261124` to `main` observed at `8dd7b1d3cb59ce7cbc858d4a28d3e68a43259c5f`. Its entire diff is **one added file**, the workflow path above with exactly that blob/hash. No tool modules, application source, fixture source, held SQL, existing workflows or acceptance ledgers may be changed by that PR. If the base or content drifts, stop for fresh review. No PR has been opened. Current default-branch workflow file is absent (HTTP404).

Create `refs/heads/engineering/solo440-owner-v2-execution` at authority SHA `b2c84b5296f85d97d77c6604334b6d64f1a0a2a5` only if absent; it is currently absent (HTTP404). If it exists at another SHA, stop; no update or force-push is permitted.

Apply exactly `proposed-ruleset.json`: new rule name `calcumint-solo440-owner-v2-execution-lock`, target `branch`, enforcement `active`, no bypass actors, include only the new execution ref, no exclusions, and rules `deletion`, `non_fast_forward`, `update`. This mirrors the existing frozen-ref lock shape. Do not change rulesets27851420/27907165 or their frozen refs. The new ref must be protected before dispatch.

In existing environment `calcumint-source-bootstrap-runtime`, **add** only branch policy `{ "name": "engineering/solo440-owner-v2-execution", "type": "branch" }`. Preserve existing policy67924782 for `engineering/trusted-bootstrap-runtime-20261123` and all other environment settings. Set only environment variable `CALCUMINT_SOLO440_HOSTED_WORKFLOW_SHA` to `b2c84b5296f85d97d77c6604334b6d64f1a0a2a5`. If already correct, no-op; if an unexpected value is present, stop for review. Do not replace the whitelist, alter historical SHA variables, add a bypass, disable reviews or weaken protection. All existing provider/governing review requirements remain applicable.

## Credentials: presence and permitted scope

The provider job references the **existing** environment secret `CALCUMINT_BOOTSTRAP_DRIVE_TOKEN`. The integration's metadata-only presence request returned HTTP403, so **current presence is not independently confirmed**; the owner/admin must confirm it without exposing its value. Its already granted scope must permit verified Google userinfo (subject115201266201052505736 and verified email subvicco12@gmail.com), Drive about, and read access to exact adoption document1KU7fGtv86RQz_n3HCdl9HscTyN2Z7SlXz8U8EF3f3MY/commentdoco.yCW4dzFjM3eDgvrRWjBNVA. Existing openid/profile/email plus sufficient Drive read access, such as drive.readonly, satisfy the intended operations. No Drive writes, token replacement, new credentials or scope expansion is authorized. Insufficient access must fail closed in provider-readback.

The job's existing `${{ github.token }}` is limited by the exact workflow to `contents: read` and `actions: read`, with provider's implicit repository metadata access. No write/admin scopes are requested at runtime. Registration/protection/variable operations need the owner's existing administrative context, not privileges passed to the jobs. The application receives no provider tokens; signing material and accounts are disposable synthetic fixture inputs only. SHA-variable metadata also returned HTTP403; an owner must verify its current state before applying the exact proposed value.

## Three jobs, budgets, inputs and receipts

| Exact job | Timeout | Expected receipt |
|---|---:|---|
| `postgres-contract` |10minutes|`solo440-postgres-qualification/postgres-qualification.json`: actual PostgreSQL17.6, independent/concurrent clients, uniqueness, refusal, interrupted/lost-ack reconciliation and network-partition results; qualification-only, no admitted source.|
| `mass426-authenticated` |20minutes|`mass426-authenticated-acceptance`: passed receipt with exactly3 authenticated Free/Pro/Business rows and3 actual JSON/CSV/PDF readbacks with original bytes/hashes, account/plan isolation, replay/version/tamper/refusal and revocation, source/build bindings and socket-isolation.json.|
| `provider-readback` |10minutes|`solo440-provider-readback/solo440-provider-readback.json`: exact owner/adoption, run/head/actor/attempt and active protection/environment readback; admitted=false, activated=false, no inferred product approval.|

**Configured combined maximum job budget:40 runner-minutes.** Three standard runners,4 provider-managed ephemeral service containers total (one PostgreSQL for the contract job; PostgreSQL/GoTrue/PostgREST for #426). All images retain their existing digest pins. Application Node22.23.4 executable hash and lockfile installation remain pinned. No paid host, permanent service, production DB, public tunnel or new platform credentials. Billing dollars/provider overhead are not inferred from timeout settings.

The workflow declares **no dispatch inputs**. Exact API body: `{ "ref": "engineering/solo440-owner-v2-execution" }`; no `inputs` object or extra fields. The only proposed invocation is:

```bash
gh workflow run solo440-hosted-qualification.yml \
  --repo subvicco12/calcumint.com \
  --ref engineering/solo440-owner-v2-execution
```

All three individual jobs must conclude SUCCESS, on the exact authority head, actor `subvicco12`, attempt1. Aggregate success, skipped jobs or local tests do not qualify anything. Preserve actual workflow/run/job IDs and receipt hashes after execution. Existing six mandatory application CI jobs remain unchanged and are not replaced by these three jobs.

## Duplicate-run control: exact limitation and mandatory procedure

The code enforces attempt1 and refuses reruns. **It does not implement an atomic cross-dispatch lock or GitHub POST idempotency.** Multiple separate dispatches could each start at attempt1; no claim of automatic prevention is made. Current authenticated repository readback found0 runs at the candidate head.

This proposed one-run authorization therefore uses an explicitly accepted **operational** control:

1. The sole dispatcher is `subvicco12`, using one session; no parallel dispatcher, bot retry, schedule or automation is authorized.
2. Immediately before dispatch, independently verify registered workflow identity, exact protected ref/SHA/environment variable, and paginate all workflow runs across every status. There must be0 matching workflow/head/ref runs. Any prior, queued, running, failed, completed or ambiguous match means STOP; reuse/read back evidence or seek a new decision rather than dispatch again.
3. Invoke the command once. Do not retry on a timeout, network failure or missing acknowledgment.
4. Reconcile uncertainty from authoritative GitHub run history for the exact workflow/head/ref/event/actor and authorization time. One matching run consumes the authorization: record its ID and poll/read it only. Zero results while outcome is uncertain or multiple matches means STOP for owner reconciliation, not another POST. No cancellation, rerun or second dispatch is implicitly authorized.

If hard automatic duplicate-new-run prevention is required, this candidate does not satisfy it; approve no execution until a separately reviewed source amendment exists. The statement below deliberately acknowledges the operational control rather than claiming an atomic guard.

## Complete exact statement prepared for the owner

> I authorize only the operations in operations.json SHA-25658a0916909667760d866baf279b2f4befc57f055778300b881fd97bba4d37677 for repository subvicco12/calcumint.com: register only .github/workflows/solo440-hosted-qualification.yml, blob af6bc1f8eb1bbe7601ed4ae837e48ac6803ac292, SHA-25664dd55015c77e30270db84514fe856da7a9f4050128671b5a92b8ee44c7e45de, from authority commit b2c84b5296f85d97d77c6604334b6d64f1a0a2a5/tree b3081a3e2dd3a10b0d5c4545e74fbefe9f8ddd79, through the exact one-file registration PR and applicable provider/governing reviews. Use fixture bab4fd87e91309b15cce9600d81ec523f645f158/tree dac8a76d9ad2745e673d3194ec9da0b37905b6bb and source archive SHA-256257bf0017446c81f8039ea432e01b8daee49c99f610b2e8b5dcb34d3cb3799b2. Permit only creation of the new execution ref at that exact authority SHA if absent, the exact new no-bypass lock in proposed-ruleset.json, addition of only that branch to existing environment calcumint-source-bootstrap-runtime, and setting only CALCUMINT_SOLO440_HOSTED_WORKFLOW_SHA to that authority SHA after current-state verification. Preserve frozen rulesets27851420/27907165, their refs, historical variables, PR1538 and all six mandatory application CI controls. After existing-secret presence and Hostinger Auto-deployment OFF are confirmed, authorize subvicco12 to make one dispatch, with no inputs, on that exact execution ref: postgres-contract10minutes, mass426-authenticated20minutes and provider-readback10minutes, combined configured budget40 runner-minutes, attempt1 only. I acknowledge there is no atomic cross-dispatch lock and accept only the documented exclusive-dispatcher, zero-prior-run, no-retry and authoritative-reconciliation procedure; uncertainty requires stopping, not another dispatch. Reuse only the named existing read-only credentials, pinned images, ephemeral job services and synthetic accounts. Require SUCCESS and exact-head receipts from each individual job; do not promote a calculator solely on CI. This grants no resource stop/deletion, broad application Docker socket access, new credentials, new service or public tunnel, frozen-ref update, PR1538 merge, unrelated merge, source admission, activation, production SQL, deployment, certification, publication or RELEASE HOLD removal. Cross-host PostgreSQL qualification and production observer/restoration decisions remain separate and do not delay this three-job qualification alone.

This statement is prepared text only. The current instruction authorized preflight and strictly read-only resource inventory, not any operation in this statement.

## Current resource and cross-host disposition

Read-only inventory succeeded under the new explicit authorization. The recorded container/network IDs and volume creation timestamp match. The container is running, with no published port, observed CPU0.00%, RAM23.91MiB and6PIDs; only that container depends on the named volume and network. No explicit memory/NanoCPU/CpuQuota limit appeared in those inspected fields. No contents or credentials were inspected; local-volume size and dollar cost are not established. No separate paid resource was created. Cleanup remains HOLD; no stop or deletion occurred.

The existing local bridge endpoint is not a shared cross-host resource. Name-filtered connected Neon metadata returned no CalcuMint projects. Supabase metadata lookup requires an existing link_id selector, so it established no available shared endpoint. No credential or connection string was retrieved, and no new service/tunnel was created. Cross-host qualification remains unresolved independently of the three-job package. The current native client remains loopback-only; a future nominated store would require its own exact TLS/identity/access binding and review, not silent redirection.
