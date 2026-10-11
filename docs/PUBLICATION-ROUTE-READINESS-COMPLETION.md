# Publication and route readiness — Batch 5

This review increment stacks on draft #1376 at `540d52531a1cbcfc090911d0589585b135f2787b`; current main is `caffafe639350ca0c2c2cf33ae1f099294f5af54`. It does not modify or activate that draft. The supplied 1 October 2026 governing blueprint and master catalog remain the sources for approval/publication separation. Existing Batch 4 master-ID ledger remains authoritative for unresolved mapping candidates; this report adds engine-level route evidence rather than guessing master identities.

## Implemented

- Validate the entire minimal publication RPC payload at runtime. Malformed rows and conflicting slug/key/version identities make authority unavailable; exact duplicates are idempotent. Direct composition fails closed too, independent of row order.
- Memoize snapshots with React `cache`, scoped to one server request, not persistent Next caching. Metadata and detail rendering use one shared governed resolver, requiring current publication authority, exact repository identity/version through composition, repository certification, governed content and canonical category. Related links continue to use the same snapshot. Wrong-category URLs and unsupported aliases remain blocked.
- Provide an anonymous, read-only route-readiness command and the committed 573-row engine ledger. It distinguishes structural route readiness from unknown runtime publication evidence; observed identity/version mismatches are separate diagnostic evidence and never grant a route.

## Counts and evidence

Local repository: 573 distinct registered engines/slugs; 225 code-certified, 37 reviewed, 311 draft; 225 structurally route-ready content candidates. Catalog: 540 master IDs across 27 domains, unchanged. This environment has no public Supabase URL/anonymous key or service-role/database configuration (names/presence checked only). Runtime-approved route count and specialist approvals are **unknown**, not zero; every committed engine row has unknown publication evidence. No database query was possible or inferred.

Reproduce the report using existing installed tooling:

```sh
node node_modules/vite-node/vite-node.mjs --config vitest.config.ts scripts/public-route-readiness.ts
```

The command uses only the existing minimal anonymous RPC if public configuration is available. It performs no service-role query, import, lifecycle transition or production write. Its local report does not establish deployed visibility or expose credentials/errors.

Focused verification: 26 unique tests across seven files cover malformed/ambiguous identities, exact duplicates, DB failures, version/code-certification withdrawal, unknown authority, structural counts, canonical metadata/detail/sitemap parity and actual discovery surfaces. Existing source guards assert request-scoped cache wiring and absence of persistent cache directives. Installed Next documentation explicitly permits React `cache` for shared metadata/page non-fetch data. These tests do not claim real RSC request-cache or deployed-browser certification; jsdom executes actual page/resolver functions against synthetic authority. Final local typecheck/lint and mandatory exact-head CI results are recorded in the PR body.

## Known production blockers and next actions

Reuse bounded Batch 4 observations: 209 deployed directory calculator links and 209 sitemap calculator URLs were observed; none proves DB approval. All six documented detail probes returned actual 404. Loan/EMI, SIP and Compound Interest have certified structural public-content routes; Mortgage remains an unregistered internal reference owned by #60. BMI and Break Even remain draft-gated. No deployed 404 cause is established without authoritative DB/deployment evidence; these code fixes cannot be described as fixing production configuration or approvals.

Next authorized review should obtain read-only authoritative publication identity/version evidence, compare it against this report and deployed commit/configuration, and adjudicate unresolved master-ID mappings through existing owners. Specialist financial/YMYL review, accessibility/RSC runtime review and ordinary publication/security approvals remain required. No approvals are asserted or waived. No formula, SQL, RLS, entitlement, workflow, dependency or build configuration changes; no merge, deployment, production write or publication action.
