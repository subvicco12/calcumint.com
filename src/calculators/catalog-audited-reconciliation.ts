import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { auditCatalogDomainMappings } from "./catalog-domain-audit";
import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { MASTER_CATALOG_DOMAINS } from "./catalog-domain-audit";
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
  slugDomains: Readonly<Record<string, string>> = {},
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
  const inventory = listCalculatorImplementationInventory();
  const known = new Set<string>(MASTER_CATALOG_DOMAINS);
  const registrySlugs = new Set(inventory.map((entry) => entry.slug));
  const unknownOverrides = Object.keys(slugDomains).filter((slug) => !registrySlugs.has(slug)).sort();
  const invalidOverrides = Object.entries(slugDomains).filter(([, domain]) => !known.has(domain)).map(([slug]) => slug).sort();
  // Shared registry categories mix unrelated master domains. A category-level
  // default alone cannot certify their semantic classification.
  const sharedCategories = new Set(["science", "everyday"]);
  const missingSharedOverrides = inventory.filter((entry) =>
    sharedCategories.has(entry.category) && !Object.prototype.hasOwnProperty.call(slugDomains, entry.slug)
  ).map((entry) => entry.slug).sort();
  const unresolved = inventory.filter((entry) => {
    const domain = slugDomains[entry.slug] ?? categoryDomains[entry.category] ?? entry.category;
    return !known.has(domain);
  }).map((entry) => entry.slug);
  if (unknownOverrides.length || invalidOverrides.length || unresolved.length || missingSharedOverrides.length) {
    throw new Error(`Catalog calculator mapping audit incomplete: ${JSON.stringify({ unknownOverrides, invalidOverrides, unresolved, missingSharedOverrides })}`);
  }
  const report = buildCatalogReconciliationReport(master, { categoryDomains, aliases, slugDomains });
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
