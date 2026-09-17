import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "./registry";
import { getPublicCalculatorContent, listPublicCalculators, listPublicCategories } from "./public-content";

const draftFinanceSlugs = [
  "compound-interest-calculator",
  "loan-payment-calculator",
  "loan-emi-calculator",
  "fixed-term-deposit-calculator",
  "recurring-deposit-calculator",
  "sip-calculator",
  "step-up-sip-calculator",
  "investment-growth-calculator",
  "swp-calculator"
] as const;

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

  it("does not expose any draft finance calculator", () => {
    const publicSlugs = new Set(listPublicCalculators().map((item) => item.slug));
    for (const slug of draftFinanceSlugs) {
      expect(calculatorRegistry.getBySlug(slug)).toBeDefined();
      expect(calculatorRegistry.getBySlug(slug)?.reviewStatus).not.toBe("certified");
      expect(publicSlugs.has(slug)).toBe(false);
      expect(getPublicCalculatorContent(slug)).toBeUndefined();
    }
  });

  it("has a category hub for every public calculator", () => {
    const categories = new Set(listPublicCategories().map((category) => category.slug));
    for (const item of listPublicCalculators()) expect(categories.has(item.category)).toBe(true);
  });

  it("prepares the finance category without making draft finance pages public", () => {
    const categories = new Set(listPublicCategories().map((category) => category.slug));
    expect(categories.has("finance-investment")).toBe(true);
    expect(listPublicCalculators().some((item) => item.category === "finance-investment")).toBe(false);
  });
});
