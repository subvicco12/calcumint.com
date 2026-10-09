import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { loanPaymentCalculator } from "./loan-payment";

describe("loan payment numeric safety", () => {
  it("preserves the documented fixed-rate example", () => {
    expect(runCalculator(loanPaymentCalculator, { principal: 100000, annualRatePercent: 6, termMonths: 360 }).output)
      .toEqual({ monthlyPayment: 599.55, totalPayment: 215838, totalInterest: 115838 });
  });

  it("preserves the zero-interest repayment case", () => {
    expect(runCalculator(loanPaymentCalculator, { principal: 12000, annualRatePercent: 0, termMonths: 12 }).output)
      .toEqual({ monthlyPayment: 1000, totalPayment: 12000, totalInterest: 0 });
  });

  it("rejects a finite principal whose total payment overflows", () => {
    expect(() => runCalculator(loanPaymentCalculator, { principal: 1e308, annualRatePercent: 1000, termMonths: 1200 }))
      .toThrow(/supported numeric range/);
  });

  it("rejects invalid direct inputs via the common calculator engine", () => {
    expect(() => runCalculator(loanPaymentCalculator, { principal: Number.POSITIVE_INFINITY, annualRatePercent: 6, termMonths: 360 })).toThrow();
    expect(() => runCalculator(loanPaymentCalculator, { principal: 1000, annualRatePercent: -1, termMonths: 12 })).toThrow();
  });
});
