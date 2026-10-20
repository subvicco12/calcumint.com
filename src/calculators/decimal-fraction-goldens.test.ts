import { describe, expect, it } from "vitest";
import { decimalFractionGoldenTests, decimalFractionVectors } from "./decimal-fraction-goldens";
import { getLaunchSpec, launchDefinition } from "./launch-portfolio";
import { calculatorRegistry } from "./registry";
import { runCalculator } from "./engine";

const spec = getLaunchSpec("decimal-to-fraction-calculator")!;
const definition = calculatorRegistry.getBySlug(spec.slug)!;

describe("decimal-to-fraction independent golden contract", () => {
  it("binds the final standard-risk record without changing identity/version/status", () => {
    expect(definition.id).toBe("launch-decimal-to-fraction-calculator");
    expect(definition.version).toBe(1);
    expect(definition.reviewStatus).toBe("certified");
    expect(definition.riskClass).toBe("standard");
    expect(definition.goldenTests).toEqual(decimalFractionGoldenTests);
    expect(launchDefinition(spec).goldenTests).toEqual(decimalFractionGoldenTests);
    expect(decimalFractionVectors).toHaveLength(24);
    expect(new Set(decimalFractionVectors.map(vector => vector.input.precision)).size).toBe(13);
  });
  for (const vector of decimalFractionVectors) {
    it(vector.label, () => {
      const parsed = definition.inputSchema.parse(vector.input);
      for (const context of [{}, { locale: "en-US", currency: "USD" }, { locale: "hi-IN", currency: "INR" }]) {
        const actual = runCalculator(definition, vector.input, context).output as { result: number };
        expect(Object.is(actual.result, vector.expected.result)).toBe(true);
        expect(definition.calculate(parsed, context)).toEqual(vector.expected);
        expect(spec.formatResult?.(vector.input, actual.result)).toBe(vector.fraction);
      }
    });
  }
  it("rejects invalid schema inputs without imposing a safe-integer numerator restriction", () => {
    for (const precision of [-1, 0.5, 13, 309, NaN, Infinity, -Infinity, "2", null, undefined]) {
      expect(() => runCalculator(definition, { decimal: 0.75, precision })).toThrow();
    }
    for (const decimal of [NaN, Infinity, -Infinity, "0.75", null, undefined]) {
      expect(() => runCalculator(definition, { decimal, precision: 2 })).toThrow();
    }
    expect(runCalculator(definition, { decimal: 9008, precision: 12 }).output).toEqual({ result: 9008 });
  });
  it("retains finite-range rejection before calling the UI formatter", () => {
    for (const decimal of [Number.MAX_VALUE, -Number.MAX_VALUE, 1e308, -1e308]) {
      expect(definition.inputSchema.safeParse({ decimal, precision: 2 }).success).toBe(true);
      expect(() => runCalculator(definition, { decimal, precision: 2 })).toThrow("supported finite range");
    }
    const maximum = runCalculator(definition, { decimal: Number.MAX_VALUE, precision: 0 }).output as { result: number };
    expect(maximum.result).toBe(Number.MAX_VALUE);
    expect(spec.formatResult?.({ decimal: Number.MAX_VALUE, precision: 0 }, maximum.result)).toBe("1.7976931348623157e+308/1");
  });
  it("keeps denominator bounds and literal fraction reduction exact within the safe envelope", () => {
    const gcd = (a: bigint, b: bigint): bigint => b === BigInt(0) ? a : gcd(b, a % b);
    for (const vector of decimalFractionVectors) {
      const denominator = 10 ** vector.input.precision;
      expect(Number.isSafeInteger(denominator)).toBe(true);
      expect(denominator).toBeLessThanOrEqual(1e12);
      if (vector.fraction.includes("e")) continue;
      const [numerator, divisor] = vector.fraction.split("/").map(BigInt);
      expect(divisor > BigInt(0)).toBe(true);
      expect(gcd(numerator < BigInt(0) ? -numerator : numerator, divisor)).toBe(BigInt(1));
    }
  });
});
