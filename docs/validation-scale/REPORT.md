# Expanded canonical contract validation

Baseline: verified draft PR #1500, `448533b858e80d4eb90b2146e9dd8c5ba7d91fdb`, hosted CI #41198902096 SUCCESS. The isolated branch descends directly from that exact commit; cumulative frozen ancestry is verified in `baseline-and-preservation.json`.

## Engineering coverage

Added **51** actual-engine adapters and **102** independently specified numerical/boundary witnesses, with 51 domain negatives and output-schema, actual identity/version, full-plan parity, scenario/replay and tamper checks. They produce **714 new checks / 1,106 cumulative checks across 79 private contracts**.

New related catalog IDs:

25, 37, 45, 47, 57, 58, 59, 60, 61, 62, 63, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 83, 93, 94, 100, 101, 102, 106, 107, 108, 110, 111, 113, 114, 115, 116, 117, 118, 119, 465, 466, 473, 477, 480, 494, 528, 537.

This cohort covers caller-defined calendar payoff, savings/investment and cashflow arithmetic, budgeting/percentage operations, supplied transport/energy costs and explicit physical formulas. Existing immutable engines and source applicability restrictions remain unchanged. Original Batch09 independently authored numerical witnesses are reused; identity/zero/loss boundaries are separately authored. Goldens are not collected from engine outputs.

Raw binary64 helper witnesses have explicitly recorded scalar absolute tolerances (at most1e-7, ordinarily1e-9). Zero/null, sign, primitive types, identity, schemas, source, replay and other expected fields remain exact. No stored output is rounded or normalized by the validator. This is witnessed numerical acceptance, not exhaustive all-domain accuracy or a newly certified rounding policy.

## Genuine defects and compatibility fixes

The v1 glob-based source verifier would incorporate unrelated new source files and invalidate its shipped capture. Disposable tests execute the original committed verifier: it passes the original tree and fails after one unrelated addition. The revised v1 verifier authenticates the frozen 433-file membership preimage against the unchanged original SHA, checks every original file's bytes, and permits independent additions. Membership tampering and any original-source modification still fail. Original v1 binding, packets, readers, evidence and arithmetic remain byte-identical.

The expanded source capture and packets use validation revision2. Its own439-file membership is also frozen and authenticated, so future independent additions do not invalidate either shipped capture. Reader dispatch reuses the unchanged v1 reader for original packets; it never silently upgrades them. The expanded private review UI exposes 79 adapters, supports complete scenarios, and can read original v1 history without changing its storage. Explicit Save copies a selected original packet to the separate expanded history. Corrupt/unsupported history blocks writes without deleting original data. Central plan limits govern new writes; downgrade keeps existing history readable.

Independent review demonstrated a new tolerance defect: actual zero could match a nonzero expected value within tolerance. The corrected comparator preserves zero in both directions and rejects sign crossing; the original RED and sign regressions are now GREEN. The original strict v1 comparator is unchanged.

## Evidence and governance

`evidence-540.json` preserves every catalog identity and all prior unextended per-ID records. New dispositions explicitly distinguish recorded private witness satisfaction from partial source/account requirements and blocked canonical scope. #528 remains caller-supplied gross-MET arithmetic only: no clinical validity, activity lookup, physiology or safety approval. All43 authority blockers and qualified-review requirements remain intact.

Counts remain **305 registered / 192 private / 43 authority-blocked**, with **497 full-contract reviews and zero canonical acceptances**. The 424-record ledger, original14DRAFTs, historical SIP/Slope and all original mathematical versions are preserved. No registry/publication promotion occurs.

## Browser observation

The documented earlier reload timeout did not reproduce during114 family/plan/viewport journeys and3 dedicated workflow journeys. Every new navigation asserts absence of Page.navigate errorText before unchanged DOM readiness/result assertions. Browser contexts are isolated per viewport, while history reloads remain in each context. No shared transport or application fix is claimed and no root cause is established. The earlier observation remains retained; see `reload-investigation.json`.

## Validation and remaining path

Full unit regression passed6,259 tests with4 existing skips. Five additional governance/actual-browser receipt guards were added afterward and pass in the final115-test focused suite on actual Node22.23.4 and Node24.19.0. Browser114+3, source compatibility/mutation3, security/transport/runtime/CI guards, launch/certification guards, lint, typecheck and next build --webpack pass. Exact commands and hashes are in `validation.json`; independent review is in `INDEPENDENT-REVIEW.md`.

The next scalable engineering step is another deterministic adapter group using explicit witnesses and versioned source captures, preserving shipped reader revisions. Full canonical mapping/input/output/operator scope, exhaustive numerical acceptance, all authority and qualified-applicability decisions, real GoTrue/account adoption, production schema equivalence and device/screen-reader/performance acceptance remain unestablished. Private JSON review is not a complete canonical calculator UX. Historical fixture mismatches remain recorded.

No merge, deployment, production database change, payment activation, certification or publication. RELEASE HOLD remains active.
