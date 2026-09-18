import { describe, expect, it } from "vitest";
import { termDepositCalculator, termDepositFutureValue } from "./term-deposit";

describe("fixed / term deposit", () => {
  it("calculates compound maturity value", () => {
    expect(termDepositFutureValue(100000, 8, 12, 4)).toBeCloseTo(108243.216, 2);
  });

  it("handles zero-rate deposits", () => {
    const result = termDepositCalculator.calculate({ principal: 50000, annualRatePercent: 0, termMonths: 24, compoundingPerYear: 4 }, {});
    expect(result.maturityValue).toBe(50000);
    expect(result.interestEarned).toBe(0);
    expect(result.effectiveAnnualYieldPercent).toBe(0);
  });

  it("reports effective annual yield separately from nominal rate", () => {
    const result = termDepositCalculator.calculate({ principal: 100000, annualRatePercent: 8, termMonths: 12, compoundingPerYear: 4 }, {});
    expect(result.effectiveAnnualYieldPercent).toBeCloseTo(8.2432, 4);
    expect(result.interestEarned).toBeGreaterThan(8000);
  });
  it("rejects unsafe direct helper inputs",()=>{expect(()=>termDepositFutureValue(Number.POSITIVE_INFINITY,8,12,4)).toThrow();expect(()=>termDepositFutureValue(1000,-1,12,4)).toThrow();expect(()=>termDepositFutureValue(1000,8,12.5,4)).toThrow();expect(()=>termDepositFutureValue(1000,8,12,3)).toThrow();expect(()=>termDepositFutureValue(Number.MAX_VALUE,1000,1200,365)).toThrow(/numeric range/);});
});
