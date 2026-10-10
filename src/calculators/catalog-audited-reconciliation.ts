import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { auditCatalogDomainMappings } from "./catalog-domain-audit";
import { buildCatalogReconciliationReport, exportCatalogReconciliationCsv } from "./catalog-reconciliation-report";

export type AuditedCatalogReconciliation = Readonly<{
  summary: string;
  csv: string;
}>;

/**
 * Fail-closed offline reporting: every registry category must be explicitly
 * reconciled with a master domain before producing any gap counts.
 * This grants no publication or certification authority.
 */
export function reconcileAuditedMasterCatalogCsv(
  source: string,
  categoryDomains: Readonly<Record<string, string>>,
  aliases: Readonly<Record<string, string>> = {},
): AuditedCatalogReconciliation {
  const master = parseMasterCatalogCsv(source);
  const audit = auditCatalogDomainMappings(master, categoryDomains);
  if (!audit.complete) {
    throw new Error(
      `Catalog domain mapping audit incomplete: ${JSON.stringify({
        unknownMasterDomains: audit.unknownMasterDomains,
        unmappedRegistryCategories: audit.unmappedRegistryCategories,
        unusedMappings: audit.unusedMappings,
      })}`,
    );
  }
  const report = buildCatalogReconciliationReport(master, { categoryDomains, aliases });
  return {
    summary: JSON.stringify({
      totalMaster: report.totalMaster,
      totalRegistered: report.totalRegistered,
      exact: report.exact,
      alias: report.alias,
      ambiguous: report.ambiguous,
      unmatched: report.unmatched,
      coveredMasterDomains: audit.coveredMasterDomains,
      unreferencedRegistrySlugs: report.unreferencedRegistrySlugs,
      publicationAuthority: false,
      certificationAuthority: false,
    }, null, 2),
    csv: exportCatalogReconciliationCsv(report),
  };
}
