import { describe, expect, it } from "vitest";
import { automotiveTravelBatch1Definitions } from "./catalog-batch-1";

describe("automotive travel batch 1 direct-call input domains", () => {
  for (const calculator of automotiveTravelBatch1Definitions) {
    it(`${calculator.slug} rejects nonfinite input and retains its worked example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Automotive travel inputs are outside the supported domain");
      const actual = calculator.calculate(input as never).value;
      const expected = calculator.goldenTests[0].expected.value;
      expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.max(0.01, Math.abs(expected) * 1e-8));
    });
  }
});
