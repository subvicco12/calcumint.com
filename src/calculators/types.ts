import type { ZodType } from "zod";

export type CalculatorRiskClass = "standard" | "financial" | "health" | "tax";
export type CalculatorReviewStatus = "draft" | "reviewed" | "certified";
export type UnitSystem = "metric" | "us";

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

export type JurisdictionRef = {
  country: string;
  region?: string;
};

export type CalculatorRuleMetadata = {
  jurisdiction: JurisdictionRef;
  ruleVersion: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  taxYear?: string;
  currency?: string;
  unitSystem?: UnitSystem;
  officialSources?: readonly CalculatorSource[];
  lastVerifiedAt?: string;
};

export type CalculatorUiMetadata = {
  simpleInputKeys: readonly string[];
  advancedInputKeys?: readonly string[];
};

export type ReverseSolverDefinition = {
  id: string;
  target: string;
  description: string;
};

export type CalculatorContext = {
  locale?: string;
  currency?: string;
  unitSystem?: UnitSystem;
  country?: string;
  region?: string;
  ruleVersion?: string;
  taxYear?: string;
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
  /** Optional global metadata. Existing certified calculators remain backwards compatible. */
  jurisdictions?: readonly JurisdictionRef[];
  locales?: readonly string[];
  currencies?: readonly string[];
  unitSystems?: readonly UnitSystem[];
  ruleMetadata?: readonly CalculatorRuleMetadata[];
  reverseSolvers?: readonly ReverseSolverDefinition[];
  ui?: CalculatorUiMetadata;
  relatedCalculators?: readonly string[];
  journeyMemberships?: readonly string[];
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
