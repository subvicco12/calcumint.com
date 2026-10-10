import { describe, expect, it } from "vitest";
import { earthScienceBatch2Definitions, porosityCalculator, airDensityCalculator, hydraulicGradientCalculator } from "./catalog-batch-2";
describe("earth science batch 2 direct-call contracts", () => {
  it("preserves all five worked examples", () => {
    for (const calculator of earthScienceBatch2Definitions) {
      const example=calculator.examples[0];
      expect(calculator.calculate(example.input as never).value).toBeCloseTo(example.expected.value,5);
    }
  });
  it("rejects malformed direct calls", () => {
    for (const calculator of earthScienceBatch2Definitions)
      expect(() => calculator.calculate({} as never)).toThrow();
  });
  it("enforces porosity and physical denominator bounds", () => {
    expect(() => porosityCalculator.calculate({voidVolume:2,totalVolume:1})).toThrow();
    expect(() => airDensityCalculator.calculate({pressurePa:101325,temperatureC:-274})).toThrow();
    expect(() => hydraulicGradientCalculator.calculate({headDifferenceM:1,flowLengthM:0})).toThrow();
  });
});
