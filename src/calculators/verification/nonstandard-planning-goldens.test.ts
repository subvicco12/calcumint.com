import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "../registry";
import { runCalculator } from "../engine";

const contracts = [
  ["roi-calculator", "finance.roi"], ["net-worth-calculator", "finance.net-worth"],
  ["inflation-calculator", "finance.inflation"], ["emergency-fund-calculator", "finance.emergency-fund"],
  ["effective-interest-rate-calculator", "finance.rate-conversion"], ["savings-goal-calculator", "finance.savings-goal"],
] as const;

describe("literal planning contract vectors, source and specialist evidence pending", () => {
  for (const [slug, id] of contracts) {
    const definition = calculatorRegistry.getBySlug(slug)!;
    it(`${id}: preserves draft identity and missing source evidence`, () => {
      expect(definition.id).toBe(id);
      expect(definition.version).toBe(1);
      expect(definition.riskClass).toBe("financial");
      expect(definition.reviewStatus).toBe("draft");
      expect(definition.sources).toEqual([]);
      expect(definition.formulas.length).toBeGreaterThan(0);
      expect(definition.goldenTests).toHaveLength(6);
      expect(new Set(definition.goldenTests!.map(vector => JSON.stringify(vector.input))).size).toBe(6);
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
  it("reduces explicit nonstandard record gaps to seven, without approvals", () => {
    const definitions = calculatorRegistry.list();
    expect(definitions).toHaveLength(574);
    expect(definitions.filter(definition => !definition.goldenTests?.length)).toHaveLength(7);
    expect(definitions.filter(definition => definition.riskClass === "standard" && !definition.goldenTests?.length)).toHaveLength(0);
  });
  it("rejects malformed monetary inputs and preserves nullable/boolean results", () => {
    const roi = calculatorRegistry.getBySlug("roi-calculator")!;
    for (const initialInvestment of [0, -1, NaN, Infinity, -Infinity, "100", null]) {
      expect(() => runCalculator(roi, { initialInvestment, finalValue: 100, holdingMonths: 12 })).toThrow();
    }
    const net = calculatorRegistry.getBySlug("net-worth-calculator")!;
    for (const amount of [-1, NaN, Infinity, "100"]) {
      expect(() => runCalculator(net, { assets: [{ name: "cash", amount }], liabilities: [] })).toThrow();
    }
    expect(() => runCalculator(net, { assets: [{ name: " ", amount: 1 }], liabilities: [] })).toThrow();
    for (const slug of ["inflation-calculator", "savings-goal-calculator"]) {
      const definition = calculatorRegistry.getBySlug(slug)!;
      const input = definition.goldenTests![0].input as Record<string, unknown>;
      const key = slug === "inflation-calculator" ? "annualInflationPercent" : "annualReturnPercent";
      for (const value of [-100, NaN, Infinity, 1001]) expect(() => runCalculator(definition, { ...input, [key]: value })).toThrow();
    }
  });
  it("rejects invalid frequency, period and reserve boundaries through authoritative schemas", () => {
    const rate = calculatorRegistry.getBySlug("effective-interest-rate-calculator")!;
    for (const compoundsPerYear of [0, 1.5, 100001, Infinity]) {
      expect(() => runCalculator(rate, { mode: "nominal-to-effective", annualNominalPercent: 10, compoundsPerYear })).toThrow();
    }
    const emergency = calculatorRegistry.getBySlug("emergency-fund-calculator")!;
    for (const targetMonths of [0, 37, NaN, Infinity]) {
      expect(() => runCalculator(emergency, { monthlyEssentialExpenses: 100, targetMonths, currentEmergencySavings: 0 })).toThrow();
    }
    const savings = calculatorRegistry.getBySlug("savings-goal-calculator")!;
    for (const months of [0, 1.5, 1201, Infinity]) {
      expect(() => runCalculator(savings, { currentSavings: 0, targetAmount: 100, annualReturnPercent: 0, months })).toThrow();
    }
  });
});
