# Captured account workflow compatibility

The isolated Node 24.19.0 campaign uses pinned PostgreSQL 17.6, GoTrue 2.197.0 and PostgREST 12.2.3. It verifies committed sanitized descriptors against their manifests before initialization. Optional `HOSTED_DESCRIPTOR` strictly checks the full private capture SHA256 and exact selected scoped rows. Four account tables use captured columns, constraints, policies and effective table/column rights. The invitation initializer supplies the captured auth bootstrap and helper dependencies. Provider auth is supplied by genuine local GoTrue; this is scoped compatibility evidence, not whole-hosted equivalence or reconstruction of historical grant ancestry.

Run from the repository with cached dependencies:

```sh
COMPATIBILITY_ARTIFACTS=/outside/source/account-receipts \
node tests/hosted-remediation-closure/compatibility/acceptance.mjs
```

The campaign reproduces the missing-country read and upsert failure on the captured baseline and anonymous TRUNCATE despite RLS. It verifies the unchanged guarded review SQL aborts. Only within the disposable database, it applies unchanged 009 and removes the unconditional execution guard from an in-memory copy of the existing 038 review artifact. No active migration or historical SQL is changed. A deliberately inherited billing UPDATE grant makes the candidate fail and roll back its earlier revokes. After removing that synthetic inheritance, repeated candidate application preserves service-role table grants, removes anonymous table/column rights and rejects actual anonymous TRUNCATE. PostgREST receives a schema reload after 009; a bounded observation waits for the new column before application traffic resumes.

Real GoTrue signup sessions exercise the application's complete preference upsert payload and conflict key, successive country changes, own-profile and billing reads, cross-account row isolation, denied cross-account upsert, hidden cross-account UPDATE, denied plan escalation and billing INSERT. A service-role HTTP client retains visibility of both synthetic accounts.

The private-source receipt lives outside Git at `/workspace/work/authentic-schema-reconciliation-private/compatibility-receipts/receipt.json`; the self-contained run without `HOSTED_DESCRIPTOR` writes `/workspace/work/authentic-schema-reconciliation-private/compatibility-ci-receipts/receipt.json`. CI requires only `COMPATIBILITY_ARTIFACTS`. It records source/capture hashes, pinned fixture provenance, actual HTTP methods/statuses and checks without session tokens. All containers and the internal network are removed on completion. No production query, build, active migration or deploy occurs.

**Disposition remains blocked.** Runtime compatibility does not approve country migration replay or privilege activation. Owner approval remains required for the retained `profiles.display_name` UPDATE allowance and `billing_customers` SELECT/RLS disposition. Existing captured owner policies are exercised, not replaced. No combined review artifact is necessary: the existing unconditional-guarded review artifact plus unchanged 009 suffices for disposable testing.
