import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { auditCatalogDomainMappings, MASTER_CATALOG_DOMAINS } from "./catalog-domain-audit";
import { reconcileAuditedMasterCatalogCsv } from "./catalog-audited-reconciliation";

/**
 * Opt-in full-catalog evidence run:
 * CALCUMINT_MASTER_CSV=/path/to/CalcuMint_540_Master_Ingestion.csv
 * CALCUMINT_CATEGORY_MAPPINGS=/path/to/reviewed-mappings.json
 * CALCUMINT_RECONCILIATION_OUT=/path/to/output-directory
 * CALCUMINT_SLUG_DOMAINS=/path/to/reviewed-slug-overrides.json
 *
 * Mappings JSON is { "registry category": "master domain" }.
 * Never silently infer domain equivalence or publication authority.
 */
const catalogPath = process.env.CALCUMINT_MASTER_CSV;
const mappingsPath = process.env.CALCUMINT_CATEGORY_MAPPINGS;
const outputPath = process.env.CALCUMINT_RECONCILIATION_OUT;

describe("opt-in full master catalog reconciliation evidence", () => {
  it.skipIf(!catalogPath)("validates 540 unique IDs and all 27 canonical domains", () => {
    const rows = parseMasterCatalogCsv(readFileSync(resolve(catalogPath!), "utf8"));
    expect(rows).toHaveLength(540);
    expect(new Set(rows.map((row) => row.masterId)).size).toBe(540);
    expect([...new Set(rows.map((row) => row.domain))].sort()).toEqual([...MASTER_CATALOG_DOMAINS].sort());
  });

  it.skipIf(!catalogPath || !mappingsPath || !outputPath)("writes audited registry evidence only with reviewed mappings", () => {
    const csv = readFileSync(resolve(catalogPath!), "utf8");
    const mappings = JSON.parse(readFileSync(resolve(mappingsPath!), "utf8")) as Record<string, string>;
    if (!mappings || Array.isArray(mappings) || typeof mappings !== "object" ||
        Object.entries(mappings).some(([key, value]) => !key || typeof value !== "string")) {
      throw new Error("Expected category-to-domain mapping object");
    }
    const rows = parseMasterCatalogCsv(csv);
    expect(rows).toHaveLength(540);
    const audit = auditCatalogDomainMappings(rows, mappings);
    expect(audit).toMatchObject({ complete: true, unknownMasterDomains: [], unmappedRegistryCategories: [], unusedMappings: [] });
    const slugDomains = process.env.CALCUMINT_SLUG_DOMAINS
      ? JSON.parse(readFileSync(resolve(process.env.CALCUMINT_SLUG_DOMAINS), "utf8")) as Record<string, string>
      : {};
    const result = reconcileAuditedMasterCatalogCsv(csv, mappings, {}, slugDomains);
    const summary = JSON.parse(result.summary);
    expect(summary.exact + summary.alias + summary.ambiguous + summary.unmatched).toBe(540);
    mkdirSync(resolve(outputPath!), { recursive: true });
    writeFileSync(resolve(outputPath!, "reconciliation-summary.json"), result.summary + "\n");
    writeFileSync(resolve(outputPath!, "reconciliation-rows.csv"), result.csv);
  });
});
