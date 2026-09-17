import { describe, expect, it } from "vitest";
import { cagr, futureValue, investmentMathCalculator, presentValueFromFuture, realReturnPercent } from "./investment-math";

describe("investment math", () => {
  it("round-trips present and future value", () => {
    const future = futureValue(100000, 8, 10);
    expect(presentValueFromFuture(future, 8, 10)).toBeCloseTo(100000, 8);
  });

  it("calculates CAGR", () => {
    expect(cagr(100, 200, 10)).toBeCloseTo(7.177346, 5);
  });

  it("uses the exact inflation-adjusted return relationship", () => {
    expect(realReturnPercent(10, 5)).toBeCloseTo(4.7619048, 5);
  });

  it("reports nominal and real future values separately", () => {
    const result = investmentMathCalculator.calculate({ presentValue: 100000, annualReturnPercent: 10, years: 10, inflationPercent: 5 }, {});
    expect(result.futureValue).toBeGreaterThan(result.inflationAdjustedFutureValue);
    expect(result.realAnnualReturnPercent).toBeCloseTo(4.7619, 4);
  });
});
