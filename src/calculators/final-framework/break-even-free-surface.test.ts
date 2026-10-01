import { describe, expect, it } from "vitest";
import { breakEvenResult } from "./reference-adapters";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("Break-even Free renderer surface", () => {
  it("retains core result, KPIs and trust evidence without paid capability execution", () => {
    const result = breakEvenResult({ breakEvenUnits: 500, breakEvenRevenue: 25000, contributionMarginPerUnit: 20, contributionMarginPercent: 40 });
    expect(result.primaryResult.id).toBe("break-even-units");
    expect(result.metrics?.map(metric => metric.id)).toEqual(["revenue", "margin", "margin-percent"]);
    expect(rendererTrustSurface(result)).not.toBeNull();
    expect(result.scenarioVariables?.length).toBeGreaterThan(0);
    expect(result.sensitivityVariables?.length).toBeGreaterThan(0);
  });
});
