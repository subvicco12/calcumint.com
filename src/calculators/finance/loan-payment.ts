import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  principal: z.number().finite().positive(),
  annualRatePercent: z.number().finite().min(0).max(1000),
  termMonths: z.number().int().min(1).max(1200)
});

type Input = z.infer<typeof inputSchema>;
type Output = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

export const loanPaymentCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.loan-payment",
  slug: "loan-payment-calculator",
  title: "Loan Payment Calculator",
  category: "loans-mortgages",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ principal, annualRatePercent, termMonths }) => {
    const monthlyRate = annualRatePercent / 100 / 12;
    const unroundedPayment = monthlyRate === 0
      ? principal / termMonths
      : principal * monthlyRate / (1 - (1 + monthlyRate) ** -termMonths);

    const monthlyPayment = roundTo(unroundedPayment, 2);
    const totalPayment = roundTo(monthlyPayment * termMonths, 2);

    return {
      monthlyPayment,
      totalPayment,
      totalInterest: roundTo(totalPayment - principal, 2)
    };
  },
  formulas: [
    {
      id: "amortizing-loan-payment",
      expression: "M = P × r / (1 - (1 + r)^(-n))",
      description: "Fixed periodic payment for a fully amortizing loan with a fixed periodic interest rate."
    }
  ],
  sources: [],
  examples: [
    {
      label: "$100,000 at 6% for 30 years",
      input: { principal: 100000, annualRatePercent: 6, termMonths: 360 },
      expected: { monthlyPayment: 599.55, totalPayment: 215838, totalInterest: 115838 }
    }
  ]
};
