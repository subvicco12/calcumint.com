import { describe, expect, it } from "vitest";
import { cellConcentrationCalculator as calculator } from "./catalog-batch-9";
describe("cell concentration direct-call domain", () => {
  it("rejects invalid counting and dilution inputs", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,totalCellsCounted:1.5},{})).toThrow();
    expect(() => calculator.calculate({...input,squaresCounted:0},{})).toThrow();
    expect(() => calculator.calculate({...input,dilutionFactor:0},{})).toThrow();
  });
  it("preserves reference cell count", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).cellsPerMl).toBeCloseTo(ex.expected.cellsPerMl,8);
  });
});
