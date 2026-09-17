import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  principal: z.number().finite().positive(),
  annualRatePercent: z.number().finite().min(0).max(1000),
  termMonths: z.number().int().min(1).max(1200),
  compoundingPerYear: z.union([z.literal(1), z.literal(2), z.literal(4), z.literal(12), z.literal(365)])
});

type Input = z.infer<typeof inputSchema>;
type Output = { maturityValue: number; interestEarned: number; effectiveAnnualYieldPercent: number };

export function termDepositFutureValue(principal: number, annualRatePercent: number, termMonths: number, compoundingPerYear: number): number {
  const years = termMonths / 12;
  const rate = annualRatePercent / 100;
  return principal * (1 + rate / compoundingPerYear) ** (compoundingPerYear * years);
}

export const termDepositCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.term-deposit",
  slug: "fixed-term-deposit-calculator",
  title: "Fixed / Term Deposit Calculator",
  category: "finance-investment",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ principal, annualRatePercent, termMonths, compoundingPerYear }) => {
    const maturityValue = roundTo(termDepositFutureValue(principal, annualRatePercent, termMonths, compoundingPerYear), 2);
    const nominal = annualRatePercent / 100;
    const effective = (1 + nominal / compoundingPerYear) ** compoundingPerYear - 1;
    return { maturityValue, interestEarned: roundTo(maturityValue - principal, 2), effectiveAnnualYieldPercent: roundTo(effective * 100, 4) };
  },
  formulas: [{ id: "compound-deposit", expression: "A = P(1 + r/m)^(m×t)", description: "Compound growth using the selected compounding frequency and fractional years derived from months." }],
  sources: [],
  examples: [],
  jurisdictions: [{ country: "GLOBAL" }],
  relatedCalculators: ["compound-interest-calculator"],
  journeyMemberships: ["invest-for-a-goal", "plan-retirement"]
};
