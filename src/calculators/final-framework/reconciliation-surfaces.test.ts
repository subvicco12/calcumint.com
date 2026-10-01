import { describe, expect, it } from "vitest";
import { reconcilePrimaryWithSeriesTerminal } from "./reconciliation";
import { createStructuredResult } from "./structured-result";

describe("Final reconciliation surfaces", () => {
  it("accepts explicit rounding tolerance", () => {
    const result = createStructuredResult({
      primaryResult: { key: "value", label: "Value", value: 100 },
      series: [{ key: "value-series", label: "Value", points: [{ x: 1, y: 100.004 }] }]
    });
    expect(reconcilePrimaryWithSeriesTerminal(result, "value-series", 0.01)).toEqual([]);
  });

  it("fails closed when visualization terminal value drifts beyond tolerance", () => {
    const result = createStructuredResult({
      primaryResult: { key: "value", label: "Value", value: 100 },
      series: [{ key: "value-series", label: "Value", points: [{ x: 1, y: 100.02 }] }]
    });
    expect(reconcilePrimaryWithSeriesTerminal(result, "value-series", 0.01)).toHaveLength(1);
  });
});
