import { MASTER_CATALOG_DOMAINS } from "./catalog-domain-audit";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

export type CatalogSlugReview = Readonly<{
  slug: string;
  domain: string;
  sourcePath: string;
  inputContract: string;
  outputContract: string;
  evidence: string;
  decision: "approved" | "hold";
}>;

/**
 * A reviewed mapping requires per-slug provenance, not a category-derived guess.
 * HOLD entries are deliberately excluded from the approved mapping.
 * This is offline planning evidence and grants no publication authority.
 */
export function requireCompleteCatalogSlugReviewLedger(
  reviews: readonly CatalogSlugReview[],
): Readonly<Record<string, string>> {
  const audit = auditCatalogSlugReviewLedger(reviews);
  if (audit.missing.length || audit.held.length) {
    throw new Error(`Catalog source review incomplete: ${JSON.stringify({ missing: audit.missing, held: audit.held })}`);
  }
  return audit.approvedDomains;
}

export function auditCatalogSlugReviewLedger(
  reviews: readonly CatalogSlugReview[],
): Readonly<{ approvedDomains: Readonly<Record<string, string>>; missing: readonly string[]; held: readonly string[] }> {
  const inventory = listCalculatorImplementationInventory();
  const mixed = new Set(["science", "everyday"]);
  const required = new Set(inventory.filter((entry) => mixed.has(entry.category)).map((entry) => entry.slug));
  const known = new Set<string>(MASTER_CATALOG_DOMAINS);
  const seen = new Set<string>();
  const approvedDomains: Record<string, string> = {};
  const held: string[] = [];
  for (const review of reviews) {
    if (!required.has(review.slug)) throw new Error(`Unexpected mixed-category review slug: ${review.slug}`);
    if (seen.has(review.slug)) throw new Error(`Duplicate review slug: ${review.slug}`);
    seen.add(review.slug);
    if (!known.has(review.domain)) throw new Error(`Unknown master domain for ${review.slug}`);
    if (![review.sourcePath, review.inputContract, review.outputContract, review.evidence].every(
      (value) => typeof value === "string" && value.trim().length > 0
    )) throw new Error(`Missing source evidence for ${review.slug}`);
    if (review.decision === "hold") held.push(review.slug);
    else if (review.decision === "approved") approvedDomains[review.slug] = review.domain;
    else throw new Error(`Invalid review decision for ${review.slug}`);
  }
  const missing = [...required].filter((slug) => !seen.has(slug)).sort();
  return { approvedDomains, missing, held: held.sort() };
}
