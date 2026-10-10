import { describe, expect, it } from "vitest";
import { automotiveCatalogBatch1Definitions, fuelEconomyCalculator, gasMileageCalculator, tripFuelCalculator } from "./catalog-batch-2";
describe("automotive fuel economy direct-call contracts", () => {
  it("preserves all reference examples", () => {
    for (const calculator of automotiveCatalogBatch1Definitions) {
      const example = calculator.examples[0];
      expect(calculator.calculate(example.input as never,{}).value).toBeCloseTo(example.expected.value,8);
    }
  });
  it("rejects malformed direct calls", () => {
    for (const calculator of automotiveCatalogBatch1Definitions)
      expect(() => calculator.calculate({} as never,{})).toThrow();
  });
  it("rejects zero fuel divisors and negative distances", () => {
    expect(() => fuelEconomyCalculator.calculate({distanceKm:10,fuelUsedLiters:0},{})).toThrow();
    expect(() => gasMileageCalculator.calculate({distanceMiles:10,fuelUsedUsGallons:0},{})).toThrow();
    expect(() => tripFuelCalculator.calculate({distanceKm:-1,fuelConsumptionLitersPer100Km:8},{})).toThrow();
  });
});
