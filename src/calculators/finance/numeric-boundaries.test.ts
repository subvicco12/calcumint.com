import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { compoundInterestCalculator } from "./compound-interest";
import { loanPaymentCalculator } from "./loan-payment";

describe("financial numeric boundaries beyond unrounded output guards", () => {
  it("rejects finite compound interest that overflows only during rounding", () => {
    const input = { principal: 1e308, annualRatePercent: -50, years: 10, compoundsPerYear: 1 };
    expect(compoundInterestCalculator.inputSchema.safeParse(input).success).toBe(true);
    expect(() => runCalculator(compoundInterestCalculator, input)).toThrow(/numeric range/);
    expect(() => compoundInterestCalculator.calculate(input, {})).toThrow(/numeric range/);
  });

  it.each([
    { principal: 0 }, { principal: -1 }, { principal: Number.NaN },
    { principal: Number.POSITIVE_INFINITY }, { annualRatePercent: -1 },
    { annualRatePercent: 1000.01 }, { annualRatePercent: Number.POSITIVE_INFINITY },
    { termMonths: 0 }, { termMonths: 1.5 }, { termMonths: 1201 }
  ])("enforces loan schema bounds on a direct call with %o", (override) => {
    const input = { principal: 1000, annualRatePercent: 6, termMonths: 12, ...override };
    expect(loanPaymentCalculator.inputSchema.safeParse(input).success).toBe(false);
    expect(() => loanPaymentCalculator.calculate(input, {})).toThrow();
  });

  it("preserves the loan example and valid schema boundaries on direct calls", () => {
    const example = loanPaymentCalculator.examples[0];
    expect(loanPaymentCalculator.calculate(example.input, {})).toEqual(example.expected);
    for (const input of [
      { principal: 12000, annualRatePercent: 0, termMonths: 1 },
      { principal: 1000, annualRatePercent: 1000, termMonths: 1200 }
    ]) {
      expect(loanPaymentCalculator.calculate(input, {})).toEqual(runCalculator(loanPaymentCalculator, input).output);
      expect(Object.values(loanPaymentCalculator.calculate(input, {})).every(Number.isFinite)).toBe(true);
    }
  });
});
