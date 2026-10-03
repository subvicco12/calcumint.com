import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { momentumCalculator } from "../physics/catalog-batch-2";

describe("Momentum Calculator Final-renderer readiness",()=>{
  it("keeps the certified deterministic engine authoritative before renderer migration",()=>{
    expect(momentumCalculator.riskClass).toBe("standard");
    expect(momentumCalculator.reviewStatus).toBe("certified");
    expect(momentumCalculator.formulas?.length).toBeGreaterThan(0);
    expect(momentumCalculator.sources?.length).toBeGreaterThan(0);
    expect(momentumCalculator.goldenTests?.length).toBeGreaterThan(0);
    const output=runCalculator(momentumCalculator,{mass:2,velocity:3}).output;
    expect(output.value).toBe(6);
  });
  it("preserves signed velocity semantics",()=>{
    const output=runCalculator(momentumCalculator,{mass:2,velocity:-3}).output;
    expect(output.value).toBe(-6);
  });
});
