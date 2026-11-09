# Operator recovery evidence and isolated restore

The executable local reference preflight accepts no connection:

    node tests/execution-recovery-20261109/operations-preflight.mjs docs/execution-recovery-20261109/operations/operator-references.json

Exit 2 is deliberate: missing references remain BLOCKED; even populated references require independent factual adjudication and never authorize execution. Supply only responsibleParty and opaque evidenceRef (vault:, change:, receipt:, repo: or ticket:) for each listed field. No secret/configuration values or credential URLs are accepted or echoed.

Operator review order:

1. Deployment owner binds the real deployed commit and every participating RPC client/writer to the exact held package. Inventory external jobs, scheduler/service-key holders, direct SQL, RLS-bypass/TRUNCATE and provider DDL/default-ACL writers. Include enabled automatic-main deployment in the proposed window controls.
2. Each writer and DB/provider custodian supplies supported pause/drain/resume and DDL controls, observer, window and abort ownership. Only separately authorized operators enact the freeze. A zero-lock sample and a table lock test do not establish this freeze.
3. Recovery owner supplies checkpoint identifier/time/scope/retention, restore access, independently tested restore receipt and exact row/metadata invariants. Use a separately approved restore destination. Retain evidence of recovery capability, not credentials.
4. Security/deployment/DB custodians supply approved vault/config handles, scoped access/readiness and rotation/recovery ownership. A connector's read access or listed environment-variable name does not establish custody.
5. Review fresh exact held metadata/RPC dependencies in the authorized window, then exact activation/reversal authority. Existing held SQL remains held. Reversal restores known-defective predecessors and preserves publication rows; withdrawing publication requires its separate audited lifecycle path and separate authority. An interrupted or unknown image requires read-only reconciliation, not blind reapply.

New executable isolated recovery:

    node tests/execution-recovery-20261109/operations-restore.mjs

This owns a hardcoded local Docker fixture, rejects production selectors and arguments, and creates a separate empty recovery database inside that fixture. It performs actual pg_dump pre-data, public synthetic data, then post-data restore. It never dumps auth/session/token data or role passwords; a minimal synthetic auth-user ID supplies the public FK dependency. The dump remains in memory; only its hash is recorded.

The post-data order is necessary: installing lifecycle triggers before copying historical published sentinels rejects their initial lifecycle. A late injected restore failure must leave the empty target without public tables. Successful restore must exactly match the seven-table metadata projection and rows, preserve publication/audit sentinels, enforce foreign-key and anonymous authorization denial, then support exact held-core reversal/reapplication without data loss. Guard removal occurs only in disposable in-memory fixture strings.

Default receipt: /tmp/calcumint-operations-restore.json; override with OPERATIONS_REPORT. Copy a qualified receipt explicitly into review artifacts. Ordinary runs never update historical receipts. No production backup or production restore is attested. Provider control-plane/event hooks, external writer completeness and operational custody remain real external requirements. Existing singleton/withdrawal and lock-schedule evidence remains separately scoped; no new publication architecture or deployment is introduced.
