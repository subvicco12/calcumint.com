import { describe, expect, it } from "vitest";
import { agriculturalYieldCalculator as calculator } from "./catalog-batch-5";
describe("agricultural yield direct-call domain", () => {
  it("rejects invalid yield factors", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,kernelsPerBushel:0},{})).toThrow();
    expect(() => calculator.calculate({...input,kernelRowsPerEar:101},{})).toThrow();
    expect(() => calculator.calculate({...input,earsPerAcre:Number.NaN},{})).toThrow();
  });
  it("preserves the reference yield", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).bushelsPerAcre).toBeCloseTo(ex.expected.bushelsPerAcre,8);
  });
});
