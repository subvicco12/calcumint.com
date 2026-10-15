import type { CalculatorInventoryRecord } from "./implementation-inventory";

export type DatabaseCatalogIdentity = Readonly<{
  calculator_key: string;
  slug: string;
  version: number;
  published_timestamp_present: boolean;
}>;

/** Read-only evidence comparison; never grants certification or publication. */
export function auditDatabaseCatalogIdentities(
  inventory: readonly CalculatorInventoryRecord[],
  databaseRows: readonly DatabaseCatalogIdentity[],
) {
  const bySlug = new Map<string, DatabaseCatalogIdentity[]>();
  for (const row of databaseRows) {
    bySlug.set(row.slug, [...(bySlug.get(row.slug) ?? []), row]);
  }
  return inventory.map(item => {
    const records = bySlug.get(item.slug) ?? [];
    const status = records.length === 0 ? "database-row-missing"
      : records.length !== 1 ? "duplicate-database-slug-hold"
      : records[0].calculator_key !== item.id ? "calculator-key-mismatch-hold"
      : records[0].version !== item.version ? "version-mismatch-hold"
      : !records[0].published_timestamp_present ? "publication-timestamp-missing"
      : "database-identity-match";
    return {
      calculatorKey: item.id, slug: item.slug, version: item.version,
      status, identityApproved: false, publicationAuthorized: false,
    };
  });
}
