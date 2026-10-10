import { describe, expect, it } from "vitest";
import { automotiveTravelBatch1Definitions, travelTimeCalculator, roadTripFuelCostCalculator } from "./catalog-batch-1";
describe("automotive batch 1 direct-call domain regressions", () => {
  it("preserves all reference fixtures", () => {
    for (const calculator of automotiveTravelBatch1Definitions) {
      const example = calculator.examples[0];
      expect(calculator.calculate(example.input as never).value).toBeCloseTo(example.expected.value,5);
    }
  });
  it("rejects invalid direct-call inputs across the batch", () => {
    for (const calculator of automotiveTravelBatch1Definitions) {
      expect(() => calculator.calculate({} as never)).toThrow();
    }
  });
  it("rejects zero speed and negative fuel price", () => {
    expect(() => travelTimeCalculator.calculate({distanceKm:10,averageSpeedKmh:0})).toThrow();
    expect(() => roadTripFuelCostCalculator.calculate({distanceKm:10,fuelConsumptionLitersPer100Km:8,fuelPricePerLiter:-1})).toThrow();
  });
});
