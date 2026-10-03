import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { speedCalculator } from "../physics/catalog-batch-1";
import { speedResult } from "./speed-adapter";
import { rendererTrustSurface } from "./renderer-trust-surface";
import { capabilitiesFor } from "./entitlements";

describe("Speed Calculator post-migration authority",()=>{
  it("keeps one certified deterministic result and free trust surface across plans",()=>{
    const input={distance:42,time:6};
    const output=runCalculator(speedCalculator,input).output;
    const structured=speedResult(output);
    expect(speedCalculator.reviewStatus).toBe("certified");
    expect(speedCalculator.riskClass).toBe("standard");
    expect(structured.primaryResult.value).toBe(output.value);
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.methodology).toContain("certified deterministic");
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
