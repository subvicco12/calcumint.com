# Batch 8 — cumulative release-readiness review

Review date: 11 October 2026 IST. Current main is `caffafe639350ca0c2c2cf33ae1f099294f5af54`. This branch extends #1378's existing ancestry without recopying source changes and presents one cumulative diff against main. A new commit corrects proven required-input/engine-fallback defects; prior source drafts remain untouched.

## Concrete integration corrections

Cleared required fields in Loan/EMI, SIP, Compound Interest and Break Even still became zero although the six finance interfaces fixed in #1378 correctly rejected blanks. Worse, canonical Loan/EMI rejected a negative extra payment in loanAnalysis and then silently fell back to ordinary loanPayment, leaving a nonnull result/account output for invalid canonical input. SIP reverse mode similarly displayed/exported zero for a missing target or invalid term because its compatibility helper returns zero for invalid values.

The shared finite required-input parser now serves these four interfaces and remains backwards compatible with #1378's finance helper alias. Canonical Loan/EMI fails closed on its own engine errors; ordinary loan-payment retains its separate registered engine. SIP reverse mode validates a finite positive target and the existing certified SIP input schema before calling the unchanged helper. Invalid core/extra/reverse inputs remove derived results/analytics/schedules and disable actual save/export actions. Explicit zero remains valid where existing schemas allow it. Independent Goal Solver target errors expose an accessible error panel while preserving unrelated valid core results and baseline scenarios. There is no formula, rounding, default, entitlement or engine-contract change.

## Source review order and overlap reconciliation

| Draft | Exact source head | Representation in this review |
| --- | --- | --- |
| #1372 | a972c8f411c685486fe5a23143c9b74aa8f1418b | Legacy schedule alignment incorporated in #1376 with provenance |
| #1373 | 3785ee8c6d36463f4cf2d8182a36b73fa4c97566 | Precise accessible analysis incorporated in #1376 |
| #1374 | 0176100548e4d8a1bfd67e4afb6099bc497f9809 | Governed schedules/export incorporated in #1376 |
| #1375 | 8f27b04c547dba14414c89f7f48bd69f889531f1 | Investment projections incorporated in #1376 |
| #1376 | 540d52531a1cbcfc090911d0589585b135f2787b | Main-based consolidation/discovery integration; ancestor |
| #1377 | d38ff4f19460b16ee8052369ce1ca907db4c9374 | Publication identity/shared route readiness; ancestor |
| #1378 | 3ac5dc9a1cf9148e430c99cd188f3f4bc27a2050 | Six finance trust/input readiness; ancestor |

All seven remain open drafts at these heads. The cumulative review proposes replacing separate integration merges; it does not close, merge, approve or change any source PR. Review the represented #1376, then #1377, then #1378 changes and this final correction. Do not independently merge duplicate source changes after accepting a cumulative integration. #861 completion proposal and Mortgage #60 registry/editorial ownership remain separate and unmodified.

## Validation and limits

Five test-first failures reproduced fabricated blank-rate Loan results across three plans, invalid canonical extra-payment fallback and missing SIP reverse target zero. The final focused integration aggregate passes61tests across8files, including all16 candidate UI/registered-engine bindings across plans, six finance golden input/metric/trust regressions, full Reference Six workflows, actual CSV/JSON and save/export invalidation, canonical metadata/detail/discovery/sitemap gates, malformed publication identities and version/certification withdrawal. The ordinary LoanPayment alias remains covered by the registered-output comparison.

Inherited exact-head CI for #1376–#1378 already passed and is reused; final cumulative exact-head CI is recorded in this PR's body. One final local typecheck and affected lint are also recorded there. No local full build or full-suite repeat. Prior scoped real-Chromium responsive/keyboard/accessibility-tree evidence is reused; no claim is made of deployed-route or real screen-reader certification for this review.

## Candidate and approval separation

The inherited anonymous authority snapshot has209 exact published key/slug/version route matches, zero mismatches and exact parity with209 live directory/sitemap paths. Repository counts remain540master IDs,573engines,225code-certified/37reviewed/311draft and225structural route candidates. Sixteen certified structural candidates are absent from published authority. See `UNPUBLISHED-CANDIDATE-READINESS-MATRIX.csv` for every exact ID/version/risk, registered advanced inputs, responsible authority and required evidence. This correction additionally strengthens Loan/EMI, SIP and Compound required-input readiness; the matrix's six migrated finance candidates retain their verified trust behavior.

Specialist approvals, internal HOLD/lifecycle reasons, absent-versus-withheld inventory and unresolved master-ID approvals remain UNKNOWN: the minimal anonymous manifest exposes no reviewer evidence and the four protected SELECT-only probes were denied. The209published count does not assert209specialist sign-offs. Only authorized reviewers can evaluate protected evidence; only owner/admin can perform publication after existing gates pass. No publication transition is executed or approved here.

Loan/EMI, SIP and Compound remain publication-excluded. BMI and Break Even remain draft-gated. Mortgage remains unregistered and owned by #60; its specialist/registry/amortization blockers are not bypassed. Prior three individually verified live200/UI routes and six excluded404 probes remain scoped observations. No deployed revision or production drift cause is asserted.

Remaining release decisions: cumulative code review; finance/YMYL methodology/trust/input review; actual assistive-technology/RSC review; protected approval/lifecycle and master-ID adjudication through existing authorized owners; normal publication/deployment review. The safe next substantial batch is owner-led resolution of the16 protected review blockers and identity decisions, with engineering corrections only for demonstrated issues. No database writes, approvals/certification changes, promotion, merge, deployment, RLS/security weakening, dependency/workflow changes or build configuration changes.
