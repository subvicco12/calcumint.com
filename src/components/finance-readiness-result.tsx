import type { CalculatorDefinition } from "@/calculators/types";
import { financeReadinessResult } from "@/calculators/final-framework/finance-readiness-result";
import { CalculatorInputError } from "./calculator-input-error";
import { FinalCalculatorRenderer } from "./final-calculator-renderer";

export function FinanceReadinessResult({ definition, output }: {
  definition: Pick<CalculatorDefinition<unknown, unknown>, "id" | "slug" | "formulas" | "sources">;
  output: Readonly<Record<string, unknown>> | null;
}) {
  if (!output) return <CalculatorInputError/>;
  const result = financeReadinessResult(definition, output);
  return <><FinalCalculatorRenderer result={result}/>{result.assumptions?.length ? <details><summary>Assumptions and limitations</summary><ul>{result.assumptions.map(assumption => <li key={assumption}>{assumption}</li>)}</ul></details> : null}</>;
}
