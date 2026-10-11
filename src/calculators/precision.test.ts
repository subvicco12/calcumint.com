import { describe, expect, it } from "vitest";
import { roundTo, type RoundingMode } from "./precision";

describe("finite rounding boundaries", () => {
  it.each<RoundingMode>(["half-away-from-zero", "floor", "ceil", "truncate"])(
    "rejects scaling overflow in %s mode", (mode) => {
      expect(() => roundTo(1e308, 2, mode)).toThrow(/numeric range/);
      expect(() => roundTo(-1e308, 2, mode)).toThrow(/numeric range/);
    }
  );

  it("rejects overflow from the half-away rounding tolerance", () => {
    expect(() => roundTo(Number.MAX_VALUE, 0)).toThrow(/numeric range/);
    expect(() => roundTo(-Number.MAX_VALUE, 0)).toThrow(/numeric range/);
  });

  it("preserves supported finite values and existing tie behavior", () => {
    expect(Number.isFinite(roundTo(1e300, 2))).toBe(true);
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(-1.005, 2)).toBe(-1.01);
    expect(roundTo(-0.001, 2)).toBe(0);
    expect(roundTo(1.239, 2, "floor")).toBe(1.23);
    expect(roundTo(1.231, 2, "ceil")).toBe(1.24);
    expect(roundTo(-1.239, 2, "truncate")).toBe(-1.23);
  });
});
