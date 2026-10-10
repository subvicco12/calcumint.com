import { describe, expect, it } from "vitest";
import { buildCatalogReconciliationReport, exportCatalogReconciliationCsv } from "./catalog-reconciliation-report";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

describe("master catalog reconciliation report", () => {
  it("accounts for every master row and never mistakes registry inventory for publication", () => {
    const first = listCalculatorImplementationInventory()[0];
    expect(first).toBeDefined();
    const report = buildCatalogReconciliationReport([
      { masterId: 1, domain: first.category, title: first.title },
      { masterId: 2, domain: "Unmapped domain", title: "Definitely absent calculator" },
    ]);
    expect(report.totalMaster).toBe(2);
    expect(report.totalRegistered).toBe(listCalculatorImplementationInventory().length);
    expect(report.exact + report.alias + report.ambiguous + report.unmatched).toBe(2);
    expect(report.unmatched).toBe(1);
    expect(report).not.toHaveProperty("published");
    expect(report).not.toHaveProperty("certified");
  });

  it("exports a quoted, stable CSV without executable definitions or lifecycle assertions", () => {
    const report = buildCatalogReconciliationReport([
      { masterId: 9, domain: "Unknown", title: 'Cost, "Special" Calculator' },
    ]);
    const csv = exportCatalogReconciliationCsv(report);
    expect(csv).toContain('"master_id","domain","title","status","registry_slug","candidates","evidence"');
    expect(csv).toContain('"9","Unknown","Cost, ""Special"" Calculator","unmatched"');
    expect(csv.endsWith("\r\n")).toBe(true);
    expect(csv).not.toContain("published");
  });

  it("produces reproducible rows and unreferenced registry slug order", () => {
    const master = [{ masterId: 7, domain: "Unknown", title: "Unknown" }];
    const first = buildCatalogReconciliationReport(master);
    const second = buildCatalogReconciliationReport(master);
    expect(first).toEqual(second);
    expect(first.unreferencedRegistrySlugs).toEqual([...first.unreferencedRegistrySlugs].sort());
  });
});
