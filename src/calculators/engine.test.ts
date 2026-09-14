import { describe, expect, it } from "vitest";
import { runCalculator } from "./engine";
import { calculatorRegistry } from "./registry";
import { percentageCalculator } from "./core/percentage";
import { compoundInterestCalculator } from "./finance/compound-interest";
import { loanPaymentCalculator } from "./finance/loan-payment";
import { CalculatorValidationError } from "./types";

describe("calculator engine", () => {
  it("runs validated calculator definitions", () => {
    const run = runCalculator(percentageCalculator, { percentage: 20, value: 250 });
    expect(run.output).toEqual({ result: 50 });
    expect(run.version).toBe(1);
  });

  it("rejects invalid input before calculate()", () => {
    expect(() => runCalculator(loanPaymentCalculator, { principal: -1, annualRatePercent: 5, termMonths: 12 }))
      .toThrow(CalculatorValidationError);
  });

  it("matches compound-interest golden vector", () => {
    const run = runCalculator(compoundInterestCalculator, {
      principal: 10000,
      annualRatePercent: 5,
      years: 10,
      compoundsPerYear: 12
    });
    expect(run.output).toEqual({ futureValue: 16470.09, totalInterest: 6470.09 });
  });

  it("handles zero-interest loans", () => {
    const run = runCalculator(loanPaymentCalculator, {
      principal: 12000,
      annualRatePercent: 0,
      termMonths: 12
    });
    expect(run.output).toEqual({ monthlyPayment: 1000, totalPayment: 12000, totalInterest: 0 });
  });

  it("registers unique calculators", () => {
    expect(calculatorRegistry.list()).toHaveLength(4);
    expect(calculatorRegistry.getBySlug("loan-payment-calculator")?.id).toBe("finance.loan-payment");
  });
});
