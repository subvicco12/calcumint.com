import { describe, expect, it } from "vitest";
import { bmiResult, breakEvenResult, mortgageResult } from "./reference-adapters";

describe("Reference Six adapter contracts", () => {
  it("keeps BMI contextual rather than diagnostic", () => {
    const result = bmiResult({ bmi: 22, classification: "Normal" });
    expect(result.primaryResult.value).toBe(22);
    expect(result.warnings?.join(" ")).toMatch(/screening/i);
  });

  it("preserves break-even authoritative outputs", () => {
    const result = breakEvenResult({ breakEvenUnits: 100, breakEvenRevenue: 1000, contributionMarginPerUnit: 10, contributionMarginPercent: 50 });
    expect(result.primaryResult.value).toBe(100);
    expect(result.metrics?.find(metric => metric.id === "revenue")?.value).toBe(1000);
  });

  it("keeps mortgage principal and interest decomposition tied to engine outputs", () => {
    const result = mortgageResult({ principal: 200000, termMonths: 360 }, { monthlyPayment: 1200, totalPayment: 432000, totalInterest: 232000 });
    expect(result.primaryResult.value).toBe(1200);
    expect(result.composition?.reduce((sum, item) => sum + item.value, 0)).toBe(432000);
  });
});
