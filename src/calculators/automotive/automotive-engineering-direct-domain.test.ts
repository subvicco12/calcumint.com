import { describe, expect, it } from "vitest";
import { automotiveEngineeringBatch2Definitions, tireSizeCalculator, horsepowerCalculator, engineHorsepowerCalculator } from "./catalog-batch-3";
describe("automotive engineering direct-call contracts", () => {
  it("preserves all reference examples", () => {
    for (const calculator of automotiveEngineeringBatch2Definitions) {
      const example = calculator.examples[0];
      const actual=calculator.calculate(example.input as never,{});
      if ("horsepower" in actual && "horsepower" in example.expected)
        expect(actual.horsepower).toBeCloseTo(example.expected.horsepower as number,8);
      if ("currentDiameterMm" in actual && "currentDiameterMm" in example.expected)
        expect(actual.currentDiameterMm).toBeCloseTo(example.expected.currentDiameterMm as number,8);
    }
  });
  it("rejects malformed direct calls", () => {
    for (const calculator of automotiveEngineeringBatch2Definitions)
      expect(() => calculator.calculate({} as never,{})).toThrow();
  });
  it("rejects invalid rim size, negative power and zero RPM", () => {
    const tire=tireSizeCalculator.examples[0].input;
    expect(() => tireSizeCalculator.calculate({...tire,currentRimInches:0},{})).toThrow();
    expect(() => horsepowerCalculator.calculate({kilowatts:-1},{})).toThrow();
    expect(() => engineHorsepowerCalculator.calculate({torqueLbFt:100,rpm:0},{})).toThrow();
  });
});
