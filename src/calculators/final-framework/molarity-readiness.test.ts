import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { molarityCalculator } from "../chemistry/catalog-batch-1";

describe("Molarity Calculator Final-renderer readiness",()=>{
  it("keeps the certified deterministic chemistry engine authoritative before renderer migration",()=>{
    expect(molarityCalculator.riskClass).toBe("standard");
    expect(molarityCalculator.reviewStatus).toBe("certified");
    expect(molarityCalculator.formulas?.length).toBeGreaterThan(0);
    expect(molarityCalculator.sources?.length).toBeGreaterThan(0);
    expect(molarityCalculator.goldenTests?.length).toBeGreaterThan(0);
    const output=runCalculator(molarityCalculator,{moles:1,solutionVolumeLiters:2}).output;
    expect(output.value).toBe(0.5);
  });
  it("has one deterministic calculation path independent of plan presentation",()=>{
    const input={moles:3,solutionVolumeLiters:2};
    const a=runCalculator(molarityCalculator,input).output;
    const b=runCalculator(molarityCalculator,input).output;
    expect(b).toEqual(a);
  });
});
