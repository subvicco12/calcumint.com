import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { loanAnalysisCalculator } from "../finance/loan-analysis";
import { loanResult } from "./adapters";
import { inspectScheduleContract } from "./schedule-contract";

describe("authoritative Loan checkpoint metadata", () => {
  it("uses supplied authoritative amortization for direct extra-payment adapters", () => {
    const input = { principal: 100000, annualRatePercent: 6, termMonths: 360, extraMonthlyPayment: 100 };
    const output = runCalculator(loanAnalysisCalculator, input).output;
    const result = loanResult(input, output);
    expect(result.schedule?.at(-1)?.period).toBe(output.payoffMonths);
    expect(inspectScheduleContract(result.schedule!, result.scheduleMetadata!)).toEqual([]);
    expect(result.schedule?.[0]?.values.payment).toBe(output.amortization[0].payment);
  });
  it("declares real engine row meanings without guessing currency or complete totals", () => {
    const input = { principal: 100000, annualRatePercent: 6, termMonths: 360, extraMonthlyPayment: 100 };
    const output = runCalculator(loanAnalysisCalculator, input).output;
    const rows = output.amortization.filter(row => row.month === 1 || row.month % 12 === 0 || row.month === output.payoffMonths)
      .map(row => ({ id: String(row.month), period: row.month, values: { payment: row.payment, principal: row.principal, interest: row.interest, balance: row.balance } }));
    const result = loanResult(input, output, rows);
    expect(result.scheduleMetadata?.granularity).toBe("checkpoints");
    expect(result.scheduleMetadata?.period).toEqual({ key: "month", label: "Month", unit: "months" });
    expect(result.scheduleMetadata?.columns.map(column => column.label)).toEqual(["Payment", "Principal paid", "Interest paid", "Remaining balance"]);
    expect(result.scheduleMetadata?.columns.every(column => column.unit === undefined)).toBe(true);
    expect(inspectScheduleContract(result.schedule!, result.scheduleMetadata!)).toEqual([]);
    expect(result.schedule?.at(-1)?.period).toBe(output.payoffMonths);
    expect(result.schedule?.at(-1)?.values.balance).toBe(0);
    for (const row of result.schedule!) {
      const source = output.amortization.find(item => item.month === row.period)!;
      expect(row.values).toEqual({ payment: source.payment, principal: source.principal, interest: source.interest, balance: source.balance });
    }
  });
});
