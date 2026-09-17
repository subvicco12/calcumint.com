import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { loanAnalysisCalculator, maxPrincipalForPayment, paymentForLoan } from "./loan-analysis";

describe("loan EMI analysis", () => {
  it("matches the standard amortizing payment formula", () => {
    expect(paymentForLoan(100000, 6, 360)).toBeCloseTo(599.5505, 3);
  });

  it("handles zero-interest loans", () => {
    expect(paymentForLoan(12000, 0, 12)).toBe(1000);
    expect(maxPrincipalForPayment(1000, 0, 12)).toBe(12000);
  });

  it("reverse-solves principal from a target payment", () => {
    const payment = paymentForLoan(500000, 8.5, 240);
    expect(maxPrincipalForPayment(payment, 8.5, 240)).toBeCloseTo(500000, 5);
  });

  it("produces a complete amortization schedule ending at zero", () => {
    const result = loanAnalysisCalculator.calculate({ principal: 100000, annualRatePercent: 6, termMonths: 360, extraMonthlyPayment: 0 }, {});
    expect(result.scheduledPayment).toBe(599.55);
    expect(result.amortization).toHaveLength(360);
    expect(result.amortization.at(-1)?.balance).toBe(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it("extra payments reduce interest and payoff time", () => {
    const base = loanAnalysisCalculator.calculate({ principal: 250000, annualRatePercent: 7, termMonths: 360, extraMonthlyPayment: 0 }, {});
    const accelerated = loanAnalysisCalculator.calculate({ principal: 250000, annualRatePercent: 7, termMonths: 360, extraMonthlyPayment: 300 }, {});
    expect(accelerated.payoffMonths).toBeLessThan(base.payoffMonths);
    expect(accelerated.totalInterest).toBeLessThan(base.totalInterest);
    expect(accelerated.interestSavedVsScheduled).toBeGreaterThan(0);
    expect(accelerated.monthsSavedVsScheduled).toBeGreaterThan(0);
  });
  it("rejects invalid direct solver inputs and validates through the common engine", () => {
    expect(() => paymentForLoan(1000, -1, 12)).toThrow(/rate/);
    expect(() => paymentForLoan(1000, 5, 12.5)).toThrow(/integer/);
    expect(maxPrincipalForPayment(-1, 5, 12)).toBe(0);
    expect(() => runCalculator(loanAnalysisCalculator, { principal: 0, annualRatePercent: 5, termMonths: 12, extraMonthlyPayment: 0 })).toThrow();
  });
});
