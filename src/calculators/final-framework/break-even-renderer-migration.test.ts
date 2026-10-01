import { describe, expect, it } from "vitest";
import { breakEvenResult } from "./reference-adapters";
describe("Break-even renderer migration contract", () => {
  it("keeps structured result data sufficient for presentation without recalculation", () => {
    const result = breakEvenResult({ breakEvenUnits: 500, breakEvenRevenue: 25000, contributionMarginPerUnit: 20, contributionMarginPercent: 40 });
    expect(result.primaryResult.value).toBe(500);
    expect(result.metrics?.length).toBeGreaterThan(0);
    expect(result.methodology).toBeTruthy();
    expect(result.sources?.length).toBeGreaterThan(0);
  });
});
