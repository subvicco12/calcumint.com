import { describe, expect, it } from "vitest";
import { microbiologyDilutionCalculator as calculator } from "./catalog-batch-6";
describe("microbiology dilution direct-call domain", () => {
  it("rejects fractional counts and invalid dilution", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,colonyCount:1.5},{})).toThrow();
    expect(() => calculator.calculate({...input,dilution:0},{})).toThrow();
    expect(() => calculator.calculate({...input,platedVolumeMl:0},{})).toThrow();
  });
  it("preserves reference plate count", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).cfuPerMl).toBeCloseTo(ex.expected.cfuPerMl,8);
  });
});
