import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";

describe("Compound Interest renderer authority", () => {
  it("carries authoritative visualization values in the structured result", () => {
    const result = compoundInterestResult({ principal: 10000, years: 10 }, { futureValue: 16470.09, totalInterest: 6470.09 });
    expect(result.composition).toEqual([
      { id: "principal", label: "Principal", value: 10000 },
      { id: "interest", label: "Interest", value: 6470.09 }
    ]);
    expect(result.primaryResult.value).toBe(16470.09);
  });
});
