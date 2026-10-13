import { describe, expect, it } from "vitest";
import { readPersistedSlopeHistoryRow, readVersionedSlopeSnapshot } from "./slope-versioned-compatibility";

describe("persisted Slope history row read boundary", () => {
  it("preserves legacy v1 rows with database metadata", () => {
    const row = { id: "historical-row", created_at: "2026-01-01", calculator_slug: "slope-calculator", calculator_version: 1, input_data: { rise: -6, run: 3 }, output_data: { result: -2 } };
    const before = JSON.stringify(row);
    expect(readPersistedSlopeHistoryRow(row)).toMatchObject({ calculatorVersion: 1, provenance: "historical-rise-run", output: { result: -2 } });
    expect(JSON.stringify(row)).toBe(before);
  });
  it("preserves v2 rows and rejects incompatible versions or shapes", () => {
    const row = { calculator_slug: "slope-calculator", calculator_version: 2, input_data: { x1: 0, y1: 1, x2: 2, y2: 5 }, output_data: { value: 2, dx: 2, dy: 4, steps: ["recorded"] } };
    expect(readPersistedSlopeHistoryRow(row)).toMatchObject({ calculatorVersion: 2, provenance: "coordinate-points", output: row.output_data });
    expect(() => readPersistedSlopeHistoryRow({ ...row, calculator_version: 3 })).toThrow();
    expect(() => readPersistedSlopeHistoryRow({ ...row, input_data: { rise: 4, run: 2 } })).toThrow();
    expect(() => readPersistedSlopeHistoryRow({ ...row, input_data: { ...row.input_data, run: 2 } })).toThrow();
  });
});

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
