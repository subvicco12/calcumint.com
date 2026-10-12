import { unitConversionCalculator } from '@/calculators/core/unit-conversion';
import { percentageCalculator } from '@/calculators/core/percentage';
import { runCalculator } from '@/calculators/engine';
import type { CalculationSnapshot } from './calculation-snapshot';
import { createCalculationSnapshot } from './calculation-snapshot';

/**
 * Re-evaluation is opt-in. A complete-input contract must be reviewed and
 * supplied by the caller; this module never infers eligibility from a slug.
 * No calculator is registered by default.
 */
export type ScenarioReevaluationContract = Readonly<{
  calculatorSlug: string;
  calculatorVersion: number;
  reviewEvidence: string;
  calculate: (completeInput: Readonly<Record<string, unknown>>) => Record<string, unknown>;
}>;

function validIdentity(slug: string, version: number) {
  return typeof slug === 'string' && slug.trim().length > 0 &&
    Number.isSafeInteger(version) && version > 0;
}

export function reevaluateScenario(
  captured: CalculationSnapshot,
  contract: ScenarioReevaluationContract | undefined,
  editedInput?: Readonly<Record<string, unknown>>,
): CalculationSnapshot {
  if (!contract || !validIdentity(contract.calculatorSlug, contract.calculatorVersion) ||
      !contract.reviewEvidence?.trim() || typeof contract.calculate !== 'function') {
    throw new Error('Scenario re-evaluation is unavailable without an explicit reviewed contract');
  }
  const original = createCalculationSnapshot(captured);
  if (original.calculatorSlug !== contract.calculatorSlug ||
      original.calculatorVersion !== contract.calculatorVersion) {
    throw new Error('Scenario re-evaluation calculator identity mismatch');
  }
  // Never pass the historical input object itself to the engine.
  const input = createCalculationSnapshot({ ...original, input: editedInput ? { ...editedInput } : original.input }).input;
  const output = contract.calculate(input);
  // Snapshot validation rejects non-finite, cyclic and non-JSON results.
  return createCalculationSnapshot({
    calculatorSlug: original.calculatorSlug,
    calculatorVersion: original.calculatorVersion,
    input,
    output,
  });
}

/** Explicit complete-input allowlist; financial and specialist-dependent calculators are excluded. */
export function eligibleScenarioContract(snapshot: CalculationSnapshot): ScenarioReevaluationContract | undefined {
  const definitions = [percentageCalculator, unitConversionCalculator] as const;
  const definition = definitions.find(item => item.slug === snapshot.calculatorSlug && item.version === snapshot.calculatorVersion);
  if (!definition || definition.reviewStatus !== 'certified' || definition.riskClass !== 'standard') return undefined;
  return {
    calculatorSlug: definition.slug,
    calculatorVersion: definition.version,
    reviewEvidence: `${definition.id} v${definition.version}: complete engine input schema, certified standard-risk engine`,
    calculate: input => {
      // All approved engines receive exactly their declared complete input shape.
      const parsed = definition.inputSchema.parse(input);
      if (Object.keys(input).length !== Object.keys(parsed).length ||
          Object.keys(parsed).some(key => !Object.hasOwn(input, key))) {
        throw new Error('Incomplete or unsupported scenario input');
      }
      // Narrow by identity before calling the typed engine.
      if (definition.slug === percentageCalculator.slug) {
        return runCalculator(percentageCalculator, percentageCalculator.inputSchema.parse(parsed)).output;
      }
      return runCalculator(unitConversionCalculator, unitConversionCalculator.inputSchema.parse(parsed)).output;
    },
  };
}
