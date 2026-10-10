import { reconcileMasterCatalog } from "./catalog-reconciliation";
import type { CatalogMatch, MasterCatalogRow } from "./catalog-reconciliation";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

export type ReconciliationReport = Readonly<{
  totalMaster: number;
  totalRegistered: number;
  exact: number;
  alias: number;
  ambiguous: number;
  unmatched: number;
  rows: readonly CatalogMatch[];
  /** Registered slugs not referenced by any exact/alias/ambiguous catalog match. */
  unreferencedRegistrySlugs: readonly string[];
}>;

/** Planning evidence only: this is not a publication or certification decision. */
export function buildCatalogReconciliationReport(
  master: readonly MasterCatalogRow[],
  options: Parameters<typeof reconcileMasterCatalog>[2] = {},
): ReconciliationReport {
  const inventory = listCalculatorImplementationInventory();
  const rows = reconcileMasterCatalog(master, inventory, options);
  const counts = { exact: 0, alias: 0, ambiguous: 0, unmatched: 0 };
  const referenced = new Set<string>();
  for (const row of rows) {
    counts[row.status]++;
    if (row.status === "exact" || row.status === "alias") referenced.add(row.slug);
    if (row.status === "ambiguous") row.candidates.forEach((slug) => referenced.add(slug));
  }
  return {
    totalMaster: master.length,
    totalRegistered: inventory.length,
    ...counts,
    rows,
    unreferencedRegistrySlugs: inventory.map((record) => record.slug).filter((slug) => !referenced.has(slug)).sort(),
  };
}

export function exportCatalogReconciliationCsv(report: ReconciliationReport): string {
  const cell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const lines = [["master_id", "domain", "title", "status", "registry_slug", "candidates", "evidence"]];
  for (const row of report.rows) {
    lines.push([
      String(row.masterId), row.domain, row.title, row.status,
      row.status === "exact" || row.status === "alias" ? row.slug : "",
      row.status === "ambiguous" ? row.candidates.join(";") : "",
      row.status === "exact" || row.status === "alias" ? row.evidence : "",
    ]);
  }
  return lines.map((line) => line.map(cell).join(",")).join("\r\n") + "\r\n";
}
