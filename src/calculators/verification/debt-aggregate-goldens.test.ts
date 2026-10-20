import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "../registry";
import { runCalculator } from "../engine";
import { loanAnalysisCalculator } from "../finance/loan-analysis";

const contracts = [
  ["loan-payment-calculator", "finance.loan-payment", "certified"],
  ["loan-comparison-calculator", "finance.loan-comparison", "draft"],
  ["loan-affordability-calculator", "finance.loan-affordability", "draft"],
] as const;

describe("independent debt aggregate vectors; no financial approval", () => {
  for (const [slug, id, status] of contracts) {
    const definition = calculatorRegistry.getBySlug(slug)!;
    it(`${id}: preserves immutable identity, source gaps and lifecycle flag`, () => {
      expect(definition.id).toBe(id);
      expect(definition.version).toBe(1);
      expect(definition.riskClass).toBe("financial");
      expect(definition.reviewStatus).toBe(status);
      if (status === "draft") expect(definition.sources).toEqual([]);
      else expect(definition.sources[0].url).toContain("consumerfinance.gov");
      expect(definition.goldenTests).toHaveLength(8);
      expect(new Set(definition.goldenTests!.map(vector => JSON.stringify(vector.input))).size).toBe(8);
    });
    for (const vector of definition.goldenTests ?? []) {
      it(`${id}: ${vector.label}`, () => {
        expect(definition.calculate(definition.inputSchema.parse(vector.input), {})).toEqual(vector.expected);
        for (const plan of ["free", "pro", "business"]) {
          const result = runCalculator(definition, { ...vector.input as Record<string, unknown>, plan });
          expect(result.input).not.toHaveProperty("plan");
          expect(result.output).toEqual(vector.expected);
        }
        for (const context of [{ locale: "en-US", currency: "USD" }, { locale: "de-DE", currency: "EUR" }]) {
          expect(runCalculator(definition, vector.input, context).output).toEqual(vector.expected);
        }
      });
    }
  }
  it("asserts exactly two remaining records separately from approvals", () => {
    const definitions = calculatorRegistry.list();
    expect(definitions).toHaveLength(574);
    expect(definitions.filter(definition => !definition.goldenTests?.length).map(definition => definition.id).sort()).toEqual([
      "finance.mortgage", "health.bmi",
    ]);
    expect(definitions.filter(definition => definition.riskClass === "standard" && !definition.goldenTests?.length)).toHaveLength(0);
  });
  it("does not inherit Loan Payment golden evidence into Mortgage", () => {
    const payment = calculatorRegistry.getBySlug("loan-payment-calculator")!;
    const mortgage = calculatorRegistry.getBySlug("mortgage-payment")!;
    expect(mortgage.goldenTests).toBeUndefined();
    expect(mortgage.calculate).toBe(payment.calculate);
    expect(mortgage.inputSchema).toBe(payment.inputSchema);
    expect(mortgage.id).toBe("finance.mortgage");
    expect(mortgage.version).toBe(1);
    expect(mortgage.sources).toHaveLength(2);
  });
  it("preserves the different registered aggregate rounding policies", () => {
    const payment = calculatorRegistry.getBySlug("loan-payment-calculator")!;
    expect(runCalculator(payment, { principal: 100, annualRatePercent: 0, termMonths: 3 }).output)
      .toEqual({ monthlyPayment: 33.33, totalPayment: 99.99, totalInterest: -0.01 });
    const comparison = calculatorRegistry.getBySlug("loan-comparison-calculator")!;
    const loan = { principal: 100, annualRatePercent: 0, termMonths: 3 };
    expect(runCalculator(comparison, { loanA: loan, loanB: loan }).output).toEqual({
      loanA: { monthlyPayment: 33.33, totalInterest: 0, upfrontCosts: 0, totalCost: 100 },
      loanB: { monthlyPayment: 33.33, totalInterest: 0, upfrontCosts: 0, totalCost: 100 },
      monthlyPaymentDifference: 0, totalCostDifference: 0, lowerMonthlyPayment: "equal", lowerTotalCost: "equal",
    });
  });
  it("checks a two-period amortization identity without defining Mortgage rules", () => {
    // Independent recurrence:201 +2.01 -102.01 =101;101 +1.01 -102.01 =0.
    const result = runCalculator(loanAnalysisCalculator, { principal: 201, annualRatePercent: 12, termMonths: 2 });
    expect(result.output).toEqual({ monthlyPayment: 102.01, scheduledPayment: 102.01, totalPayment: 204.02, totalInterest: 3.02,
      payoffMonths: 2, interestSavedVsScheduled: 0, monthsSavedVsScheduled: 0,
      amortization: [{ month: 1, payment: 102.01, principal: 100, interest: 2.01, balance: 101 },
        { month: 2, payment: 102.01, principal: 101, interest: 1.01, balance: 0 }] });
  });
  it("rejects invalid schema inputs without changing separately owned direct-call hardening", () => {
    const payment = calculatorRegistry.getBySlug("loan-payment-calculator")!;
    for (const principal of [0, -1, NaN, Infinity, -Infinity, "100", null]) {
      expect(() => runCalculator(payment, { principal, annualRatePercent: 0, termMonths: 1 })).toThrow();
    }
    for (const annualRatePercent of [-1, 1001, NaN, Infinity]) {
      expect(() => runCalculator(payment, { principal: 100, annualRatePercent, termMonths: 1 })).toThrow();
    }
    for (const termMonths of [0, 1.5, 1201, Infinity]) {
      expect(() => runCalculator(payment, { principal: 100, annualRatePercent: 0, termMonths })).toThrow();
    }
    const comparison = calculatorRegistry.getBySlug("loan-comparison-calculator")!;
    const loan = { principal: 100, annualRatePercent: 0, termMonths: 1 };
    for (const upfrontCosts of [-1, NaN, Infinity]) {
      expect(() => runCalculator(comparison, { loanA: { ...loan, upfrontCosts }, loanB: loan })).toThrow();
    }
    const affordability = calculatorRegistry.getBySlug("loan-affordability-calculator")!;
    const input = { grossMonthlyIncome: 1000, targetDtiPercent: 20, annualRatePercent: 0, termMonths: 10 };
    for (const targetDtiPercent of [0, 101, NaN, Infinity]) expect(() => runCalculator(affordability, { ...input, targetDtiPercent })).toThrow();
    for (const grossMonthlyIncome of [0, -1, NaN, Infinity]) expect(() => runCalculator(affordability, { ...input, grossMonthlyIncome })).toThrow();
    for (const value of [-1, NaN, Infinity]) {
      expect(() => runCalculator(affordability, { ...input, existingMonthlyDebt: value })).toThrow();
      expect(() => runCalculator(affordability, { ...input, downPayment: value })).toThrow();
    }
  });
});
