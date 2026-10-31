# Full declared catalog capture tooling

Task: `DB-FULL-CAPTURE-TOOLING` from the frozen Batch16 remaining-work queue. This additive tool replaces no Batch16 descriptor, script or receipt. It reads metadata only; it never connects automatically, discovers credentials, reads application rows, applies a migration, or authorizes adoption.

## Exact input contract

`tests/batch17-capture/descriptor.mjs` declares format `calcumint-full-catalog-v1`, PostgreSQL major **17**, the exact **41 public tables**, the **27 auth tables observed in the pinned GoTrue v2.197.0 / 75-migration local fixture**, and every exact filename in the existing migration-contract candidate sequence. Both files at each duplicate prefix032–035 remain separate identities. A different schema/auth version requires a reviewed contract update, rather than silently shrinking the scope.

Every required section has exactly `{status, count, rows}`; every row has the exact documented-in-code field set and a unique identity. `COMPLETE` requires count/row agreement. Table/column/function effective grant matrices must cover each exported object and each declared client role. Public/auth table membership must match the declared contract. Duplicate, missing or malformed sections, fields or identities are rejected. Array row order and JSON key order do not cause drift. Catalog counts and shape validation are **not provenance authentication**; an invented or edited descriptor is never proof of what ran in an external database.

Captured sections cover schema owners/ACLs and effective USAGE/CREATE; table owners/ACLs, RLS/forced RLS; ordered column identity/type/default/nullability/generated/identity settings and column ACLs; constraint definitions/validation; index definitions/valid/ready/live/unique/primary state; all internal and user trigger definitions/enablement; permissive/restrictive policies and roles; function definitions/owner/definer/config (including search_path)/ACL and effective EXECUTE; table and column effective privileges; sequence definitions/ownership dependencies/ACL and effective privileges without reading sequence current values; enum/domain definitions/ACL; default privileges; password-free role attributes and the complete direct membership graph with PG17 grantor/admin/inherit/SET options; auth migration versions; historical migration and effect ledgers.

This is the declared repository model metadata contract, not universal PostgreSQL DDL equivalence. Views/materialized/foreign/partitioned relations, range/multirange/standalone composite types, custom rewrite rules and aggregate/window routines are explicitly inventoried as unsupported; their presence blocks validation. Extension binaries/platform services, global event triggers, publication/subscription/replication configuration, external writers, application data and hosted identity/provider behavior are outside this contract. No production-equivalence claim follows from matching metadata.

## Read-only export

Generate the SQL offline:

```sh
node tests/batch17-capture/cli.mjs sql > /tmp/full-catalog-export.sql
```

An operator with an **already authorized connection** can run `psql -X -qAt -v ON_ERROR_STOP=1 -f /tmp/full-catalog-export.sql > /tmp/full-catalog.json`. Select the connection using the operator's established secure workflow; this tool supplies or searches for no database URL. The export executes one repeatable-read, read-only transaction, fixes search_path to pg_catalog, and emits one JSON document. Errors are fatal. It queries only catalogs and `auth.schema_migrations.version` bookkeeping. Review function/config metadata before sharing externally.

Repository migration filenames are declared scope, **not an execution ledger**. Raw catalog export deliberately emits `UNKNOWN` migration/effect sections. Reading reviewed SQL files, successful local initializer execution, matching schema shape, and auth migration versions cannot establish the external historical/effect ledger.

## Offline reconciliation and strict comparison

```sh
node tests/batch17-capture/cli.mjs reconcile /tmp/model.json /tmp/full-catalog.json
node tests/batch17-capture/cli.mjs compare /tmp/model.json /tmp/full-catalog.json
```

`reconcile` permits explicit `UNKNOWN`/`MISSING` historical/effect ledgers (with zero count and empty rows), reports known catalog differences and blocking sections, and returns exit2 while anything is blocked. It can report `catalogMatches:true` while **equal:false**. `compare` rejects any incomplete section (exit1); genuine complete matches return exit0 and complete differences exit2. Malformed JSON, incompatible contracts and unsupported object classes return exit1. Every result retains `captureProvenanceVerified:false`, `adoptionAuthorized:false` and production equivalence UNKNOWN.

To attach independently observed, reviewed ledgers without overwriting an existing output:

```sh
node tests/batch17-capture/cli.mjs attach-ledgers /tmp/full-catalog.json /tmp/observed-ledgers.json /tmp/with-ledgers.json
```

The supplied object has exactly `migrationLedger` and `effectLedger` sections. Each complete section contains one row for **every exact declared migration filename**, with fields `{id, source, evidence, disposition}`. `source` identifies the observing authority/capture, `evidence` points to the actual observation, and `disposition` records what that evidence establishes, including explicit nonapplication/substitution/deferment where supported. These are attestations requiring independent review, not automatically trusted claims. Do not fill gaps from repository sources. Missing authority remains UNKNOWN. Attachment refuses to replace an existing ledger or output; attachment validates the complete descriptor before writing, and strict comparison validates it again.

## Verification

Run only the scoped new tooling and preserved Batch16 CLI tests:

```sh
node --test tests/batch17-capture/capture.test.mjs tests/batch16-auth/schema-comparison.test.mjs
```

The genuine local PostgreSQL integration uses the existing digest-pinned GoTrue/PostgREST/PostgreSQL fixture and full reviewed repository initializer. It requires the coordinator's Docker lease, cached images and locked dependencies; it creates unique internal fixture resources and cleans them up:

```sh
CAPTURE_ARTIFACTS=/tmp/batch17-capture-pg node tests/batch17-capture/postgres.mjs
```

It captures the real model before/after an isolated index creation, proves restoration after dropping it, detects column-only SELECT ACL/effective privilege drift, a PG17 membership SET option change, schema/sequence USAGE drift, and unsupported-view presence. Full historical/effect ledgers remain UNKNOWN throughout. No authentic hosted capture, adoption, deployment, new service/build or full unit-suite run is claimed. See `capture-verification.json` for actual UTC timing and results.
