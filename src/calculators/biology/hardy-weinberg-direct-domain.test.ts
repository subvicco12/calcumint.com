import { describe, expect, it } from "vitest";
import { hardyWeinbergCalculator as calculator } from "./catalog-batch-2";
describe("Hardy-Weinberg direct-call domain", () => {
  it("rejects allele frequencies outside the unit interval", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,allelePFrequency:-0.1},{})).toThrow();
    expect(() => calculator.calculate({...input,allelePFrequency:1.1},{})).toThrow();
    expect(() => calculator.calculate({...input,allelePFrequency:Number.NaN},{})).toThrow();
  });
  it("preserves reference allele frequencies", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).twoPq).toBeCloseTo(ex.expected.twoPq,8);
  });
});
