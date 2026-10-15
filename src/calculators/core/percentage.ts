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
  sources: [
    {
      label: "BIPM — SI Brochure, 9th edition",
      url: "https://www.bipm.org/en/publications/si-brochure",
      note: "Documents the internationally recognized percent symbol and its meaning as parts per hundred."
    }
  ],
  goldenTests: [
    { label: "Parts per hundred: 20/100 × 250 = 50 (BIPM)", input: { percentage: 20, value: 250 }, expected: { result: 50 } },
    { label: "Signed percentage: -25/100 × 80 = -20", input: { percentage: -25, value: 80 }, expected: { result: -20 } },
    { label: "Zero percent: 0/100 × 250 = 0", input: { percentage: 0, value: 250 }, expected: { result: 0 } },
    { label: "Identity at finite extreme: 100/100 × 1e308 = 1e308", input: { percentage: 100, value: 1e308 }, expected: { result: 1e308 } }
  ],
  examples: [
    {
      label: "20% of 250",
      input: { percentage: 20, value: 250 },
      expected: { result: 50 }
    }
  ]
};
