import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "../registry";
import { runCalculator } from "../engine";

const contracts = [
  ["loan-emi-calculator", "finance.loan-analysis", 6, "certified"],
  ["loan-prepayment-calculator", "finance.loan-prepayment", 6, "draft"],
  ["loan-refinance-calculator", "finance.loan-refinance", 6, "draft"],
  ["debt-payoff-calculator", "finance.debt-payoff", 8, "draft"],
  ["credit-card-payoff-calculator", "finance.credit-card-payoff", 8, "draft"],
] as const;

describe("literal debt payoff evidence; financial approval remains separate", () => {
  for (const [slug, id, count, status] of contracts) {
    const definition = calculatorRegistry.getBySlug(slug)!;
    it(`${id}: preserves identity, source gaps and inherited lifecycle`, () => {
      expect(definition.id).toBe(id);
      expect(definition.version).toBe(1);
      expect(definition.riskClass).toBe("financial");
      expect(definition.reviewStatus).toBe(status);
      if (definition.id === "finance.loan-refinance" || definition.id === "finance.loan-prepayment") {
        expect(definition.sources.length).toBeGreaterThan(0);
        expect(definition.sources.every(source => source.url?.startsWith("https://") && source.note?.includes("pending"))).toBe(true);
      } else if (status === "draft") {
        expect(definition.sources.length).toBeGreaterThan(0);
        expect(definition.sources.every(source => !source.url && source.label.startsWith("Internal") && source.note?.includes("not external"))).toBe(true);
      }
      else expect(definition.sources.length).toBeGreaterThan(0);
      expect(definition.goldenTests).toHaveLength(count);
      expect(new Set(definition.goldenTests!.map(vector => JSON.stringify(vector.input))).size).toBe(count);
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
  it("leaves exactly Mortgage and BMI missing without inheriting unrelated evidence", () => {
    const definitions = calculatorRegistry.list();
    expect(definitions).toHaveLength(574);
    expect(definitions.filter(definition => !definition.goldenTests?.length).map(definition => definition.id).sort())
      .toEqual(["finance.mortgage", "health.bmi"]);
    expect(definitions.filter(definition => definition.riskClass === "standard" && !definition.goldenTests?.length)).toHaveLength(0);
    expect(calculatorRegistry.getBySlug("mortgage-payment")!.goldenTests).toBeUndefined();
  });
  it("rejects invalid loan inputs and recovers on the next valid calculation", () => {
    for (const slug of ["loan-emi-calculator", "loan-prepayment-calculator", "loan-refinance-calculator"]) {
      const definition = calculatorRegistry.getBySlug(slug)!;
      const valid = definition.goldenTests![0];
      const key = slug === "loan-refinance-calculator" ? "remainingBalance" : "principal";
      for (const value of [0, -1, NaN, Infinity, "100", null]) {
        expect(() => runCalculator(definition, { ...valid.input as Record<string, unknown>, [key]: value })).toThrow();
      }
      expect(runCalculator(definition, valid.input).output).toEqual(valid.expected);
    }
    const prepayment = calculatorRegistry.getBySlug("loan-prepayment-calculator")!;
    const valid = prepayment.goldenTests![0].input as Record<string, unknown>;
    for (const paymentsMade of [-1, 1.5, valid.originalTermMonths, 1200, Infinity]) {
      expect(() => runCalculator(prepayment, { ...valid, paymentsMade })).toThrow();
    }
    for (const fee of [-1, NaN, Infinity]) expect(() => runCalculator(prepayment, { ...valid, prepaymentFee: fee })).toThrow();
  });
  it("rejects unsupported strategies, duplicate names and non-amortizing budgets", () => {
    const debt = calculatorRegistry.getBySlug("debt-payoff-calculator")!;
    const base = { debts: [{ name: "A", balance: 100, annualRatePercent: 12, minimumPayment: 1 }], extraMonthlyPayment: 0, strategy: "avalanche" };
    expect(() => runCalculator(debt, base)).toThrow(/does not reduce/);
    expect(() => runCalculator(debt, { ...base, strategy: "unknown" })).toThrow();
    expect(() => runCalculator(debt, { ...base, debts: [...base.debts, { ...base.debts[0], name: " a " }] })).toThrow();
    expect(() => runCalculator(debt, { ...base, debts: [] })).toThrow();
    const credit = calculatorRegistry.getBySlug("credit-card-payoff-calculator")!;
    expect(() => runCalculator(credit, { balance: 100, annualAprPercent: 12, monthlyPayment: 1 })).toThrow(/does not amortize/);
    for (const extraMonthlyPayment of [-1, NaN, Infinity]) expect(() => runCalculator(credit, { balance: 100, annualAprPercent: 0, monthlyPayment: 25, extraMonthlyPayment })).toThrow();
    expect(runCalculator(debt, debt.goldenTests![0].input).output).toEqual(debt.goldenTests![0].expected);
    expect(runCalculator(credit, credit.goldenTests![0].input).output).toEqual(credit.goldenTests![0].expected);
  });
  it("preserves terminal and horizon contracts without new financial rules", () => {
    const analysis = calculatorRegistry.getBySlug("loan-emi-calculator")!;
    const result = runCalculator(analysis, { principal: 1200, annualRatePercent: 0, termMonths: 1200 }).output as { amortization: { balance: number }[]; totalPayment: number; totalInterest: number };
    expect(result.amortization).toHaveLength(1200);
    expect(result.amortization[1199].balance).toBe(0);
    expect(result.totalPayment).toBe(1200);
    expect(result.totalInterest).toBe(0);
    expect(() => runCalculator(analysis, { principal: 100, annualRatePercent: 0, termMonths: 1201 })).toThrow();
    const debt = calculatorRegistry.getBySlug("debt-payoff-calculator")!;
    expect(() => runCalculator(debt, { debts: [{ name: "A", balance: 1201, annualRatePercent: 0, minimumPayment: 1 }] })).toThrow(/1200-month/);
    const credit = calculatorRegistry.getBySlug("credit-card-payoff-calculator")!;
    expect(() => runCalculator(credit, { balance: 2401, annualAprPercent: 0, monthlyPayment: 1 })).toThrow(/2400-month/);
  });
});
