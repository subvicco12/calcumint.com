import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  principal: z.number().finite().nonnegative(),
  annualRatePercent: z.number().finite().min(-100).max(1000),
  years: z.number().finite().nonnegative().max(200),
  compoundsPerYear: z.number().int().min(1).max(365)
});

type Input = z.infer<typeof inputSchema>;
type Output = {
  futureValue: number;
  totalInterest: number;
};

export const compoundInterestCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.compound-interest",
  slug: "compound-interest-calculator",
  title: "Compound Interest Calculator",
  category: "finance",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ principal, annualRatePercent, years, compoundsPerYear }) => {
    const rate = annualRatePercent / 100;
    const futureValue = principal * (1 + rate / compoundsPerYear) ** (compoundsPerYear * years);
    const roundedFutureValue = roundTo(futureValue, 2);

    return {
      futureValue: roundedFutureValue,
      totalInterest: roundTo(roundedFutureValue - principal, 2)
    };
  },
  formulas: [
    {
      id: "compound-interest",
      expression: "A = P(1 + r/n)^(nt)",
      description: "Future value with a fixed nominal annual rate compounded n times per year."
    }
  ],
  sources: [],
  examples: [
    {
      label: "$10,000 at 5% for 10 years, compounded monthly",
      input: { principal: 10000, annualRatePercent: 5, years: 10, compoundsPerYear: 12 },
      expected: { futureValue: 16470.09, totalInterest: 6470.09 }
    }
  ]
};
