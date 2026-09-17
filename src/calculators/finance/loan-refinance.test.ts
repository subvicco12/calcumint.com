import { describe, expect, it } from "vitest";
import { compareLoanRefinance, loanRefinanceCalculator } from "./loan-refinance";

describe("loan refinance engine", () => {
  it("shows savings for a lower-rate same-term refinance with no costs", () => {
    const result = compareLoanRefinance({ remainingBalance: 250000, currentAnnualRatePercent: 7, currentRemainingMonths: 240, newAnnualRatePercent: 5.5, newTermMonths: 240, refinanceCosts: 0 });
    expect(result.newMonthlyPayment).toBeLessThan(result.currentMonthlyPayment);
    expect(result.grossInterestSavings).toBeGreaterThan(0);
    expect(result.netLifetimeSavings).toBe(result.grossInterestSavings);
    expect(result.breakEvenMonths).toBe(0);
  });

  it("can identify costs that erase lifetime savings", () => {
    const result = compareLoanRefinance({ remainingBalance: 250000, currentAnnualRatePercent: 7, currentRemainingMonths: 240, newAnnualRatePercent: 6.75, newTermMonths: 240, refinanceCosts: 50000 });
    expect(result.netLifetimeSavings).toBeLessThan(0);
  });

  it("reports no payment-based break-even when the replacement payment is not lower", () => {
    const result = compareLoanRefinance({ remainingBalance: 200000, currentAnnualRatePercent: 5, currentRemainingMonths: 240, newAnnualRatePercent: 5, newTermMonths: 180, refinanceCosts: 3000 });
    expect(result.newMonthlyPayment).toBeGreaterThan(result.currentMonthlyPayment);
    expect(result.breakEvenMonths).toBeNull();
  });

  it("keeps same-rate same-term economics equal before refinance costs", () => {
    const result = compareLoanRefinance({ remainingBalance: 100000, currentAnnualRatePercent: 6, currentRemainingMonths: 120, newAnnualRatePercent: 6, newTermMonths: 120, refinanceCosts: 2500 });
    expect(result.currentMonthlyPayment).toBe(result.newMonthlyPayment);
    expect(result.grossInterestSavings).toBeCloseTo(0, 2);
    expect(result.netLifetimeSavings).toBeCloseTo(-2500, 2);
    expect(result.breakEvenMonths).toBeNull();
  });

  it("exposes a structured calculator result", () => {
    const result = loanRefinanceCalculator.calculate({ remainingBalance: 300000, currentAnnualRatePercent: 7.25, currentRemainingMonths: 300, newAnnualRatePercent: 6, newTermMonths: 240, refinanceCosts: 4000 }, {});
    expect(Number.isFinite(result.currentRemainingInterest)).toBe(true);
    expect(Number.isFinite(result.newLoanInterest)).toBe(true);
    expect(result.refinanceCosts).toBe(4000);
  });
});
