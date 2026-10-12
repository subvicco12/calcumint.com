import type { CalculationSnapshot } from './calculation-snapshot';
import type { SensitivityPoint } from './scenario-sensitivity';

/** Read-only presentation of existing engine results. Never re-runs an engine. */
export type SensitivityMetric = Readonly<{ field: string; value: number; baselineDifference: number | null }>;
export type SensitivityPresentationRow = Readonly<{ inputValue: number; metrics: readonly SensitivityMetric[] }>;

export function presentSensitivityResults(
  baseline: CalculationSnapshot,
  points: readonly SensitivityPoint[],
): readonly SensitivityPresentationRow[] {
  return Object.freeze(points.map(point => {
    if (point.snapshot.calculatorSlug !== baseline.calculatorSlug ||
        point.snapshot.calculatorVersion !== baseline.calculatorVersion) {
      throw new Error('Sensitivity presentation identity mismatch');
    }
    const metrics = Object.entries(point.snapshot.output).flatMap(([field, value]) => {
      if (typeof value !== 'number' || !Number.isFinite(value)) return [];
      const original = baseline.output[field];
      const difference = typeof original === 'number' && Number.isFinite(original) ? value - original : null;
      return [Object.freeze({
        field, value,
        baselineDifference: difference !== null && Number.isFinite(difference) ? difference : null,
      })];
    });
    return Object.freeze({ inputValue: point.inputValue, metrics: Object.freeze(metrics) });
  }));
}
