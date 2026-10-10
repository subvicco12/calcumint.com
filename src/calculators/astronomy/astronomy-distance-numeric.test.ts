import { describe, expect, it } from "vitest";
import { astronomicalDistanceConverter as calculator } from "./catalog-batch-2";
describe("astronomical distance numeric stability", () => {
  it("avoids overflow in intermediate metres when converted result is finite", () => {
    const result=calculator.calculate({value:1e308,fromUnit:"km",toUnit:"au"}).result;
    expect(Number.isFinite(result)).toBe(true);
    expect(result/1e300).toBeCloseTo(1e8*1000/149597870700,8);
  });
  it("preserves reference conversion and rejects invalid values", () => {
    expect(calculator.calculate({value:1,fromUnit:"au",toUnit:"km"}).result).toBeCloseTo(149597870.7,6);
    expect(() => calculator.calculate({value:-1,fromUnit:"km",toUnit:"au"})).toThrow();
  });
});
