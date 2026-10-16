import type { MasterCatalogRow } from "./catalog-reconciliation";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

/** Offline candidate discovery. Never grants identity approval or publication. */
export function buildCatalogIdentityCandidateReport(
  master: readonly MasterCatalogRow[],
  inventory: readonly CalculatorInventoryRecord[],
) {
  const normalize = (value: string) => value.trim().toLowerCase();
  const byTitle = new Map<string, CalculatorInventoryRecord[]>();
  for (const item of inventory) {
    const key = normalize(item.title);
    byTitle.set(key, [...(byTitle.get(key) ?? []), item]);
  }
  const rows = master.map(row => ({
    masterId: row.masterId,
    domain: row.domain,
    title: row.title,
    candidates: (byTitle.get(normalize(row.title)) ?? []).map(item => ({
      slug: item.slug, calculatorKey: item.id, version: item.version,
      riskClass: item.riskClass, reviewStatus: item.reviewStatus,
    })),
  }));
  const slugCounts = new Map<string, number>();
  for (const row of rows) for (const item of row.candidates) {
    slugCounts.set(item.slug, (slugCounts.get(item.slug) ?? 0) + 1);
  }
  return rows.map(row => ({
    ...row,
    disposition: row.candidates.some(item => (slugCounts.get(item.slug) ?? 0) > 1)
      ? "shared-slug-hold" as const
      : row.candidates.length > 1 ? "multiple-candidates-hold" as const
      : row.candidates.length === 1 ? "source-review-required" as const
      : "no-exact-title-candidate" as const,
  }));
}
