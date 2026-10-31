# Independent review — canonical evidence and private calculus

Reviewed against baseline `5b60fcd2bdc3116aab7700f3daea67ca303e4bb6`. This review does not establish canonical acceptance, certification, publication or release authorization.

## Findings

The historical numerical-calculus implementation has demonstrated functional defects, retained unchanged: its limit of `exp(-x^2/1e-20)` at zero is reported as certified zero although continuity proves one; its integral of `exp(-((x-0.1234567)/0.0000001)^2)` over [0,1] is zero with zero estimated error although the area is approximately `sqrt(pi)*1e-7`. The equal-bound helper also returns before expression/finite-bound validation; the catalog wrapper subsequently parses expressions. Three independent diagnostics record these historical observations, not acceptance.

The separate private version2 successor addresses these examples by checking continuous expression domains directly and restricting integration to degree32 polynomials. It makes no rigorous binary64 error-bound claim. An independent RED regression demonstrated destructive intermediate underflow: derivative `1e-200*1e-200*1e200*x` returned zero although the exact derivative is representable `1e-200`. Guarded arithmetic now rejects that unsupported computation. Independent matrices also verify literal, multiplication, division, power and exponential underflow rejection, with genuine zeros retained. Three additional independent tests verify complete-addend-erasure rejection across all operations, and preservation of exact cancellation. These tests were added after the new guard; no pre-fix RED execution is claimed for that guard.

The Important UI restoration mismatch is corrected: importing a calculus snapshot now restores both its input textarea and recomputed result. Previously importing the derivative of x³ at2 could show12 beneath the unchanged default Gaussian limit input, whose answer is1. The browser assertion checks restored input equality; to exercise the former defect it should import after deliberately changing the textarea. No outstanding Critical or Important defect was found in the corrected new implementation.

## Evidence and limits

Five focused test files passed50 tests, including34 independent successor tests and three frozen-v1 diagnostics. Both owned test files passed ESLint. Missing calculate-context arguments in the independent diagnostics were corrected. Historical calculus and catalog-batch9 source bytes are unchanged relative to the baseline.

The offline generator `--check` reproduced all four checked-in artifacts:540 identities, zero canonical acceptances, eleven postBatch09 bounded profiles, three private successors,574 registered authored-fixture audits and16 identities with declared-fixture mismatches. The latter are diagnostics, not independently adjudicated defects. The424 preserved requirement records are explicitly distinct from the unavailable full Blueprint. The eleven bounded source profiles retain full-product blocks; current publication/certification and complete numerical/browser/UX acceptance are not inferred. The inherited implementation source-tree hash identifies the existing reconciliation graph, not the entire new review application.

Evidence-packet imports re-export the selected compiled identity and compare the entire envelope, rejecting forged approval, requirements, source and governance changes. Calculus imports recompute the selected operation and compare the full envelope. UI claims consistently distinguish private engineering, historical fixture evidence and unresolved canonical scope.

The runtime auth fixture is synthetic: local HS256 identities, a user endpoint and real PostgREST forwarding; no checked-in GoTrue service/configuration was found. Signup, password recovery, refresh rotation, revocation, PKCE, MFA, email and live-provider equivalence remain unverified. No new provider acceptance follows from these tests.

The parent's reported60 browser journeys and isolated database/security checks were not independently rerun here. Full-unit/build/current-head CI outcomes remain separate verification evidence. RELEASE HOLD remains active.
