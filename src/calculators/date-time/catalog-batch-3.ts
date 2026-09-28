import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { dateAddSubtractCalculator } from "./catalog-batch-1";

type Input = { date: string };
type Output = { date: string };
const dateSchema = z.string().refine(
  (date) => dateAddSubtractCalculator.inputSchema.safeParse({ date, years: 0, months: 0, days: 0 }).success,
  "Invalid ISO calendar date",
);
const source = { label: "ISO 8601 date representation", url: "https://www.iso.org/iso-8601-date-and-time-format.html", note: "Fixed-day offsets reuse the deterministic Date Add/Subtract calendar engine." };

function fixedDayCalculator(days: 30 | 60 | 90): CalculatorDefinition<Input, Output> {
  const exampleDate = days === 90 ? "2024-05-01" : days === 60 ? "2024-04-01" : "2024-03-02";
  return {
    id: `date-time.${days}-day`, slug: `${days}-day-calculator`, title: `${days} Day Calculator`,
    category: "date-time", version: 1, riskClass: "standard", reviewStatus: "draft", sources: [source],
    inputSchema: z.object({ date: dateSchema }),
    calculate: ({ date }) => dateAddSubtractCalculator.calculate({ date, years: 0, months: 0, days }, {}),
    formulas: [{ id: `add-${days}-days`, expression: `result = date + ${days} calendar days`, description: `CalcuMint contract: input is day zero; return the date ${days} elapsed calendar days later, without business-day or timezone adjustments.` }],
    examples: [{ label: `Add ${days} days`, input: { date: "2024-02-01" }, expected: { date: exampleDate } }],
    goldenTests: [{ label: `Add ${days} days`, input: { date: "2024-02-01" }, expected: { date: exampleDate } }],
    ui: { simpleInputKeys: ["date"] },
  };
}

export const ninetyDayCalculator = fixedDayCalculator(90);
export const thirtyDayCalculator = fixedDayCalculator(30);
export const sixtyDayCalculator = fixedDayCalculator(60);
export const dateTimeBatch3Definitions = [ninetyDayCalculator, thirtyDayCalculator, sixtyDayCalculator] as const;
