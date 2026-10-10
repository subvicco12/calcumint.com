import { describe, expect, it } from "vitest";
import { plantPopulationCalculator as calculator } from "./catalog-batch-4";
describe("plant population direct-call domain", () => {
  it("rejects fractional counts and invalid row spacing", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,plantCount:1.5},{})).toThrow();
    expect(() => calculator.calculate({...input,rowSpacingInches:0},{})).toThrow();
  });
  it("preserves the reference sample", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).plantsPerAcre).toBeCloseTo(ex.expected.plantsPerAcre,8);
  });
});
