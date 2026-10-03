import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { momentumCalculator } from "../physics/catalog-batch-2";
import { momentumResult } from "./momentum-adapter";
import { rendererTrustSurface } from "./renderer-trust-surface";
import { capabilitiesFor } from "./entitlements";

describe("Momentum Calculator post-migration authority",()=>{
  it("keeps one certified deterministic signed result and free trust surface across plans",()=>{
    const positive=runCalculator(momentumCalculator,{mass:4,velocity:3}).output;
    const negative=runCalculator(momentumCalculator,{mass:4,velocity:-3}).output;
    expect(momentumCalculator.reviewStatus).toBe("certified");
    expect(momentumCalculator.riskClass).toBe("standard");
    expect(momentumResult(positive).primaryResult.value).toBe(12);
    expect(momentumResult(negative).primaryResult.value).toBe(-12);
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(momentumResult(positive))?.sources.length).toBeGreaterThan(0);
  });
});
