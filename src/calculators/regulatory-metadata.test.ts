import { describe, expect, it } from "vitest";
import { buildCatalogRegulatoryMetadata, buildVerifiedCatalogRegulatoryMetadata, resolveRegistryDefinition, serializeRuleMetadata, validateCalculatorRuleMetadata } from "./regulatory-metadata";
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

  it("resolves admin synchronization only by exact registry id or slug", () => {
    const definition = calculatorRegistry.list()[0];
    expect(resolveRegistryDefinition({ id: definition.id })).toBe(definition);
    expect(resolveRegistryDefinition({ slug: definition.slug })).toBe(definition);
    expect(resolveRegistryDefinition({ id: "core:not-a-real-calculator", slug: "not-a-real-calculator" })).toBeUndefined();
  });

  it("rejects conflicting registry identities", () => {
    const definitions = calculatorRegistry.list();
    expect(definitions.length).toBeGreaterThan(1);
    expect(() => resolveRegistryDefinition({ id: definitions[0].id, slug: definitions[1].slug })).toThrow(/different calculators/);
  });

  it("requires an exact id-and-slug pair when both identity fields are supplied", () => {
    const definition = calculatorRegistry.list()[0];
    expect(buildVerifiedCatalogRegulatoryMetadata({ id: definition.id, slug: "wrong-slug" }).matched).toBe(false);
    expect(buildVerifiedCatalogRegulatoryMetadata({ id: "wrong-id", slug: definition.slug }).matched).toBe(false);
    expect(buildVerifiedCatalogRegulatoryMetadata({ id: definition.id, slug: definition.slug }).matched).toBe(true);
  });

  it("keeps unmatched inventory non-regulatory instead of guessing a binding", () => {
    expect(buildVerifiedCatalogRegulatoryMetadata({ id: "unknown", slug: "unknown" })).toEqual({
      matched: false,
      rulePackRequired: false,
      ruleMetadata: []
    });
  });

  it("keeps every registry ruleMetadata entry structurally complete", () => {
    for (const definition of calculatorRegistry.list()) {
      for (const metadata of definition.ruleMetadata ?? []) {
        expect(validateCalculatorRuleMetadata(metadata), definition.slug).toEqual([]);
      }
    }
  });
});
