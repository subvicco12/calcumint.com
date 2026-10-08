# Transactional admin RPC database validation

Run `tests/atomic-admin-rpc-db-smoke.sql` **only in an isolated test database** after applying migrations 032, 033, 034, and 035 in order. The SQL performs catalog/privilege assertions and does not mutate application data.

It verifies that the four exact function signatures exist, remain SECURITY INVOKER, cannot be executed by the anonymous role, are executable by authenticated users, and that RLS remains enabled on all four admin tables.

**Not covered:** role-specific row visibility, authenticated caller identities, QA trigger behavior, failed audit insert rollback, publication gating, or concurrency. These require fixture-based transactional integration tests in a disposable environment. Do not use production user records or disable RLS for testing.

Production currently lacks migrations 032–035; do not run this smoke script there until a separately approved deployment has applied them.
