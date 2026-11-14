import { describe, expect, it } from "vitest";
import { roundTo, type RoundingMode } from "../precision";

describe("shared financial rounding safety", () => {
  const modes: RoundingMode[] = ["half-away-from-zero", "floor", "ceil", "truncate"];

  it("preserves finite integers even when decimal scaling would overflow", () => {
    for (const mode of modes) {
      for (const digits of [0, 2, 12]) {
        for (const value of [Number.MAX_VALUE, -Number.MAX_VALUE, 1e308, -1e308, Number.MAX_SAFE_INTEGER]) {
          expect(roundTo(value, digits, mode)).toBe(value);
        }
      }
    }
  });

  it("validates precision before the integer fast path", () => {
    for (const digits of [-1, 13, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => roundTo(1e308, digits)).toThrow(RangeError);
    }
  });

  it("rejects every nonfinite input for every rounding mode", () => {
    for (const mode of modes) {
      for (const value of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
        expect(() => roundTo(value, 2, mode)).toThrow(RangeError);
      }
    }
  });

  it("preserves ordinary signed rounding and normalizes negative zero", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(-1.005, 2)).toBe(-1.01);
    expect(roundTo(-1.239, 2, "floor")).toBe(-1.24);
    expect(roundTo(-1.239, 2, "ceil")).toBe(-1.23);
    expect(roundTo(-1.239, 2, "truncate")).toBe(-1.23);
    for (const mode of modes) expect(Object.is(roundTo(-0, 2, mode), -0)).toBe(false);
  });
});
