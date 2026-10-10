import { describe, expect, it } from "vitest";
import { reconcileAuditedMasterCatalogCsv } from "./catalog-audited-reconciliation";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

describe("audited catalog reconciliation", () => {
  it("fails closed without reviewed mappings rather than reporting false implementation gaps", () => {
    expect(() => reconcileAuditedMasterCatalogCsv(
      "master_id,domain,title\n1,Math,Example Calculator\n", {},
    )).toThrow(/mapping audit incomplete/);
  });

  it("produces a registry-derived report only after all categories are mapped", () => {
    const inventory = listCalculatorImplementationInventory();
    const categories = [...new Set(inventory.map((entry) => entry.category))];
    const mapping = Object.fromEntries(categories.map((category) => [category, "Math"]));
    const overrides = Object.fromEntries(inventory.filter((entry) => ["science", "everyday"].includes(entry.category)).map((entry) => [entry.slug, "Math"]));
    const output = reconcileAuditedMasterCatalogCsv(
      "master_id,domain,title\n1,Math,Nonexistent Example Calculator\n",
      mapping,
      {},
      overrides,
    );
    const summary = JSON.parse(output.summary);
    expect(summary.totalRegistered).toBe(inventory.length);
    expect(summary.unmatched).toBe(1);
    expect(summary.publicationAuthority).toBe(false);
    expect(summary.certificationAuthority).toBe(false);
    expect(output.csv).toContain('"unmatched"');
  });

  it("rejects incomplete per-slug assignments for shared categories", () => {
    const inventory = listCalculatorImplementationInventory();
    const mapping = Object.fromEntries([...new Set(inventory.map((entry) => entry.category))].map((category) => [category, "Math"]));
    expect(() => reconcileAuditedMasterCatalogCsv("master_id,domain,title\n1,Math,Example\n", mapping))
      .toThrow(/missingSharedOverrides/);
  });

  it("rejects unknown master domains even with otherwise complete category mappings", () => {
    const categories = [...new Set(listCalculatorImplementationInventory().map((entry) => entry.category))];
    const mapping = Object.fromEntries(categories.map((category) => [category, "Math"]));
    expect(() => reconcileAuditedMasterCatalogCsv(
      "master_id,domain,title\n1,Imaginary Domain,Example\n", mapping,
    )).toThrow(/unknownMasterDomains/);
  });
});
