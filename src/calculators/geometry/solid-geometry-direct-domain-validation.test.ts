import { describe, expect, it } from "vitest";
import { solidGeometryBatch1Definitions } from "./solid-geometry-batch-1";
import { solidGeometryBatch2Definitions } from "./solid-geometry-batch-2";
import { solidGeometryBatch3Definitions } from "./solid-geometry-batch-3";
import { solidGeometryBatch4Definitions } from "./solid-geometry-batch-4";
import { solidGeometryBatch5Definitions } from "./solid-geometry-batch-5";

describe("solid geometry batch 1 direct-call domains", () => {
  for (const calculator of solidGeometryBatch1Definitions) {
    it(`${calculator.slug} rejects nonfinite inputs and retains the golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("solid geometry batch 2 direct-call domains", () => {
  for (const calculator of solidGeometryBatch2Definitions) {
    it(`${calculator.slug} rejects nonfinite inputs and retains the golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("solid geometry batch 3 direct-call domains", () => {
  for (const calculator of solidGeometryBatch3Definitions) {
    it(`${calculator.slug} rejects nonfinite inputs and retains the golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("solid geometry batch 4 direct-call domains", () => {
  for (const calculator of solidGeometryBatch4Definitions) {
    it(`${calculator.slug} rejects nonfinite inputs and retains the golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});

describe("solid geometry batch 5 direct-call domains", () => {
  for (const calculator of solidGeometryBatch5Definitions) {
    it(`${calculator.slug} rejects nonfinite inputs and retains the golden example`, () => {
      const input = calculator.examples[0].input;
      const key = Object.keys(input).find((name) => typeof (input as Record<string, unknown>)[name] === "number");
      expect(key).toBeDefined();
      expect(() => calculator.calculate({ ...input, [key!]: Number.POSITIVE_INFINITY } as never)).toThrow("Solid geometry inputs are outside the supported domain");
      expect(calculator.calculate(input as never).value).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
