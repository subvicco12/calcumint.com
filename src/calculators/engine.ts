import type { CalculatorContext, CalculatorDefinition, CalculatorRunResult } from "./types";
import { CalculatorValidationError } from "./types";

export function runCalculator<TInput, TOutput>(
  definition: CalculatorDefinition<TInput, TOutput>,
  rawInput: unknown,
  context: CalculatorContext = {}
): CalculatorRunResult<TInput, TOutput> {
  const parsed = definition.inputSchema.safeParse(rawInput);

  if (!parsed.success) {
    throw new CalculatorValidationError(parsed.error.issues);
  }

  const output = definition.calculate(parsed.data, context);

  return {
    calculatorId: definition.id,
    slug: definition.slug,
    version: definition.version,
    input: parsed.data,
    output
  };
}
