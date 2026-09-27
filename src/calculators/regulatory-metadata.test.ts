import { describe, expect, it } from "vitest";
import { buildCatalogRegulatoryMetadata, serializeRuleMetadata, validateCalculatorRuleMetadata } from "./regulatory-metadata";
import { calculatorRegistry } from "./registry";

const complete = {
  jurisdiction: { country: "in" },
  ruleVersion: "2026",
  effectiveFrom: "2026-04-01",
  effectiveTo: "2027-03-31",
  taxYear: "2026-27",
  officialSources: [{ label: "Official source", url: "https://example.gov/rules" }],
  lastVerifiedAt: "2026-09-01"
} as const;

describe("calculator regulatory metadata binding", () => {
  it("requires the Master regulatory provenance fields", () => {
    expect(validateCalculatorRuleMetadata(complete)).toEqual([]);
    expect(validateCalculatorRuleMetadata({ ...complete, jurisdiction: { country: " " } })).toContain("jurisdiction country is required");
    expect(validateCalculatorRuleMetadata({ ...complete, ruleVersion: " " })).toContain("rule version is required");
    expect(validateCalculatorRuleMetadata({ ...complete, effectiveFrom: undefined })).toContain("valid effectiveFrom is required");
    expect(validateCalculatorRuleMetadata({ ...complete, officialSources: [] })).toContain("at least one official source is required");
    expect(validateCalculatorRuleMetadata({ ...complete, lastVerifiedAt: undefined })).toContain("valid lastVerifiedAt is required");
  });

  it("rejects invalid and reversed effective periods", () => {
    expect(validateCalculatorRuleMetadata({ ...complete, effectiveFrom: "2026-02-30" })).toContain("valid effectiveFrom is required");
    expect(validateCalculatorRuleMetadata({ ...complete, effectiveTo: "2025-12-31" })).toContain("effectiveTo cannot precede effectiveFrom");
  });

  it("serializes a stable catalog representation without inventing fields", () => {
    expect(serializeRuleMetadata(complete)).toEqual({
      jurisdiction: { country: "IN" },
      ruleVersion: "2026",
      effectiveFrom: "2026-04-01",
      effectiveTo: "2027-03-31",
      taxYear: "2026-27",
      officialSources: [{ label: "Official source", url: "https://example.gov/rules" }],
      lastVerifiedAt: "2026-09-01"
    });
  });

  it("derives rulePackRequired from actual rule metadata", () => {
    expect(buildCatalogRegulatoryMetadata({ ruleMetadata: [] })).toEqual({ rulePackRequired: false, ruleMetadata: [] });
    expect(buildCatalogRegulatoryMetadata({ ruleMetadata: [complete] }).rulePackRequired).toBe(true);
  });
  it("keeps every registry ruleMetadata entry structurally complete", () => {
    for (const definition of calculatorRegistry.list()) {
      for (const metadata of definition.ruleMetadata ?? []) {
        expect(validateCalculatorRuleMetadata(metadata), definition.slug).toEqual([]);
      }
    }
  });
});
