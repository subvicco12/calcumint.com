import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "./registry";
import { listPublicCalculators, listPublicCategories } from "./public-content";

describe("public calculator publication gate", () => {
  it("publishes only certified calculator definitions", () => {
    const publicItems = listPublicCalculators();
    expect(publicItems.length).toBeGreaterThan(0);
    for (const item of publicItems) {
      const definition = calculatorRegistry.getBySlug(item.slug);
      expect(definition).toBeDefined();
      expect(definition?.reviewStatus).toBe("certified");
      expect(definition?.category).toBe(item.category);
    }
  });

  it("requires usable provenance for every public calculator", () => {
    for (const item of listPublicCalculators()) {
      const definition = calculatorRegistry.getBySlug(item.slug);
      expect(definition).toBeDefined();
      expect(definition?.formulas.length).toBeGreaterThan(0);
      expect(definition?.examples.length).toBeGreaterThan(0);
      expect(definition?.sources.length).toBeGreaterThan(0);
      for (const source of definition?.sources ?? []) {
        expect(source.label.trim().length).toBeGreaterThan(0);
        const sourceUrl = source.url;
        if (sourceUrl) expect(() => new URL(sourceUrl)).not.toThrow();
      }
    }
  });

  it("does not expose draft finance calculators", () => {
    const slugs = listPublicCalculators().map((item) => item.slug);
    expect(slugs).not.toContain("compound-interest-calculator");
    expect(slugs).not.toContain("loan-payment-calculator");
  });

  it("has a category hub for every public calculator", () => {
    const categories = new Set(listPublicCategories().map((category) => category.slug));
    for (const item of listPublicCalculators()) expect(categories.has(item.category)).toBe(true);
  });
});
