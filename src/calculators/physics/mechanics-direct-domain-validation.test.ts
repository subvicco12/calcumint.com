import { describe, expect, it } from "vitest";
import { physicsMechanicsBatch4Definitions } from "./catalog-batch-4";
import { physicsMechanicsBatch5Definitions } from "./catalog-batch-5";

describe("physics mechanics batch 4 direct-call validation", () => {
  for (const calculator of physicsMechanicsBatch4Definitions) {
    it(`${calculator.slug} rejects nonfinite inputs and preserves its worked example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Physics mechanics inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("physics mechanics batch 5 direct-call validation", () => {
  for (const calculator of physicsMechanicsBatch5Definitions) {
    it(`${calculator.slug} rejects nonfinite inputs and preserves its worked example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Physics mechanics inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
