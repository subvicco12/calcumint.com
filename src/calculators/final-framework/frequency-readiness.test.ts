import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {frequencyCalculator} from "../physics/catalog-batch-2";

describe("Frequency Calculator Final-renderer readiness",()=>{
  it("is certified standard-risk with deterministic metadata and golden evidence",()=>{
    expect(frequencyCalculator.riskClass).toBe("standard");
    expect(frequencyCalculator.reviewStatus).toBe("certified");
    expect(frequencyCalculator.formulas.length).toBeGreaterThan(0);
    expect(frequencyCalculator.sources.length).toBeGreaterThan(0);
    expect(frequencyCalculator.goldenTests?.length ?? 0).toBeGreaterThan(0);
  });
  it("keeps the authoritative cycles-over-time engine deterministic",()=>{
    const first=runCalculator(frequencyCalculator,{cycles:20,time:4}).output;
    const second=runCalculator(frequencyCalculator,{cycles:20,time:4}).output;
    expect(first.value).toBe(5);
    expect(second).toEqual(first);
    expect(first.steps).toEqual(["Frequency = cycles / time = 5"]);
  });
  it("accepts zero cycles but rejects zero time at the definition boundary",()=>{
    expect(frequencyCalculator.inputSchema.safeParse({cycles:0,time:4}).success).toBe(true);
    expect(frequencyCalculator.inputSchema.safeParse({cycles:20,time:0}).success).toBe(false);
  });
});
