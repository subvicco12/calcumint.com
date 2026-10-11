import { describe, expect, it } from "vitest";
import { serializeCalculationCsv } from "./calculation-export";

describe("raw calculation CSV safety", () => {
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite nested engine values %s", value => {
    expect(() => serializeCalculationCsv({}, { schedule: [{ value }] })).toThrow(/Non-finite/);
  });
  it("preserves deterministic field order and numeric negatives while neutralizing formula keys and text", () => {
    expect(serializeCalculationCsv({ "=field": " \t@sum(A1)", negative: -0.000001 }, { zero: 0 })).toBe('"section","field","value"\n"input","\'=field","\' \t@sum(A1)"\n"input","negative","-0.000001"\n"output","zero","0"');
  });
  it("fails visibly for cyclic or unsupported nested data instead of silently dropping fields", () => {
    const cycle: Record<string, unknown> = {}; cycle.self = cycle;
    expect(() => serializeCalculationCsv({}, cycle)).toThrow();
    expect(() => serializeCalculationCsv({}, { rows: [{ value: undefined }] })).toThrow(/Unsupported/);
  });
});
