import { describe, expect, it } from "vitest";
import { astronomicalDistanceConverter as calculator } from "./catalog-batch-2";
describe("astronomical distance direct-call domains", () => {
  it("rejects invalid numbers and unsupported unit codes", () => {
    const input = calculator.examples[0].input;
    expect(() => calculator.calculate({ ...input, value: Number.POSITIVE_INFINITY }, {})).toThrow();
    expect(() => calculator.calculate({ ...input, fromUnit: "bad" as never }, {})).toThrow();
  });
  it("preserves reference example", () => {
    const example = calculator.examples[0];
    expect(calculator.calculate(example.input, {}).result).toBeCloseTo(example.expected.result, 8);
  });
});
