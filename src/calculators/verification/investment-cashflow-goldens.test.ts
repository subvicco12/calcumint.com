import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "../registry";
import { runCalculator } from "../engine";
import { requiredInitialStepUpSip } from "../finance/step-up-sip";
import { cagr, presentValueFromFuture } from "../finance/investment-math";
import { sustainableMonthlyWithdrawal } from "../finance/swp";

const contracts = [
  ["step-up-sip-calculator", "finance.step-up-sip", 10],
  ["investment-growth-calculator", "finance.investment-math", 8],
  ["swp-calculator", "finance.swp", 10],
] as const;

describe("independent investment cash-flow golden contracts; specialist approval not granted", () => {
  for (const [slug, id, count] of contracts) {
    const definition = calculatorRegistry.getBySlug(slug)!;
    it(`${id}: preserves identity and inherited status with distinct literal inputs`, () => {
      expect(definition.id).toBe(id);
      expect(definition.version).toBe(1);
      expect(definition.riskClass).toBe("financial");
      expect(definition.reviewStatus).toBe("certified"); // unchanged code flag, not a new approval
      expect(definition.sources.every(source => source.url?.startsWith("https://www.investor.gov/"))).toBe(true);
      expect(definition.sources.length).toBeGreaterThan(0);
      expect(definition.goldenTests).toHaveLength(count);
      expect(new Set(definition.goldenTests!.map(vector => JSON.stringify(vector.input))).size).toBe(count);
    });
    for (const vector of definition.goldenTests ?? []) {
      it(`${id}: ${vector.label}`, () => {
        expect(definition.calculate(definition.inputSchema.parse(vector.input), {})).toEqual(vector.expected);
        for (const plan of ["free", "pro", "business"]) {
          const run = runCalculator(definition, { ...vector.input as Record<string, unknown>, plan });
          expect(run.input).not.toHaveProperty("plan");
          expect(run.output).toEqual(vector.expected);
        }
        for (const context of [{ locale: "en-US", currency: "USD" }, { locale: "de-DE", currency: "EUR" }]) {
          expect(runCalculator(definition, vector.input, context).output).toEqual(vector.expected);
        }
      });
    }
    it(`${id}: rejects nonfinite, negative or missing capital`, () => {
      const input = definition.goldenTests![0].input as Record<string, unknown>;
      const key = slug === "step-up-sip-calculator" ? "initialMonthlyContribution" : slug === "swp-calculator" ? "initialCorpus" : "presentValue";
      for (const value of [undefined, null, "100", 0, -1, NaN, Infinity, -Infinity]) {
        expect(() => runCalculator(definition, { ...input, [key]: value })).toThrow();
      }
      for (const annualReturnPercent of [-100, 1001, NaN, Infinity]) {
        expect(() => runCalculator(definition, { ...input, annualReturnPercent })).toThrow();
      }
    });
  }
  it("retains two remaining gaps without implying certification", () => {
    const definitions = calculatorRegistry.list();
    expect(definitions).toHaveLength(574);
    expect(definitions.filter(definition => !definition.goldenTests?.length).map(definition => definition.id).sort()).toEqual([
      "finance.mortgage", "health.bmi",
    ]);
    expect(definitions.filter(definition => definition.riskClass === "standard" && !definition.goldenTests?.length)).toHaveLength(0);
  });
  it("independently verifies exact zero-return reverse contracts and square-root CAGR", () => {
    expect(requiredInitialStepUpSip(1310, 10, 0, 13, "end")).toBe(100);
    expect(presentValueFromFuture(121, 10, 2)).toBeCloseTo(100, 12);
    expect(cagr(100, 121, 2)).toBeCloseTo(10, 12);
    expect(sustainableMonthlyWithdrawal(100, 0, 4, "end")).toBe(25);
    expect(sustainableMonthlyWithdrawal(100, 0, 4, "beginning")).toBe(25);
  });
  it("preserves default timing and rejects invalid timing, step-up, periods and inflation", () => {
    const step = calculatorRegistry.getBySlug("step-up-sip-calculator")!;
    const input = { initialMonthlyContribution: 100, annualStepUpPercent: 10, annualReturnPercent: 12, termMonths: 2 };
    expect(runCalculator(step, input).output).toEqual({ futureValue: 203.01, investedAmount: 200, estimatedGain: 3.01, finalMonthlyContribution: 100 });
    for (const annualStepUpPercent of [-1, 1001, NaN, Infinity]) expect(() => runCalculator(step, { ...input, annualStepUpPercent })).toThrow();
    for (const termMonths of [0, 1.5, 1201, Infinity]) {
      expect(() => runCalculator(step, { ...input, termMonths })).toThrow();
      expect(() => runCalculator(calculatorRegistry.getBySlug("swp-calculator")!, { initialCorpus: 100, monthlyWithdrawal: 10, annualReturnPercent: 0, termMonths })).toThrow();
    }
    expect(() => runCalculator(step, { ...input, contributionTiming: "middle" })).toThrow();
    const swp = calculatorRegistry.getBySlug("swp-calculator")!;
    expect(runCalculator(swp, { initialCorpus: 100, monthlyWithdrawal: 10, annualReturnPercent: 12, termMonths: 2 }).output)
      .toEqual({ endingCorpus: 81.91, totalWithdrawn: 20, depleted: false, depletionMonth: null });
    expect(() => runCalculator(swp, { initialCorpus: 100, monthlyWithdrawal: -1, annualReturnPercent: 0, termMonths: 1 })).toThrow();
    expect(() => runCalculator(swp, { initialCorpus: 100, monthlyWithdrawal: 10, annualReturnPercent: 0, termMonths: 1, withdrawalTiming: "middle" })).toThrow();
    const investment = calculatorRegistry.getBySlug("investment-growth-calculator")!;
    for (const inflationPercent of [-100, 1001, NaN, Infinity]) expect(() => runCalculator(investment, { presentValue: 100, annualReturnPercent: 0, years: 1, inflationPercent })).toThrow();
    for (const years of [0, -1, 201, Infinity]) expect(() => runCalculator(investment, { presentValue: 100, annualReturnPercent: 0, years })).toThrow();
  });
});
