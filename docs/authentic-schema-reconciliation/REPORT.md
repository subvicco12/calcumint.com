# Authentic hosted schema reconciliation

Baseline: PR #1507, `cab705d4f13e17a5ec0bb3450df704c9c226e817`; hosted CI **41241865527 completed SUCCESS**. Work starts from that exact commit on an isolated successor branch. Its parent is `57ab7c2119f782886b0cb12a3f2ca4fe4cb6629b`; no frozen branch was changed.

## Exact four-relation result

Authenticated metadata from Supabase project `zpwpstsvztyshcnwdfye` establishes 37 public + 27 auth relations, against the disposable model's 41 + 27. The exact four model-only objects are:

- `public.batch_request_receipts`
- `public.billing_account_fences`
- `public.billing_atomic_completions`
- `public.embed_lead_receipts`

All four originate guarded, unapplied proposals outside deployment migrations. **Their absence is MODEL_ONLY_OBJECT, not evidence of a missed approved deployment.** No additional hosted public or auth relation was found. Source paths, introduction commits and guard evidence are in [relation-writer-analysis.md](relation-writer-analysis.md).

## Evidence and limits

The supplied Markdown SHA-256 is `2a9cacded7066ed454fb4a759122bb63d1e85cff24b4ea50f07b79dfea86c631`. It contains aggregate observations, insufficient to identify the four names. We independently located the exact project through the connected authenticated Supabase account and reused the unchanged Batch17 `export.sql` in a repeatable-read READ ONLY transaction. Supplemental reads obtained extension dependencies, migration identities/fingerprints and a pure regex witness. No application rows, secrets, migration activation or production writes were requested.

Raw authenticated response text and complete descriptor remain outside Git in a private directory. [validation.json](validation.json) binds file bytes by SHA-256; the raw tool text and parsed serialization are distinct artifacts. Metadata bodies are untrusted data, never executed. Captures from separate reads are not represented as one cross-service atomic snapshot. The descriptor covers declared public/auth objects; extension inspection is supplemental, not full provider-schema acceptance.

The original strict 68-relation validator rejects the hosted descriptor. It was not weakened. New difference intake reports incomplete or unequal evidence without authorizing adoption or asserting equivalence. Both external migration/effect ledgers remain UNKNOWN.

## Compared metadata

| Section | Model | Hosted | Interpretation |
| --- | ---: | ---: | --- |
| Relations | 68 | 64 | Four guarded model-only proposals |
| Columns | 630 | 604 | Common columns differ only at auth.schema_migrations.version: varchar(14) versus varchar(255) |
| Constraints | 321 | 296 | All common named definitions equal; absent proposal constraints are not deployment orders |
| Indexes | 234 | 230 | Eight model-only, four hosted-only; common definitions equal |
| Triggers including internal | 435 | 390 | After removing only generated RI names, 45 model-only and zero hosted-only semantic rows |
| Policies | 86 | 86 | Two exact definition differences |
| Functions within exporter scope | 92 | 37 | 36 signatures belong to hosted pgcrypto in extensions; 19 remaining model-only functions need source/deployment reconciliation |
| Auth migration identities | 75 | 82 | Seven hosted-only provider identities; matching names alone do not prove effects/runtime equivalence |

Raw trigger IDs are OID-derived and can collide while referring to different constraints; hundreds of apparent name differences are not hundreds of missing triggers. The independent normalizer preserves event, target, enabled state, literals and multiplicity. Four hosted-only indexes are on auth.users (email, creation, name, last sign-in); provider/custom intention remains UNKNOWN. Model-only indexes include proposal receipts, history pagination and auth migration version indexing. No index was created.

All 37 public tables have RLS enabled. That does not establish equivalent authorization. Captured effective grants differ on 113 common table grants, 188 column grants, 16 function grants and 63 sequence grants. Full safe object identities and hashes appear in [catalog-differences.json](catalog-differences.json); classifications are in [discrepancy-classification.json](discrepancy-classification.json). Provider roles/default privileges differ; no blanket provider-equivalence exemption was applied. Hosted authenticated TRUNCATE privileges are broader on some tables; TRUNCATE is not constrained by row policies. Direct SQL capability and API exposure must be reviewed separately; no destructive test was attempted.

## Application differences and independent witnesses

- `members_admin_update` lacks the model's OLD-owner fencing. The hosted invitation RPC exactly matches the original source, executes as postgres and does not serialize organization seats or token redemption. Its upsert can demote an existing owner's membership under a valid matching invitation. These are source-supported conditional paths, not observed production incidents. See the writer analysis for all participating routes and prerequisite decisions.
- `catalog_editor_update` has no explicit WITH CHECK, whereas the model adds one. PostgreSQL can reuse USING as its check when omitted; this is an exact metadata difference, not by itself proof of a bypass. Missing atomic reviewer/catalog RPCs correspond to unmapped repository migration identities and need migration-effect reconciliation.
- Hosted `consume_business_api_quota` lacks the model proposal's key lock and paid-owner-plan check. The model is a guarded proposal, not an automatically approved production repair.
- Hosted `validate_calculator_publish_gate` contains double-backslash date regex literals where the model uses explicit ASCII digits. A pure read-only hosted witness with standard_conforming_strings=on returned **false** for valid `2026-11-01` against that captured pattern and **true** against the explicit ASCII pattern. This confirms a predicate defect; no catalog row or publication transition was exercised. Preserve fail-closed behavior and independently test valid and invalid metadata in isolation before a separately authorized correction.
- `enforce_calcumint_save_quotas` body differs only by inspected whitespace; this does not justify generic whitespace stripping of SQL literals.

## Migration identity reconciliation

37 hosted migration records versus 42 repository files produce 36 exact name matches, six repository names unmatched, and one hosted-only name (`production_function_privilege_hardening`). Unmatched files: `009_country_preferences.sql`, the four atomic reviewer/assignment/lifecycle/catalog migrations numbered 032–035, and `038_client_account_billing_privileges.sql`. Duplicate numeric prefixes remain distinct filenames. [migration-identities.json](migration-identities.json) records exact hosted versions and statement-count/MD5 metadata fingerprints. These are identity fingerprints, not SHA-256 byte equality or proof of statement effects. Reviewed substitutions and guarded proposals in the model make replaying the raw repository chain unsafe. No migration was applied or history marker fabricated.

## Validation and disposition

16 offline tests passed: 12 existing full-capture/fail-closed guards plus four new difference-intake regressions. They cover exact named differences, duplicate rejection, unavailable ledgers, trigger OID normalization, event preservation and multiplicity. An initial restricted child-process invocation failed; rerunning with normal subprocess support passed all 16. An unsupported Node test flag was removed before that successful run. No application code changed; full application/browser/build suites were not repeated for this metadata-only task. Independent review and final receipts are recorded in validation.json.

No authentic production concurrency, data-integrity audit, complete migration-effect equivalence or external writer inventory is claimed. [blockers.md](blockers.md) defines conditional remediation and independent acceptance. All historical engines, 540 identities, 424 acceptance records, 14 original DRAFTs and 43 authority blockers remain untouched. **RELEASE HOLD remains active. No production changes, activation, certification or publication.**
