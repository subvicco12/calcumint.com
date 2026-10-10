import { describe, expect, it } from "vitest";
import { auditCatalogSlugReviewLedger, requireCompleteCatalogSlugReviewLedger } from "./catalog-slug-review-ledger";

const evidence = {
  slug: "power-calculator",
  domain: "Physics",
  sourcePath: "src/calculators/physics/catalog-batch-1.ts",
  inputContract: "work finite, time positive",
  outputContract: "average power = work/time",
  evidence: "Implementation source inspected; unresolved competing power-from-work calculator",
} as const;

describe("mixed-category review ledger", () => {
  it("does not turn a held candidate into an approved mapping", () => {
    const result = auditCatalogSlugReviewLedger([{ ...evidence, decision: "hold" }]);
    expect(result.held).toContain("power-calculator");
    expect(result.approvedDomains).not.toHaveProperty("power-calculator");
    expect(result.missing.length).toBeGreaterThan(0);
  });
  it("refuses to export mappings while evidence is held or missing", () => {
    expect(() => requireCompleteCatalogSlugReviewLedger([{ ...evidence, decision: "hold" }])).toThrow(/source review incomplete/);
  });
  it("rejects malformed review records and untrusted source paths", () => {
    expect(() => auditCatalogSlugReviewLedger([null as unknown as typeof evidence])).toThrow(/Invalid source review entry/);
    expect(() => auditCatalogSlugReviewLedger([{ ...evidence, decision: "hold", sourcePath: "../untrusted.ts" }])).toThrow(/Invalid implementation source path/);
    expect(() => auditCatalogSlugReviewLedger([{ ...evidence, decision: "hold", sourcePath: undefined as unknown as string }])).toThrow(/Invalid implementation source path/);
  });
  it("rejects unsupported decisions and duplicate slugs", () => {
    expect(() => auditCatalogSlugReviewLedger([{ ...evidence, decision: "approved", evidence: "" }]))
      .toThrow(/Missing source evidence/);
    expect(() => auditCatalogSlugReviewLedger([
      { ...evidence, decision: "hold" },
      { ...evidence, decision: "hold" },
    ])).toThrow(/Duplicate review slug/);
    expect(() => auditCatalogSlugReviewLedger([{ ...evidence, domain: "Unknown", decision: "approved" }]))
      .toThrow(/Unknown master domain/);
  });
});
