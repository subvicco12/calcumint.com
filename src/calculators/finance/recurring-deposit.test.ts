import { describe, expect, it } from "vitest";
import { recurringDepositCalculator, recurringDepositFutureValue, requiredMonthlyRecurringDeposit } from "./recurring-deposit";

describe("recurring deposit engine", () => {
  it("handles zero interest deterministically", () => {
    expect(recurringDepositFutureValue(1000, 0, 24, "beginning")).toBe(24000);
  });

  it("beginning deposits earn more than end deposits", () => {
    const beginning = recurringDepositFutureValue(5000, 8, 60, "beginning");
    const end = recurringDepositFutureValue(5000, 8, 60, "end");
    expect(beginning).toBeGreaterThan(end);
  });

  it("reverse-solves the monthly deposit for a target maturity", () => {
    const required = requiredMonthlyRecurringDeposit(1_000_000, 7, 120, "beginning");
    expect(recurringDepositFutureValue(required, 7, 120, "beginning")).toBeCloseTo(1_000_000, 6);
  });

  it("reports deposits and interest separately", () => {
    const result = recurringDepositCalculator.calculate({ monthlyDeposit: 10000, annualInterestPercent: 7, termMonths: 60, depositTiming: "beginning" }, {});
    expect(result.depositedAmount).toBe(600000);
    expect(result.maturityValue).toBeGreaterThan(result.depositedAmount);
    expect(result.interestEarned).toBeCloseTo(result.maturityValue - result.depositedAmount, 2);
  });

  it("rejects maturity projections outside supported numeric range", () => {
    expect(() => recurringDepositFutureValue(Number.MAX_VALUE, 100, 1200, "beginning")).toThrow(/supported numeric range/);
  });
  it("rejects unsafe direct solver inputs",()=>{expect(recurringDepositFutureValue(Number.POSITIVE_INFINITY,7,12)).toBe(0);expect(()=>recurringDepositFutureValue(1000,-1,12)).toThrow();expect(recurringDepositFutureValue(1000,7,12.5)).toBe(0);expect(requiredMonthlyRecurringDeposit(Number.POSITIVE_INFINITY,7,12)).toBe(0);expect(()=>requiredMonthlyRecurringDeposit(100000,-1,12)).toThrow();expect(()=>recurringDepositFutureValue(1000,101,12)).toThrow();expect(recurringDepositFutureValue(1000,7,1201)).toBe(0);expect(()=>recurringDepositFutureValue(1000,7,12,"middle" as "end")).toThrow(/timing/);});
});
