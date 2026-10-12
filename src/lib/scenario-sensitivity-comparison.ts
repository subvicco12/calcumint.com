import type { CalculationSnapshot } from './calculation-snapshot';
import { calculateScenarioSensitivity } from './scenario-sensitivity';

/**
 * Presentation-only reconciliation of a single numeric engine output.
 * Never computes an alternate calculator formula or changes captured evidence.
 */
export type SensitivityComparisonRow = Readonly<{
  inputValue: number;
  outputValue: number;
  differenceFromBaseline: number;
}>;

export function compareScenarioSensitivity(
  captured: CalculationSnapshot,
  inputField: string,
  outputField: string,
  candidateValues: readonly number[],
): readonly SensitivityComparisonRow[] {
  if (!Object.hasOwn(captured.output, outputField) ||
      typeof captured.output[outputField] !== 'number' ||
      !Number.isFinite(captured.output[outputField])) {
    throw new Error('Comparison requires an existing finite numeric engine output');
  }
  const baseline = captured.output[outputField];
  const points = calculateScenarioSensitivity(captured, inputField, candidateValues);
  const rows = points.map(({ inputValue, snapshot }) => {
    const result = snapshot.output[outputField];
    if (typeof result !== 'number' || !Number.isFinite(result)) {
      throw new Error('Comparison output is missing or nonnumeric');
    }
    const difference = result - baseline;
    if (!Number.isFinite(difference)) throw new Error('Comparison difference is non-finite');
    return Object.freeze({ inputValue, outputValue: result, differenceFromBaseline: difference });
  });
  return Object.freeze(rows);
}
