# Embed consent and retry privacy checkpoint — 20 October 2026

RELEASE HOLD. Cumulative from #1443 `0a7d9af97da42ab01a18f5ec7aa0bad0015a4474`. No production reads/writes, SQL application, deployment, certification or publication. Existing quota proposal/tests, billing/auth and migration files remain unchanged.

## Reproduced failures and corrections

1. A widget displayed old consent/privacy content, but the request contained only `consented=true`; the RPC stored the current configuration text without checking what was displayed. A stale-terms PostgreSQL regression failed before correction. New captures bind the exact displayed `consentText` and nullable `privacyUrl` to the current configuration. A mismatch returns PT412; the route emits a generic `CONSENT_CHANGED` conflict and the widget requires reload instead of blindly retrying stale terms.
2. Duplicate acknowledgement checked receipt payload and the existence of any true consent, but not the stored lead's actual tenant/configuration/fields or exact consent text/privacy. The proposal now retains explicit consent/privacy snapshots in the receipt and checks the referenced lead, payload fields and exactly one matching consent. Corrupted tenant, contact data or consent evidence fails closed.
3. A pending capture completed after the widget changed public key and rendered its old success in the new context. The DOM regression failed before correction. Calculator/key/definition/displayed-consent scope now owns a keyed component instance; old async completions cannot update the new scope, and previous contact/retry data is cleared when scope changes. Ordinary edits and same-version token renewal preserve drafts/retry identity. New immutable version claims reset state even if the definition JSON is identical. Client-side token decoding partitions UI state only: it is not signature verification or authorization; server HMAC/publication validation remains required.
4. The RPC accepted arbitrary unknown payload fields and non-object captured inputs/outputs when invoked directly. The proposal now allowlists the supported payload keys and rejects non-object captures; the public route still provides authoritative string/email/URL schema validation before the service-only RPC.

## Immutable retry decision

An existing exact committed receipt is reconciled against its original lead and original consent snapshot before comparison with mutable current consent text. A legitimate lost-response retry can acknowledge its original capture after active configuration terms change; it does not accept the newer terms or rewrite historical evidence. A new request with old displayed terms is rejected. Current active configuration, organization, published version and capability expiry checks still precede acknowledgement. Privileged corruption, disabled captures or mismatched versions do not silently recover.

Literal consent fields are client assertions about displayed content, not proof a human read or legally accepted a policy. All legal/privacy authority remains UNKNOWN. Direct clients must supply consentText and privacyUrl (null when absent); route/widget/proposal require coordinated review and rollout. Legacy clients cannot silently inherit current terms.

## Evidence and limits

Focused route/browser/static integration tests pass, including exact literal forwarding, missing evidence, stale-term reload, old-scope completion, changed-terms retry isolation and same-version renewal versus new-version reset. Sixteen native PostgreSQL cases pass: all twelve prior embed/quota cases plus stale displayed terms, original committed terms, corrupted duplicate evidence and malformed/minimization cases. The four privacy cases run against actual 005/006 schemas over synthetic prerequisites, inside a guarded disposable PostgreSQL fixture. Existing concurrency, rollback including webhook rows, role denial, RLS, quota race/isolation and optional phone/company cases remain passing.

Affected lint: no errors; one pre-existing `_options` warning in the widget test. Full typecheck/build/exact-head CI belong to the integration owner; no redundant full build was run in this lane.

The receipt still retains contact/capture payloads and consent evidence, as the existing proposal did. No retention duration, deletion authorization, clinical/financial approval or cryptographic audit guarantee is invented. Database/security/privacy owners must review data retention, restricted deletion/FKs, actual default/inherited grants, function ownership and every privileged writer. SQL is an evolving unapplied proposal, not a deployed migration. No production atomicity or exactly-once guarantee is established.
