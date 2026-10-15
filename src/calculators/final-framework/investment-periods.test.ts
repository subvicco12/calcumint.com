import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { sipCalculator } from "../finance/sip";
import { compoundInterestCalculator } from "../finance/compound-interest";
import { compoundPeriodResult, sipPeriodResult } from "./investment-periods";
import { inspectScheduleContract } from "./schedule-contract";

describe("certified investment prefix projections", () => {
  it.each(["beginning", "end"] as const)("preserves every monthly SIP prefix and exact terminal for %s contributions", contributionTiming => {
    const input = { monthlyContribution: 0.001, annualReturnPercent: -20, termMonths: 25, contributionTiming };
    const output = runCalculator(sipCalculator, input).output;
    const result = sipPeriodResult(input, output);
    expect(result.schedule).toHaveLength(25);
    for (const row of result.schedule!) {
      const prefix = runCalculator(sipCalculator, { ...input, termMonths: row.period }).output;
      expect(row.values).toEqual(prefix);
    }
    expect(result.schedule!.at(-1)!.values).toEqual(output);
    expect(inspectScheduleContract(result.schedule!, result.scheduleMetadata!)).toEqual([]);
    expect(result.series![0].points).toEqual(result.schedule!.map(row => ({ x: row.period, y: row.values.futureValue })));
    expect(result.primaryResult.value).toBe(output.futureValue);
  });
  it.each([0, 0.25, 1.125, 2])("includes unique compounding boundaries and exact fractional terminal at %s years", years => {
    const input = { principal: 10000, annualRatePercent: -5, years, compoundsPerYear: 12 };
    const output = runCalculator(compoundInterestCalculator, input).output;
    const result = compoundPeriodResult(input, output);
    expect(new Set(result.schedule!.map(row => row.period)).size).toBe(result.schedule!.length);
    expect(result.schedule!.at(-1)!.period).toBe(years);
    for (const row of result.schedule!) expect(row.values).toEqual({ elapsedYears: String(row.period), ...runCalculator(compoundInterestCalculator, { ...input, years: row.period }).output });
    expect(result.schedule!.at(-1)!.values).toEqual({ elapsedYears: String(years), ...output });
    expect(inspectScheduleContract(result.schedule!, result.scheduleMetadata!)).toEqual([]);
  });
  it("rejects invalid bounds and inconsistent terminal results before constructing projection rows", () => {
    const input = { monthlyContribution: 10, annualReturnPercent: 0, termMonths: 12, contributionTiming: "end" as const };
    const output = runCalculator(sipCalculator, input).output;
    expect(() => sipPeriodResult({ ...input, termMonths: 1201 }, output)).toThrow();
    expect(() => sipPeriodResult(input, { ...output, futureValue: output.futureValue + 1 })).toThrow(/reconcile/);
    expect(() => sipPeriodResult(input, { ...output, estimatedGain: Infinity })).toThrow(/reconcile/);
    const compoundInput = { principal: 100, annualRatePercent: 5, years: 1, compoundsPerYear: 12 };
    const compoundOutput = runCalculator(compoundInterestCalculator, compoundInput).output;
    expect(() => compoundPeriodResult({ ...compoundInput, compoundsPerYear: 0 }, compoundOutput)).toThrow();
    expect(() => compoundPeriodResult(compoundInput, { ...compoundOutput, totalInterest: NaN })).toThrow(/reconcile/);
  });
  it("preserves certified published golden examples exactly", () => {
    for (const example of sipCalculator.examples!) {
      const output = runCalculator(sipCalculator, example.input).output;
      expect(output).toEqual(example.expected);
      expect(sipPeriodResult(example.input, output).schedule!.at(-1)!.values).toEqual(example.expected);
    }
    for (const example of compoundInterestCalculator.examples!) {
      const output = runCalculator(compoundInterestCalculator, example.input).output;
      expect(output).toEqual(example.expected);
      expect(compoundPeriodResult(example.input, output).schedule!.at(-1)!.values).toEqual({ elapsedYears: String(example.input.years), ...example.expected });
    }
  });
  it("bounds high-frequency compound projections explicitly as checkpoints and keeps exact terminal", () => {
    const input = { principal: 100, annualRatePercent: 1, years: 200, compoundsPerYear: 365 };
    const output = runCalculator(compoundInterestCalculator, input).output;
    const result = compoundPeriodResult(input, output);
    expect(result.schedule!.length).toBeLessThanOrEqual(1200);
    expect(result.scheduleMetadata!.granularity).toBe("checkpoints");
    expect(result.schedule!.at(-1)!.values).toEqual({ elapsedYears: String(input.years), ...output });
    expect(result.series![0].points.at(-1)!.y).toBe(output.futureValue);
  });
  it("keeps the maximum supported SIP term complete", () => {
    const input = { monthlyContribution: 10, annualReturnPercent: 0, termMonths: 1200, contributionTiming: "end" as const };
    const output = runCalculator(sipCalculator, input).output;
    const result = sipPeriodResult(input, output);
    expect(result.schedule).toHaveLength(1200);
    expect(result.scheduleMetadata!.granularity).toBe("complete");
    expect(result.schedule!.at(-1)!.values.futureValue).toBe(12000);
  });
});
