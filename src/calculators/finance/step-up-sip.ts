import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  initialMonthlyContribution: z.number().finite().positive(),
  annualStepUpPercent: z.number().finite().min(0).max(1000),
  annualReturnPercent: z.number().finite().min(-99).max(1000),
  termMonths: z.number().int().min(1).max(1200),
  contributionTiming: z.enum(["beginning", "end"]).default("beginning")
});

type Input = z.infer<typeof inputSchema>;
type Output = { futureValue: number; investedAmount: number; estimatedGain: number; finalMonthlyContribution: number };

function requireFinite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} exceeds supported numeric range`);
  return value;
}

export function stepUpSipFutureValue(initialMonthlyContribution: number, annualStepUpPercent: number, annualReturnPercent: number, termMonths: number, timing: "beginning" | "end" = "beginning") {
  if(!Number.isFinite(initialMonthlyContribution)||initialMonthlyContribution<0)throw new Error("Initial contribution must be non-negative and finite");
  if(!Number.isFinite(annualStepUpPercent)||annualStepUpPercent<0)throw new Error("Annual step-up must be non-negative and finite");
  if(!Number.isFinite(annualReturnPercent)||annualReturnPercent<=-100)throw new Error("Annual return must be greater than -100% and finite");
  if(!Number.isInteger(termMonths)||termMonths<1)throw new Error("Term months must be a positive integer");
  const monthlyRate = annualReturnPercent / 100 / 12;
  const step = annualStepUpPercent / 100;
  let balance = 0;
  let invested = 0;
  let contribution = initialMonthlyContribution;
  for (let month = 1; month <= termMonths; month += 1) {
    if (month > 1 && (month - 1) % 12 === 0) contribution = requireFinite(contribution * (1 + step), "Monthly contribution");
    if (timing === "beginning") balance = requireFinite(balance + contribution, "Projected balance");
    balance = requireFinite(balance * (1 + monthlyRate), "Projected balance");
    if (timing === "end") balance = requireFinite(balance + contribution, "Projected balance");
    invested = requireFinite(invested + contribution, "Invested amount");
  }
  return { futureValue: balance, investedAmount: invested, finalMonthlyContribution: contribution };
}

export function requiredInitialStepUpSip(targetFutureValue: number, annualStepUpPercent: number, annualReturnPercent: number, termMonths: number, timing: "beginning" | "end" = "beginning"): number {
  if(!Number.isFinite(targetFutureValue)||targetFutureValue<=0)return 0;
  if(!Number.isInteger(termMonths)||termMonths<1)return 0;
  const factor = stepUpSipFutureValue(1, annualStepUpPercent, annualReturnPercent, termMonths, timing).futureValue;
  return requireFinite(targetFutureValue / factor, "Required initial contribution");
}

export const stepUpSipCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.step-up-sip",
  slug: "step-up-sip-calculator",
  title: "Step-Up SIP Calculator",
  category: "finance-investment",
  version: 1,
  riskClass: "financial",
  reviewStatus: "certified",
  inputSchema,
  calculate: ({ initialMonthlyContribution, annualStepUpPercent, annualReturnPercent, termMonths, contributionTiming }) => {
    const result = stepUpSipFutureValue(initialMonthlyContribution, annualStepUpPercent, annualReturnPercent, termMonths, contributionTiming);
    const futureValue = roundTo(result.futureValue, 2);
    const investedAmount = roundTo(result.investedAmount, 2);
    return { futureValue, investedAmount, estimatedGain: roundTo(futureValue - investedAmount, 2), finalMonthlyContribution: roundTo(result.finalMonthlyContribution, 2) };
  },
  formulas: [{ id: "step-up-sip-simulation", expression: "balance[m] = (balance[m-1] + contribution[m]) × (1+r) with annual contribution step-up", description: "Deterministic monthly cash-flow simulation with annual contribution increases; timing controls whether each contribution is invested before or after monthly growth." }],
  sources: [{ label: "Investor.gov — Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" }, { label: "Investor.gov — Dollar Cost Averaging", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging" }],
  examples: [{ label: "$10,000 initial monthly contribution, 10% annual step-up and 10% estimated return for 10 years", input: { initialMonthlyContribution: 10000, annualStepUpPercent: 10, annualReturnPercent: 10, termMonths: 120, contributionTiming: "beginning" }, expected: { futureValue: 3045851.97, investedAmount: 1912490.95, estimatedGain: 1133361.02, finalMonthlyContribution: 23579.48 } }],
  jurisdictions: [{ country: "GLOBAL" }],
  ui: { simpleInputKeys: ["initialMonthlyContribution","annualStepUpPercent","annualReturnPercent","termMonths"], advancedInputKeys: ["contributionTiming"] },
  reverseSolvers: [{ id: "target-initial-step-up-sip", target: "initialMonthlyContribution", description: "Solve the initial monthly contribution required to reach a target future value with a specified annual step-up." }],
  relatedCalculators: ["sip-calculator", "compound-interest-calculator"],
  journeyMemberships: ["invest-for-a-goal", "plan-retirement"]
};
