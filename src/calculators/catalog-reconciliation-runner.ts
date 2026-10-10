import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { buildCatalogReconciliationReport, exportCatalogReconciliationCsv } from "./catalog-reconciliation-report";
import type { MasterCatalogRow } from "./catalog-reconciliation";

/** Offline-only entry point: caller supplies catalog bytes, reviewed mappings and aliases. */
export function reconcileMasterCatalogCsv(
  csv: string,
  options: Parameters<typeof buildCatalogReconciliationReport>[1] = {},
): Readonly<{ summary: string; csv: string; master: readonly MasterCatalogRow[] }> {
  const master = parseMasterCatalogCsv(csv);
  const report = buildCatalogReconciliationReport(master, options);
  const summary = JSON.stringify({
    totalMaster: report.totalMaster,
    totalRegistered: report.totalRegistered,
    exact: report.exact,
    alias: report.alias,
    ambiguous: report.ambiguous,
    unmatched: report.unmatched,
    unreferencedRegistrySlugs: report.unreferencedRegistrySlugs,
    publicationAuthority: false,
    certificationAuthority: false,
  }, null, 2);
  return { summary, csv: exportCatalogReconciliationCsv(report), master };
}
