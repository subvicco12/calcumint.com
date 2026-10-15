import type { CalculationSnapshot } from './calculation-snapshot';
import { eligibleScenarioContract, reevaluateScenario } from './scenario-reevaluation';
import { eligibleSensitivityFields } from './scenario-sensitivity-capabilities';

/**
 * Deterministic, read-only one-variable sensitivity. Only certified, explicitly
 * allowlisted complete-input engines are eligible. No formula is duplicated.
 * Captured historical inputs and outputs are never modified.
 */
export type SensitivityPoint = Readonly<{
  inputValue: number;
  snapshot: CalculationSnapshot;
}>;

export function calculateScenarioSensitivity(
  captured: CalculationSnapshot,
  field: string,
  candidateValues: readonly number[],
): readonly SensitivityPoint[] {
  const contract = eligibleScenarioContract(captured);
  if (!contract) throw new Error('Sensitivity requires an eligible certified calculator');
  if (!eligibleSensitivityFields(captured).includes(field)) {
    throw new Error('Sensitivity requires an existing numeric engine input');
  }
  if (!Array.isArray(candidateValues) || candidateValues.length === 0 || candidateValues.length > 25 ||
      candidateValues.some(value => typeof value !== 'number' || !Number.isFinite(value))) {
    throw new Error('Sensitivity requires 1–25 finite candidate values');
  }
  return Object.freeze(candidateValues.map(inputValue => Object.freeze({
    inputValue,
    snapshot: reevaluateScenario(captured, contract, { ...captured.input, [field]: inputValue }),
  })));
}
