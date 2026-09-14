import { describe, expect, it } from "vitest";
import { roundTo } from "./precision";
import { convertUnit } from "./units";

describe("precision helpers", () => {
  it("rounds half away from zero", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(-1.005, 2)).toBe(-1.01);
  });

  it("rejects non-finite values", () => {
    expect(() => roundTo(Number.POSITIVE_INFINITY, 2)).toThrow(RangeError);
  });
});

describe("unit conversion", () => {
  it("converts exact length factors", () => {
    expect(convertUnit(1, "mi", "km")).toBeCloseTo(1.609344, 12);
    expect(convertUnit(12, "in", "ft")).toBeCloseTo(1, 12);
  });

  it("converts temperatures through kelvin", () => {
    expect(convertUnit(0, "c", "f")).toBeCloseTo(32, 12);
    expect(convertUnit(212, "f", "c")).toBeCloseTo(100, 12);
  });

  it("rejects cross-family conversion", () => {
    expect(() => convertUnit(1, "kg", "m")).toThrow(RangeError);
  });
});
