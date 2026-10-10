import { describe, expect, it } from "vitest";
import { cookingMeasurementConverter as calculator } from "./catalog-batch-4";
describe("cooking volume domain", () => {
  it("rejects negative quantities and unsupported units", () => {
    expect(() => calculator.calculate({value:-1,fromUnit:"ml",toUnit:"l"},{})).toThrow();
    expect(() => calculator.calculate({value:1,fromUnit:"invalid",toUnit:"ml"},{})).toThrow();
  });
  it("preserves zero and reference cup conversion", () => {
    expect(calculator.calculate({value:0,fromUnit:"ml",toUnit:"l"},{}).result).toBe(0);
    expect(calculator.calculate({value:1,fromUnit:"cup_us",toUnit:"ml"},{}).result).toBeCloseTo(236.58824,6);
  });
});
