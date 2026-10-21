import { describe, expect, it } from "vitest";
import { calculateLegacySlopeCompatibility } from "./slope-legacy-compatibility";

describe("isolated legacy slope adapter", () => {
  it("retains legacy inputs and outputs while labeling derived coordinates", () => {
    const result = calculateLegacySlopeCompatibility({ rise: -8, run: 4 });
    expect(result.legacyInput).toEqual({ rise: -8, run: 4 });
    expect(result.derivedCoordinates).toEqual({ x1: 0, y1: 0, x2: 4, y2: -8 });
    expect(result.legacyOutput).toEqual({ result: -2 });
    expect(result.coordinateOutput.value).toBe(-2);
    expect(result.provenance).toBe("derived-origin-anchored");
  });
  it.each([
    { rise: 1, run: 0 },
    { rise: 1, run: Infinity },
    { rise: NaN, run: 1 },
    { rise: 1, run: 2, x1: 0 },
    { x1: 0, y1: 0, x2: 1, y2: 2 },
    { rise: 1 },
    null,
  ])("rejects invalid or mixed legacy payloads: %j", (input) => {
    expect(() => calculateLegacySlopeCompatibility(input)).toThrow();
  });
  it("rejects arithmetic overflow in the derived coordinate engine", () => {
    expect(() => calculateLegacySlopeCompatibility({ rise: 1e308, run: Number.MIN_VALUE })).toThrow(/finite range|Too big/);
  });
});
