import { describe, expect, it } from "vitest";
import { astronomyBatch1Definitions, orbitalPeriodCalculator } from "./catalog-batch-1";
describe("astronomy finite result protection", () => {
  it("preserves reference results", () => {
    for(const calculator of astronomyBatch1Definitions){
      const ex=calculator.examples[0];
      expect(calculator.calculate(ex.input as never,{}).value).toBeCloseTo(ex.expected.value,5);
    }
  });
  it("rejects a mathematically overflowing but schema-valid orbital period", () => {
    expect(() => orbitalPeriodCalculator.calculate({semiMajorAxisAu:1e35,centralMassSolar:1e-250},{})).toThrow();
  });
});
