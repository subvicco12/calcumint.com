import { buildMixedReviewCoverageReport } from "./catalog-mixed-coverage-report";
import type { CatalogSlugReview } from "./catalog-slug-review-ledger";

type MasterRow = { id: number; domain: string; title: string };

export function buildMixedHoldAdjudicationReport(reviews: readonly CatalogSlugReview[], master: readonly MasterRow[]) {
  const report = buildMixedReviewCoverageReport(reviews, master);
  const bySlug = new Map(reviews.map(review => [review.slug, review]));
  const entries = report.rows.filter(row => row.decision === "hold").map(row => {
    const evidence = bySlug.get(row.slug);
    if (!evidence) throw new Error("Missing review evidence: " + row.slug);
    return {
      slug: row.slug,
      title: row.title,
      category: row.category,
      proposedDomain: row.proposedDomain,
      sourcePath: evidence.sourcePath,
      inputContract: evidence.inputContract,
      outputContract: evidence.outputContract,
      existingEvidence: evidence.evidence,
      reviewStatus: evidence.reviewStatus,
      exactTitleCandidates: row.exactTitleCandidates,
      sameDomainCandidates: row.sameDomainCandidates,
      blocker: row.titleCollision ? "title-collision" : row.exactTitleCandidates.length === 1 ? "unique-title-needs-adjudication" : "no-exact-title",
      disposition: "HOLD" as const,
      requiresAdjudication: true as const,
    };
  });
  return { total: entries.length, entries };
}
