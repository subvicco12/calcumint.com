import { describe, expect, it } from "vitest";
import { dnaConcentrationCalculator as dna, rnaConcentrationCalculator as rna } from "./catalog-batch-8";
describe("nucleic acid direct-call domains", () => {
  it("rejects negative absorbance and invalid dilution", () => {
    for(const calculator of [dna,rna]){
      const input=calculator.examples[0].input;
      expect(() => calculator.calculate({...input,absorbance260:-1},{})).toThrow();
      expect(() => calculator.calculate({...input,dilutionFactor:0},{})).toThrow();
    }
  });
  it("preserves reference concentration conversions", () => {
    for(const calculator of [dna,rna]){
      const ex=calculator.examples[0];
      expect(calculator.calculate(ex.input,{}).concentrationNgPerUl).toBeCloseTo(ex.expected.concentrationNgPerUl,8);
    }
  });
});
