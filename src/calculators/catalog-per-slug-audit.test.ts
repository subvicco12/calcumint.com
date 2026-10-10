import { describe, expect, it } from "vitest";
import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { MASTER_CATALOG_DOMAINS } from "./catalog-domain-audit";
import { reconcileAuditedMasterCatalogCsv } from "./catalog-audited-reconciliation";

const mappings = Object.fromEntries(
  [...new Set(listCalculatorImplementationInventory().map((entry) => entry.category))]
    .map((category) => [category, MASTER_CATALOG_DOMAINS[0]])
);

describe("audited per-calculator domain overrides", () => {
  const fixture = "master_id,domain,title\n1,Loans & Credit,Placeholder Calculator\n";
  it("rejects overrides pointing to unknown registry slugs", () => {
    expect(() => reconcileAuditedMasterCatalogCsv(fixture, mappings, {}, { "not-a-registered-slug": "Physics" }))
      .toThrow("unknownOverrides");
  });
  it("rejects override domains not in the master taxonomy", () => {
    const slug = listCalculatorImplementationInventory()[0]?.slug;
    expect(slug).toBeDefined();
    expect(() => reconcileAuditedMasterCatalogCsv(fixture, mappings, {}, { [slug!]: "Unreviewed Domain" }))
      .toThrow("invalidOverrides");
  });
});
