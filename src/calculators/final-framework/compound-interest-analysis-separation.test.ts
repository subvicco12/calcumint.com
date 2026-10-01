import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { compoundInterestScenarios, compoundInterestSensitivity } from "./analysis";

describe("Compound Interest analysis separation", () => {
  const input = { principal: 10000, annualRatePercent: 5, years: 10, compoundsPerYear: 12 };

  it("keeps core structured presentation independent from advanced analysis", () => {
    const result = compoundInterestResult(input, { futureValue: 16470.09, totalInterest: 6470.09 });
    expect(result.primaryResult.id).toBe("future-value");
    expect(compoundInterestScenarios(input).length).toBeGreaterThan(0);
    expect(compoundInterestSensitivity(input).length).toBeGreaterThan(0);
  });
});
