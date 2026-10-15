import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "./registry";
import { composePublishedCalculatorSlugs, parsePublishedCalculatorManifest } from "./publication-authority";
const loan = calculatorRegistry.getBySlug("loan-emi-calculator")!;
const valid = { calculator_key: loan.id, slug: loan.slug, version: loan.version };
describe("runtime publication identity boundaries", () => {
  it("rejects malformed manifest rows instead of silently treating corrupt authority as empty", () => {
    for (const value of [null, {}, [null], [valid, {}], [{ ...valid, version: "1" }], [{ ...valid, version: 0 }], [{ ...valid, slug: "../loan" }], [{ ...valid, calculator_key: " " }]]) {
      expect(parsePublishedCalculatorManifest(value)).toBeUndefined();
    }
    expect(parsePublishedCalculatorManifest([])).toEqual([]);
  });
  it("accepts exact duplicates but rejects conflicting slug or engine identities in either order", () => {
    expect(parsePublishedCalculatorManifest([valid, { ...valid }])).toEqual([valid]);
    for (const other of [{ ...valid, version: valid.version + 1 }, { ...valid, calculator_key: "other.engine" }, { ...valid, slug: "other-calculator" }]) {
      expect(parsePublishedCalculatorManifest([valid, other])).toBeUndefined();
      expect(parsePublishedCalculatorManifest([other, valid])).toBeUndefined();
      expect(composePublishedCalculatorSlugs([loan], [valid, other]).size).toBe(0);
    }
  });
  it("does not retain publication across DB lifecycle/version changes", () => {
    expect(composePublishedCalculatorSlugs([loan], [valid]).has(loan.slug)).toBe(true);
    expect(composePublishedCalculatorSlugs([loan], []).size).toBe(0);
    expect(composePublishedCalculatorSlugs([loan], [{ ...valid, version: loan.version + 1 }]).size).toBe(0);
    expect(composePublishedCalculatorSlugs([{ ...loan, reviewStatus: "draft" }], [valid]).size).toBe(0);
  });
});
