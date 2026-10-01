import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { compoundInterestScenarios, compoundInterestSensitivity } from "./analysis";

describe("Compound Interest post-migration analysis separation", () => {
  const input = { principal: 10000, annualRatePercent: 5, years: 10, compoundsPerYear: 12 };

  it("keeps advanced analysis outside the core renderer result", () => {
    const result = compoundInterestResult(input, { futureValue: 16470.09, totalInterest: 6470.09 });
    expect(result.scenarioVariables).toContain("annualRatePercent");
    expect(result.sensitivityVariables).toContain("annualRatePercent");
    expect(compoundInterestScenarios(input).length).toBeGreaterThan(0);
    expect(compoundInterestSensitivity(input).length).toBeGreaterThan(0);
  });
});
