import { describe, expect, it } from "vitest";
import { simulateSwp, sustainableMonthlyWithdrawal, swpCalculator } from "./swp";

describe("SWP engine", () => {
  it("withdraws a zero-return corpus evenly", () => {
    expect(sustainableMonthlyWithdrawal(120000, 0, 12, "end")).toBeCloseTo(10000, 8);
    const result = simulateSwp(120000, 10000, 0, 12, "end");
    expect(result.endingCorpus).toBeCloseTo(0, 8);
    expect(result.totalWithdrawn).toBeCloseTo(120000, 8);
  });

  it("reverse-solves a sustainable withdrawal for positive returns", () => {
    const withdrawal = sustainableMonthlyWithdrawal(1000000, 8, 120, "end");
    const result = simulateSwp(1000000, withdrawal, 8, 120, "end");
    expect(result.endingCorpus).toBeCloseTo(0, 4);
    expect(result.depletionMonth).toBe(120);
  });

  it("detects early corpus depletion", () => {
    const result = simulateSwp(10000, 3000, 0, 12, "end");
    expect(result.depleted).toBe(true);
    expect(result.depletionMonth).toBe(4);
    expect(result.totalWithdrawn).toBe(10000);
  });

  it("supports beginning-of-period withdrawals", () => {
    const end = sustainableMonthlyWithdrawal(100000, 12, 24, "end");
    const beginning = sustainableMonthlyWithdrawal(100000, 12, 24, "beginning");
    expect(beginning).toBeLessThan(end);
  });

  it("returns structured calculator output", () => {
    const result = swpCalculator.calculate({ initialCorpus: 500000, monthlyWithdrawal: 5000, annualReturnPercent: 8, termMonths: 60, withdrawalTiming: "end" }, {});
    expect(result.totalWithdrawn).toBeGreaterThan(0);
    expect(result.endingCorpus).toBeGreaterThanOrEqual(0);
  });
});
