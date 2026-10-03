import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {wavelengthCalculator} from "../physics/catalog-batch-2";

describe("Wavelength Calculator Final-renderer readiness",()=>{
  it("is certified standard-risk with deterministic metadata and golden evidence",()=>{
    expect(wavelengthCalculator.riskClass).toBe("standard");expect(wavelengthCalculator.reviewStatus).toBe("certified");expect(wavelengthCalculator.formulas.length).toBeGreaterThan(0);expect(wavelengthCalculator.sources.length).toBeGreaterThan(0);expect(wavelengthCalculator.goldenTests?.length ?? 0).toBeGreaterThan(0);
  });
  it("keeps the authoritative wave-speed-over-frequency engine deterministic",()=>{
    const first=runCalculator(wavelengthCalculator,{waveSpeed:340,frequency:170}).output;const second=runCalculator(wavelengthCalculator,{waveSpeed:340,frequency:170}).output;expect(first.value).toBe(2);expect(second).toEqual(first);expect(first.steps).toEqual(["Wavelength = wave speed / frequency = 2"]);
  });
  it("accepts zero wave speed but rejects zero frequency at the definition boundary",()=>{
    expect(wavelengthCalculator.inputSchema.safeParse({waveSpeed:0,frequency:170}).success).toBe(true);expect(wavelengthCalculator.inputSchema.safeParse({waveSpeed:340,frequency:0}).success).toBe(false);
  });
});
