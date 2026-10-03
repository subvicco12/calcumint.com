import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {distanceTimeCalculator} from "../physics/catalog-batch-1";
import {distanceTimeResult} from "./distance-time-adapter";
import {distanceTimePresentation} from "./distance-time-presentation";
import {rendererTrustSurface} from "./renderer-trust-surface";
import {capabilitiesFor} from "./entitlements";

describe("Distance-Time Calculator post-migration authority",()=>{
  it("keeps certified deterministic authority and trust capability context across plans",()=>{
    const output=runCalculator(distanceTimeCalculator,{speed:15,time:4}).output;
    const zeroSpeed=runCalculator(distanceTimeCalculator,{speed:0,time:4}).output;
    const zeroTime=runCalculator(distanceTimeCalculator,{speed:15,time:0}).output;
    const structured=distanceTimeResult(output);
    expect(distanceTimeCalculator.reviewStatus).toBe("certified");
    expect(distanceTimeCalculator.riskClass).toBe("standard");
    expect(output.value).toBe(60);
    expect(zeroSpeed.value).toBe(0);
    expect(zeroTime.value).toBe(0);
    expect(structured.primaryResult.value).toBe(output.value);
    expect(structured.primaryResult.unit).toBeUndefined();
    expect(distanceTimePresentation.domain).toBe("physics");
    expect(distanceTimePresentation.family).toBe("simple-scalar");
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
