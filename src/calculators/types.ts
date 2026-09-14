import type { ZodType } from "zod";

export type CalculatorRiskClass = "standard" | "financial" | "health" | "tax";
export type CalculatorReviewStatus = "draft" | "reviewed" | "certified";

export type CalculatorSource = {
  label: string;
  url?: string;
  note?: string;
};

export type CalculatorFormula = {
  id: string;
  expression: string;
  description: string;
};

export type CalculatorExample<TInput, TOutput> = {
  label: string;
  input: TInput;
  expected: TOutput;
};

export type CalculatorContext = {
  locale?: string;
  currency?: string;
  unitSystem?: "metric" | "us";
};

export type CalculatorDefinition<TInput, TOutput> = {
  id: string;
  slug: string;
  title: string;
  category: string;
  version: number;
  riskClass: CalculatorRiskClass;
  reviewStatus: CalculatorReviewStatus;
  inputSchema: ZodType<TInput>;
  calculate: (input: TInput, context: CalculatorContext) => TOutput;
  formulas: readonly CalculatorFormula[];
  sources: readonly CalculatorSource[];
  examples: readonly CalculatorExample<TInput, TOutput>[];
};

export type CalculatorRunResult<TInput, TOutput> = {
  calculatorId: string;
  slug: string;
  version: number;
  input: TInput;
  output: TOutput;
};

export class CalculatorValidationError extends Error {
  readonly issues: readonly unknown[];

  constructor(issues: readonly unknown[]) {
    super("Calculator input validation failed");
    this.name = "CalculatorValidationError";
    this.issues = issues;
  }
}
