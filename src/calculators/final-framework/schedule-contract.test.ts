import { describe, expect, it } from "vitest";
import { inspectScheduleContract } from "./schedule-contract";
import type { ResultScheduleMetadata, ResultScheduleRow } from "./types";

const metadata: ResultScheduleMetadata = { caption: "Growth", period: { key: "date", label: "Date" }, columns: [{ key: "balance", label: "Balance" }], granularity: "complete" };
const rows: ResultScheduleRow[] = [{ id: "first", period: "2026-01-01", values: { balance: -0.000001 } }, { id: "last", period: "2026-02-01", values: {} }];
describe("schedule contract boundaries", () => {
  it("preserves date labels, sparse cells, small signed values and empty schedules without terminal assertions", () => {
    expect(inspectScheduleContract(rows, metadata)).toEqual([]);
    expect(inspectScheduleContract([], metadata)).toEqual([]);
  });
  it.each([
    { ...metadata, caption: " " },
    { ...metadata, columns: [] },
    { ...metadata, columns: [...metadata.columns, ...metadata.columns] },
    { ...metadata, columns: [{ key: "date", label: "Date" }] },
    { ...metadata, period: { ...metadata.period, unit: " " } },
    { ...metadata, terminal: [{ column: "unknown", expected: 0, tolerance: 0 }] },
    { ...metadata, terminal: [{ column: "balance", expected: Infinity, tolerance: 0 }] },
    { ...metadata, terminal: [{ column: "balance", expected: 0, tolerance: -1 }] }
  ])("rejects invalid declared identities or terminal policies %#", invalid => {
    expect(inspectScheduleContract(rows, invalid).length).toBeGreaterThan(0);
  });
  it.each([
    [...rows, rows[0]],
    [{ ...rows[0], period: NaN }],
    [{ ...rows[0], period: "" }],
    [{ ...rows[0], values: { extra: 0 } }],
    [{ ...rows[0], values: { balance: Infinity } }]
  ].map(invalid => ({ invalid })))("reports invalid rows without hiding or normalizing their values %#", ({ invalid }) => {
    expect(inspectScheduleContract(invalid, metadata).length).toBeGreaterThan(0);
  });
  it("reconciles only declared terminal values with explicit tolerance, including missing and empty rows", () => {
    const terminal = { ...metadata, terminal: [{ column: "balance", expected: 0, tolerance: 0.01 }] };
    expect(inspectScheduleContract([{ ...rows[0], values: { balance: 0.005 } }], terminal)).toEqual([]);
    expect(inspectScheduleContract([{ ...rows[0], values: { balance: 0.02 } }], terminal).length).toBeGreaterThan(0);
    expect(inspectScheduleContract(rows, terminal).length).toBeGreaterThan(0);
    expect(inspectScheduleContract([], terminal).length).toBeGreaterThan(0);
  });
});
