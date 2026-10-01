import { describe, expect, it } from "vitest";
import { loanResult, sipResult, compoundInterestResult } from "./adapters";
import { bmiResult, breakEvenResult, mortgageResult } from "./reference-adapters";

describe("Reference Six structured-result adapter coverage", () => {
  it("exposes all six reference adapters as authoritative structured results", () => {
    expect(typeof loanResult).toBe("function");
    expect(typeof sipResult).toBe("function");
    expect(typeof compoundInterestResult).toBe("function");
    expect(typeof mortgageResult).toBe("function");
    expect(typeof bmiResult).toBe("function");
    expect(typeof breakEvenResult).toBe("function");
  });
});
