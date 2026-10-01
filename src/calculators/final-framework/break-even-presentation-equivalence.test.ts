import { describe, expect, it } from "vitest";
import { breakEvenResult } from "./reference-adapters";
import { rendererTrustSurface } from "./renderer-trust-surface";
describe("Break-even Final presentation equivalence", () => {
  it("retains primary result, KPI metrics and trust evidence for renderer migration", () => {
    const result = breakEvenResult({ breakEvenUnits: 500, breakEvenRevenue: 25000, contributionMarginPerUnit: 20, contributionMarginPercent: 40 });
    expect(result.primaryResult.label).toBe("Break-even units");
    expect(result.metrics?.map(metric => metric.id)).toEqual(["revenue","margin","margin-percent"]);
    expect(rendererTrustSurface(result)).not.toBeNull();
  });
});
