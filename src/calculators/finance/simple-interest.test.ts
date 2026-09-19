import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { calculateSimpleInterest, simpleInterestCalculator } from "./simple-interest";

describe("simple interest", () => {
  it("calculates non-compounding interest", () => {
    expect(calculateSimpleInterest({ principal: 10000, annualRatePercent: 5, years: 2 })).toEqual({ interest: 1000, totalAmount: 11000 });
  });
  it("handles zero rate and zero time", () => {
    expect(calculateSimpleInterest({ principal: 500, annualRatePercent: 0, years: 10 }).interest).toBe(0);
    expect(calculateSimpleInterest({ principal: 500, annualRatePercent: 10, years: 0 }).totalAmount).toBe(500);
  });
  it("validates through the common engine", () => {
    expect(() => runCalculator(simpleInterestCalculator, { principal: -1, annualRatePercent: 5, years: 1 })).toThrow();
    expect(() => runCalculator(simpleInterestCalculator, { principal: 100, annualRatePercent: 10001, years: 1 })).toThrow();
    expect(runCalculator(simpleInterestCalculator, { principal: 100, annualRatePercent: 10, years: 1 }).output.interest).toBe(10);
  });
  it("rejects unsafe direct inputs", () => {
    expect(() => calculateSimpleInterest({ principal: Number.NaN, annualRatePercent: 5, years: 1 })).toThrow();
    expect(() => calculateSimpleInterest({ principal: 100, annualRatePercent: -1, years: 1 })).toThrow();
    expect(() => calculateSimpleInterest({ principal: 100, annualRatePercent: 5, years: Number.POSITIVE_INFINITY })).toThrow();
  });
  it("keeps global certified metadata and documented example", () => {
    expect(simpleInterestCalculator.category).toBe("finance-investment");
    expect(simpleInterestCalculator.reviewStatus).toBe("certified");
    expect(simpleInterestCalculator.jurisdictions).toEqual([{ country: "GLOBAL" }]);
    expect(simpleInterestCalculator.sources.length).toBeGreaterThan(0);
    expect(simpleInterestCalculator.examples?.[0]?.expected).toEqual({ interest: 1000, totalAmount: 11000 });
  });
});
