import type { CalculatorDefinition } from "./types";
import { percentageCalculator } from "./core/percentage";
import { unitConversionCalculator } from "./core/unit-conversion";
import { compoundInterestCalculator } from "./finance/compound-interest";
import { loanPaymentCalculator } from "./finance/loan-payment";

type AnyCalculator = CalculatorDefinition<any, any>;

const definitions: readonly AnyCalculator[] = [
  percentageCalculator,
  unitConversionCalculator,
  compoundInterestCalculator,
  loanPaymentCalculator
];

const bySlug = new Map<string, AnyCalculator>();
const byId = new Map<string, AnyCalculator>();

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
  list(): readonly AnyCalculator[] {
    return definitions;
  },
  getBySlug(slug: string): AnyCalculator | undefined {
    return bySlug.get(slug);
  },
  getById(id: string): AnyCalculator | undefined {
    return byId.get(id);
  }
} as const;
