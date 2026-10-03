import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {densityCalculator} from "../physics/catalog-batch-2";
import {densityResult} from "./density-adapter";
import {densityPresentation} from "./density-presentation";
import {rendererTrustSurface} from "./renderer-trust-surface";
import {capabilitiesFor} from "./entitlements";

describe("Density Calculator post-migration authority",()=>{
  it("keeps one certified deterministic mass-over-volume result and trust capability context across plans",()=>{
    const output=runCalculator(densityCalculator,{mass:12,volume:3}).output;
    const zero=runCalculator(densityCalculator,{mass:0,volume:3}).output;
    const structured=densityResult(output);
    expect(densityCalculator.reviewStatus).toBe("certified");
    expect(densityCalculator.riskClass).toBe("standard");
    expect(output.value).toBe(4);
    expect(zero.value).toBe(0);
    expect(structured.primaryResult.value).toBe(output.value);
    expect(structured.primaryResult.unit).toBeUndefined();
    expect(densityPresentation.domain).toBe("physics");
    expect(densityPresentation.family).toBe("simple-scalar");
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
