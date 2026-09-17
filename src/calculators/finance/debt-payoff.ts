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
  const monthlyBudget = finite(debts.reduce((sum, debt) => sum + debt.minimumPayment, input.extraMonthlyPayment), "Monthly debt budget");
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;
  const payoffOrder: string[] = [];

  while (debts.some((debt) => debt.balance > 0.005) && months < 1200) {
    months += 1;
    const openingBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);

    for (const debt of debts) {
      if (debt.balance <= 0.005) continue;
      const interest = finite(debt.balance * (debt.annualRatePercent / 100 / 12), "Debt interest");
      debt.balance = finite(debt.balance + interest, "Debt balance");
      totalInterest = finite(totalInterest + interest, "Total interest");
    }

    let remainingBudget = monthlyBudget;
    for (const debt of debts) {
      if (debt.balance <= 0.005 || remainingBudget <= 0) continue;
      const payment = Math.min(debt.minimumPayment, debt.balance, remainingBudget);
      debt.balance -= payment;
      remainingBudget -= payment;
      totalPaid = finite(totalPaid + payment, "Total paid");
      if (debt.balance <= 0.005 && !payoffOrder.includes(debt.name)) payoffOrder.push(debt.name);
    }

    while (remainingBudget > 0.005) {
      const active = debts
        .filter((debt) => debt.balance > 0.005)
        .sort((a, b) => input.strategy === "avalanche"
          ? b.annualRatePercent - a.annualRatePercent || a.balance - b.balance || a.index - b.index
          : a.balance - b.balance || b.annualRatePercent - a.annualRatePercent || a.index - b.index);
      if (!active.length) break;
      const target = active[0];
      const payment = Math.min(remainingBudget, target.balance);
      target.balance -= payment;
      remainingBudget -= payment;
      totalPaid = finite(totalPaid + payment, "Total paid");
      if (target.balance <= 0.005 && !payoffOrder.includes(target.name)) payoffOrder.push(target.name);
    }

    const closingBalance = debts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0);
    if (closingBalance > 0.005 && closingBalance >= openingBalance - 0.000001) {
      throw new Error("Monthly debt budget does not reduce the modeled debt balances");
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
    { id: "payoff-priority", expression: "monthly budget = original minimum payments + extra; avalanche: highest rate first; snowball: lowest balance first", description: "The original monthly debt budget is preserved so minimum-payment capacity freed by paid debts rolls to the remaining debts." },
  ],
  sources: [],
  examples: [],
  jurisdictions: [{ country: "GLOBAL" }],
  relatedCalculators: ["credit-card-payoff-calculator", "loan-emi-calculator", "loan-affordability-calculator", "loan-prepayment-calculator"],
  journeyMemberships: ["get-out-of-debt"],
};
