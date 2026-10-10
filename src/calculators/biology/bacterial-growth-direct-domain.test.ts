import { describe, expect, it } from "vitest";
import { bacterialGrowthCalculator as calculator } from "./catalog-batch-7";
describe("bacterial growth direct-call domain", () => {
  it("rejects invalid time and overflowing exponential", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,generationTimeMinutes:0},{})).toThrow();
    expect(() => calculator.calculate({...input,elapsedTimeMinutes:-1},{})).toThrow();
    expect(() => calculator.calculate({...input,elapsedTimeMinutes:1e9,generationTimeMinutes:1},{})).toThrow();
  });
  it("preserves reference generation count", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).cells).toBeCloseTo(ex.expected.cells,8);
  });
});
