import { describe, expect, it } from "vitest";
import { requiredInitialStepUpSip, stepUpSipCalculator, stepUpSipFutureValue } from "./step-up-sip";

describe("step-up SIP engine", () => {
  it("matches a flat SIP when annual step-up is zero", () => {
    const result = stepUpSipFutureValue(1000, 0, 0, 24, "beginning");
    expect(result.futureValue).toBe(24000);
    expect(result.investedAmount).toBe(24000);
    expect(result.finalMonthlyContribution).toBe(1000);
  });

  it("steps the monthly contribution after each completed year", () => {
    const result = stepUpSipFutureValue(1000, 10, 0, 25, "beginning");
    expect(result.finalMonthlyContribution).toBeCloseTo(1210, 8);
    expect(result.investedAmount).toBeCloseTo(12000 + 13200 + 1210, 8);
  });

  it("reverse-solves the initial contribution for a target corpus", () => {
    const required = requiredInitialStepUpSip(2500000, 10, 10, 180, "beginning");
    const projected = stepUpSipFutureValue(required, 10, 10, 180, "beginning").futureValue;
    expect(projected).toBeCloseTo(2500000, 5);
  });

  it("reports investment, gain and final contribution separately", () => {
    const result = stepUpSipCalculator.calculate({ initialMonthlyContribution: 10000, annualStepUpPercent: 10, annualReturnPercent: 10, termMonths: 120, contributionTiming: "beginning" }, {});
    expect(result.futureValue).toBeGreaterThan(result.investedAmount);
    expect(result.estimatedGain).toBeCloseTo(result.futureValue - result.investedAmount, 2);
    expect(result.finalMonthlyContribution).toBeGreaterThan(10000);
  });

  it("rejects projections that exceed supported numeric range", () => {
    expect(() => stepUpSipFutureValue(Number.MAX_VALUE, 1000, 1000, 1200, "beginning")).toThrow(/supported numeric range/);
  });

  it("keeps demanding but finite step-up scenarios supported", () => {
    const result = stepUpSipFutureValue(10000, 20, 15, 360, "beginning");
    expect(Number.isFinite(result.futureValue)).toBe(true);
    expect(Number.isFinite(result.investedAmount)).toBe(true);
    expect(result.futureValue).toBeGreaterThan(result.investedAmount);
  });
  it("rejects unsafe direct-helper inputs",()=>{expect(()=>stepUpSipFutureValue(-1,10,8,12)).toThrow();expect(()=>stepUpSipFutureValue(100,Number.NaN,8,12)).toThrow();expect(()=>stepUpSipFutureValue(100,10,-100,12)).toThrow();expect(()=>stepUpSipFutureValue(100,10,8,12.5)).toThrow();expect(requiredInitialStepUpSip(Number.POSITIVE_INFINITY,10,8,12)).toBe(0);expect(requiredInitialStepUpSip(100000,10,8,12.5)).toBe(0);});
});
