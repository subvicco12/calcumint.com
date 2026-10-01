import { describe, expect, it } from "vitest";
import { breakEvenResult } from "./reference-adapters";
import { rendererTrustSurface } from "./renderer-trust-surface";
import { displayFinalValue } from "./renderer-display";

describe("Break-even post-migration parity", () => {
  it("keeps the authoritative Free result, KPI display and trust surface", () => {
    const result = breakEvenResult({ breakEvenUnits: 500, breakEvenRevenue: 25000, contributionMarginPerUnit: 20, contributionMarginPercent: 40 });
    expect(displayFinalValue(result.primaryResult.value, result.primaryResult.unit)).toBe("500");
    expect(result.metrics?.map(metric => displayFinalValue(metric.value, metric.unit))).toEqual(["25,000", "20", "40 %"]);
    expect(rendererTrustSurface(result)).not.toBeNull();
  });
});
