import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  initialCorpus: z.number().finite().positive(),
  monthlyWithdrawal: z.number().finite().nonnegative(),
  annualReturnPercent: z.number().finite().min(-99).max(1000),
  termMonths: z.number().int().min(1).max(1200),
  withdrawalTiming: z.enum(["beginning", "end"]).default("end")
});

type Input = z.infer<typeof inputSchema>;
type Output = { endingCorpus: number; totalWithdrawn: number; depleted: boolean; depletionMonth: number | null };

export function simulateSwp(initialCorpus: number, monthlyWithdrawal: number, annualReturnPercent: number, termMonths: number, timing: "beginning" | "end" = "end") {
  if(!Number.isFinite(initialCorpus)||initialCorpus<=0)throw new Error("Initial corpus must be positive and finite");
  if(!Number.isFinite(monthlyWithdrawal)||monthlyWithdrawal<0)throw new Error("Monthly withdrawal must be non-negative and finite");
  if(!Number.isFinite(annualReturnPercent)||annualReturnPercent<=-100)throw new Error("Annual return must be greater than -100% and finite");
  if(!Number.isInteger(termMonths)||termMonths<1)throw new Error("Term months must be a positive integer");
  const monthlyRate = annualReturnPercent / 100 / 12;
  let balance = initialCorpus;
  let totalWithdrawn = 0;
  let depletionMonth: number | null = null;

  for (let month = 1; month <= termMonths; month += 1) {
    if (timing === "beginning") {
      const withdrawal = Math.min(monthlyWithdrawal, balance);
      balance -= withdrawal;
      totalWithdrawn += withdrawal;
      if (balance <= 0 && monthlyWithdrawal > 0) { depletionMonth = month; break; }
    }

    balance *= 1 + monthlyRate;
    if(!Number.isFinite(balance))throw new Error("SWP balance exceeds supported numeric range");
    if (balance <= 0) { balance = 0; depletionMonth = month; break; }

    if (timing === "end") {
      const withdrawal = Math.min(monthlyWithdrawal, balance);
      balance -= withdrawal;
      totalWithdrawn += withdrawal;
      if (balance <= 0 && monthlyWithdrawal > 0) { depletionMonth = month; break; }
    }
  }

  return { endingCorpus: balance, totalWithdrawn, depleted: depletionMonth !== null, depletionMonth };
}

export function sustainableMonthlyWithdrawal(initialCorpus: number, annualReturnPercent: number, termMonths: number, timing: "beginning" | "end" = "end"): number {
  if (!Number.isFinite(initialCorpus)||initialCorpus <= 0 || !Number.isInteger(termMonths)||termMonths < 1) return 0;
  if(!Number.isFinite(annualReturnPercent)||annualReturnPercent<=-100)throw new Error("Annual return must be greater than -100% and finite");
  const r = annualReturnPercent / 100 / 12;
  if (Math.abs(r) < 1e-12) return initialCorpus / termMonths;
  const ordinary = initialCorpus * r / (1 - (1 + r) ** -termMonths);
  const value=timing === "beginning" ? ordinary / (1 + r) : ordinary;
  if(!Number.isFinite(value)||value<0)throw new Error("Sustainable withdrawal exceeds supported numeric range");
  return value;
}

export const swpCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.swp",
  slug: "swp-calculator",
  title: "Systematic Withdrawal Plan Calculator",
  category: "finance-investment",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ initialCorpus, monthlyWithdrawal, annualReturnPercent, termMonths, withdrawalTiming }) => {
    const result = simulateSwp(initialCorpus, monthlyWithdrawal, annualReturnPercent, termMonths, withdrawalTiming);
    return { endingCorpus: roundTo(result.endingCorpus, 2), totalWithdrawn: roundTo(result.totalWithdrawn, 2), depleted: result.depleted, depletionMonth: result.depletionMonth };
  },
  formulas: [{ id: "swp-cashflow", expression: "balance[m] = balance[m-1] × (1+r) - withdrawal", description: "Deterministic monthly withdrawal simulation; withdrawal timing controls whether cash is removed before or after monthly growth." }],
  sources: [],
  examples: [],
  jurisdictions: [{ country: "GLOBAL" }],
  ui: { simpleInputKeys: ["initialCorpus","monthlyWithdrawal","annualReturnPercent","termMonths"], advancedInputKeys: ["withdrawalTiming"] },
  reverseSolvers: [{ id: "sustainable-monthly-withdrawal", target: "monthlyWithdrawal", description: "Solve the level monthly withdrawal that amortizes a corpus over the selected term at the assumed return." }],
  relatedCalculators: ["sip-calculator", "step-up-sip-calculator", "investment-growth-calculator"],
  journeyMemberships: ["plan-retirement", "invest-for-a-goal"]
};
