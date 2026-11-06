# Calculator-first sprint engineering — 2026-11-06

Baseline: PR1527, `a94a963d9e6b4b189ed864905d34b366c7d90c01`; exact-head CI42192198106 **SUCCESS**. Branch: `engineering/sprint20-workflows-20261106`. No older checkout replaced the candidate. Source/reviewer decisions remain owned by the independent acceptance workstream; OWN-427 is preserved unchanged.

## Functional changes

| Requirement | IDs | Result |
| --- | --- | --- |
| Reset state at exact calculator identity changes | 370–374 | Fixed hidden blank inputs leaking from bandwidth into storage, and old time values becoming bandwidth after navigation. |
| Apply current plan to result presentation | 370–374 | Fixed Pro/Business result panels displaying Free locks. Numerical artifacts remain identical. |
| Retain input/output units in scenarios and exports | 370–374 | Existing declared units now reach actual caller metadata. Storage retains selected source unit and from/to labels, instead of a unitless captured value. |
| Analytical tables and unit explanations | 370–374 | Pro/Business receive accessible raw input/output reconciliation tables; invalid results produce no table. Existing deterministic formulas and limitations accompany results and new export methodology. No new variables or mathematics were invented. |
| Bind draft creation to registered risk and version | Shared factory; validated with real length/loan identities | Submitted financial-to-standard risk downgrade is refused before any write. New draft metadata records exact engine/slug/version. Version-one database creation refuses an unsupported future successor rather than relabelling it. |
| Atomic draft inventory preparation | Shared factory; current20 compatible v1 targets | Application now makes one invoker RPC call, with no partial direct-write fallback. The guarded database proposal creates drafts, pending QA, creation audits and completed job atomically; compatible retries repair only missing draft checks. |

The guarded proposal is **not installed or activated**. The application dependency is conditional, and absent RPCs fail closed. There are no active migration changes, RLS changes, service-role fallbacks, certification transitions or publication writes. The draft-creation RPC does not independently contain the application registry; direct privileged writers and production compatibility still require reconciliation.

Current20: 370,371,372,373,374,423,424,425,427,428,429,430,431,432,433,434,437,438,439,440. No new calculator cohort was developed. Original engine, parser, saved-history/replay, catalog and acceptance-ledger files remain unchanged. The six complex-engine improvements and frozen source bindings remain intact.

**New complete full-scope implementations established:0. New canonical approvals:0. New publication-eligible calculators:0. Production publications:0.** These changes close concrete software requirements, not complete product acceptance.

## Actual hosted entry blocker

Authenticated read-only observation at `2026-11-06T09:28:55.066951+00:00` confirms209 published governed records. This is database lifecycle evidence, not a fresh209-URL or canonical-certification audit. Neither `create_catalog_calculator_with_audit(text,text,text,text,text,jsonb)` nor the new preparation RPC exists on the target. Bulk-job RLS exposes INSERT/SELECT policies only; the old application attempted unsupported UPDATE completion and ignored failures. Query and returned metadata are retained in this directory.

The required predecessor source and target schema/privileges must be reconciled and separately authorized before adoption. The proposal pins the exact predecessor definition SHA-256, checks required tables/columns/RLS/version default/QA uniqueness, refuses an existing target RPC, and cannot execute past its transaction guard even if a SQL client continues after errors. Runtime retries are idempotent for drafts/QA/creation audits; each successful attempt can create its own completed job. Existing stale processing jobs are not silently rewritten.

## Isolated acceptance and review

Genuine pinned PostgreSQL17.6, GoTrue and PostgREST reproduce the old job-completion failure under authenticated RLS. New acceptance covers owner/admin restrictions; reviewer, nonadmin and anonymous denials; pending-only QA; existing negative QA preservation; exact binding/version/slug conflicts; later-item batch rollback; injected QA/audit/job failure; concurrent identical requests; and unchanged209 **synthetic** published sentinels. Those sentinels are not production records or fabricated competent approvals. SQL stays outside active migrations.

Independent review found no important defect and ran48 focused tests. Subsequent review confirmed the stronger installation refusal and retained rule-pack/specialist assertions. A stale assertion for duplicated rule-pack code was replaced by shared-constructor path checks plus a real single/bulk action test preserving an explicitly required rule pack. Three old wording assertions now check explicit ideal-transfer scope; raw output, sources, formulas and health cautions remain asserted.

The first browser campaign stopped on diagnosed `ERR_NETWORK_CHANGED` during concurrent Docker activity, before a calculator assertion failed. The failure is retained. One manual rerun after container cleanup passed the unchanged campaign; no retry loop or assertion weakening was added. Exact final receipts and limits are in `validation.json`.

## Publication mechanism and remaining critical path

Existing read-only release preflight remains in force: exact engine/version/contract/source/QA/reviewer binding, certified lifecycle, authenticated database acceptance and prepublication visibility must be established independently. Its unsigned capture can never grant eligibility or clear RELEASE HOLD. Public routes, discovery and sitemap continue to use the authoritative publication manifest. This increment fixes the draft entry stage; it does not claim end-to-end positive production release acceptance.

1. **ChatGPT Work:** supply per-ID competent source revision/applicability, precision, applicable canonical/workflow dispositions and qualified-risk/QA decisions. Reuse existing witnesses and this increment. Do not request OWN-427 again. No engineering-hour estimate can substitute for these reviews.
2. **Conditional engineering,2–4hours:** bind reviewed target schema effects, privileges and predecessor adoption to the guarded draft bundle, using existing compatibility tooling. The currently missing predecessor is a confirmed blocker; no installation is authorized.
3. **Conditional engineering,2–4hours:** bind genuine version-specific acceptance records into the release-wave preflight after independent decisions arrive; stage an authorized certified batch in an isolated target-compatible environment.
4. **Conditional engineering,2–4hours:** execute the isolated route/discovery/sitemap, rollback/recovery and post-release smoke rehearsal for that genuinely eligible batch, including prior guarded publication successors. Production activation/release authorization remains separate.

Estimated remaining software effort on this identified path: **6–12 engineering hours after prerequisites**, excluding source/qualified reviews, target access and activation decisions. No credible all540 four-day completion promise follows from the current zero-eligible queue. Independent functional work will continue when exact requirements are available; unsupported advanced features and duplicate wrappers are not substituted for acceptance.

RELEASE HOLD. No production SQL, migrations, permission changes, merge, deployment, payment activation, certification or publication.
