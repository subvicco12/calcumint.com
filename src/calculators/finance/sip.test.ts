import { describe, expect, it } from "vitest";
import { requiredMonthlySip, sipCalculator, sipFutureValue } from "./sip";

describe("SIP investment engine", () => {
  it("handles zero-return contributions deterministically", () => {
    expect(sipFutureValue(1000, 0, 120)).toBe(120000);
  });

  it("distinguishes beginning and end contribution timing", () => {
    const beginning = sipFutureValue(5000, 12, 120, "beginning");
    const end = sipFutureValue(5000, 12, 120, "end");
    expect(beginning).toBeGreaterThan(end);
    expect(beginning / end).toBeCloseTo(1.01, 10);
  });

  it("reverse-solves the monthly SIP required for a target corpus", () => {
    const required = requiredMonthlySip(1000000, 10, 120, "beginning");
    expect(sipFutureValue(required, 10, 120, "beginning")).toBeCloseTo(1000000, 6);
  });

  it("separates invested capital from estimated gain", () => {
    const result = sipCalculator.calculate({ monthlyContribution: 10000, annualReturnPercent: 10, termMonths: 120, contributionTiming: "beginning" }, {});
    expect(result.investedAmount).toBe(1200000);
    expect(result.futureValue).toBeGreaterThan(result.investedAmount);
    expect(result.estimatedGain).toBeCloseTo(result.futureValue - result.investedAmount, 2);
  });
});
