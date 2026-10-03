import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {velocityCalculator} from "../physics/catalog-batch-1";

describe("Velocity Calculator Final-renderer readiness",()=>{
  it("is certified standard-risk with deterministic metadata and golden evidence",()=>{
    expect(velocityCalculator.riskClass).toBe("standard");
    expect(velocityCalculator.reviewStatus).toBe("certified");
    expect(velocityCalculator.formulas.length).toBeGreaterThan(0);
    expect(velocityCalculator.sources.length).toBeGreaterThan(0);
    expect(velocityCalculator.goldenTests?.length ?? 0).toBeGreaterThan(0);
  });
  it("preserves signed displacement in the authoritative engine",()=>{
    const first=runCalculator(velocityCalculator,{displacement:-30,time:10}).output;
    const second=runCalculator(velocityCalculator,{displacement:-30,time:10}).output;
    expect(first.value).toBe(-3);
    expect(second).toEqual(first);
    expect(first.steps).toEqual(["Average velocity = displacement / time = -3"]);
  });
  it("accepts zero displacement but rejects zero elapsed time",()=>{
    expect(velocityCalculator.inputSchema.safeParse({displacement:0,time:10}).success).toBe(true);
    expect(velocityCalculator.inputSchema.safeParse({displacement:30,time:0}).success).toBe(false);
  });
});
