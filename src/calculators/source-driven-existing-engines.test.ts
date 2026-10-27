import { describe, expect, it } from "vitest";
import { runCalculator } from "./engine";
import { savingsGoalCalculator } from "./finance/savings-goal";
import { investmentMathCalculator, futureValue, presentValueFromFuture } from "./finance/investment-math";
import { swpCalculator, sustainableMonthlyWithdrawal } from "./finance/swp";
import { loanAnalysisCalculator, maxPrincipalForPayment } from "./finance/loan-analysis";
import { percentageCalculator } from "./core/percentage";

// Component-only witnesses for packet tasks 81/84/85/86/126/468. These synthetic
// rational examples do not bind catalog IDs, approve scope, or accept full products.
// Expected amounts are literals or small rational cash-flow sums, never engine outputs.
describe("source-driven existing components (not catalog acceptance)", () => {
  it.each([
    [0, 100, 0, 3, 300],
    [100, 0, 0, 12, 100],
    [100, 10, 12, 1, 111], // 100*1.01 + deposit after growth
    [100, 10, 12, 2, 122.11], // 101+10, then 112.11+10
    [100, 10, -12, 2, 117.91], // 99+10, then 107.91+10
    [100, 0, 12, 2, 102.01],
    [0, 10, 12, 2, 20.1],
  ])("81 end-month accumulation %j/%j/%j/%j", (currentSavings, monthlyContribution, annualReturnPercent, months, expected) => {
    const output = runCalculator(savingsGoalCalculator, { currentSavings, monthlyContribution, annualReturnPercent, months, targetAmount: 1000 }).output;
    expect(output.futureValue).toBe(expected);
  });
  it.each([
    [100, 400, 0, 3, 100],
    [100, 122.11, 12, 2, 10],
    [100, 100, 12, 2, 0],
  ])("81 inverse contribution %j/%j/%j/%j", (currentSavings, targetAmount, annualReturnPercent, months, expected) => {
    expect(runCalculator(savingsGoalCalculator, { currentSavings, targetAmount, annualReturnPercent, months }).output.requiredMonthlyContribution).toBe(expected);
  });
  it.each([
    [100, 5, 1, 0, 105, 105, 5],
    [100, 10, 1, 10, 110, 100, 0],
    [100, 5, 1, 25, 105, 84, -16],
    [100, 0, 2, 0, 100, 100, 0],
    [100, -10, 2, 0, 81, 81, -10],
    [100, 0, 1, -20, 100, 125, 25],
  ])("84 nominal/real component %j/%j/%j/%j", (presentValue, annualReturnPercent, years, inflationPercent, fv, real, rate) => {
    expect(runCalculator(investmentMathCalculator, { presentValue, annualReturnPercent, years, inflationPercent }).output).toEqual({ futureValue: fv, inflationAdjustedFutureValue: real, realAnnualReturnPercent: rate });
  });
  it("84 exposed zero-period helper boundary (wrapper requires positive years)", () => {
    expect(futureValue(100, 5, 0)).toBe(100);
    expect(presentValueFromFuture(105, 5, 1)).toBe(100);
    expect(() => runCalculator(investmentMathCalculator, { presentValue: 100, annualReturnPercent: 5, years: 0, inflationPercent: 0 })).toThrow();
  });
  it.each([
    [100, 10, 12, 2, "end", 81.91, 20, null], // 101-10=91;91.91-10
    [100, 10, 12, 2, "beginning", 81.71, 20, null], // 90*1.01=90.9;80.9*1.01
    [100, 10, -12, 2, "end", 78.11, 20, null],
    [100, 10, -12, 2, "beginning", 78.31, 20, null],
    [100, 60, 0, 3, "end", 0, 100, 2],
    [100, 60, 0, 3, "beginning", 0, 100, 2],
    [100, 50, 0, 2, "end", 0, 100, 2],
    [100, 0, 12, 2, "end", 102.01, 0, null],
    [100, 110, 12, 1, "end", 0, 101, 1],
    [100, 110, 12, 1, "beginning", 0, 100, 1],
  ] as const)("85/86 deterministic withdrawal %j/%j/%j/%j/%j", (initialCorpus, monthlyWithdrawal, annualReturnPercent, termMonths, withdrawalTiming, endingCorpus, totalWithdrawn, depletionMonth) => {
    expect(runCalculator(swpCalculator, { initialCorpus, monthlyWithdrawal, annualReturnPercent, termMonths, withdrawalTiming }).output).toEqual({ endingCorpus, totalWithdrawn, depletionMonth, depleted: depletionMonth !== null });
  });
  it.each([
    [100, 0, 2, "end", 50], [100, 0, 2, "beginning", 50],
    [100, 12, 1, "end", 101], [100, 12, 1, "beginning", 100],
  ] as const)("85/86 level withdrawal inverse %j/%j/%j/%j", (corpus, rate, months, timing, expected) => {
    expect(sustainableMonthlyWithdrawal(corpus, rate, months, timing)).toBeCloseTo(expected, 9);
  });
  it.each([
    [100, 0, 12, 1200],
    [101, 12, 1, 100], // 101 discounted one month at 1%
    [102.01, 12, 2, 201], // 102.01/1.01 +102.01/1.0201=101+100
    [0, 12, 12, 0],
  ])("468 exposed monthly-payment inverse %j/%j/%j", (payment, rate, months, expected) => {
    expect(maxPrincipalForPayment(payment, rate, months)).toBeCloseTo(expected, 9);
  });
  it("468 actual loan wrapper with independently summed two-month flows", () => {
    const output = runCalculator(loanAnalysisCalculator, { principal: 201, annualRatePercent: 12, termMonths: 2, extraMonthlyPayment: 0 }).output;
    expect(output.scheduledPayment).toBe(102.01);
    expect(output.totalPayment).toBe(204.02);
    expect(output.totalInterest).toBe(3.02);
    expect(output.amortization).toEqual([
      { month: 1, payment: 102.01, principal: 100, interest: 2.01, balance: 101 },
      { month: 2, payment: 102.01, principal: 101, interest: 1.01, balance: 0 },
    ]);
  });
  it.each([[15, 100, 15], [0, 100, 0], [15, 200, 30]])("126 supplied percentage only %j/%j", (percentage, value, expected) => {
    expect(runCalculator(percentageCalculator, { percentage, value }).output.result).toBe(expected);
  });
});
