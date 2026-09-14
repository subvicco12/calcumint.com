import { describe, expect, it } from "vitest";
import { deterministicCalculatorSearch, publicCalculatorCatalog } from "./catalog";
import { AI_GROUNDING_RULES, canUseAiFeature } from "./policy";

describe("CalcuMint AI safety and discovery", () => {
  it("routes natural-language intent only to certified public calculators", () => {
    const results = deterministicCalculatorSearch("convert miles to kilometres");
    expect(results[0]?.slug).toBe("unit-conversion-calculator");
    const allowed = new Set(publicCalculatorCatalog().map((item) => item.slug));
    expect(results.every((item) => allowed.has(item.slug))).toBe(true);
  });

  it("keeps premium explanation and builder features plan-gated", () => {
    expect(canUseAiFeature("free", "finder")).toBe(true);
    expect(canUseAiFeature("free", "explain")).toBe(false);
    expect(canUseAiFeature("pro", "explain")).toBe(true);
    expect(canUseAiFeature("pro", "builder")).toBe(false);
    expect(canUseAiFeature("business", "builder")).toBe(true);
  });

  it("states that AI cannot replace deterministic calculations", () => {
    expect(AI_GROUNDING_RULES.join(" ")).toMatch(/Never perform or replace the deterministic calculation engine/i);
    expect(AI_GROUNDING_RULES.join(" ")).toMatch(/Never change, recompute, estimate or contradict/i);
  });
});
