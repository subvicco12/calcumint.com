import { describe, expect, it } from "vitest";
import { applianceRunningCostCalculator, homeEnergyConsumptionCalculator } from "./catalog-batch-2";
describe("energy direct-call domains", () => {
  it("rejects nonfinite appliance power and preserves example", () => {
    const c = applianceRunningCostCalculator, ex = c.examples[0];
    expect(() => c.calculate({ ...ex.input, powerWatts: Number.POSITIVE_INFINITY }, {})).toThrow();
    expect(c.calculate(ex.input, {}).cost).toBeCloseTo(ex.expected.cost, 8);
  });
  it("rejects home hours exceeding 24 and preserves example", () => {
    const c = homeEnergyConsumptionCalculator, ex = c.examples[0];
    expect(() => c.calculate({ ...ex.input, hoursPerDay: 25 }, {})).toThrow();
    expect(c.calculate(ex.input, {}).periodCost).toBeCloseTo(ex.expected.periodCost, 8);
  });
});
