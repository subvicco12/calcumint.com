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
  const input = createCalculationSnapshot(original).input;
  const output = contract.calculate(input);
  // Snapshot validation rejects non-finite, cyclic and non-JSON results.
  return createCalculationSnapshot({
    calculatorSlug: original.calculatorSlug,
    calculatorVersion: original.calculatorVersion,
    input,
    output,
  });
}
