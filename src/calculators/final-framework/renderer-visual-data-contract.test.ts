import { describe, expect, it } from "vitest";
import type { StructuredCalculationResult } from "./types";
describe("Final renderer visual data contract", () => {
  it("keeps visualization inputs as structured authoritative result data", () => {
    const result: StructuredCalculationResult = {
      primaryResult: { id: "result", label: "Result", value: 10 },
      composition: [{ id: "part", label: "Part", value: 4 }],
      ranges: [{ id: "range", label: "Range", min: 0, max: 20, classification: "Within range" }],
      series: [{ id: "trend", label: "Trend", points: [{ x: 1, y: 10 }] }]
    };
    expect(result.composition?.[0].value).toBe(4);
    expect(result.ranges?.[0].classification).toBe("Within range");
    expect(result.series?.[0].points.at(-1)?.y).toBe(10);
  });
});
