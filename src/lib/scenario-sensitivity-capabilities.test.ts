import { describe, expect, it } from 'vitest';
import { createCalculationSnapshot } from './calculation-snapshot';
import { eligibleSensitivityFields } from './scenario-sensitivity-capabilities';
import { calculateScenarioSensitivity } from './scenario-sensitivity';

describe('reviewed sensitivity capability metadata', () => {
  it('exposes only explicitly reviewed percentage variables', () => {
    const snapshot = createCalculationSnapshot({
      calculatorSlug: 'percentage-of-value-calculator', calculatorVersion: 1,
      input: { percentage: 20, value: 250 }, output: { result: 50 },
    });
    expect(eligibleSensitivityFields(snapshot)).toEqual(['percentage', 'value']);
    expect(calculateScenarioSensitivity(snapshot, 'value', [100, 200]).map(point => point.snapshot.output.result)).toEqual([20, 40]);
    expect(() => calculateScenarioSensitivity(snapshot, 'unreviewed', [100])).toThrow();
  });
  it('allows only conversion magnitude, not unit identity, and excludes mortgage', () => {
    const conversion = createCalculationSnapshot({
      calculatorSlug: 'unit-conversion-calculator', calculatorVersion: 1,
      input: { value: 1, fromUnit: 'mi', toUnit: 'km' }, output: { result: 1.609344 },
    });
    expect(eligibleSensitivityFields(conversion)).toEqual(['value']);
    expect(() => calculateScenarioSensitivity(conversion, 'fromUnit', [2])).toThrow();
    const mortgage = createCalculationSnapshot({
      calculatorSlug: 'mortgage-calculator', calculatorVersion: 1,
      input: { principal: 100, termMonths: 12 }, output: { monthlyPayment: 10 },
    });
    expect(eligibleSensitivityFields(mortgage)).toEqual([]);
  });
});
