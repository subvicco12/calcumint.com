import { describe, expect, it } from "vitest";
import { earthScienceBatch1Definitions } from "./catalog-batch-1";
import { earthScienceBatch2Definitions } from "./catalog-batch-2";
import { earthScienceBatch3Definitions } from "./catalog-batch-3";

describe("earth science batch 1 direct-call validation", () => {
  for (const calculator of earthScienceBatch1Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and retains its worked example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Earth science inputs are outside the supported domain");
      const actual = calculator.calculate(input as never).value;
      const expected = calculator.goldenTests[0].expected.value;
      expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.max(0.01, Math.abs(expected) * 1e-8));
    });
  }
});

describe("earth science batch 2 direct-call validation", () => {
  for (const calculator of earthScienceBatch2Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and retains its worked example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Earth science inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("earth science batch 3 direct-call validation", () => {
  for (const calculator of earthScienceBatch3Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and retains its worked example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Earth science inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
