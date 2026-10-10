import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { auditCatalogSlugReviewLedger, type CatalogSlugReview } from "./catalog-slug-review-ledger";

/** Deterministic, registry-backed review queue; no inferred approval or domain. */
export function buildMixedCategoryReviewQueue(reviews: readonly CatalogSlugReview[]) {
  const audit = auditCatalogSlugReviewLedger(reviews);
  const bySlug = new Map(reviews.map((review) => [review.slug, review]));
  const entries = listCalculatorImplementationInventory()
    .filter((item) => item.category === "science" || item.category === "everyday")
    .map((item) => {
      const review = bySlug.get(item.slug);
      return {
        slug: item.slug,
        title: item.title,
        category: item.category,
        registryReviewStatus: item.reviewStatus,
        decision: review?.decision ?? "missing",
        proposedDomain: review?.domain ?? null,
        sourcePath: review?.sourcePath ?? null,
      };
    });
  return {
    total: entries.length,
    approved: entries.filter((entry) => entry.decision === "approved").length,
    held: audit.held.length,
    missing: audit.missing.length,
    entries,
  };
}
