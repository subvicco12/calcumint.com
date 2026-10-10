import { describe, expect, it } from "vitest";
import { auditCatalogSlugReviewLedger } from "./catalog-slug-review-ledger";

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
