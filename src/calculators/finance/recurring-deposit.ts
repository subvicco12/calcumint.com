import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  monthlyDeposit: z.number().finite().positive(),
  annualInterestPercent: z.number().finite().min(0).max(100),
  termMonths: z.number().int().min(1).max(1200),
  depositTiming: z.enum(["beginning", "end"]).default("beginning")
});

type Input = z.infer<typeof inputSchema>;
type Output = { maturityValue: number; depositedAmount: number; interestEarned: number };

function requireFinite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} exceeds supported numeric range`);
  return value;
}

export function recurringDepositFutureValue(monthlyDeposit: number, annualInterestPercent: number, termMonths: number, timing: "beginning" | "end" = "beginning"): number {
  if(!Number.isFinite(monthlyDeposit)||monthlyDeposit<=0)return 0;
  if(!Number.isFinite(annualInterestPercent)||annualInterestPercent<0||annualInterestPercent>100)throw new Error("Annual interest must be non-negative and finite");
  if(!Number.isInteger(termMonths)||termMonths<1||termMonths>1200)return 0;
  if(timing!=="beginning"&&timing!=="end")throw new Error("Unsupported deposit timing");
  const monthlyRate = annualInterestPercent / 100 / 12;
  if (monthlyRate === 0) return requireFinite(monthlyDeposit * termMonths, "Maturity value");
  const ordinary = monthlyDeposit * (((1 + monthlyRate) ** termMonths - 1) / monthlyRate);
  return requireFinite(timing === "beginning" ? ordinary * (1 + monthlyRate) : ordinary, "Maturity value");
}

export function requiredMonthlyRecurringDeposit(targetMaturityValue: number, annualInterestPercent: number, termMonths: number, timing: "beginning" | "end" = "beginning"): number {
  if(!Number.isFinite(targetMaturityValue)||targetMaturityValue<=0)return 0;
  if(!Number.isFinite(annualInterestPercent)||annualInterestPercent<0||annualInterestPercent>100)throw new Error("Annual interest must be non-negative and finite");
  if(!Number.isInteger(termMonths)||termMonths<1||termMonths>1200)return 0;
  const factor = recurringDepositFutureValue(1, annualInterestPercent, termMonths, timing);
  return requireFinite(targetMaturityValue / factor, "Required monthly deposit");
}

export const recurringDepositCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.recurring-deposit",
  slug: "recurring-deposit-calculator",
  title: "Recurring Deposit Calculator",
  category: "finance-investment",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ monthlyDeposit, annualInterestPercent, termMonths, depositTiming }) => {
    const maturityValue = roundTo(recurringDepositFutureValue(monthlyDeposit, annualInterestPercent, termMonths, depositTiming), 2);
    const depositedAmount = roundTo(monthlyDeposit * termMonths, 2);
    return { maturityValue, depositedAmount, interestEarned: roundTo(maturityValue - depositedAmount, 2) };
  },
  formulas: [{ id: "recurring-deposit-future-value", expression: "FV = D × ((1+i)^n - 1) / i; beginning timing multiplies by (1+i)", description: "Generic monthly recurring-deposit future-value model. Institution- or jurisdiction-specific compounding conventions require a certified rule pack." }],
  sources: [],
  examples: [],
  jurisdictions: [{ country: "GLOBAL" }],
  ui: { simpleInputKeys: ["monthlyDeposit","annualInterestPercent","termMonths"], advancedInputKeys: ["depositTiming"] },
  reverseSolvers: [{ id: "target-monthly-deposit", target: "monthlyDeposit", description: "Solve the monthly recurring deposit required for a target maturity value." }],
  relatedCalculators: ["fixed-term-deposit-calculator", "sip-calculator", "investment-growth-calculator"],
  journeyMemberships: ["invest-for-a-goal", "plan-retirement"]
};
