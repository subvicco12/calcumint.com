import { describe, expect, it } from "vitest";
import { cellDilutionCalculator as calculator } from "./catalog-batch-10";
describe("cell dilution direct-call domain", () => {
  it("rejects invalid and infeasible dilution inputs", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,stockCellsPerMl:0},{})).toThrow();
    expect(() => calculator.calculate({...input,finalVolumeMl:0},{})).toThrow();
    expect(() => calculator.calculate({...input,desiredCells:3000000},{})).toThrow();
  });
  it("preserves reference stock and medium volumes", () => {
    const ex=calculator.examples[0];
    const result=calculator.calculate(ex.input,{});
    expect(result.stockVolumeMl).toBeCloseTo(ex.expected.stockVolumeMl,8);
    expect(result.mediumVolumeMl).toBeCloseTo(ex.expected.mediumVolumeMl,8);
  });
});
