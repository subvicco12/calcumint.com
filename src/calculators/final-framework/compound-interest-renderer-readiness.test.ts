import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { referencePresentations } from "./reference-presentations";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("Compound Interest renderer readiness", () => {
  it("provides the authoritative Free composition, KPIs and trust evidence", () => {
    const result = compoundInterestResult({ principal: 10000, years: 10 }, { futureValue: 16470.09, totalInterest: 6470.09 });
    expect(referencePresentations.compoundInterest.freeVisualization).toBe("composition");
    expect(result.primaryResult.id).toBe("future-value");
    expect(result.metrics?.map(metric => metric.id)).toEqual(["principal", "interest", "years"]);
    expect(result.composition?.map(item => item.id)).toEqual(["principal", "interest"]);
    expect(rendererTrustSurface(result)).not.toBeNull();
  });
});
