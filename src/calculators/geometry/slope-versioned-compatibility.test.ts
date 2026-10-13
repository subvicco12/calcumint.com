import { describe, expect, it } from "vitest";
import { readVersionedSlopeSnapshot } from "./slope-versioned-compatibility";

describe("isolated versioned Slope compatibility reader", () => {
  it("reads legacy v1 rise/run without rewriting the supplied payload", () => {
    const snapshot = { calculatorSlug: "slope-calculator", calculatorVersion: 1, input: { rise: -6, run: 3 } };
    const before = JSON.stringify(snapshot);
    expect(readVersionedSlopeSnapshot(snapshot)).toMatchObject({
      calculatorVersion: 1, input: { rise: -6, run: 3 },
      output: { result: -2 }, provenance: "historical-rise-run",
    });
    expect(JSON.stringify(snapshot)).toBe(before);
  });
  it("reads coordinate v2 and rejects legacy shapes", () => {
    expect(readVersionedSlopeSnapshot({
      calculatorSlug: "slope-calculator", calculatorVersion: 2,
      input: { x1: 1, y1: 2, x2: 4, y2: 8 },
    })).toMatchObject({ calculatorVersion: 2, output: { value: 2, dx: 3, dy: 6 } });
    expect(() => readVersionedSlopeSnapshot({
      calculatorSlug: "slope-calculator", calculatorVersion: 2, input: { rise: 6, run: 3 },
    })).toThrow();
  });
  it("fails closed on unknown versions, mixed shapes and other calculator slugs", () => {
    for (const payload of [
      { calculatorSlug: "slope-calculator", calculatorVersion: 3, input: { rise: 6, run: 3 } },
      { calculatorSlug: "other-calculator", calculatorVersion: 1, input: { rise: 6, run: 3 } },
      { calculatorSlug: "slope-calculator", calculatorVersion: 1, input: { x1: 0, y1: 0, x2: 3, y2: 6 } },
      { calculatorSlug: "slope-calculator", calculatorVersion: 1, input: { rise: 6, run: 3, x1: 0 } },
    ]) expect(() => readVersionedSlopeSnapshot(payload)).toThrow();
  });
});
