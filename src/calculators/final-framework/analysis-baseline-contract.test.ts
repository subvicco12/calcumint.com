import { describe, expect, it } from "vitest";
import { loanScenarios, mortgageScenarios, sipScenarios, compoundInterestScenarios, breakEvenScenarios } from "./analysis";

describe("explicit analysis baseline identity", () => {
  it("marks the normal input rather than any scenario with a zero delta", () => {
    const results = [
      loanScenarios({ principal: 1000, annualRatePercent: 0, termMonths: 12 }),
      mortgageScenarios({ principal: 1000, annualRatePercent: 0, termMonths: 12 }),
      sipScenarios({ monthlyContribution: 10, annualReturnPercent: 0, termMonths: 12, contributionTiming: "end" }),
      compoundInterestScenarios({ principal: 1000, annualRatePercent: 0, years: 1, compoundsPerYear: 12 }),
      breakEvenScenarios({ fixedCosts: 1000, pricePerUnit: 50, variableCostPerUnit: 30 })
    ];
    for (const scenarios of results) {
      expect(scenarios.filter(scenario => scenario.baseline).map(scenario => scenario.id)).toEqual(["1"]);
      expect(scenarios.find(scenario => scenario.baseline)?.delta).toBe(0);
    }
    // Clamped zero rates can produce identical outcomes without being baseline inputs.
    expect(results[0][0].delta).toBe(0);
    expect(results[0][0].baseline).toBe(false);
  });

  it("carries actual small and clamped scenario inputs without changing legacy labels", () => {
    const loan = loanScenarios({ principal: 1000, annualRatePercent: 0.001, termMonths: 12 });
    expect(loan[1].input).toEqual({ label: "Annual rate", value: 0.001, unit: "%" });
    expect(loan[0].input).toEqual({ label: "Annual rate", value: 0, unit: "%" });
    const clamped = sipScenarios({ monthlyContribution: 10, annualReturnPercent: -99, termMonths: 12, contributionTiming: "end" });
    expect(clamped[0].input).toEqual(clamped[1].input);
    expect(clamped[0].baseline).toBe(false);
    expect(clamped[1].baseline).toBe(true);
  });
});
