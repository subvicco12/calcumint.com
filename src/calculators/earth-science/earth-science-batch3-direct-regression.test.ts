import { describe, expect, it } from "vitest";
import { earthScienceBatch3Definitions, rockDensityCalculator, earthquakeEnergyCalculator, seismicTravelTimeCalculator } from "./catalog-batch-3";
describe("earth science batch 3 direct-call contracts", () => {
  it("preserves all five worked examples", () => {
    for (const calculator of earthScienceBatch3Definitions) {
      const example=calculator.examples[0];
      expect(calculator.calculate(example.input as never,{}).value).toBeCloseTo(example.expected.value,5);
    }
  });
  it("rejects malformed direct calls", () => {
    for (const calculator of earthScienceBatch3Definitions)
      expect(() => calculator.calculate({} as never,{})).toThrow();
  });
  it("enforces positive denominators and magnitude bounds", () => {
    expect(() => rockDensityCalculator.calculate({massKg:100,volumeM3:0},{})).toThrow();
    expect(() => seismicTravelTimeCalculator.calculate({distanceKm:100,waveSpeedKms:0},{})).toThrow();
    expect(() => earthquakeEnergyCalculator.calculate({magnitude:11},{})).toThrow();
  });
});
