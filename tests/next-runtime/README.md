# Isolated actual Next runtime acceptance

See `docs/audits/runtime-pdf-2026-10-22/README.md` for coverage, reproduction and explicit fidelity limits. `database.mjs` uses pinned PostgreSQL17.6 and PostgREST12.2.3 on an internal Docker network; `security.mjs` tests actual HTTP/RLS/transactions. The runtime runner starts actual Next.js in a temporary source copy, with synthetic identity and real database replies. It does not connect to configured production credentials.

The test-copy CSP permits development webpack eval and one exact loopback identity origin; production headers remain unchanged. This is not GoTrue, production-schema equivalence, physical-device acceptance or exactly-once payment/persistence certification. Keep raw diagnostic logs private. RELEASE HOLD.
