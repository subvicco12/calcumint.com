import { describe, expect, it } from "vitest";
import { loanPaymentCalculator } from "./loan-payment";
import { compoundInterestCalculator } from "./compound-interest";
import { roundTo } from "../precision";

describe("financial direct-call safety", () => {
  const validLoan = { principal: 100000, annualRatePercent: 6, termMonths: 360 };

  it("preserves the documented finite loan golden output", () => {
    expect(loanPaymentCalculator.calculate(validLoan, {})).toEqual({
      monthlyPayment: 599.55,
      totalPayment: 215838,
      totalInterest: 115838
    });
  });

  it("rejects direct loan calls that violate the declared schema", () => {
    for (const input of [
      { ...validLoan, annualRatePercent: -1 },
      { ...validLoan, annualRatePercent: 1001 },
      { ...validLoan, termMonths: 0 },
      { ...validLoan, termMonths: 1201 },
      { ...validLoan, termMonths: 12.5 },
      { ...validLoan, principal: Number.NaN }
    ]) {
      expect(() => loanPaymentCalculator.calculate(input, {})).toThrow();
    }
  });

  it("fails closed when a schema-valid loan produces a nonfinite total", () => {
    expect(() => loanPaymentCalculator.calculate({
      principal: 1e308, annualRatePercent: 0, termMonths: 1200
    }, {})).toThrow();
  });

  it("fails closed on extreme compound-interest rounding and interest", () => {
    expect(() => compoundInterestCalculator.calculate({
      principal: 1e308, annualRatePercent: -50, years: 10, compoundsPerYear: 1
    }, {})).toThrow();
  });

  it("rejects nonfinite rounding inputs without changing ordinary rounding", () => {
    expect(() => roundTo(Number.POSITIVE_INFINITY, 2)).toThrow(RangeError);
    expect(() => roundTo(Number.NaN, 2)).toThrow(RangeError);
    expect(roundTo(1.234, 2)).toBe(1.23);
  });
});
