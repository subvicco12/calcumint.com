import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {velocityCalculator} from "../physics/catalog-batch-1";
import {velocityResult} from "./velocity-adapter";
import {velocityPresentation} from "./velocity-presentation";
import {rendererTrustSurface} from "./renderer-trust-surface";
import {capabilitiesFor} from "./entitlements";

describe("Velocity Calculator post-migration authority",()=>{
  it("keeps one certified deterministic signed result and trust capability context across plans",()=>{
    const output=runCalculator(velocityCalculator,{displacement:-45,time:15}).output;
    const zero=runCalculator(velocityCalculator,{displacement:0,time:15}).output;
    const structured=velocityResult(output);
    expect(velocityCalculator.reviewStatus).toBe("certified");
    expect(velocityCalculator.riskClass).toBe("standard");
    expect(output.value).toBe(-3);
    expect(zero.value).toBe(0);
    expect(structured.primaryResult.value).toBe(output.value);
    expect(structured.primaryResult.unit).toBeUndefined();
    expect(velocityPresentation.domain).toBe("physics");
    expect(velocityPresentation.family).toBe("simple-scalar");
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
