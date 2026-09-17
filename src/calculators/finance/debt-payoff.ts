import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const debtSchema = z.object({
  name: z.string().trim().min(1).max(80),
  balance: z.number().finite().positive(),
  annualRatePercent: z.number().finite().min(0).max(1000),
  minimumPayment: z.number().finite().min(0),
});
const inputSchema = z.object({
  debts: z.array(debtSchema).min(1).max(50),
  extraMonthlyPayment: z.number().finite().min(0).default(0),
  strategy: z.enum(["avalanche", "snowball"]).default("avalanche"),
});
type Input = z.infer<typeof inputSchema>;
type Output = { strategy: "avalanche" | "snowball"; monthsToPayoff: number; totalInterest: number; totalPaid: number; startingBalance: number; payoffOrder: string[] };

function finite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} exceeds supported numeric range`);
  return value;
}

export function simulateDebtPayoff(input: Input): Output {
  const debts = input.debts.map((debt, index) => ({ ...debt, index, balance: debt.balance }));
  const startingBalance = finite(debts.reduce((sum, debt) => sum + debt.balance, 0), "Starting balance");
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;
  const payoffOrder: string[] = [];

  while (debts.some((debt) => debt.balance > 0.005) && months < 1200) {
    months += 1;
    for (const debt of debts) {
      if (debt.balance <= 0.005) continue;
      const interest = finite(debt.balance * (debt.annualRatePercent / 100 / 12), "Debt interest");
      debt.balance = finite(debt.balance + interest, "Debt balance");
      totalInterest = finite(totalInterest + interest, "Total interest");
    }

    let pool = input.extraMonthlyPayment;
    for (const debt of debts) {
      if (debt.balance <= 0.005) continue;
      const payment = Math.min(debt.minimumPayment, debt.balance);
      debt.balance -= payment;
      pool += Math.max(0, debt.minimumPayment - payment);
      totalPaid = finite(totalPaid + payment, "Total paid");
      if (debt.balance <= 0.005 && !payoffOrder.includes(debt.name)) payoffOrder.push(debt.name);
    }

    const active = debts
      .filter((debt) => debt.balance > 0.005)
      .sort((a, b) => input.strategy === "avalanche"
        ? b.annualRatePercent - a.annualRatePercent || a.balance - b.balance || a.index - b.index
        : a.balance - b.balance || b.annualRatePercent - a.annualRatePercent || a.index - b.index);

    if (active.length && pool > 0) {
      const target = active[0];
      const payment = Math.min(pool, target.balance);
      target.balance -= payment;
      totalPaid = finite(totalPaid + payment, "Total paid");
      if (target.balance <= 0.005 && !payoffOrder.includes(target.name)) payoffOrder.push(target.name);
    }

    const activeAfter = debts.filter((debt) => debt.balance > 0.005);
    if (activeAfter.length && input.extraMonthlyPayment === 0 && activeAfter.every((debt) => debt.minimumPayment <= debt.balance * (debt.annualRatePercent / 100 / 12) + 0.000001)) {
      throw new Error("Minimum payments do not reduce the modeled debt balances");
    }
  }

  if (debts.some((debt) => debt.balance > 0.005)) throw new Error("Debt payoff exceeds supported 1200-month horizon");
  return { strategy: input.strategy, monthsToPayoff: months, totalInterest: roundTo(totalInterest, 2), totalPaid: roundTo(totalPaid, 2), startingBalance: roundTo(startingBalance, 2), payoffOrder };
}

export const debtPayoffCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.debt-payoff",
  slug: "debt-payoff-calculator",
  title: "Debt Snowball & Avalanche Calculator",
  category: "loans-mortgages",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: (input) => simulateDebtPayoff(input),
  formulas: [
    { id: "monthly-interest", expression: "interest = balance × annual rate / 12", description: "Applies modeled monthly interest to each outstanding balance." },
    { id: "payoff-priority", expression: "avalanche: highest rate first; snowball: lowest balance first", description: "Minimum payments are applied first, then available extra payment is directed to the selected priority debt." },
  ],
  sources: [],
  examples: [],
  jurisdictions: [{ country: "GLOBAL" }],
  relatedCalculators: ["loan-emi-calculator", "loan-affordability-calculator", "loan-prepayment-calculator"],
  journeyMemberships: ["get-out-of-debt"],
};
