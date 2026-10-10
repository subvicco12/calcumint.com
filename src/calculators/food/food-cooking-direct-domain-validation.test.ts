import { describe, expect, it } from "vitest";
import { foodCookingBatch1Definitions } from "./catalog-batch-1";
import { foodCookingBatch2Definitions } from "./catalog-batch-2";

describe("food cooking direct-call input domains", () => {
  for (const calculator of [...foodCookingBatch1Definitions, ...foodCookingBatch2Definitions]) {
    it(`${calculator.slug} rejects nonfinite input and preserves its example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Food cooking inputs are outside the supported domain");
      const actual = calculator.calculate(input as never).value;
      const expected = calculator.examples[0].expected.value;
      expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.max(0.01, Math.abs(expected) * 1e-8));
    });
  }
});
