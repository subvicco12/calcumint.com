import { describe, expect, it } from "vitest";
import type { CalculatorDefinition } from "../types";
import { sportsBatch1Definitions } from "./catalog-batch-1";

describe("sports direct-call input domains", () => {
  for (const calculator of sportsBatch1Definitions as readonly CalculatorDefinition<Record<string, number>, { value: number; steps: string[] }>[]) {
    it(`${calculator.slug} rejects nonfinite and zero input while retaining its example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input)[0];
      expect(() => calculator.calculate({ ...input, [key]: Number.POSITIVE_INFINITY }, {})).toThrow("Sports inputs are outside the supported domain");
      expect(() => calculator.calculate({ ...input, [key]: 0 }, {})).toThrow("Sports inputs are outside the supported domain");
      expect(calculator.calculate(input, {}).value).toBeCloseTo(calculator.examples[0].expected.value, 8);
    });
  }
});
