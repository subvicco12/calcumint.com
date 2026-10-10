import { describe, expect, it } from "vitest";
import { solidGeometryBatch6Definitions } from "./solid-geometry-batch-6";
import { solidGeometryBatch7Definitions } from "./solid-geometry-batch-7";
import { solidGeometryBatch8Definitions } from "./solid-geometry-batch-8";
import { solidGeometryBatch9Definitions } from "./solid-geometry-batch-9";
import { solidGeometryBatch10Definitions } from "./solid-geometry-batch-10";

describe("solid geometry batch 6 direct-call domains", () => {
  for (const calculator of solidGeometryBatch6Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("solid geometry batch 7 direct-call domains", () => {
  for (const calculator of solidGeometryBatch7Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("solid geometry batch 8 direct-call domains", () => {
  for (const calculator of solidGeometryBatch8Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("solid geometry batch 9 direct-call domains", () => {
  for (const calculator of solidGeometryBatch9Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("solid geometry batch 10 direct-call domains", () => {
  for (const calculator of solidGeometryBatch10Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
