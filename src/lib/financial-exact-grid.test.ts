import { describe, expect, it } from "vitest";
import { roundTo, type RoundingMode } from "../calculators/precision";
import { compoundInterestCalculator } from "../calculators/finance/compound-interest";
import { loanPaymentCalculator } from "../calculators/finance/loan-payment";
import { financialExactGridTechnicalRevision, roundFinancialExactGridCandidate } from "./financial-exact-grid";

const modes: RoundingMode[] = ["half-away-from-zero", "floor", "ceil", "truncate"];

describe("standalone experimental exact-grid financial candidate", () => {
  it("labels its private technical revision without registering a calculator version", () => {
    expect(financialExactGridTechnicalRevision).toBe("private-exact-grid-candidate-1");
  });

  it("preserves independently exact quarter-dollar identities in formula harnesses", () => {
    // 1/4 = 25/100 exactly: zero years and a zero-rate one-month loan preserve P.
    const principal = 12000000000000.25;
    const futureValue = roundFinancialExactGridCandidate(principal * (1 + .05 / 12) ** (12 * 0), 2);
    expect(futureValue).toBe(12000000000000.25);
    expect(roundFinancialExactGridCandidate(futureValue - principal, 2)).toBe(0);
    const payment = roundFinancialExactGridCandidate(principal / 1, 2);
    expect(payment).toBe(12000000000000.25);
    expect(roundFinancialExactGridCandidate(payment * 1 - principal, 2)).toBe(0);
  });

  it("leaves the registered v1 calculators and their historical behavior unchanged", () => {
    expect(compoundInterestCalculator.version).toBe(1);
    expect(loanPaymentCalculator.version).toBe(1);
    expect(compoundInterestCalculator.calculate({principal:12000000000000.25,annualRatePercent:5,years:0,compoundsPerYear:12}, {})).toEqual({futureValue:12000000000000.26,totalInterest:.01});
    expect(loanPaymentCalculator.calculate({principal:12000000000000.25,annualRatePercent:0,termMonths:1}, {})).toEqual({monthlyPayment:12000000000000.26,totalPayment:12000000000000.27,totalInterest:.02});
  });

  it("preserves signed exact dyadic grid points for every supported precision and mode", () => {
    for (let digits = 0; digits <= 12; digits++) {
      // 2^-digits * 10^digits = 5^digits, an integer, without float scaling as proof.
      const largeGridPoint = 12000000000000 + 2 ** -Math.min(digits, 2);
      for (const value of [2 ** -digits, -(2 ** -digits), largeGridPoint, -largeGridPoint, Number.MAX_VALUE, -Number.MAX_VALUE]) {
        for (const mode of modes) expect(roundFinancialExactGridCandidate(value, digits, mode)).toBe(value);
      }
    }
  });

  it("uses legacy rounding for off-grid dyadics, ties, subnormals and misleading double scaling", () => {
    // This exact double is 45035996273704 + 123/128; double scaling rounds to an integer.
    const misleading = 45035996273704.96;
    expect(Number.isInteger(misleading * 100)).toBe(true);
    // Reduced dyadic denominator exponents, independently checked as exact fractions.
    const offGridCases = [[1.005, 50],[-1.005, 50],[1.234, 49],[-1.234, 49],[misleading, 7],[-misleading, 7],[.125, 3],[-.125, 3],[Number.MIN_VALUE, 1074],[-Number.MIN_VALUE, 1074]];
    for (const [value, exactGridDigits] of offGridCases) {
      for (let digits = 0; digits < Math.min(13, exactGridDigits); digits++) {
        for (const mode of modes) expect(roundFinancialExactGridCandidate(value, digits, mode)).toBe(roundTo(value, digits, mode));
      }
    }
    expect(roundFinancialExactGridCandidate(1.005, 2)).toBe(1.01);
    expect(roundFinancialExactGridCandidate(-1.005, 2)).toBe(-1.01);
  });

  it("preserves validation and negative-zero normalization", () => {
    for (const mode of modes) {
      for (const value of [NaN,Infinity,-Infinity]) expect(() => roundFinancialExactGridCandidate(value, 2, mode)).toThrow(RangeError);
      expect(Object.is(roundFinancialExactGridCandidate(-0, 2, mode), -0)).toBe(false);
      for (const digits of [-1,13,.5,NaN,Infinity]) expect(() => roundFinancialExactGridCandidate(1, digits, mode)).toThrow(RangeError);
    }
  });
});
