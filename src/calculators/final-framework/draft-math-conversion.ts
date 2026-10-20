import { basicDraftCalculator } from "../core/draft-master-205";
import { draftMaster232Calculator } from "../core/draft-master-232";
import { draftMaster233Calculator } from "../core/draft-master-233";
import { draftMaster435Calculator } from "../conversion/draft-master-435";
import { draftMaster441Calculator } from "../conversion/draft-master-441";
import { createCalculationSnapshot } from "@/lib/calculation-snapshot";
import type { CalculatorDefinition, CalculatorContext } from "../types";
import type { PresentationDefinition, ResultMetric, StructuredCalculationResult } from "./types";

export type DraftMathConversionMasterId = 205 | 232 | 233 | 435 | 441;
export const draftMathConversionPresentation = {
  id: "draft.math-conversion", domain: "math", family: "simple-scalar", level: "essential",
  supportedVisualizations: [], supportsSchedule: false, supportsGoalSolver: false, supportsScenarios: false, supportsSensitivity: false
} as const satisfies PresentationDefinition;

function capture<I extends Record<string, unknown>, O extends Record<string, unknown>>(definition: CalculatorDefinition<I,O>, input: unknown, context: CalculatorContext, present: (output: O, parsed: I) => { primaryResult: ResultMetric; metrics?: ResultMetric[] }) {
  const parsed = definition.inputSchema.parse(input);
  const output = definition.calculate(parsed, context);
  const snapshot = createCalculationSnapshot({ calculatorSlug: definition.slug, calculatorVersion: definition.version, input: { ...parsed }, output: { ...output } });
  const result: StructuredCalculationResult = {
    ...present(output, parsed),
    methodology: definition.formulas.map(formula => formula.description).join(" "), sources: definition.sources,
    warnings: ["DRAFT — unregistered, uncertified and unpublished. Not authorized for release.", `Technical version: ${definition.version}. Exact strings are preserved; numeric-only analytics are unavailable.`]
  };
  return { snapshot, result };
}

/** Private draft harness only; no public registry, route, entitlement or persistence writer is connected. */
export function calculateDraftMathConversion(masterId: DraftMathConversionMasterId, input: unknown, context: CalculatorContext = {}) {
  switch (masterId) {
    case 205: return capture(basicDraftCalculator, input, context, output => ({ primaryResult: { id: "result", label: "Result", value: output.result } }));
    case 232: return capture(draftMaster232Calculator, input, context, output => "result" in output
      ? { primaryResult: { id: "result", label: "Result", value: output.result } }
      : { primaryResult: { id: "quotient", label: "Quotient (toward zero)", value: output.quotient }, metrics: [{ id: "remainder", label: "Remainder", value: output.remainder }] });
    case 233: return capture(draftMaster233Calculator, input, context, output => ({ primaryResult: { id: "values", label: "Generated integers (noncryptographic)", value: output.values.join(", ") }, metrics: [{ id: "count", label: "Generated count", value: output.values.length }, { id: "state", label: "Final PCG state", value: output.finalState }] }));
    case 435: return capture(draftMaster435Calculator, input, context, (output, parsed) => ({ primaryResult: { id: "result", label: "Converted fuel economy", value: output.result, unit: { km_per_l: "km/L", l_per_100km: "L/100 km", mpg_us: "mpg (US)", mpg_imp: "mpg (imperial)" }[parsed.toUnit] } }));
    case 441: return capture(draftMaster441Calculator, input, context, (output, parsed) => ({ primaryResult: { id: "result", label: "Converted CSS resolution", value: output.result, unit: parsed.toUnit } }));
    default: throw new Error("Unsupported unpublished draft master identity");
  }
}
