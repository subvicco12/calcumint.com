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
    // The monthly amount is finite; accumulation across the full term overflows.
    const monthlyPayment = 1e308 * 0.005 / (1 - 1.005 ** -1200);
    expect(Number.isFinite(monthlyPayment)).toBe(true);
    expect(monthlyPayment * 1200).toBe(Number.POSITIVE_INFINITY);
    expect(() => loanPaymentCalculator.calculate({
      principal: 1e308, annualRatePercent: 6, termMonths: 1200
    }, {})).toThrow("Total loan payment exceeds supported numeric range");
  });

  it("fails closed when compound-interest growth exceeds the finite range", () => {
    expect(1e308 * 2 ** 10).toBe(Number.POSITIVE_INFINITY);
    expect(() => compoundInterestCalculator.calculate({
      principal: 1e308, annualRatePercent: 100, years: 10, compoundsPerYear: 1
    }, {})).toThrow("Future value exceeds supported numeric range");
  });

  it("preserves a finite large zero-rate loan without overflowing decimal scaling", () => {
    expect(loanPaymentCalculator.calculate({
      principal: 1e308, annualRatePercent: 0, termMonths: 1200
    }, {})).toEqual({ monthlyPayment: 8.333333333333333e304, totalPayment: 1e308, totalInterest: 0 });
  });

  it("preserves finite large compound-interest losses without overflowing decimal scaling", () => {
    expect(compoundInterestCalculator.calculate({
      principal: 1e308, annualRatePercent: -50, years: 10, compoundsPerYear: 1
    }, {})).toEqual({ futureValue: 9.765625e304, totalInterest: -9.990234375e307 });
  });

  it("rejects nonfinite rounding inputs without changing ordinary rounding", () => {
    expect(() => roundTo(Number.POSITIVE_INFINITY, 2)).toThrow(RangeError);
    expect(() => roundTo(Number.NaN, 2)).toThrow(RangeError);
    expect(roundTo(1.234, 2)).toBe(1.23);
  });
});
