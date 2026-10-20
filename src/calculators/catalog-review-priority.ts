import type { CalculatorInventoryRecord } from "./implementation-inventory";
import type { MasterCatalogRow } from "./catalog-reconciliation";
import { buildCatalogIdentityCandidateReport } from "./catalog-identity-candidate-report";

/** Prioritization is informational only; no identity, certification or publication approvals. */
export function buildCatalogReviewPriority(
  master: readonly MasterCatalogRow[],
  inventory: readonly CalculatorInventoryRecord[],
) {
  return buildCatalogIdentityCandidateReport(master, inventory).map(row => {
    const candidate = row.candidates.length === 1 ? row.candidates[0] : null;
    const eligibleForSourceReview = row.disposition === "source-review-required"
      && candidate?.riskClass === "standard" && candidate.reviewStatus === "certified";
    return {
      masterId: row.masterId, domain: row.domain, title: row.title,
      disposition: row.disposition,
      calculatorKey: candidate?.calculatorKey ?? null,
      slug: candidate?.slug ?? null,
      version: candidate?.version ?? null,
      reviewPriority: eligibleForSourceReview ? "P1-source-contract-review"
        : row.disposition.includes("hold") ? "HOLD-identity-collision"
        : "P2-other-review",
      sourceContractVerified: false,
      databaseIdentityVerified: false,
      identityApproved: false,
      publicationAuthorized: false,
    };
  }).sort((a,b) => a.reviewPriority.localeCompare(b.reviewPriority)
    || a.masterId - b.masterId);
}
