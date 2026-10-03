import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {pressureCalculator} from "../physics/catalog-batch-2";

describe("Pressure Calculator Final-renderer readiness",()=>{
  it("is certified standard-risk with deterministic metadata and golden evidence",()=>{
    expect(pressureCalculator.riskClass).toBe("standard");
    expect(pressureCalculator.reviewStatus).toBe("certified");
    expect(pressureCalculator.formulas.length).toBeGreaterThan(0);
    expect(pressureCalculator.sources.length).toBeGreaterThan(0);
    expect(pressureCalculator.goldenTests?.length ?? 0).toBeGreaterThan(0);
  });
  it("keeps the authoritative force-over-area engine deterministic",()=>{
    const first=runCalculator(pressureCalculator,{force:100,area:2}).output;
    const second=runCalculator(pressureCalculator,{force:100,area:2}).output;
    expect(first.value).toBe(50);
    expect(second).toEqual(first);
    expect(first.steps).toEqual(["Pressure = force / area = 50"]);
  });
  it("accepts zero force but rejects zero area at the definition boundary",()=>{
    expect(pressureCalculator.inputSchema.safeParse({force:0,area:2}).success).toBe(true);
    expect(pressureCalculator.inputSchema.safeParse({force:100,area:0}).success).toBe(false);
  });
});
