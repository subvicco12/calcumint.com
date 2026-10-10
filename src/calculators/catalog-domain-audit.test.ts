import { describe, expect, it } from "vitest";
import { auditCatalogDomainMappings, MASTER_CATALOG_DOMAINS } from "./catalog-domain-audit";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

describe("master catalog domain mapping audit", () => {
  it("preserves the 27 authoritative master domain labels", () => {
    expect(MASTER_CATALOG_DOMAINS).toHaveLength(27);
    expect(new Set(MASTER_CATALOG_DOMAINS).size).toBe(27);
  });
  it("requires explicit mappings for registry categories that differ from master domains", () => {
    const first = listCalculatorImplementationInventory()[0];
    const result = auditCatalogDomainMappings(
      [{ masterId: 1, domain: "Math", title: "Example" }],
      { [first.category]: "Math" },
    );
    expect(result.unknownMasterDomains).toEqual([]);
    expect(result.unusedMappings).toEqual([]);
    expect(result.coveredMasterDomains).toContain("Math");
  });
  it("rejects invented master domains and unused mappings", () => {
    const result = auditCatalogDomainMappings(
      [{ masterId: 1, domain: "Invented Domain", title: "Example" }],
      { "Nonexistent Category": "Math" },
    );
    expect(result.complete).toBe(false);
    expect(result.unknownMasterDomains).toEqual(["Invented Domain"]);
    expect(result.unusedMappings).toEqual(["Nonexistent Category"]);
  });
});
