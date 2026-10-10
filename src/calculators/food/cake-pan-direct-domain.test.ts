import { describe, expect, it } from "vitest";
import { cakePanConversionCalculator as calculator } from "./catalog-batch-3";
describe("cake pan conversion direct-call domain", () => {
  it("rejects invalid areas and nonfinite quantities", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,originalPanArea:0},{})).toThrow();
    expect(() => calculator.calculate({...input,targetPanArea:Number.POSITIVE_INFINITY},{})).toThrow();
  });
  it("preserves deterministic reference example", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).value).toBeCloseTo(ex.expected.value,8);
  });
});
