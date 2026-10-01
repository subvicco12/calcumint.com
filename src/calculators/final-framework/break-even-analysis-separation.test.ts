import { describe, expect, it } from "vitest";
import { breakEvenResult } from "./reference-adapters";
import { breakEvenScenarios, breakEvenSensitivity } from "./analysis";

describe("Break-even analysis separation after renderer migration", () => {
  const input = { fixedCosts: 10000, pricePerUnit: 50, variableCostPerUnit: 30 };

  it("keeps structured core presentation independent from advanced analysis execution", () => {
    const result = breakEvenResult({ breakEvenUnits: 500, breakEvenRevenue: 25000, contributionMarginPerUnit: 20, contributionMarginPercent: 40 });
    expect(result.primaryResult.value).toBe(500);
    expect(breakEvenScenarios(input).length).toBeGreaterThan(0);
    expect(breakEvenSensitivity(input).length).toBeGreaterThan(0);
  });
});
