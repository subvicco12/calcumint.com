import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "./registry";
import { getPublicCalculatorContent, listPublicCalculators, listPublicCategories } from "./public-content";

describe("public calculator publication gate", () => {
  it("publishes only certified calculator definitions", () => {
    const publicItems = listPublicCalculators();
    expect(publicItems.length).toBeGreaterThan(0);
    expect(new Set(publicItems.map((item) => item.slug)).size).toBe(publicItems.length);
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
        if (source.url) expect(() => new URL(source.url!)).not.toThrow();
      }
    }
  });

  it("never exposes draft calculators", () => {
    const publicSlugs = new Set(listPublicCalculators().map((item) => item.slug));
    for (const definition of calculatorRegistry.list()) {
      if (definition.reviewStatus !== "draft") continue;
      expect(publicSlugs.has(definition.slug)).toBe(false);
      expect(getPublicCalculatorContent(definition.slug)).toBeUndefined();
    }
  });

  it("has a category hub for every public calculator", () => {
    const categories = new Set(listPublicCategories().map((category) => category.slug));
    for (const item of listPublicCalculators()) expect(categories.has(item.category)).toBe(true);
  });

  it("publishes finance category hubs when certified finance calculators exist", () => {
    const publicItems = listPublicCalculators();
    const categories = new Set(listPublicCategories().map((category) => category.slug));
    expect(publicItems.some((item) => item.category === "finance-investment")).toBe(true);
    expect(publicItems.some((item) => item.category === "loans-mortgages")).toBe(true);
    expect(categories.has("finance-investment")).toBe(true);
    expect(categories.has("loans-mortgages")).toBe(true);
  });
});
