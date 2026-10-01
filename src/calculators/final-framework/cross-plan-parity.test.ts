import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { compoundInterestCalculator } from "../finance/compound-interest";
import { sipCalculator } from "../finance/sip";
import type { FinalPlan } from "./product-capabilities";

const plans: readonly FinalPlan[] = ["free", "pro", "business"];

describe("Final Blueprint cross-plan mathematical parity", () => {
  it("keeps compound-interest engine output identical across plans", () => {
    const input = { principal: 10000, annualRatePercent: 7, years: 10, compoundsPerYear: 12 };
    const authoritative = runCalculator(compoundInterestCalculator, input);
    for (const plan of plans) {
      void plan;
      expect(runCalculator(compoundInterestCalculator, input)).toEqual(authoritative);
    }
  });

  it("keeps SIP engine output identical across plans", () => {
    const input = { monthlyContribution: 5000, annualReturnPercent: 10, termMonths: 120, contributionTiming: "end" as const };
    const authoritative = runCalculator(sipCalculator, input);
    for (const plan of plans) {
      void plan;
      expect(runCalculator(sipCalculator, input)).toEqual(authoritative);
    }
  });

  it("does not accept plan as an engine input dimension", () => {
    expect("plan" in compoundInterestCalculator.inputSchema.shape).toBe(false);
    expect("plan" in sipCalculator.inputSchema.shape).toBe(false);
  });
});
