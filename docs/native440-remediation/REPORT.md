# PR1532 targeted #440 remediation

Reviewed baseline: `a681043567729358d852badbd8b7c2e377c205cb`, draft1532. Exact remote head reverified before implementation. Baseline CI42268307389 failed full-product while source-acceptance, publication-factory, build and checks passed. Work report: Drive `1ES4OdTYLTIcV9uwa8cHH_taJkWllnFWG`.

## Findings and engineering changes

**F440-CI-01:** reproduced historical binding failure. The retained historical Business API source hash and blob remain pinned. Only the exact native-delivery successor at commit `a9f17d4f010355eb490318c3a868d445bf38f72f`, blob `749b321053ee8df70f5fadfb807fe982e6288930`, SHA256 `b55c1948dfceddc58bfa671421f97b5c3d384a212e8f3e7e7559aba95347887d` is admitted. Rewritten claims, changed bytes and historical rollback are rejected. Historical JSON and the two original caller successors are unchanged.

**F440-EMBED-02:** an authenticated issuer explicitly chooses their active same-organization `calculations:run` API key. No secret key value reaches the iframe. Short-lived signed grants now carry random grant identity and metering-key identity and must match a persisted hashed-token registry row. Expiry/current membership/current Business plans/key status/organization/scope/publication continue to fail closed. Issuer revocation is durable and tenant-checked.

A new unactivated SQL addendum serializes per-key valid embed attempts and shared quota debit; it uses the key's existing configured per-minute/monthly values, not invented limits. A separate attempt window bounds validated retries without a second monthly debit. Accepted calculation audit binds grant, organization, issuer, API key, catalog440, conversion.frequency, technicalv1, request UUID, request/result hashes and timestamp. No raw token, inputs or results enter the audit. Concurrent duplicate IDs debit once; a changed payload conflicts. Failed audit persistence rolls back debit. Native API and embed compete for the same existing quota lock. RLS and service-only privileges deny direct untrusted access. Missing tables/functions or metering errors deny delivery.

The addendum is outside migrations and has an unconditional hold, role/isolation/timeout checks, predecessor wrapper hash and unexpected-object refusal. `embed-disable.sql` is a source-bound held feature disable, not destructive reversal: it revokes the metering RPC while retaining all durable grants/attempts/audit. It never restores the old unmetered path. Existing account/publication/quota apply/reverse packages are byte-unchanged. This new addendum needs separate schema/provider/activation review; it is not an approved hosted migration.

**F440-QA-03:** production fixture runs `next build --webpack` and `next start` with explicit local-only environment. Native gate, publication eligibility composer, shared hosted-manifest reader and production CSP are unchanged. Only the disposable lower registry reader supplies a synthetic certification fact; an actual fixture manifest RPC supplies deliberately mismatched then exact hosted identity/version. Incorrect/absent authority is denied. No complete publication gate replacement remains. Genuine allowed third-party parent framing succeeds, an unlisted third-party origin is blocked. Expiry, committed revocation, cross-account denial, replay/conflict, current membership/plan/key removal and exact artifact parity passed.

## Evidence and scope limits

Production browser:11 groups passed in159s. Native iframe Chromium accessibility tree includes named heading/value/unit controls/button/live result;320px overflow check passed. One local calculate-to-visible-result observation was221ms. This is not a production/mobile percentile, SLA, full WCAG audit, screen-reader user test or PDF/UA proof. Focused SQL covers shared-key last-slot concurrency, duplicate request concurrency, audit rollback, tenant/expiry/revocation/plan negatives and RLS. Test fixtures are synthetic isolated candidate metadata, not production-equivalence acceptance.

The 634 numerical witnesses, six precision refusals and genuine authenticated history/Business project/scenario/export/replay receipts are reused from baseline, not rerun or relabeled as new independent acceptance. Original engines, catalog IDs, historical outputs and formula/source records remain unchanged. Free/Pro/Business mathematical equality follows the retained same immutable engine; Business delivery entitlement is distinct from mathematics.

Rate-control boundary is explicit: it bounds validated calculation redemption and retry. Invalid schema/signature/UUID requests, iframe page loads and grant issuance do not consume this attempt window. The application still enforces strict size/schema/origin/authentication checks, but no blanket endpoint/edge throttle or global abuse guarantee is inferred. Persistent grant-management dashboard/analytics, broad team/client/automation applicability, full assistive-technology/contrast/touch/reduced-motion and editorial/public-route SEO acceptance remain requirement-specific adjudication gaps rather than invented N/A decisions.

## Acceptance disposition

| Disposition | Result |
|---|---|
| Targeted source-binding correction | Implemented and independently reviewed |
| Bounded native embed metering/audit software | Implemented; held database dependency |
| Actual authority composition / production iframe evidence | Passed in explicit synthetic-authority local fixture |
| All applicable engineering requirements complete | **Not established**; exact remaining applicability and operational gaps retained |
| Canonical-complete | **No** |
| Competent source/formula/QA review | **Pending**; AI engineering review is not certification |
| Newly publication-eligible / published | **0 / 0** |

Source facts/reviewer recommendation remain with ChatGPT Work. No Work-owned source, formula, applicability or approval record changed. No invented reviewer signatures or owner exemptions.

## Adoption and remaining prerequisites

Original adoption packages retain exact source hashes and holds. This additive embed proposal additionally requires authenticated absence/privilege/dependency/default-ACL/retention reconciliation, a fresh exact quota predecessor match, reviewed durable audit storage/retention, named writer/DDL-freeze and recovery operators, secure secret provisioning, separate adoption/deployment authority and competent lifecycle decisions. The existing operator-freeze procedure remains applicable; no production quiescence, external-key-holder enumeration, backup restoration or deployed revision was established by this local run.

Engineering records are review-ready. Production adoption/execution, full canonical acceptance and publication remain blocked. RELEASE HOLD active. No production SQL, migrations, certification promotions, merge, deployment or publication.

## Final local validation

8,011 tests passed,4 existing skips,0 unhandled errors;30 focused tests;43 source/CI guards;8 isolated metering groups;11 production browser/HTTP groups;45 launch and15 certification checks. Lint/typecheck/webpack passed. The initial full-suite run exposed an existing test URL-stub/timer lifetime leak; test-only cleanup was corrected, assertions retained, and the full suite reran clean. All five hosted CI jobs remain required; shallow CI explicitly fetches the newly pinned immutable successor commit. Exact successor SHA and bounded hosted result are recorded in the delivery checkpoint.
