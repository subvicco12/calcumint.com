import { describe, expect, it } from "vitest";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { MASTER_CATALOG_DOMAINS } from "./catalog-domain-audit";

const output = process.env.CALCUMINT_INVENTORY_OUT;
const csvCell = (value: string | number) => '"' + String(value).replace(/"/g, '""') + '"';

describe("offline authoritative registry inventory export", () => {
  it.skipIf(!output)("exports every live registry entry for manual domain review", () => {
    const catalog = parseMasterCatalogCsv(readFileSync(resolve("data/catalog/master-catalog-2026.csv"), "utf8"));
    expect(catalog).toHaveLength(540);
    const inventory = listCalculatorImplementationInventory();
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const entry of inventory) {
      expect(ids.has(entry.id), "duplicate calculator ID: " + entry.id).toBe(false);
      expect(slugs.has(entry.slug), "duplicate calculator slug: " + entry.slug).toBe(false);
      ids.add(entry.id); slugs.add(entry.slug);
    }
    const domains = new Set<string>(MASTER_CATALOG_DOMAINS);
    const rows = inventory.map((entry) => {
      const suggestedDomain = entry.category === "science" || entry.category === "everyday"
        ? "" : domains.has(entry.category) ? entry.category : "";
      return [entry.id, entry.slug, entry.title, entry.category, entry.reviewStatus, entry.riskClass, suggestedDomain, "UNREVIEWED"];
    });
    const header = ["id", "slug", "title", "registry_category", "review_status", "risk_class", "master_domain", "mapping_review"];
    mkdirSync(resolve(output!), { recursive: true });
    writeFileSync(resolve(output!, "registry-inventory-for-domain-review.csv"),
      [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n");
    writeFileSync(resolve(output!, "registry-inventory-summary.json"),
      JSON.stringify({
        totalRegistered: inventory.length,
        totalMaster: catalog.length,
        categories: [...new Set(inventory.map((entry) => entry.category))].sort(),
        sharedCategoriesRequiringPerSlugReview: ["science", "everyday"],
        mappingAuthority: false,
        publicationAuthority: false,
        certificationAuthority: false,
      }, null, 2) + "\n");
  });
});
