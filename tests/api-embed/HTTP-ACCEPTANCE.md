# Embed lead HTTP acceptance

Run `node tests/api-embed/atomic-postgres.mjs` from the repository root. Docker must be available locally; the existing dependency installation must include Vitest. This runs the existing 16 native PostgreSQL cases, the separate legacy orphan reproduction, then 19 HTTP cases. It fails on a missing Docker/image/runtime dependency rather than silently skipping.

The runner creates disposable PostgreSQL 16 and PostgREST 12.2.3 containers using digest-pinned images on a unique internal Docker network, tmpfs database storage, and no published container ports. HTTP tests verify the network, inspected private PostgREST address and absence of port bindings. All credentials, JWTs, users, leads and URLs are synthetic. No production URL or service credential is read. Existing environment proxy/CA configuration is inherited without replacement. Containers and network are removed in `finally`.

The SQL remains an unapplied, guarded proposal. The fixture first proves the guard rejects execution, then removes that exact guard only in the disposable database. It uses migrations 005/006 and minimal prerequisite tables/helpers. The fixture `auth.uid()` supports both legacy per-claim settings and PostgREST's actual JSON JWT claims; membership/role helpers model only two synthetic owners.

The HTTP path is a loopback Node HTTP listener invoking the real Next lead route, a real Supabase JS client, a loopback path adapter for `/rest/v1`, real PostgREST JWT verification/role switching, and PostgreSQL. Only the admin-client factory is replaced. The adapter does not replace authorization or database results. This does not boot a complete Next server or deploy the application.

The acceptance cases cover:

- JSON success/error responses, private success bodies, no-store success, affirmative applicable consent, malformed JSON, invalid identity, forged/expired capabilities and required-field validation.
- Concurrent identical and conflicting requests, one immutable receipt and the expected lead/consent/webhook/event counts.
- Consent and receipt trigger failures rolling back all mandatory effects and webhook enqueue, followed by explicit same-key retry.
- A real successful PostgREST response fully consumed and then deliberately discarded: route returns 503, SQL proves the five effects committed, and explicit same-key retry returns duplicate without another effect. This proves recovery from simulated post-commit response loss; it does not claim network-wide exactly-once delivery or automatic reconciliation.
- Exact stale consent text/privacy rejection, privacy-only changes, blank configured consent, and retention of original evidence on committed retry after terms change.
- Public key/config/organization/calculator/version bindings, paused/disabled/draft state, and independent same-UUID capture under two valid configs.
- Actual invalid JWT rejection; anon/authenticated RPC and receipt denial; revoked service execution with no fallback; definer owner/search path; service direct receipt mutation denial; owner/nonowner RLS reads for leads and consents.
- Corrupted receipt ownership, stored lead payload and consent evidence refusing duplicate acknowledgement; direct RPC payload/binding/expiry checks; best-effort analytics failure preserving mandatory evidence.

Limits: synthetic membership helpers do not establish correctness of the full production organization graph. No browser/widget, CORS, reverse proxy, production deployment, migrations beyond fixture prerequisites, worker webhook delivery, real third-party service, distributed network fault injection, or complete Next server startup is covered. Application errors deliberately redact SQL details; generic failures may map to 503. Existing native quota cases run unchanged; this HTTP suite does not exercise quota middleware. Passing fixtures authorize no SQL deployment.

Observed implementation defects: none reproduced in the application route or proposal. Initial owner RLS HTTP acceptance failed because the old fixture helper ignored PostgREST JSON JWT claims; correcting that fixture helper made actual owner/nonowner assertions pass. No production SQL or route change was needed.

Schema fidelity follow-up (2026-10-20): the same HTTP/route cases now run against
whole repository 001/003/004/005/006/029/032_business_builder dependencies and
actual membership helpers/RLS. Final focused run: **18 native + 19 real route
HTTP cases passed** (prior 16 native and separate orphan reproduction preserved).
Three shared schema/catalog check groups also pass, including six deliberate
catalog drift rejections. See [bounded schema evidence and remaining production
attestations](../api-schema/README.md). This supersedes only the earlier minimal
fixture dependency description.
