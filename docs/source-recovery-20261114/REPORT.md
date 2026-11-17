# Source-admission repair and exact20 qualification checkpoint

RELEASE HOLD ACTIVE. Existing draft PR1538; historical PR1537 preserved. This report is committed before exact-head hosted execution, so it does not claim a later CI conclusion. The final external checkpoint records the immutable delivery SHA and actual observed job states.

## Actual CI failure and corrections

Authenticated run43577553256 at d102135f3922d8c094bd89584475db0ef5b945a1 passed checks, build, publication-factory and full-product. Source-acceptance failed one outer unit case with three functional errors; aggregate correctly failed.

- **Historical authority availability:** the newly generated independently pinned authority commit101bdd56f6c5d195c85c340ac9ab4ff0cb643fa3 was omitted from its own shallow-checkout preparation. It was a valid historical object, not a fabricated or substituted reference. A bounded helper now prepares only an independently literal-pinned ref/blob/SHA256 at the fixed authority path. It uses the existing actual common-directory lock and at most one exact HTTPS fetch. Preparation does not admit source. Original current-source and authority assertions still run.
- **Supplied transport lock:** suppliedAvailability previously invoked custom callbacks outside coordination. It now enters the existing lock resolved through native Git before calling the supplied transport. No supplied proof or presence result is cached.
- **Wrapped parallel reader lock:** a custom-reader early return bypassed the actual common-directory lock. That bypass is removed. Lock ownership/release, foreign Git shallow locks and fail-closed callback errors are preserved.
- **Lint correction:** a new fixture identifier named module violates the existing Next ESLint rule. The minimal identifier-only successor is separately source-admitted; no rule is disabled.

The original lock and availability test assertions are unchanged. Added cases exercise all finite-stage callbacks, repeated uncached reads, callback errors/reacquisition, real shallow recovery, wrong path/blob/SHA, substituted commit bytes and foreign-lock preservation. Existing source admission retains reversion, tamper and symlink refusals. Historical capture arrays and authority predecessors are retained as immutable records, not rewritten. No mathematical engine, active migration, publication SQL or application source changed.

## Validation and local bounded failures

At source head e43be96f160510e487fc749922c41c22236ba487, the targeted original/new group passed19/19 in4.749s. The original first authority assertion passed. At final source head0a584b06d610a5daff7a76f26915d290c5371603, targeted19/19 passed again in3.933s; current authority plus actual-current nested54-case guard both passed in45.379s combined, preserving the original45000ms inner child bound and all count/no-fail/no-skip assertions. An actual shallow clone of the real source head, without alternates/hardlinks, reproduced fatal-not-a-tree and recovered the exact real authority through authenticated GitHub in3.281s; exact blob and SHA256 matched and the owned lock was released. Synthetic test repositories remain explicitly synthetic and never populate real history.

The unfiltered Node22/CI full unit run did **not** pass. It hit its unchanged1200-second outer safety cap after571 file reports. Observed original deadlines failed for the150-second retained group,65-second shortest-publication case,30-second authenticated setup,15-second retained availability,5-second API assertion and two45-second retained-source cases. The exact remaining498 files were then run for coverage:496 passed,2 skipped;3088 tests passed and4 skipped,481.11s. All1069 expected files were attempted, but prior failures remain failures; this is not a green aggregate or a replacement for unchanged mandatory hosted CI.

The prior hosted baseline passed the API assertion in4286ms, authenticated evidence file in18495ms and retained source group in89387ms. Local cold Node22 measurements still exceeded API/authentication budgets. Node-version mismatch was removed; no OOM, CPU throttle or competing-worker cause was demonstrated. Do not label these timings fixed or invent a hardware explanation. A readonly orchestration review also identified sequential60-second verifier calls inside one65-second outer case without shared cancellation; actual overlap causing all failures remains unproven.

Launch45/45 and certification15/15 passed. Typecheck passed. Initial lint found the new reserved identifier; the corrected full lint run passed with0errors and80existing warnings, retaining the original failed attempt. Production next build --webpack passed in49.525s at e43be96f, with identical start/end source heads. Detailed logs and exact-SHA receipts are retained in the external evidence archive; validation.json preserves successful and failed attempts.

## Exact20 outcomes: no promotion

The exact ledger/nominations/review-packet bindings and current immutable engine identities reconcile. Retained genuine isolated account/Business delivery and original export bytes remain valid against unchanged application b1dccffe1cc9e0515030d5e7ea4bad8a72756080. Per-ID evidence is in candidate-dispositions.json and delivery-revalidation.json. No new specialist/QA approval or hosted production result is inferred.

| ID | Calculator | Exact current engine | Outcome |
|---|---|---|---|
| 213 | Fraction Calculator | `launch-fraction-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 221 | Cube Root Calculator | `launch-cube-root-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 223 | Exponent Calculator | `launch-exponent-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 224 | Logarithm Calculator | `launch-logarithm-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 225 | Reciprocal Calculator | `launch-reciprocal-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 226 | Remainder Calculator | `launch-remainder-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 227 | LCM Calculator | `launch-lcm-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 228 | GCF Calculator | `launch-gcf-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 229 | Factor Calculator | `launch-factor-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 230 | Rounding Calculator | `launch-rounding-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 231 | Scientific Notation Calculator | `launch-scientific-notation-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 272 | Cone Volume Calculator | `launch-cone-volume-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 274 | Surface Area Calculator | `geometry.surface-area@1` | Conditional; hosted qualification and local timing gates outstanding |
| 275 | Volume Calculator | `geometry.volume@1` | Conditional; hosted qualification and local timing gates outstanding |
| 278 | Pythagorean Theorem Calculator | `launch-pythagorean-theorem-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 279 | Degrees to Radians Calculator | `launch-degrees-to-radians-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 280 | Radians to Degrees Calculator | `launch-radians-to-degrees-calculator@1` | Conditional; hosted qualification and local timing gates outstanding |
| 328 | Molarity Calculator | `chemistry.molarity@1` | Conditional; hosted qualification and local timing gates outstanding |
| 331 | Moles Calculator | `chemistry.moles@1` | Conditional; hosted qualification and local timing gates outstanding |
| 332 | Dilution Calculator | `chemistry.dilution@1` | Conditional; hosted qualification and local timing gates outstanding |

These are bounded current technical profiles, not complete canonical Blueprint products. For example213 is a quotient profile,229 finds the smallest factor,231 is scientific-notation output,274/275 are rectangular-prism profiles. Full scope/source/applicability and competent acceptance must remain explicit.

Confirmed scoped overlay remains61; qualified increment0;20 conditional. Potential81 is not confirmed. Canonical disposition remains0 complete/certified,2 review pending,495 partial/unproven,43 blocked:540 total. Newly canonical-approved, certified and publication-eligible counts are all0.

## Next gates and forecast

First resolve the remaining local orchestration/timing evidence and obtain all five mandatory exact-head jobs plus aggregate. Do not expand the cohort or silently waive failed assertions. If hosted CI is pending or failed, retain61 and these20 conditional. No engineering-completion throughput is claimed from evidence-only reconciliation. A defensible full540 completion date cannot be derived from this recovery batch; separate remaining implementation, competent-review capacity and operator gates before forecasting.

#440 reviewer appointment and competent source/formula/precision/QA decisions remain human gates; #432 remains fallback. Six publication RPCs remain held. Genuine participating-writer/DDL freeze, production recovery, credential custody and deployment attestations, plus separately scoped adoption/certification/publication authorization, remain external. No production changes, certification or publication occurred.
