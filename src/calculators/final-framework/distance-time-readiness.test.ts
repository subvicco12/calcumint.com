import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {distanceTimeCalculator} from "../physics/catalog-batch-1";

describe("Distance-Time Calculator Final-renderer readiness",()=>{
  it("is certified standard-risk with deterministic metadata and golden evidence",()=>{
    expect(distanceTimeCalculator.riskClass).toBe("standard");
    expect(distanceTimeCalculator.reviewStatus).toBe("certified");
    expect(distanceTimeCalculator.formulas.length).toBeGreaterThan(0);
    expect(distanceTimeCalculator.sources.length).toBeGreaterThan(0);
    expect(distanceTimeCalculator.goldenTests?.length ?? 0).toBeGreaterThan(0);
  });
  it("preserves authoritative constant-speed multiplication",()=>{
    const first=runCalculator(distanceTimeCalculator,{speed:12,time:5}).output;
    const second=runCalculator(distanceTimeCalculator,{speed:12,time:5}).output;
    expect(first.value).toBe(60);
    expect(second).toEqual(first);
    expect(first.steps).toEqual(["Distance = speed × time = 60"]);
  });
  it("preserves valid zero boundaries and rejects negative inputs",()=>{
    expect(runCalculator(distanceTimeCalculator,{speed:0,time:5}).output.value).toBe(0);
    expect(runCalculator(distanceTimeCalculator,{speed:12,time:0}).output.value).toBe(0);
    expect(distanceTimeCalculator.inputSchema.safeParse({speed:-1,time:5}).success).toBe(false);
    expect(distanceTimeCalculator.inputSchema.safeParse({speed:12,time:-1}).success).toBe(false);
  });
});
