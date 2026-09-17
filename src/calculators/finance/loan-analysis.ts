import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  principal: z.number().finite().positive(),
  annualRatePercent: z.number().finite().min(0).max(1000),
  termMonths: z.number().int().min(1).max(1200),
  extraMonthlyPayment: z.number().finite().min(0).default(0)
});

type Input = z.infer<typeof inputSchema>;
export type AmortizationRow = { month: number; payment: number; principal: number; interest: number; balance: number };
type Output = {
  monthlyPayment: number;
  scheduledPayment: number;
  totalPayment: number;
  totalInterest: number;
  payoffMonths: number;
  interestSavedVsScheduled: number;
  monthsSavedVsScheduled: number;
  amortization: readonly AmortizationRow[];
};

export function paymentForLoan(principal: number, annualRatePercent: number, termMonths: number): number {
  if (!Number.isFinite(principal) || principal <= 0) throw new Error("Principal must be positive and finite");
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) throw new Error("Annual rate must be non-negative and finite");
  if (!Number.isInteger(termMonths) || termMonths < 1) throw new Error("Term months must be a positive integer");
  const rate = annualRatePercent / 100 / 12;
  const payment = rate === 0 ? principal / termMonths : principal * rate / (1 - (1 + rate) ** -termMonths);
  if (!Number.isFinite(payment)) throw new Error("Loan payment exceeds supported numeric range");
  return payment;
}

export function maxPrincipalForPayment(monthlyPayment: number, annualRatePercent: number, termMonths: number): number {
  if (!Number.isFinite(monthlyPayment) || monthlyPayment <= 0) return 0;
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) throw new Error("Annual rate must be non-negative and finite");
  if (!Number.isInteger(termMonths) || termMonths < 1) return 0;
  const rate = annualRatePercent / 100 / 12;
  const principal = rate === 0 ? monthlyPayment * termMonths : monthlyPayment * (1 - (1 + rate) ** -termMonths) / rate;
  if (!Number.isFinite(principal)) throw new Error("Maximum principal exceeds supported numeric range");
  return principal;
}

function schedule(principal: number, annualRatePercent: number, termMonths: number, extra: number): AmortizationRow[] {
  const rate = annualRatePercent / 100 / 12;
  const scheduled = paymentForLoan(principal, annualRatePercent, termMonths);
  let balance = principal;
  const rows: AmortizationRow[] = [];
  for (let month = 1; balance > 0.005 && month <= termMonths; month += 1) {
    const interest = balance * rate;
    const requested = scheduled + extra;
    const payment = Math.min(requested, balance + interest);
    const principalPaid = payment - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month, payment: roundTo(payment, 2), principal: roundTo(principalPaid, 2), interest: roundTo(interest, 2), balance: roundTo(balance, 2) });
  }
  return rows;
}

export const loanAnalysisCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.loan-analysis",
  slug: "loan-emi-calculator",
  title: "Loan EMI & Amortization Calculator",
  category: "loans-mortgages",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ principal, annualRatePercent, termMonths, extraMonthlyPayment }) => {
    const scheduledPaymentRaw = paymentForLoan(principal, annualRatePercent, termMonths);
    const base = schedule(principal, annualRatePercent, termMonths, 0);
    const rows = schedule(principal, annualRatePercent, termMonths, extraMonthlyPayment);
    const totalPayment = roundTo(rows.reduce((sum, row) => sum + row.payment, 0), 2);
    const baseInterest = roundTo(base.reduce((sum, row) => sum + row.interest, 0), 2);
    const totalInterest = roundTo(rows.reduce((sum, row) => sum + row.interest, 0), 2);
    return {
      monthlyPayment: roundTo(scheduledPaymentRaw + extraMonthlyPayment, 2),
      scheduledPayment: roundTo(scheduledPaymentRaw, 2),
      totalPayment,
      totalInterest,
      payoffMonths: rows.length,
      interestSavedVsScheduled: roundTo(Math.max(0, baseInterest - totalInterest), 2),
      monthsSavedVsScheduled: Math.max(0, base.length - rows.length),
      amortization: rows
    };
  },
  formulas: [{ id: "amortizing-loan-payment", expression: "M = P × r / (1 - (1 + r)^(-n))", description: "Fixed monthly payment for a fully amortizing loan; zero-rate loans use P/n." }],
  sources: [],
  examples: [],
  jurisdictions: [{ country: "GLOBAL" }],
  reverseSolvers: [{ id: "max-principal", target: "principal", description: "Solve the maximum principal supported by a target monthly payment, annual rate and term." }],
  ui: { simpleInputKeys: ["principal","annualRatePercent","termMonths"], advancedInputKeys: ["extraMonthlyPayment"] },
  relatedCalculators: ["loan-payment-calculator"],
  journeyMemberships: ["buy-a-home", "get-out-of-debt"]
};
