import { describe, expect, it } from "vitest";
import { createStructuredResult } from "./structured-result";
import { assertPrimarySeriesReconciled, reconcilePrimaryWithSeriesTerminal } from "./reconciliation";

describe("Final result reconciliation validator", () => {
  it("accepts terminal visualization values within explicit rounding tolerance", () => {
    const result = createStructuredResult({
      primaryResult: { key: "future", label: "Future value", value: 12500 },
      series: [{ key: "growth", label: "Growth", points: [{ x: 10, y: 12499.995 }] }]
    });
    expect(reconcilePrimaryWithSeriesTerminal(result, "growth", 0.01)).toEqual([]);
  });

  it("fails closed when a terminal visualization contradicts the headline", () => {
    const result = createStructuredResult({
      primaryResult: { key: "future", label: "Future value", value: 12500 },
      series: [{ key: "growth", label: "Growth", points: [{ x: 10, y: 12490 }] }]
    });
    expect(() => assertPrimarySeriesReconciled(result, "growth", 0.01)).toThrow(/reconciliation failed/i);
  });
});
