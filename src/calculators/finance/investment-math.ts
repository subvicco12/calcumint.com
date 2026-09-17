import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  presentValue: z.number().finite().positive(),
  annualReturnPercent: z.number().finite().min(-99).max(1000),
  years: z.number().finite().positive().max(200),
  inflationPercent: z.number().finite().min(-99).max(1000).default(0)
});

type Input = z.infer<typeof inputSchema>;
type Output = { futureValue: number; inflationAdjustedFutureValue: number; realAnnualReturnPercent: number };

function requireFinite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} exceeds supported numeric range`);
  return value;
}

export function futureValue(presentValue: number, annualReturnPercent: number, years: number): number {
  return requireFinite(presentValue * (1 + annualReturnPercent / 100) ** years, "Future value");
}

export function presentValueFromFuture(future: number, annualReturnPercent: number, years: number): number {
  return requireFinite(future / (1 + annualReturnPercent / 100) ** years, "Present value");
}

export function cagr(beginningValue: number, endingValue: number, years: number): number {
  if (beginningValue <= 0 || endingValue < 0 || years <= 0) throw new Error("CAGR requires positive beginning value, non-negative ending value and positive years");
  return requireFinite(((endingValue / beginningValue) ** (1 / years) - 1) * 100, "CAGR");
}

export function realReturnPercent(nominalPercent: number, inflationPercent: number): number {
  return requireFinite(((1 + nominalPercent / 100) / (1 + inflationPercent / 100) - 1) * 100, "Real return");
}

export const investmentMathCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.investment-math",
  slug: "investment-growth-calculator",
  title: "Investment Growth & Real Return Calculator",
  category: "finance-investment",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ presentValue, annualReturnPercent, years, inflationPercent }) => {
    const nominalFuture = futureValue(presentValue, annualReturnPercent, years);
    const realRate = realReturnPercent(annualReturnPercent, inflationPercent);
    return {
      futureValue: roundTo(nominalFuture, 2),
      inflationAdjustedFutureValue: roundTo(futureValue(presentValue, realRate, years), 2),
      realAnnualReturnPercent: roundTo(realRate, 4)
    };
  },
  formulas: [
    { id: "future-value", expression: "FV = PV × (1+r)^t", description: "Compound future value." },
    { id: "real-return", expression: "real = (1+nominal)/(1+inflation) - 1", description: "Exact Fisher relationship for inflation-adjusted return." }
  ],
  sources: [],
  examples: [],
  jurisdictions: [{ country: "GLOBAL" }],
  reverseSolvers: [{ id: "present-value", target: "presentValue", description: "Solve the present capital required for a target future value." }],
  relatedCalculators: ["compound-interest-calculator", "sip-calculator", "step-up-sip-calculator"],
  journeyMemberships: ["invest-for-a-goal", "plan-retirement"]
};
