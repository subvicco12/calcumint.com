# Shared publication critical-path implementation

Baseline f0d974b9e0a95415a4ef96a6e40ca0386e634eb9, PR1534, CI42394728062 SUCCESS. Owner authorizes autonomous isolated engineering; production and acceptance gates remain held.

Approach: reuse existing 540 register/14293 requirements and reviewed adoption/quota packages. Add the missing exact-version atomic batch composition, rather than rewrite engines or expand #440. A single-item UUID-only transition cannot itself bind an immutable version or guarantee whole-wave rollback.

- Catalog lane owns docs/publication540-shared/catalog and reconcile scripts/tests only: join existing identity evidence to fresh CI GET capture and retained authenticated metadata; unknown freshness remains unknown.
- Database lane owns docs/publication540-shared/database and database tests only: guarded invoker batch function, exact row/evidence preconditions, stable locks, role/gate/audit reuse, rollback/reverse/reapplication and concurrent mutation acceptance. No active migrations or predecessor SQL edits.
- Root owns src/lib/publication-batch-plan.ts and tests: deterministic raw-byte-pinned batch transaction preparation with exact registry identity/version, certified rows, full persisted snapshots and preserved manifest; whole batch refuses on any mismatch. This is an engineering preflight, never approval or production execution. Every item still requires independent canonical/source/QA/qualified decisions and separate activation/release authority.
- Root integrates CI, regression, independent review and immutable SHA-bound Drive delivery. Only one production build at a time.

Validation: tests first; malformed/duplicate identity, version/source drift, inactive caller, missing snapshots, stale capture, one bad batch member and preservation checks. Database proof must include genuine authenticated RLS, untrusted/service-role denial, metadata/version drift, late gate/audit failure, concurrency, bounded locking and reversal preserving data. Existing quota/lifecycle tests reused; only compose new acceptance where needed.

Ruling: no new approval/signature system or commercial quotas. Offline plans always retain publicationEligible=false and productionAuthorized=false; truthful positive isolated fixture results are not certification. Fresh production SELECT permission denial is a blocker, not a reason to try unrelated accounts. All externally governed requirements remain explicit.
