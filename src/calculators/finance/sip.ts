import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  monthlyContribution: z.number().finite().positive(),
  annualReturnPercent: z.number().finite().min(-99).max(1000),
  termMonths: z.number().int().min(1).max(1200),
  contributionTiming: z.enum(["beginning", "end"]).default("beginning")
});

type Input = z.infer<typeof inputSchema>;
type Output = { futureValue: number; investedAmount: number; estimatedGain: number };

export function sipFutureValue(monthlyContribution: number, annualReturnPercent: number, termMonths: number, timing: "beginning" | "end" = "beginning"): number {
  if(!Number.isFinite(monthlyContribution)||monthlyContribution<0)throw new Error("Monthly contribution must be non-negative and finite");
  if(!Number.isFinite(annualReturnPercent)||annualReturnPercent<=-100)throw new Error("Annual return must be greater than -100% and finite");
  if(!Number.isInteger(termMonths)||termMonths<1)throw new Error("Term months must be a positive integer");
  const r = annualReturnPercent / 100 / 12;
  if (r === 0) return monthlyContribution * termMonths;
  const ordinary = monthlyContribution * (((1 + r) ** termMonths - 1) / r);
  const value=timing === "beginning" ? ordinary * (1 + r) : ordinary;
  if(!Number.isFinite(value))throw new Error("SIP future value exceeds supported numeric range");
  return value;
}

export function requiredMonthlySip(targetFutureValue: number, annualReturnPercent: number, termMonths: number, timing: "beginning" | "end" = "beginning"): number {
  if (!Number.isFinite(targetFutureValue)||targetFutureValue <= 0) return 0;
  if(!Number.isInteger(termMonths)||termMonths<1)return 0;
  const factor = sipFutureValue(1, annualReturnPercent, termMonths, timing);
  const required=targetFutureValue/factor;
  if(!Number.isFinite(required)||required<0)throw new Error("Required SIP exceeds supported numeric range");
  return required;
}

export const sipCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.sip",
  slug: "sip-calculator",
  title: "SIP Investment Calculator",
  category: "finance-investment",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ monthlyContribution, annualReturnPercent, termMonths, contributionTiming }) => {
    const futureValue = roundTo(sipFutureValue(monthlyContribution, annualReturnPercent, termMonths, contributionTiming), 2);
    const investedAmount = roundTo(monthlyContribution * termMonths, 2);
    return { futureValue, investedAmount, estimatedGain: roundTo(futureValue - investedAmount, 2) };
  },
  formulas: [{ id: "sip-future-value", expression: "FV = PMT × ((1+r)^n - 1)/r × timingFactor", description: "Future value of equal monthly contributions. Beginning-of-period contributions multiply the ordinary-annuity value by (1+r)." }],
  sources: [],
  examples: [],
  jurisdictions: [{ country: "GLOBAL" }],
  ui: { simpleInputKeys: ["monthlyContribution","annualReturnPercent","termMonths"], advancedInputKeys: ["contributionTiming"] },
  reverseSolvers: [{ id: "target-monthly-sip", target: "monthlyContribution", description: "Solve the monthly contribution required for a target future value." }],
  relatedCalculators: ["compound-interest-calculator", "fixed-term-deposit-calculator"],
  journeyMemberships: ["invest-for-a-goal", "plan-retirement"]
};
