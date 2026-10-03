import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {pressureCalculator} from "../physics/catalog-batch-2";
import {pressureResult} from "./pressure-adapter";
import {pressurePresentation} from "./pressure-presentation";
import {rendererTrustSurface} from "./renderer-trust-surface";
import {capabilitiesFor} from "./entitlements";

describe("Pressure Calculator post-migration authority",()=>{
  it("keeps one certified deterministic force-over-area result and trust capability context across plans",()=>{
    const output=runCalculator(pressureCalculator,{force:120,area:3}).output;
    const zero=runCalculator(pressureCalculator,{force:0,area:3}).output;
    const structured=pressureResult(output);
    expect(pressureCalculator.reviewStatus).toBe("certified");
    expect(pressureCalculator.riskClass).toBe("standard");
    expect(output.value).toBe(40);
    expect(zero.value).toBe(0);
    expect(structured.primaryResult.value).toBe(output.value);
    expect(structured.primaryResult.unit).toBeUndefined();
    expect(pressurePresentation.domain).toBe("physics");
    expect(pressurePresentation.family).toBe("simple-scalar");
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
