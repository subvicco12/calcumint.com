import { describe, expect, it } from "vitest";
import { readVersionedSlopeSnapshot } from "./slope-versioned-compatibility";

describe("isolated versioned Slope historical snapshot reader", () => {
  it("preserves the stored legacy v1 result without recalculation or mutation", () => {
    const snapshot = { calculatorSlug: "slope-calculator", calculatorVersion: 1, input: { rise: -6, run: 3 }, output: { result: -1.999 } };
    const before = JSON.stringify(snapshot);
    const decoded = readVersionedSlopeSnapshot(snapshot);
    expect(decoded).toMatchObject({ calculatorVersion: 1, input: { rise: -6, run: 3 }, output: { result: -1.999 }, provenance: "historical-rise-run" });
    expect(JSON.stringify(snapshot)).toBe(before);
    expect(Object.isFrozen(decoded.output)).toBe(true);
  });
  it("preserves coordinate v2 stored output rather than recomputing", () => {
    const snapshot = {
      calculatorSlug: "slope-calculator", calculatorVersion: 2,
      input: { x1: 1, y1: 2, x2: 4, y2: 8 },
      output: { value: 2.001, dx: 3, dy: 6, steps: ["stored"] },
    };
    expect(readVersionedSlopeSnapshot(snapshot)).toMatchObject({
      calculatorVersion: 2, output: { value: 2.001, dx: 3, dy: 6, steps: ["stored"] },
    });
    expect(() => readVersionedSlopeSnapshot({ ...snapshot, input: { rise: 6, run: 3 } })).toThrow();
    expect(() => readVersionedSlopeSnapshot({ ...snapshot, input: { ...snapshot.input, note: "unrecognized" } })).toThrow();
    expect(() => readVersionedSlopeSnapshot({ ...snapshot, input: { x1: 1, y1: 2, x2: 4 } })).toThrow();
    expect(() => readVersionedSlopeSnapshot({ ...snapshot, output: { value: 2, dx: 3, dy: 6, steps: [123] } })).toThrow();
    expect(() => readVersionedSlopeSnapshot({ ...snapshot, output: { value: 2, dx: 3, dy: 6, steps: "text" } })).toThrow();
  });
  it("rejects unknown metadata and mathematical output keys rather than discarding them", () => {
    const base = { calculatorSlug: "slope-calculator", calculatorVersion: 1, input: { rise: 6, run: 3 }, output: { result: 2 } };
    expect(() => readVersionedSlopeSnapshot({ ...base, createdAt: "2026-10-13" })).toThrow();
    expect(() => readVersionedSlopeSnapshot({ ...base, output: { result: 2, note: "legacy" } })).toThrow();
    expect(() => readVersionedSlopeSnapshot({ ...base, input: { rise: 6, run: 3, note: "legacy" } })).toThrow();
  });
  it("fails closed on unknown versions, mixed shapes, missing outputs and other slugs", () => {
    const legacy = { calculatorSlug: "slope-calculator", calculatorVersion: 1, input: { rise: 6, run: 3 }, output: { result: 2 } };
    for (const payload of [
      { ...legacy, calculatorVersion: 3 },
      { ...legacy, calculatorSlug: "other-calculator" },
      { ...legacy, input: { x1: 0, y1: 0, x2: 3, y2: 6 } },
      { ...legacy, input: { rise: 6, run: 3, x1: 0 } },
      { calculatorSlug: "slope-calculator", calculatorVersion: 2, input: { x1: 0, y1: 0, x2: 3, y2: 6 } },
    ]) expect(() => readVersionedSlopeSnapshot(payload)).toThrow();
  });
});
