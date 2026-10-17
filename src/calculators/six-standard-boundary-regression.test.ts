import { describe, expect, it } from "vitest";
import { standardDeviationCalculator, varianceCalculator } from "./statistics/catalog-batch-1";
import { graphingCalculator, functionPlotter2dCalculator } from "./advanced-math/catalog-batch-10";

describe("held standard calculators: sample and graph boundary contracts", () => {
  for (const calculator of [standardDeviationCalculator, varianceCalculator]) {
    it(calculator.slug + " uses n-1 for sample variance", () => {
      const input = { values: [1, 2, 3], kind: "sample" as const };
      const output = calculator.calculate(input, {});
      expect(output.count).toBe(3);
      expect(output.mean).toBe(2);
      expect(output.variance).toBe(1);
      expect(output.standardDeviation).toBe(1);
      expect(output.kind).toBe("sample");
    });
    it(calculator.slug + " rejects singleton sample", () => {
      expect(() => calculator.calculate({ values: [7], kind: "sample" }, {})).toThrow(/at least two/);
      expect(calculator.inputSchema.safeParse({ values: [], kind: "sample" }).success).toBe(false);
    });
  }

  for (const calculator of [graphingCalculator, functionPlotter2dCalculator]) {
    it(calculator.slug + " samples both boundaries and midpoint", () => {
      const output = calculator.calculate({ expression: "x^2", minX: -2, maxX: 2 }, {});
      expect(output.points).toHaveLength(81);
      expect(output.points[0]).toEqual({ x: -2, y: 4 });
      expect(output.points[40]).toEqual({ x: 0, y: 0 });
      expect(output.points[80]).toEqual({ x: 2, y: 4 });
      expect(output.minimum).toBe(0);
      expect(output.maximum).toBe(4);
    });
    it(calculator.slug + " rejects invalid domains and malformed expressions", () => {
      expect(calculator.inputSchema.safeParse({ expression: "x", minX: 2, maxX: 2 }).success).toBe(false);
      expect(calculator.inputSchema.safeParse({ expression: "", minX: -1, maxX: 1 }).success).toBe(false);
      expect(() => calculator.calculate({ expression: "(", minX: -1, maxX: 1 }, {})).toThrow();
    });
    it(calculator.slug + " rejects ranges without two finite samples", () => {
      expect(() => calculator.calculate({ expression: "1/(x-x)", minX: -1, maxX: 1 }, {})).toThrow();
    });
  }
});
