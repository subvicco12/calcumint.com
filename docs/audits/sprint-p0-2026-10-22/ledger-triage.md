# Acceptance-ledger triage — RELEASE HOLD

Baseline: `71261465c877eab27e48c70605dd5435d87eda77` (PR #1467 sprint). This is a read-only secondary evidence triage, not an acceptance refresh. No ledger status, authority classification, source-review decision, calculator, test or workflow changed.

## Reproducible inventory

Python standard-library CSV parsing of `docs/audits/final-acceptance-p0-2026-10-21/acceptance-ledger.csv` establishes:

| Check | Result |
| --- | --- |
| Data records / unique requirement IDs | 424 / 424 |
| Blueprint / release-check identities | 410 BP / 14 RC |
| VERIFIED / PARTIAL / BLOCKED / UNKNOWN | 55 / 331 / 20 / 18 |
| Duplicate requirement IDs | 0 |
| Repeated requirement wording beyond distinct wording | 20 additional occurrences; preserve distinct appendix identities |
| Empty ID, requirement, status, evidence or remaining-gate fields | 0 |
| Empty sourceParagraphs | 14, exactly the RC rows |

CSV SHA-256: `8b2ac855dcee0a6cb70451f9faf248e03162a695c962ec1349dd264c303e0779`.

Scratch summary: `/workspace/.pr1467/sprint/ledger/summary.json`. Counts are records, not a portfolio-completion percentage. Unique requirement IDs do not validate catalog identity mappings or grant lifecycle authority.

`final-acceptance-p0-2026-10-21/closure.json`, `FINAL-ACCEPTANCE-P0-2026-10-21.md` and the account-schema preflight README retain earlier 55/330/20/19 counts. Current CSV and scenario/runtime evidence report 55/331/20/18. Treat the closure as historical scoped provenance, not a current aggregate; do not silently rewrite it or interpret the difference as new approval. RC-head/RC-CI text also refers to the original acceptance head, not newly observed sprint-head CI.

## Critical path and secondary evidence mapping

| Rows | Existing evidence and remaining gap | Useful lane output; boundary |
| --- | --- | --- |
| RC-live-auth-billing (BLOCKED), BP-0533-0534 (PARTIAL), BP-0547-0547 (BLOCKED) | Actual Next runtime exists, but identity is a synthetic JWT provider. Genuine signup/recovery, rotation, MFA/revocation and payment-provider acceptance are unverified. | P0 auth can provide isolated real-provider evidence tied to exact code/configuration and explicit residual limits. Auth evidence alone cannot close billing or authorize activation. |
| RC-production-RLS, RC-upgrade, RC-atomic-RPCs, RC-rollback (PARTIAL); RC-fresh-install (BLOCKED) | Authentic public metadata and disposable PostgreSQL/PostgREST evidence exist; reviewed proposals remain unapplied. Raw migration 011 fails PG42601; fixture repair is explicitly substituted. Production privileged writers, fingerprints, grants, adoption and rollback remain unresolved. | Production/readiness lane can inventory exact production-mode CSP/runtime behavior and deferred operational prerequisites. It cannot establish deployed SQL equivalence, approve repairs or execute migration. |
| BP-0331-0334, BP-0850-0853, BP-0515-0515, BP-0670-0670 (PARTIAL); RC-devices (UNKNOWN) | Tagged PDF 1.7 and deterministic full report evidence exist. Independent PDF/UA, Unicode font/ToUnicode and assistive-reader acceptance remain gaps. | PDF/accessibility lane can inspect actual artifacts and independent structural/reading-order evidence, recording validator availability and failures. Tag presence is not PDF/UA certification or physical TalkBack evidence. |
| BP-0455-0456, BP-0521-0521, BP-0522-0522, BP-0523-0523, BP-0672-0672 (UNKNOWN) | Five rows share performance/accessibility gates; emulated viewport evidence does not establish performance budgets, reduced motion, contrast or physical devices. | Production-mode measurements can supplement bounded evidence if reproducible; avoid broad benchmark work that delays P0 auth. Physical-device gates stay open. |
| RC-review-authority (UNKNOWN); 14 authority-gated BP rows (BLOCKED) | 836 waiver authorities, 210 source reviews, 540 mappings, 12 HOLD dispositions and 38 specialist reviews remain unauthenticated. | Lane outputs may link evidence to existing IDs and versions only. No source-review promotion, approval, certification or publication follows from green checks. |
| BP-0583-0587, BP-0588-0592, RC-SIP-version-policy (BLOCKED) | Mortgage period/rounding policy, BMI clinical methodology and SIP numerical/version policy require the named owner/specialist decisions. | Record precise decision requests and existing fixture limits; no new engines, invented schedules, v1 replacement or historical snapshot reinterpretation. |

The remaining UNKNOWN distribution is 11 AI-provider rows, five performance/accessibility rows, RC-review-authority and RC-devices. The 20 BLOCKED records comprise 14 shared authority-gated rows plus billing activation, Mortgage, BMI, fresh install, live auth/billing and SIP policy. These distributions describe evidence/decision gates, not 38 proven implementation defects.

## Recommendations and limitations

1. Prioritize P0 isolated real-auth evidence; attach exact environment/provider scope and negative-path results to the relevant existing rows without changing status in this lane.
2. Reuse `runtime-pdf-2026-10-22/README.md`, `scenario-business-2026-10-21/README.md` and authentic-schema evidence. The later runtime report supersedes the earlier scenario report's untagged-PDF description and narrows its old runtime-fidelity gaps; neither establishes live/deployed acceptance.
3. Preserve the distinction between documented defects and missing proof. Existing evidence documents raw-011 syntax failure, prior credential URL disclosure, prior inaccessible native-error fallback and hydration input loss. The latter runtime corrections are documented fixes; this triage neither reran nor rediscovered them. Missing provider/device/authority evidence is not proof of a product defect.
4. Keep historical closure counts explicitly scoped when preparing future summaries; use the baseline CSV for current record totals. Do not deduplicate appendix wording.

The exact governing **CalcuMint Final Product — Forty-Eight-Hour Completion Plan** was not located in the baseline tracked repository by filename or full-text searches for its distinctive title/48-hour variants; no path can be authenticated. Related local documents include `docs/audits/MASTER-PRODUCT-COMPLETION-2026-10-20.md` and `docs/audits/FINAL-ACCEPTANCE-P0-2026-10-21.md`, but neither is asserted to be that governing plan. A bounded workspace filename search also found no matching document; inaccessible temporary directories and external attachments were not searched exhaustively.

Verification here is CSV parsing, local document inspection and diff/hash checks only: no broad audit, suite rerun, remote acceptance or current-head CI assertion. RELEASE HOLD remains: no production writes, migrations, merges, deployment, live payments, certification, publication, new calculators, Neon migration or refactor.

## Governing sprint clarification

The owner subsequently confirmed that the governing plan is a ChatGPT-project source and supplied the H0–H48 milestones directly. Those supplied requirements govern; no further repository search is needed. Preserve all fourteen unpublished DRAFT calculators, mathematical contracts and historical versions. H0–12 prioritizes auth closure, H12–24 runtime/security and exact-head CI, H24–36 independent QA/ledger reconciliation and code freeze, and H36–48 final 6/6 CI/evidence freeze/development-candidate handoff. Escalate unexplained auth at H12 and produce a reproducible blocker at H18. RELEASE HOLD remains.
