import { listCalculatorImplementationInventory } from "./implementation-inventory";
import type { MasterCatalogRow } from "./catalog-reconciliation";

export const MASTER_CATALOG_DOMAINS = [
  "Loans & Credit", "Mortgage & Property Finance", "Investing & Wealth",
  "Retirement & Financial Independence", "Personal Finance & Household",
  "Tax & Payroll", "Business & Accounting", "SaaS & Startups",
  "E-commerce & Marketing", "Math", "Advanced Math & Graphing", "Geometry",
  "Statistics & Probability", "Physics", "Chemistry",
  "Engineering & Construction", "Technology & Computing", "Health & Fitness",
  "Biology & Life Science", "Conversion", "Date & Time", "Automotive & EV",
  "Energy & Environment", "Food & Cooking", "Travel & Everyday",
  "Sports", "Earth & Astronomy",
] as const;

export type CatalogDomainAudit = Readonly<{
  unknownMasterDomains: readonly string[];
  unmappedRegistryCategories: readonly string[];
  unusedMappings: readonly string[];
  coveredMasterDomains: readonly string[];
  complete: boolean;
}>;

/**
 * A registry category must either exactly equal a master domain or have a
 * deliberately reviewed explicit mapping. No fuzzy mapping is accepted.
 */
export function auditCatalogDomainMappings(
  master: readonly MasterCatalogRow[],
  categoryDomains: Readonly<Record<string, string>>,
): CatalogDomainAudit {
  const known = new Set<string>(MASTER_CATALOG_DOMAINS);
  const masterDomains = new Set(master.map((row) => row.domain));
  const categories = new Set(listCalculatorImplementationInventory().map((record) => record.category));
  const unknownMasterDomains = [...masterDomains].filter((domain) => !known.has(domain)).sort();
  const unmappedRegistryCategories = [...categories].filter((category) => {
    const domain = categoryDomains[category] ?? category;
    return !known.has(domain) || !masterDomains.has(domain);
  }).sort();
  const unusedMappings = Object.keys(categoryDomains).filter((category) => !categories.has(category)).sort();
  const coveredMasterDomains = [...masterDomains].filter((domain) =>
    [...categories].some((category) => (categoryDomains[category] ?? category) === domain)
  ).sort();
  return {
    unknownMasterDomains, unmappedRegistryCategories, unusedMappings, coveredMasterDomains,
    complete: unknownMasterDomains.length === 0 && unmappedRegistryCategories.length === 0 && unusedMappings.length === 0,
  };
}
