import { describe, expect, it } from "vitest";
import { FINAL_PRESENTATION_FAMILIES } from "./presentation-families";
import { referencePresentations } from "./reference-presentations";

describe("Reference Six canonical presentation families", () => {
  it("uses only canonical Final Blueprint family identifiers", () => {
    for (const presentation of Object.values(referencePresentations)) {
      expect(FINAL_PRESENTATION_FAMILIES).toContain(presentation.family);
    }
  });
  it("maps each reference to its intended reusable semantics", () => {
    expect(referencePresentations.loanEmi.family).toBe("amortization-debt");
    expect(referencePresentations.sip.family).toBe("growth-accumulation");
    expect(referencePresentations.compoundInterest.family).toBe("growth-accumulation");
    expect(referencePresentations.mortgage.family).toBe("amortization-debt");
    expect(referencePresentations.bmi.family).toBe("range-classification");
    expect(referencePresentations.breakEven.family).toBe("break-even-crossover");
  });
});
