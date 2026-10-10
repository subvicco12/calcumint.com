import { describe, expect, it } from "vitest";
import { physicsBatch3Definitions } from "./catalog-batch-3";

describe("certified physics batch 3 direct-call domain checks", () => {
  for (const calculator of physicsBatch3Definitions) {
    it(`${calculator.slug} rejects nonfinite input and preserves its golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never, {})).toThrow("Physics inputs are outside the supported domain");
      const actual = calculator.calculate(input as never, {}).value;
      const expected = calculator.examples[0].expected.value;
      expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.max(0.01, Math.abs(expected) * 1e-8));
    });
  }
});
