import { describe, expect, it } from "vitest";
import type { CalculatorDefinition } from "../types";
import { travelEverydayBatch1Definitions } from "./catalog-batch-1";
import { travelEverydayBatch2Definitions } from "./catalog-batch-2";
import { travelEverydayBatch3Definitions } from "./catalog-batch-3";

describe("travel everyday direct-call input domains", () => {
  const calculators: readonly CalculatorDefinition<Record<string, number>, { value: number; steps: string[] }>[] = [
    ...travelEverydayBatch1Definitions,
    ...travelEverydayBatch2Definitions,
    ...travelEverydayBatch3Definitions,
  ];
  for (const calculator of calculators) {
    it(`${calculator.slug} rejects invalid direct input and preserves its reference example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input)[0];
      expect(() => calculator.calculate({ ...input, [key]: Number.POSITIVE_INFINITY }, {})).toThrow();
      expect(calculator.calculate(input, {}).value).toBeCloseTo(calculator.examples[0].expected.value, 8);
    });
  }
});
