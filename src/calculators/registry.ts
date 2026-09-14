import type { CalculatorDefinition } from "./types";
import { percentageCalculator } from "./core/percentage";
import { unitConversionCalculator } from "./core/unit-conversion";
import { compoundInterestCalculator } from "./finance/compound-interest";
import { loanPaymentCalculator } from "./finance/loan-payment";

type RegistryCalculator = CalculatorDefinition<unknown, unknown>;

function eraseCalculatorTypes<TInput, TOutput>(
  definition: CalculatorDefinition<TInput, TOutput>
): RegistryCalculator {
  return definition as unknown as RegistryCalculator;
}

const definitions: readonly RegistryCalculator[] = [
  eraseCalculatorTypes(percentageCalculator),
  eraseCalculatorTypes(unitConversionCalculator),
  eraseCalculatorTypes(compoundInterestCalculator),
  eraseCalculatorTypes(loanPaymentCalculator)
];

const bySlug = new Map<string, RegistryCalculator>();
const byId = new Map<string, RegistryCalculator>();

for (const definition of definitions) {
  if (bySlug.has(definition.slug)) {
    throw new Error(`Duplicate calculator slug: ${definition.slug}`);
  }
  if (byId.has(definition.id)) {
    throw new Error(`Duplicate calculator id: ${definition.id}`);
  }
  bySlug.set(definition.slug, definition);
  byId.set(definition.id, definition);
}

export const calculatorRegistry = {
  list(): readonly RegistryCalculator[] {
    return definitions;
  },
  getBySlug(slug: string): RegistryCalculator | undefined {
    return bySlug.get(slug);
  },
  getById(id: string): RegistryCalculator | undefined {
    return byId.get(id);
  }
} as const;
