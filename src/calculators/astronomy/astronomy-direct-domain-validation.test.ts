import { describe, expect, it } from "vitest";
import { astronomyBatch1Definitions } from "./catalog-batch-1";

describe("astronomy batch 1 direct-call input domains", () => {
  for (const calculator of astronomyBatch1Definitions) {
    it(`${calculator.slug} rejects nonfinite input and preserves its worked example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Astronomy inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
