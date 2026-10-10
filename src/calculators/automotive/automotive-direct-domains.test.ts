import { describe, expect, it } from "vitest";
import { fuelEconomyCalculator, gasMileageCalculator, tripFuelCalculator } from "./catalog-batch-2";
describe("automotive direct-call domains", () => {
  it("rejects invalid fuel economy inputs and preserves reference", () => {
    const c=fuelEconomyCalculator, ex=c.examples[0];
    expect(() => c.calculate({...ex.input,fuelUsedLiters:0},{})).toThrow();
    expect(c.calculate(ex.input,{}).value).toBeCloseTo(ex.expected.value,8);
  });
  it("rejects invalid gas mileage inputs and preserves reference", () => {
    const c=gasMileageCalculator, ex=c.examples[0];
    expect(() => c.calculate({...ex.input,distanceMiles:Number.POSITIVE_INFINITY},{})).toThrow();
    expect(c.calculate(ex.input,{}).value).toBeCloseTo(ex.expected.value,8);
  });
  it("rejects invalid trip fuel inputs and preserves reference", () => {
    const c=tripFuelCalculator, ex=c.examples[0];
    expect(() => c.calculate({...ex.input,distanceKm:-1},{})).toThrow();
    expect(c.calculate(ex.input,{}).value).toBeCloseTo(ex.expected.value,8);
  });
});
