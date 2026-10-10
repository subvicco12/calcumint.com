import { describe, expect, it } from "vitest";
import { tireSizeCalculator, horsepowerCalculator, engineHorsepowerCalculator } from "./catalog-batch-3";
describe("automotive engineering direct-call domains", () => {
  it("rejects invalid tire dimensions and preserves example", () => {
    const c=tireSizeCalculator,ex=c.examples[0];
    expect(() => c.calculate({...ex.input,currentWidthMm:0},{})).toThrow();
    expect(c.calculate(ex.input,{}).currentDiameterMm).toBeCloseTo(ex.expected.currentDiameterMm,8);
  });
  it("rejects nonfinite power and preserves example", () => {
    const c=horsepowerCalculator,ex=c.examples[0];
    expect(() => c.calculate({...ex.input,kilowatts:Number.POSITIVE_INFINITY},{})).toThrow();
    expect(c.calculate(ex.input,{}).horsepower).toBeCloseTo(ex.expected.horsepower,8);
  });
  it("rejects nonpositive rpm and preserves example", () => {
    const c=engineHorsepowerCalculator,ex=c.examples[0];
    expect(() => c.calculate({...ex.input,rpm:0},{})).toThrow();
    expect(c.calculate(ex.input,{}).horsepower).toBeCloseTo(ex.expected.horsepower,8);
  });
});
