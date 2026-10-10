import { describe, expect, it } from "vitest";
import { lightingEnergyCalculator as calculator } from "./catalog-batch-3";
describe("lighting energy direct-call domain", () => {
  it("rejects fractional quantity and nonfinite hours", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,quantity:1.5},{})).toThrow();
    expect(() => calculator.calculate({...input,hoursUsed:Number.POSITIVE_INFINITY},{})).toThrow();
  });
  it("preserves reference energy", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).energyKwh).toBeCloseTo(ex.expected.energyKwh,8);
  });
});
