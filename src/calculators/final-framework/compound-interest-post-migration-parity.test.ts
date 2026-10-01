import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { displayFinalValue } from "./renderer-display";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("Compound Interest post-migration parity", () => {
  it("preserves authoritative result, KPIs, composition and trust surface", () => {
    const result = compoundInterestResult({ principal: 10000, years: 10 }, { futureValue: 16470.09, totalInterest: 6470.09 });
    expect(displayFinalValue(result.primaryResult.value, result.primaryResult.unit)).toBe("16,470.09");
    expect(result.metrics?.map(metric => metric.id)).toEqual(["principal", "interest", "years"]);
    expect(result.composition?.map(item => item.value)).toEqual([10000, 6470.09]);
    expect(rendererTrustSurface(result)).not.toBeNull();
  });
});
