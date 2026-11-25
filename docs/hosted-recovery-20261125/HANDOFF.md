# Immutable attempt-one recovery handoff

RELEASE HOLD ACTIVE. No new authorization consumed, workflow registered, dispatch/rerun, protected-ref/settings modification, merge, source admission, activation, production change, credential change or resource cleanup.

## Exact isolated candidate

Branch engineering/worker3-hosted-remediation-20261125
Commit d93f3b4b986401ca7bae91961360985818bbc7b8
Tree f319ae36f84f9a6c2085154546a9629b01b6f731
Remote SHA independently read back after push.

Proposed workflow blob 15639a8c571914ceb4302c3bf930551aff52f4c1; SHA-256 bf90a09043aa1429566c505b2238be4b44352d249feac82437efa5742e20440c. It exists only in the isolated engineering source and proposal; GitHub workflow registry readback returns no recovery workflow. No registration PR opened.

Scoped source archive recovery-source.tar.gz SHA-256 7ab8f79dbd192d56f9c7eb07c78dd31a4794880fb0b3aeab2cb99ceef10cc28c.

Read failure-analysis.md for exact mechanisms/limitations, provider-permissions.md for official API requirements, verification.json and green.log for focused verification, AUTHORIZATION-PROPOSED.md for exact future operations and proposed owner statement. These documents are evidence and a proposal, not authorization or competent approval.

PostgreSQL artifact 14987606015: ZIP preserved verbatim with SHA-256 a1098236906e43035e80390bd9b1bbf8254d9873c424b929352870000f907560, all 12 existing cases pass, no rerun. Original job durations: postgres-contract15s, provider-readback6s, mass426-authenticated23s. Failed jobs did not produce acceptance receipts. No cross-host claim.

Original run 45537165821 still failed, exact b2c84b5296f85d97d77c6604334b6d64f1a0a2a5, attempt1. Frozen execution ref, rulesets28001423/27851420/27907165 and registration1541 preserved. Source diff confirms original qualification workflow, authority.py, policy.json, execute.py, store.sql and qualify_postgres.py unchanged; no application or calculator engine changes. Existing six application CI controls unchanged.

#426 remains IMPLEMENTED_NOT_ACCEPTED. Portfolio remains 274 bounded private contracts; zero added/double-counted IDs. #440 remains NO-GO for publication. Cross-host durability, fresh hosted recovery authorization/qualification, competent source/product/precision/applicability decisions, exact source admission and governed consumption, six-job application CI, production observer/restoration/rollback decisions and separate release authorization remain outstanding. #432 is no bypass for shared gates. Hostinger Auto-deployment read back OFF.
