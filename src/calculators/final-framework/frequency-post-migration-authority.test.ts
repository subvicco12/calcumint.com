import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {frequencyCalculator} from "../physics/catalog-batch-2";
import {frequencyResult} from "./frequency-adapter";
import {frequencyPresentation} from "./frequency-presentation";
import {rendererTrustSurface} from "./renderer-trust-surface";
import {capabilitiesFor} from "./entitlements";

describe("Frequency Calculator post-migration authority",()=>{
  it("keeps one certified deterministic cycles-over-time result and trust capability context across plans",()=>{
    const output=runCalculator(frequencyCalculator,{cycles:30,time:6}).output;
    const zero=runCalculator(frequencyCalculator,{cycles:0,time:6}).output;
    const structured=frequencyResult(output);
    expect(frequencyCalculator.reviewStatus).toBe("certified");
    expect(frequencyCalculator.riskClass).toBe("standard");
    expect(output.value).toBe(5);
    expect(zero.value).toBe(0);
    expect(structured.primaryResult.value).toBe(output.value);
    expect(structured.primaryResult.unit).toBeUndefined();
    expect(frequencyPresentation.domain).toBe("physics");
    expect(frequencyPresentation.family).toBe("simple-scalar");
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
