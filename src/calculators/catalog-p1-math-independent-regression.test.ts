import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "./registry";

/**
 * Independently specified mathematical regression cases for source review.
 * These are NOT certification packets and do not alter publication authority.
 */
const cases = [
  { slug: "percentage-change-calculator", input: { old: 80, next: 100 }, expected: 25 },
  { slug: "percentage-increase-calculator", input: { value: 240, percent: 12.5 }, expected: 270 },
  { slug: "percentage-decrease-calculator", input: { value: 240, percent: 12.5 }, expected: 210 },
  { slug: "ratio-calculator", input: { a: 7, b: 4 }, expected: 1.75 },
  { slug: "proportion-calculator", input: { a: 3, b: 8 }, expected: 0.375 },
  { slug: "fraction-calculator", input: { numerator: -7, denominator: 8 }, expected: -0.875 },
  { slug: "square-calculator", input: { x: -12 }, expected: 144 },
  { slug: "cube-calculator", input: { x: -3 }, expected: -27 },
] as const;

describe("P1 math independent deterministic regression cases", () => {
  for (const testCase of cases) {
    it(testCase.slug, () => {
      const definition = calculatorRegistry.getBySlug(testCase.slug);
      expect(definition).toBeDefined();
      const parsed = definition!.inputSchema.parse(testCase.input);
      const result = definition!.calculate(parsed, {});
      expect(result.result).toBeCloseTo(testCase.expected, 12);
    });
  }

  it("rejects division by zero for ratio and fraction", () => {
    for (const [slug, input] of [
      ["ratio-calculator", { a: 2, b: 0 }],
      ["fraction-calculator", { numerator: 2, denominator: 0 }],
    ] as const) {
      expect(calculatorRegistry.getBySlug(slug)!.inputSchema.safeParse(input).success).toBe(false);
    }
  });

  it("rejects zero original value for percentage change", () => {
    expect(calculatorRegistry.getBySlug("percentage-change-calculator")!
      .inputSchema.safeParse({ old: 0, next: 10 }).success).toBe(false);
  });
});
