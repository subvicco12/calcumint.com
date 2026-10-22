import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { mortgageCalculator } from "../finance/mortgage";
import { bmiCalculator } from "../health/bmi";
import { bmiArithmeticVectors, mortgageArithmeticVectors } from "./fixtures/pending-specialist-arithmetic";

const contexts = [
  { locale: "en-US", currency: "USD", unitSystem: "metric" as const },
  { locale: "de-DE", currency: "EUR", unitSystem: "us" as const },
];

describe("pending-specialist arithmetic evidence, not approval or registered goldens", () => {
  for (const vector of mortgageArithmeticVectors) {
    it(`Mortgage: ${vector.label}`, () => {
      expect(mortgageCalculator.calculate(mortgageCalculator.inputSchema.parse(vector.input), {})).toEqual(vector.expected);
      for (const context of contexts) for (const plan of ["free", "pro", "business"]) {
        const result = runCalculator(mortgageCalculator, { ...vector.input, plan }, context);
        expect(result.input).not.toHaveProperty("plan");
        expect(result.output).toEqual(vector.expected);
        expect(result.version).toBe(1);
      }
    });
  }
  for (const vector of bmiArithmeticVectors) {
    it(`BMI numeric field only: ${vector.label}`, () => {
      // Exact positive rational oracle: floor(10*p/q + 1/2)/10.
      // It does not invoke the engine's floating-point roundTo utility.
      const p = BigInt(vector.exactRatio[0]), q = BigInt(vector.exactRatio[1]);
      const independentlyRounded = Number((20n * p + q) / (2n * q)) / 10;
      expect(independentlyRounded).toBe(vector.expectedBmi);
      expect(bmiCalculator.calculate(bmiCalculator.inputSchema.parse(vector.input), {}).bmi).toBe(vector.expectedBmi);
      for (const context of contexts) for (const plan of ["free", "pro", "business"]) {
        const result = runCalculator(bmiCalculator, { ...vector.input, plan }, context);
        expect(result.input).not.toHaveProperty("plan");
        expect(result.output.bmi).toBe(vector.expectedBmi);
        // Classification is preserved across plans, not clinically approved.
        expect(result.output).toEqual(runCalculator(bmiCalculator, vector.input).output);
      }
    });
  }
  it.each([
    { principal: 0, annualRatePercent: 0, termMonths: 1 },
    { principal: -1, annualRatePercent: 0, termMonths: 1 },
    { principal: Infinity, annualRatePercent: 0, termMonths: 1 },
    { principal: 100, annualRatePercent: -1, termMonths: 1 },
    { principal: 100, annualRatePercent: 1000.01, termMonths: 1 },
    { principal: 100, annualRatePercent: 0, termMonths: 0 },
    { principal: 100, annualRatePercent: 0, termMonths: 1.5 },
    { principal: 100, annualRatePercent: 0, termMonths: 1201 },
  ])("rejects invalid Mortgage schema input before calculation: %j", input => {
    expect(() => runCalculator(mortgageCalculator, input)).toThrow();
  });
  it.each([
    { weightKg: 0, heightCm: 100 }, { weightKg: 1000.1, heightCm: 100 },
    { weightKg: 50, heightCm: 0 }, { weightKg: 50, heightCm: 300.1 },
    { weightKg: NaN, heightCm: 175 }, { weightKg: 50, heightCm: Infinity },
  ])("rejects invalid BMI schema input: %j", input => {
    expect(() => runCalculator(bmiCalculator, input)).toThrow();
  });
  it("does not expose nonfinite BMI from positive height underflow", () => {
    const input = { weightKg: 50, heightCm: Number.MIN_VALUE };
    expect(bmiCalculator.inputSchema.safeParse(input).success).toBe(true);
    expect(() => runCalculator(bmiCalculator, input)).toThrow(RangeError);
  });
  it.each([
    { principal: 100, annualRatePercent: 1e-300, termMonths: 360 },
    { principal: Number.MAX_VALUE, annualRatePercent: 1000, termMonths: 1200 },
  ])("rejects finite-input Mortgage numerical failure without changing its formula: %j", input => {
    expect(mortgageCalculator.inputSchema.safeParse(input).success).toBe(true);
    expect(() => runCalculator(mortgageCalculator, input)).toThrow(RangeError);
  });
  it("keeps evidence scopes and pending record gaps distinct", () => {
    expect(mortgageCalculator.goldenTests).toBeUndefined();
    expect(bmiCalculator.goldenTests).toBeUndefined();
    expect(bmiCalculator.reviewStatus).toBe("draft");
    expect(mortgageCalculator.sources.every(source => source.url?.includes("consumerfinance.gov"))).toBe(true);
    expect(bmiCalculator.sources[0].url).toContain("who.int");
    expect(new Set(mortgageArithmeticVectors.map(vector => JSON.stringify(vector.input))).size).toBe(8);
    expect(new Set(bmiArithmeticVectors.map(vector => JSON.stringify(vector.input))).size).toBe(10);
  });
});
