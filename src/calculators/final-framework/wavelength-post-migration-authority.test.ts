import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {wavelengthCalculator} from "../physics/catalog-batch-2";
import {wavelengthResult} from "./wavelength-adapter";
import {wavelengthPresentation} from "./wavelength-presentation";
import {rendererTrustSurface} from "./renderer-trust-surface";
import {capabilitiesFor} from "./entitlements";

describe("Wavelength Calculator post-migration authority",()=>{
  it("keeps one certified deterministic wave-speed-over-frequency result and trust capability context across plans",()=>{
    const output=runCalculator(wavelengthCalculator,{waveSpeed:360,frequency:180}).output;
    const zero=runCalculator(wavelengthCalculator,{waveSpeed:0,frequency:180}).output;
    const structured=wavelengthResult(output);
    expect(wavelengthCalculator.reviewStatus).toBe("certified");
    expect(wavelengthCalculator.riskClass).toBe("standard");
    expect(output.value).toBe(2);
    expect(zero.value).toBe(0);
    expect(structured.primaryResult.value).toBe(output.value);
    expect(structured.primaryResult.unit).toBeUndefined();
    expect(wavelengthPresentation.domain).toBe("physics");
    expect(wavelengthPresentation.family).toBe("simple-scalar");
    for(const plan of ["free","pro","business"] as const){
      expect(capabilitiesFor(plan)).toContain("coreCalculation");
      expect(capabilitiesFor(plan)).toContain("methodology");
    }
    expect(rendererTrustSurface(structured)?.sources.length).toBeGreaterThan(0);
  });
});
