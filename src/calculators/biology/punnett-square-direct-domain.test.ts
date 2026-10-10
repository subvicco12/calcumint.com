import { describe, expect, it } from "vitest";
import { punnettSquareCalculator as calculator } from "./catalog-batch-3";
describe("Punnett square direct-call domain", () => {
  it("rejects malformed and mismatched gene alleles", () => {
    const input=calculator.examples[0].input;
    expect(() => calculator.calculate({...input,parent1:"A"},{})).toThrow();
    expect(() => calculator.calculate({...input,parent2:"Bb"},{})).toThrow();
    expect(() => calculator.calculate({...input,parent1:"A1"},{})).toThrow();
  });
  it("preserves Mendelian reference distribution", () => {
    const ex=calculator.examples[0];
    expect(calculator.calculate(ex.input,{}).genotypeProbabilities).toEqual(ex.expected.genotypeProbabilities);
  });
});
