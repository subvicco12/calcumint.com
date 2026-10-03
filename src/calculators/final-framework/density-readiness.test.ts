import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {densityCalculator} from "../physics/catalog-batch-2";

describe("Density Calculator Final-renderer readiness",()=>{
  it("is certified standard-risk with deterministic metadata and golden evidence",()=>{
    expect(densityCalculator.riskClass).toBe("standard");
    expect(densityCalculator.reviewStatus).toBe("certified");
    expect(densityCalculator.formulas.length).toBeGreaterThan(0);
    expect(densityCalculator.sources.length).toBeGreaterThan(0);
    expect(densityCalculator.goldenTests?.length ?? 0).toBeGreaterThan(0);
  });
  it("keeps the authoritative mass-over-volume engine deterministic",()=>{
    const first=runCalculator(densityCalculator,{mass:10,volume:2}).output;
    const second=runCalculator(densityCalculator,{mass:10,volume:2}).output;
    expect(first.value).toBe(5);
    expect(second).toEqual(first);
    expect(first.steps).toEqual(["Density = mass / volume = 5"]);
  });
  it("accepts zero mass but rejects zero volume at the definition boundary",()=>{
    expect(densityCalculator.inputSchema.safeParse({mass:0,volume:2}).success).toBe(true);
    expect(densityCalculator.inputSchema.safeParse({mass:10,volume:0}).success).toBe(false);
  });
});
