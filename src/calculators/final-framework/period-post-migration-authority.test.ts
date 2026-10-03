import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {periodCalculator} from "../physics/catalog-batch-2";
import {periodResult} from "./period-adapter";
import {periodPresentation} from "./period-presentation";
import {rendererTrustSurface} from "./renderer-trust-surface";
import {capabilitiesFor} from "./entitlements";

describe("Period Calculator post-migration authority",()=>{
  it("keeps one certified deterministic reciprocal-frequency result and free trust surface across plans",()=>{
    const output=runCalculator(periodCalculator,{frequency:4}).output;
    const structured=periodResult(output);
    expect(periodCalculator.reviewStatus).toBe("certified");
    expect(periodCalculator.riskClass).toBe("standard");
    expect(output.value).toBe(0.25);
    expect(structured.primaryResult.value).toBe(output.value);
    expect(structured.primaryResult.unit).toBeUndefined();
    expect(periodPresentation.domain).toBe("physics");
    expect(periodPresentation.family).toBe("simple-scalar");
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
