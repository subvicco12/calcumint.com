import type { CalculatorDefinition } from "../types";
import type { ResultMetric, StructuredCalculationResult } from "./types";
import { financeReadinessAssumptions } from "./finance-readiness-assumptions";

type Definition = Pick<CalculatorDefinition<unknown, unknown>, "id" | "slug" | "formulas" | "sources">;
const fields: Readonly<Record<string, readonly (readonly [string, string, string?])[]>> = {
  "finance.term-deposit": [["maturityValue", "Maturity value"], ["interestEarned", "Interest earned"], ["effectiveAnnualYieldPercent", "Effective annual yield", "%"]],
  "finance.recurring-deposit": [["maturityValue", "Maturity value"], ["depositedAmount", "Deposited amount"], ["interestEarned", "Interest earned"]],
  "finance.step-up-sip": [["futureValue", "Projected future value"], ["investedAmount", "Invested amount"], ["estimatedGain", "Estimated gain"], ["finalMonthlyContribution", "Final monthly contribution"]],
  "finance.swp": [["endingCorpus", "Ending corpus"], ["totalWithdrawn", "Total withdrawn"]],
  "finance.investment-math": [["futureValue", "Projected future value"], ["inflationAdjustedFutureValue", "Inflation-adjusted modeled value"], ["realAnnualReturnPercent", "Real annual return", "%"]],
  "finance.simple-interest": [["interest", "Interest"], ["totalAmount", "Total amount"]]
};

/** Preserve certified engine values; presentation never computes or rounds financial fields. */
export function financeReadinessResult(definition: Definition, output: Readonly<Record<string, unknown>>): StructuredCalculationResult {
  const columns = fields[definition.id];
  if (!columns) throw new Error("Unsupported finance presentation identity");
  const metrics: ResultMetric[] = columns.map(([id, label, unit]) => {
    const value = output[id];
    if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Invalid certified finance output");
    return { id, label, value, ...(unit ? { unit } : {}) };
  });
  if (definition.id === "finance.swp") {
    if (typeof output.depleted !== "boolean" || (output.depleted ? !Number.isInteger(output.depletionMonth) || Number(output.depletionMonth) < 1 : output.depletionMonth !== null)) throw new Error("Invalid withdrawal depletion state");
    metrics.push({ id: "depletion", label: "Modeled depletion", value: output.depleted ? `Month ${output.depletionMonth}` : "Not depleted in modeled term" });
  }
  return { primaryResult: metrics[0], metrics: metrics.slice(1),
    methodology: definition.formulas.map(formula => `${formula.expression}. ${formula.description}`).join(" "),
    sources: definition.sources,
    assumptions: financeReadinessAssumptions[definition.slug] ?? [] };
}

/** A cleared required field is missing, not an explicit zero. Schemas retain all numeric bounds. */
export function requiredFinanceNumber(value: string): number {
  if (!value.trim()) return Number.NaN;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}
