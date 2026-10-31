# Independent Batch12 functional review

No outstanding Critical or Important defect found in the corrected reviewed changes. This is scoped functional engineering evidence; canonical acceptance, specialist applicability, certification, publication and deployment are not granted.

## Demonstrated findings and resolutions

Three independently executed RED regressions demonstrated stale save-success messages on Free/Pro/Business: save immutable A, display B under the same owner/slug/version, then resolve A's pending RPC. The original A bytes were correctly stored once, but the completion described the current calculation. Calculation-context signatures now label those statuses as belonging to a previous calculation. All three original regressions were rerun GREEN; idempotency, captured bytes and owner isolation remain intact.

An independently executed RED regression demonstrated discriminator form changes silently deleting unknown raw JSON keys. The corrected transition preserves keys outside the union's declared branch properties while deliberately replacing known branch fields. The original regression is GREEN. Invalid advanced input is no longer silently normalized by this transition.

Read review also confirmed the original percentage/conversion blank-number coercion and missing conversion comparison context. Root regressions and fixes now distinguish blank from zero and bind scenario unit metadata to explicit conversion inputs. Conversion recovery reconstructs missing unit context on a separate working copy and rejects conflicting units.

## Recovery and stored-record boundaries

Five independent attacks exercise mortgage core/rate/context agreement, changed context and nested presentation rejection, unknown version/projection/reverse/SIPv2/Slopev1 refusal, immutable separate scenario recovery and getter/authority-field rejection. Historical unsupported records remain readable/exportable; verification is explicit, does not upgrade versions and uses the original engine's schema defaults while retaining original raw input. Unknown extra forward fields reject. Source authorship, clinical/provider applicability and lifecycle approval are not inferred from arithmetic agreement.

Saved-record tools remain inside the server's owned-record query and account-session boundary. Their JSON/CSV/PDF exports use original recorded values without current-engine fallback. Scenario copies and previews do not write account history. Scenario-file recovery validates the complete set before replacement, has explicit file-read cancellation and size limits, and rejects authority metadata additions through a strict display schema. The new recorded-JSON equality helper validates data before canonical comparison and explicitly follows standard JSON signed-zero semantics.

## Forms, projections and private scenarios

Form controls derive from schemas and preserve Advanced JSON as the complete input representation. Blank numeric fields remain invalid; engine refinements remain authoritative. Calculus forms narrow operation to the selected immutable adapter without changing engine schemas. Stored loan rows, calendar dates and calculus segments are presented directly from original engine artifacts; no schedule/payment amounts or mathematical proof are synthesized by the renderer. Exact engine strings and approximate binary64 charts remain distinguished. Private scenario sets verify every original packet, selected identity, source, ordering and governance before atomic in-memory recovery. Local review history does not establish authenticated account adoption.

## Verification and limitations

Independently executed 135 tests across nine directly related files: all pass, including nine owned independent tests (three save-context, five registered recovery, one form-preservation). Owned-file ESLint passes. No production implementation was edited by this reviewer and no Next build was run.

The final CI workflow adds an independent 20-minute full-product job with pinned database/browser fixtures and both functional campaigns. Required validate now demands checks, build and full-product success. All 346 workflow/aggregate guard tests passed independently; existing jobs and their checks remain mandatory. Hosted exact-head CI is still separate evidence.

The parent's full-unit, native Next/browser, schema/RLS and download campaigns were not independently repeated here. Synthetic identity/PostgREST fixtures do not establish GoTrue signup, refresh rotation, recovery, email/MFA, live-provider compatibility or production-schema equivalence. Physical devices, comprehensive assistive-technology acceptance, protected lifecycle decisions and complete 540-product requirements remain outside this review. RELEASE HOLD remains active.

## Final fixture transport and intermittent-navigation supplement

Independently inspected the fixture-only CORS change: it adds only `accept-profile` and `content-profile` to the existing synthetic proxy's allowed request headers. The installed Supabase SDK emits these headers for profile reads and RPC writes. Both native Chromium tests pass against the corrected fixture. A separate temporary pre-fix fixture, with those two additions removed and all assertions retained, independently reproduces both RED failures as browser `TypeError: Failed to fetch`; the same requests without the schema header succeed. This establishes a fixture transport defect and its correction, not real GoTrue, PostgreSQL authorization or production CORS acceptance. No RLS/SQL, authentication checks, production headers or provider gates are weakened by this patch.

The separate instrumented validation-scale campaign completed114/114 journeys with unchanged assertions/timeouts. Original frozen harness/application files were not changed; diagnostic copies captured module request/response, loading failures, frame transitions and Fetch continuation failures. The prior campaign's blank entry after56 completed journeys remains unresolved: its HTML response was200 and readyState complete, but React had not mounted, with no captured runtime exception. The original trace lacks the module-response/console evidence needed to identify a cause. The rerun passed the same mobile57th-navigation point, so no calculator-specific defect, out-of-memory diagnosis, application fix or timeout extension is justified. This intermittent observation remains a disclosed limitation, separate from the corrected CORS fixture issue.

The final quota-read fixture extension was independently reviewed and all three native SDK/browser CORS tests passed. Installed-SDK HEAD count requests require `Prefer: count=exact`; the local proxy now permits that request header and HEAD method, and exposes only `content-range` so the SDK can read the returned quota count. This remains a test-fixture transport correction: no application, SQL/RLS, token verification or production headers change. The parent's captured preflight/count-null RED evidence is separate from this independent final GREEN run.
