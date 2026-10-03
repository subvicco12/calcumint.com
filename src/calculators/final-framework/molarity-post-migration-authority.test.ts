import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { molarityCalculator } from "../chemistry/catalog-batch-1";
import { molarityResult } from "./molarity-adapter";
import { rendererTrustSurface } from "./renderer-trust-surface";
import { capabilitiesFor } from "./entitlements";

describe("Molarity Calculator post-migration authority",()=>{
  it("keeps one certified deterministic mol/L result and free trust surface across plans",()=>{
    const output=runCalculator(molarityCalculator,{moles:3,solutionVolumeLiters:2}).output;
    const structured=molarityResult(output);
    expect(molarityCalculator.reviewStatus).toBe("certified");
    expect(molarityCalculator.riskClass).toBe("standard");
    expect(structured.primaryResult.value).toBe(output.value);
    expect(structured.primaryResult.unit).toBe("mol/L");
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
