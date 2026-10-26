# CalcuMint release governance

## Standard release

Use a certified main commit as the base, create a pull request, validate its exact head with required CI and the Engineering & Safety Audit where applicable, resolve blocking findings, and obtain an independent review when an eligible reviewer is available. Merge through GitHub's normal PR merge operation. Run required CI on the resulting exact main commit. Main is certified only after those checks pass.

## Sole-owner release exception

The project owner authorized this exception on 29 September 2026 because no independent reviewer is currently available. It replaces only the project-level independent PR review requirement; it does not waive or override any GitHub branch protection or repository rules.

A release PR may proceed without an independent reviewer only when all of the following are recorded and verified immediately before merge:

1. The project owner explicitly authorizes sole-owner release. Record that authorization and its scope in the PR or release record.
2. Record the exact PR head SHA inspected and tested.
3. Required CI on that exact head is green, including the Engineering & Safety Audit where applicable.
4. The PR is mergeable under GitHub's active protections; do not bypass or weaken those protections.
5. Inspect the complete diff and resolve all blocking review findings. A comment or automated review is not an independent approval.
6. Confirm that security, RLS, publication authority, fail-closed behavior, calculator certification and specialist-review requirements are preserved.
7. Merge through the normal PR operation with an expected-head SHA. Record the resulting main SHA.
8. Verify required CI on the exact resulting main SHA before calling main certified or advancing dependent release work. Stop and repair any failure.

This exception cannot stand in for substantive specialist review for Health/YMYL, financial-risk, regulatory, or other calculators that require it. New calculators remain DRAFT until properly certified. Free, Pro and Business retain identical mathematical accuracy, and deterministic engines remain authoritative. Production build stays `next build --webpack`. Production owner identity requires an explicit authorized human selection; never infer or invent one.

If an independent reviewer becomes available, return to the standard release process. If GitHub requires a review, obtain the required review and do not use this document as a bypass.
## Prospective risk-based review amendment (26 October2026)

The owner has directed a risk-based, authoritative-source review framework in place of blanket external specialist requirements where appropriate. The proposed controlled amendment is [Master Blueprint governance amendment](MASTER-BLUEPRINT-GOVERNANCE-AMENDMENT-2026-10-26.md). It defines when competent engineering-led source review is sufficient and when official rule evidence or qualified applicability/safety review remains mandatory. This is a prospective policy change, not an external-review waiver under the sole-owner release exception, and not a claim of historical specialist approval.

The proposal and its70-case reassessment are pending independent engineering/security review and exact-head validation. Existing application/database QA, reviewer assignment, lifecycle and publication gates remain unchanged and effective; offline review readiness cannot satisfy them automatically. No release, certification or publication is authorized. RELEASE HOLD remains active.
