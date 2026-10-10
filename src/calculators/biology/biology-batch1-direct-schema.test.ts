import { describe, expect, it } from "vitest";
import { biologyBatch1Definitions, microscopeMagnificationCalculator } from "./catalog-batch-1";
describe("biology batch 1 direct-call validation", () => {
  it("rejects invalid direct-call inputs for every calculator", () => {
    for(const calculator of biologyBatch1Definitions){
      expect(() => calculator.calculate({} as never)).toThrow();
    }
  });
  it("preserves all reference examples", () => {
    for(const calculator of biologyBatch1Definitions){
      const ex=calculator.examples[0];
      const result=calculator.calculate(ex.input as never);
      expect(result.value).toBeCloseTo(ex.expected.value,6);
    }
  });
  it("applies default relay magnification", () => {
    expect(microscopeMagnificationCalculator.calculate({objectiveMagnification:40,eyepieceMagnification:10} as never).value).toBe(400);
  });
});
