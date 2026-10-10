import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildMixedCategoryReviewQueue } from "./catalog-mixed-review-queue";
import type { CatalogSlugReview } from "./catalog-slug-review-ledger";

type MasterRow = { id: number; domain: string; title: string };
function parseMasterCsv(source: string): MasterRow[] {
  const lines = source.trim().split(/\r?\n/);
  if (lines.shift() !== "master_id,domain,title") throw new Error("Unexpected master catalog header");
  return lines.map((line) => {
    const match = /^"(\d+)","([^"]+)","([^"]+)"$/.exec(line);
    if (!match) throw new Error("Invalid master catalog row");
    return { id: Number(match[1]), domain: match[2], title: match[3] };
  });
}

/** Exact-title candidates are suggestions only, never automatic approvals. */
export function buildMixedReviewCoverageReport(
  reviews: readonly CatalogSlugReview[],
  master: readonly MasterRow[],
) {
  const queue = buildMixedCategoryReviewQueue(reviews);
  const rows = queue.entries.map((entry) => {
    const candidates = master.filter((row) => row.title.toLowerCase() === entry.title.toLowerCase());
    return {
      ...entry,
      exactTitleCandidates: candidates,
      sameDomainCandidates: candidates.filter((row) => row.domain === entry.proposedDomain),
      titleCollision: candidates.length > 1,
      reviewPriority: entry.decision === "approved" ? "completed" : candidates.length > 1 ? "collision" : candidates.length === 1 ? "exact-title-review" : "source-contract-review",
      requiresAdjudication: entry.decision !== "approved",
    };
  });
  return { total: queue.total, approved: queue.approved, held: queue.held, missing: queue.missing, rows };
}

if (process.env.CALCUMINT_PRINT_MIXED_REVIEW_COVERAGE === "1") {
  const root = process.cwd();
  const master = parseMasterCsv(readFileSync(resolve(root, "data/catalog/master-catalog-2026.csv"), "utf8"));
  const reviews = JSON.parse(readFileSync(resolve(root, "data/catalog/mixed-category-review-ledger.partial.json"), "utf8")) as CatalogSlugReview[];
  process.stdout.write(JSON.stringify(buildMixedReviewCoverageReport(reviews, master), null, 2) + "\n");
}
