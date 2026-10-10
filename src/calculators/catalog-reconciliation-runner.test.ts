import { describe, expect, it } from "vitest";
import { reconcileMasterCatalogCsv } from "./catalog-reconciliation-runner";

describe("offline catalog reconciliation runner", () => {
  it("reconciles imported master rows against runtime inventory without publication authority", () => {
    const result = reconcileMasterCatalogCsv("master_id,domain,title\n1,Unknown,Unimplemented Example\n");
    const summary = JSON.parse(result.summary);
    expect(summary.totalMaster).toBe(1);
    expect(summary.unmatched).toBe(1);
    expect(summary.exact + summary.alias + summary.ambiguous + summary.unmatched).toBe(1);
    expect(summary.totalRegistered).toBeGreaterThan(0);
    expect(summary.publicationAuthority).toBe(false);
    expect(summary.certificationAuthority).toBe(false);
    expect(result.csv).toContain('"1","Unknown","Unimplemented Example","unmatched"');
  });
  it("fails closed for invalid CSV and aliases pointing to unknown slugs", () => {
    expect(() => reconcileMasterCatalogCsv("master_id,domain,title\n1,Math,\n")).toThrow();
    expect(() => reconcileMasterCatalogCsv("master_id,domain,title\n1,Math,Example Calculator\n", {
      aliases: { "math:example": "not-a-real-registry-slug" },
    })).toThrow();
  });
});
