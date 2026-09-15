import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  percentage: z.number().finite(),
  value: z.number().finite()
});

type Input = z.infer<typeof inputSchema>;
type Output = { result: number };

export const percentageCalculator: CalculatorDefinition<Input, Output> = {
  id: "core.percentage-of-value",
  slug: "percentage-of-value-calculator",
  title: "Percentage of a Value Calculator",
  category: "math",
  version: 1,
  riskClass: "standard",
  reviewStatus: "certified",
  inputSchema,
  calculate: ({ percentage, value }) => ({ result: roundTo((percentage / 100) * value, 12) }),
  formulas: [
    {
      id: "percentage-of-value",
      expression: "result = (percentage / 100) × value",
      description: "Converts a percentage to decimal form and multiplies it by the base value."
    }
  ],
  sources: [],
  examples: [
    {
      label: "20% of 250",
      input: { percentage: 20, value: 250 },
      expected: { result: 50 }
    }
  ]
};
