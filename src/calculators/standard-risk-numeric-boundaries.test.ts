import { describe, expect, it } from "vitest";
import { percentageCalculator } from "./core/percentage";
import { unitConversionCalculator } from "./core/unit-conversion";
import { breakEvenCalculator } from "./business/break-even";
import { runCalculator } from "./engine";
import type { CalculatorDefinition } from "./types";
import { roundTo, type RoundingMode } from "./precision";
import { convertUnit } from "./units";
import { getLaunchSpec, launchDefinition } from "./launch-portfolio";

describe("finite integer rounding boundaries", () => {
  for (const mode of ["half-away-from-zero", "floor", "ceil", "truncate"] satisfies RoundingMode[]) {
    it.each([0, 2, 12])(`preserves large integral values with ${mode} at %i places`, digits => {
      for (const value of [1e20, -1e20, 1e308, -1e308, Number.MAX_VALUE, -Number.MAX_VALUE]) {
        expect(roundTo(value, digits, mode)).toBe(value);
      }
    });
  }
  it("retains tie rules, directed rounding, zero and precision validation", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(-1.005, 2)).toBe(-1.01);
    expect(roundTo(-1.239, 2, "floor")).toBe(-1.24);
    expect(roundTo(-1.239, 2, "ceil")).toBe(-1.23);
    expect(roundTo(-1.239, 2, "truncate")).toBe(-1.23);
    expect(Object.is(roundTo(-0, 12), 0)).toBe(true);
    for (const digits of [-1, 1.5, 13, Infinity]) expect(() => roundTo(1e308, digits)).toThrow(RangeError);
    for (const value of [NaN, Infinity, -Infinity]) expect(() => roundTo(value, 2)).toThrow(RangeError);
  });
});

describe("remaining core engine finite-result contracts", () => {
  it.each([1e308, -1e308])("preserves 100 percent of %s", value => {
    expect(runCalculator(percentageCalculator, { percentage: 100, value }).output.result).toBe(value);
    expect(percentageCalculator.calculate({ percentage: 100, value }, {}).result).toBe(value);
  });
  it("rejects truly unrepresentable percentage results", () => {
    expect(() => runCalculator(percentageCalculator, { percentage: 200, value: Number.MAX_VALUE })).toThrow();
  });
  it("preserves the same unit exactly without overflowing or temperature cancellation", () => {
    for (const unit of ["m", "km", "m3", "c", "f", "k"]) {
      for (const value of [1e308, -1e308, 1e-12]) expect(convertUnit(value, unit, unit)).toBe(value);
      expect(runCalculator(unitConversionCalculator, { value: 1e308, fromUnit: unit, toUnit: unit }).output.result).toBe(1e308);
    }
  });
  it("balances a representable linear conversion without changing ordinary factors", () => {
    const result = convertUnit(1e308, "km", "mi");
    // Exact international mile: 1609.344m; 1000/1609.344 miles per km.
    expect(Number.isFinite(result)).toBe(true);
    expect(Math.abs(result / 6.21371192237334e307 - 1)).toBeLessThan(8 * Number.EPSILON);
    const tiny = convertUnit(5e-323, "mm", "cm");
    expect(tiny).toBe(Number.MIN_VALUE);
    expect(convertUnit(1, "mi", "km")).toBe(1.609344);
    expect(convertUnit(0, "c", "f")).toBeCloseTo(32, 12);
    expect(() => convertUnit(Number.MAX_VALUE, "km", "mm")).toThrow(RangeError);
  });
  it("rejects invalid conversion identities and mismatched families", () => {
    for (const [fromUnit, toUnit] of [["unknown", "unknown"], ["__proto__", "__proto__"], ["constructor", "constructor"], ["toString", "toString"], ["kg", "m"]]) {
      expect(() => runCalculator(unitConversionCalculator, { value: 1, fromUnit, toUnit })).toThrow();
      expect(() => convertUnit(1, fromUnit, toUnit)).toThrow();
    }
  });
  it("avoids quantization in a nonzero subnormal base-unit intermediate", () => {
    // One millimetre is one tenth of a centimetre; these literal decimal
    // expectations do not reuse the implementation's conversion factors.
    expect(convertUnit(5e-321, "mm", "cm")).toBe(5e-322);
    expect(convertUnit(1e-310, "mm", "cm")).toBe(1e-311);
  });
  it("preserves finite Break-even units and revenue at extreme fixed cost", () => {
    expect(runCalculator(breakEvenCalculator, { fixedCosts: 1e308, pricePerUnit: 1, variableCostPerUnit: 0 }).output)
      .toEqual({ breakEvenUnits: 1e308, breakEvenRevenue: 1e308, contributionMarginPerUnit: 1, contributionMarginPercent: 100 });
  });
  it("keeps Break-even invalid margins and truly overflowing results fail-closed", () => {
    expect(() => runCalculator(breakEvenCalculator, { fixedCosts: 1, pricePerUnit: 2, variableCostPerUnit: 2 })).toThrow();
    expect(() => runCalculator(breakEvenCalculator, { fixedCosts: Number.MAX_VALUE, pricePerUnit: 2, variableCostPerUnit: 1 })).toThrow();
  });
});

describe("independent source-backed golden records and context independence", () => {
  function verifyGoldens<T, O>(definition: CalculatorDefinition<T, O>, status: string) {
    it(`${definition.id} binds literal goldens without changing identity/version/review`, () => {
      expect(definition.version).toBe(1);
      expect(definition.reviewStatus).toBe(status);
      expect(definition.goldenTests?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(definition.sources.some(source => source.url?.startsWith("https://"))).toBe(true);
      for (const vector of definition.goldenTests ?? []) {
        for (const context of [{}, { locale: "en-US", currency: "USD" }, { locale: "hi-IN", currency: "INR" }]) {
          expect(runCalculator(definition, vector.input, context).output).toEqual(vector.expected);
          expect(definition.calculate(definition.inputSchema.parse(vector.input), context)).toEqual(vector.expected);
        }
      }
    });
  }
  verifyGoldens(percentageCalculator, "certified");
  verifyGoldens(unitConversionCalculator, "certified");
  verifyGoldens(breakEvenCalculator, "draft");
});

describe("decimal-to-fraction compatibility envelope (no model change)", () => {
  const spec = getLaunchSpec("decimal-to-fraction-calculator")!;
  const definition = launchDefinition(spec);
  it.each([
    [{ decimal: 0.75, precision: 2 }, 0.75, "3/4"],
    [{ decimal: -1.25, precision: 2 }, -1.25, "-5/4"],
    [{ decimal: 0, precision: 12 }, 0, "0/1"],
    [{ decimal: 0.5, precision: 0 }, 1, "1/1"],
    [{ decimal: -0.5, precision: 0 }, 0, "0/1"],
  ] as const)("retains the declared rounding and rational display for %j", (input, expected, fraction) => {
    const result = runCalculator(definition, input).output.result;
    expect(result === expected).toBe(true);
    expect(spec.formatResult?.(input, result)).toBe(fraction);
  });
  it("rejects unsupported precision and overflowing numeric output before formatting", () => {
    for (const precision of [-1, 1.5, 13, Infinity]) expect(() => runCalculator(definition, { decimal: 0.75, precision })).toThrow();
    expect(() => runCalculator(definition, { decimal: 1e308, precision: 2 })).toThrow();
    expect(definition.id).toBe("launch-decimal-to-fraction-calculator");
    expect(definition.version).toBe(1);
  });
});
