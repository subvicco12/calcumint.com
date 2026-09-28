import { describe, expect, it } from "vitest";
import type { CalculatorDefinition } from "./types";
import { composePublishedCalculatorSlugs, isRepositoryPublicationEligible } from "./publication-authority";

const definition = {
  id: "test.example",
  slug: "example-calculator",
  title: "Example Calculator",
  category: "math",
  version: 3,
  riskClass: "standard",
  reviewStatus: "certified",
  inputSchema: {} as CalculatorDefinition<unknown, unknown>["inputSchema"],
  calculate: () => ({ result: 1 }),
  formulas: [{ id: "f", expression: "x = 1", description: "Example formula." }],
  sources: [{ label: "Authoritative source", url: "https://example.com/source" }],
  examples: [{ label: "Worked example", input: {}, expected: { result: 1 } }]
} satisfies CalculatorDefinition<unknown, { result: number }>;

describe("composed public publication authority", () => {
  it("requires repository eligibility and exact DB id/slug/version publication identity", () => {
    expect(composePublishedCalculatorSlugs([definition], [
      { calculator_key: definition.id, slug: definition.slug, version: definition.version }
    ]).has(definition.slug)).toBe(true);

    expect(composePublishedCalculatorSlugs([definition], []).has(definition.slug)).toBe(false);
    expect(composePublishedCalculatorSlugs([definition], [
      { calculator_key: "other.id", slug: definition.slug, version: definition.version }
    ]).has(definition.slug)).toBe(false);
    expect(composePublishedCalculatorSlugs([definition], [
      { calculator_key: definition.id, slug: definition.slug, version: definition.version + 1 }
    ]).has(definition.slug)).toBe(false);
  });

  it("fails closed for incomplete or non-certified repository definitions", () => {
    expect(isRepositoryPublicationEligible({ ...definition, reviewStatus: "draft" })).toBe(false);
    expect(isRepositoryPublicationEligible({ ...definition, formulas: [] })).toBe(false);
    expect(isRepositoryPublicationEligible({ ...definition, examples: [] })).toBe(false);
    expect(isRepositoryPublicationEligible({ ...definition, sources: [] })).toBe(false);
  });
});
