import { describe, expect, it } from "vitest";
import { loanPaymentCalculator } from "../finance/loan-payment";
import { bmiCalculator } from "../health/bmi";
import { breakEvenCalculator } from "../business/break-even";

describe("Reference Six route bindings", () => {
  it("keeps authoritative calculator slugs stable for wired references", () => {
    expect(loanPaymentCalculator.slug).toBeTruthy();
    expect(bmiCalculator.slug).toBeTruthy();
    expect(breakEvenCalculator.slug).toBeTruthy();
    expect(new Set([loanPaymentCalculator.slug, bmiCalculator.slug, breakEvenCalculator.slug]).size).toBe(3);
  });
});
