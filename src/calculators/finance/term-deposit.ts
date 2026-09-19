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
  if(!Number.isFinite(principal)||principal<=0)throw new Error("Principal must be positive and finite");
  if(!Number.isFinite(annualRatePercent)||annualRatePercent<0||annualRatePercent>1000)throw new Error("Annual rate must be non-negative and finite");
  if(!Number.isInteger(termMonths)||termMonths<1||termMonths>1200)throw new Error("Term months must be a positive integer");
  if(![1,2,4,12,365].includes(compoundingPerYear))throw new Error("Unsupported compounding frequency");
  const years = termMonths / 12;
  const rate = annualRatePercent / 100;
  const value=principal*(1+rate/compoundingPerYear)**(compoundingPerYear*years);
  if(!Number.isFinite(value))throw new Error("Maturity value exceeds supported numeric range");
  return value;
}

export const termDepositCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.term-deposit",
  slug: "fixed-term-deposit-calculator",
  title: "Fixed / Term Deposit Calculator",
  category: "finance-investment",
  version: 1,
  riskClass: "financial",
  reviewStatus: "certified",
  inputSchema,
  calculate: ({ principal, annualRatePercent, termMonths, compoundingPerYear }) => {
    const maturityValue = roundTo(termDepositFutureValue(principal, annualRatePercent, termMonths, compoundingPerYear), 2);
    const nominal = annualRatePercent / 100;
    const effective = (1 + nominal / compoundingPerYear) ** compoundingPerYear - 1;
    return { maturityValue, interestEarned: roundTo(maturityValue - principal, 2), effectiveAnnualYieldPercent: roundTo(effective * 100, 4) };
  },
  formulas: [{ id: "compound-deposit", expression: "A = P(1 + r/m)^(m×t)", description: "Compound growth using the selected compounding frequency and fractional years derived from months." }],
  sources: [{ label: "Consumer Financial Protection Bureau — How compound interest works", url: "https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/" }, { label: "CFPB Regulation DD Appendix A — Annual Percentage Yield Calculation", url: "https://www.consumerfinance.gov/rules-policy/regulations/1030/a/" }],
  examples: [{ label: "$100,000 at 8% nominal annual rate for 12 months, compounded quarterly", input: { principal: 100000, annualRatePercent: 8, termMonths: 12, compoundingPerYear: 4 }, expected: { maturityValue: 108243.22, interestEarned: 8243.22, effectiveAnnualYieldPercent: 8.2432 } }],
  jurisdictions: [{ country: "GLOBAL" }],
  ui: { simpleInputKeys: ["principal","annualRatePercent","termMonths"], advancedInputKeys: ["compoundingPerYear"] },
  relatedCalculators: ["compound-interest-calculator"],
  journeyMemberships: ["invest-for-a-goal", "plan-retirement"]
};
