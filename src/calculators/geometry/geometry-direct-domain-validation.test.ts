import { describe, expect, it } from "vitest";
import { geometryBatch1Definitions } from "./geometry-batch-1";
import { geometryBatch2Definitions } from "./geometry-batch-2";
import { geometryBatch3Definitions } from "./geometry-batch-3";
import { geometryBatch4Definitions } from "./geometry-batch-4";
import { geometryBatch5Definitions } from "./geometry-batch-5";

describe("geometry batch 1 direct-call domain validation", () => {
  for (const calculator of geometryBatch1Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its worked example`, () => {
      const example = calculator.examples[0].input;
      const numericKey = Object.keys(example).find((key) => typeof (example as Record<string, unknown>)[key] === "number");
      expect(numericKey).toBeDefined();
      const invalid = { ...example, [numericKey!]: Number.POSITIVE_INFINITY };
      expect(() => calculator.calculate(invalid as never)).toThrow("Geometry inputs are outside the supported domain");
      const actual = calculator.calculate(example as never).value;
      expect(actual).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
describe("geometry batch 2 direct-call domain validation", () => {
  for (const calculator of geometryBatch2Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its worked example`, () => {
      const example = calculator.examples[0].input;
      const numericKey = Object.keys(example).find((key) => typeof (example as Record<string, unknown>)[key] === "number");
      expect(numericKey).toBeDefined();
      const invalid = { ...example, [numericKey!]: Number.POSITIVE_INFINITY };
      expect(() => calculator.calculate(invalid as never)).toThrow("Geometry inputs are outside the supported domain");
      const actual = calculator.calculate(example as never).value;
      expect(actual).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
describe("geometry batch 3 direct-call domain validation", () => {
  for (const calculator of geometryBatch3Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its worked example`, () => {
      const example = calculator.examples[0].input;
      const numericKey = Object.keys(example).find((key) => typeof (example as Record<string, unknown>)[key] === "number");
      expect(numericKey).toBeDefined();
      const invalid = { ...example, [numericKey!]: Number.POSITIVE_INFINITY };
      expect(() => calculator.calculate(invalid as never)).toThrow("Geometry inputs are outside the supported domain");
      const actual = calculator.calculate(example as never).value;
      expect(actual).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
describe("geometry batch 4 direct-call domain validation", () => {
  for (const calculator of geometryBatch4Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its worked example`, () => {
      const example = calculator.examples[0].input;
      const numericKey = Object.keys(example).find((key) => typeof (example as Record<string, unknown>)[key] === "number");
      expect(numericKey).toBeDefined();
      const invalid = { ...example, [numericKey!]: Number.POSITIVE_INFINITY };
      expect(() => calculator.calculate(invalid as never)).toThrow("Geometry inputs are outside the supported domain");
      const actual = calculator.calculate(example as never).value;
      expect(actual).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
describe("geometry batch 5 direct-call domain validation", () => {
  for (const calculator of geometryBatch5Definitions) {
    it(`${calculator.slug} rejects nonfinite direct inputs and preserves its worked example`, () => {
      const example = calculator.examples[0].input;
      const numericKey = Object.keys(example).find((key) => typeof (example as Record<string, unknown>)[key] === "number");
      expect(numericKey).toBeDefined();
      const invalid = { ...example, [numericKey!]: Number.POSITIVE_INFINITY };
      expect(() => calculator.calculate(invalid as never)).toThrow("Geometry inputs are outside the supported domain");
      const actual = calculator.calculate(example as never).value;
      expect(actual).toBeCloseTo(calculator.goldenTests[0].expected.value, 5);
    });
  }
});
