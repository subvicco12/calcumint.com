import { describe, expect, it } from 'vitest';
import { createCalculationSnapshot } from './calculation-snapshot';
import { calculateScenarioSensitivity } from './scenario-sensitivity';

describe('scenario sensitivity contract', () => {
  const captured = createCalculationSnapshot({
    calculatorSlug: 'percentage-of-value-calculator',
    calculatorVersion: 1,
    input: { percentage: 20, value: 250 },
    output: { result: 50 },
  });
  it('reuses certified deterministic engines and preserves historical evidence', () => {
    const before = JSON.stringify(captured);
    const points = calculateScenarioSensitivity(captured, 'percentage', [10, 20, 30]);
    expect(points.map(point => point.snapshot.output.result)).toEqual([25, 50, 75]);
    expect(points.map(point => point.snapshot.input.percentage)).toEqual([10, 20, 30]);
    expect(JSON.stringify(captured)).toBe(before);
    expect(Object.isFrozen(points)).toBe(true);
    expect(Object.isFrozen(points[0].snapshot)).toBe(true);
  });
  it('rejects unsupported identities, nonnumeric fields, invalid ranges and unapproved inputs', () => {
    expect(() => calculateScenarioSensitivity(captured, 'missing', [10])).toThrow();
    expect(() => calculateScenarioSensitivity(captured, 'percentage', [Number.NaN])).toThrow();
    expect(() => calculateScenarioSensitivity(captured, 'percentage', [])).toThrow();
    expect(() => calculateScenarioSensitivity(captured, 'percentage', Array(26).fill(1))).toThrow();
    expect(calculateScenarioSensitivity(captured, 'percentage', [-10])[0].snapshot.output.result).toBe(-25);
    const mortgage = createCalculationSnapshot({
      calculatorSlug: 'mortgage-calculator', calculatorVersion: 1,
      input: { principal: 100, termMonths: 12 }, output: { monthlyPayment: 10 },
    });
    expect(() => calculateScenarioSensitivity(mortgage, 'principal', [100])).toThrow();
  });
  it('reconciles baseline sensitivity to certified historical output and rejects a mixed invalid series atomically', () => {
    const original = JSON.stringify(captured);
    const points = calculateScenarioSensitivity(captured, 'percentage', [10, 20, 30]);
    const baseline = points.find(point => point.inputValue === captured.input.percentage);
    expect(baseline?.snapshot.output).toEqual(captured.output);
    expect(baseline?.snapshot.input).toEqual(captured.input);
    expect(() => calculateScenarioSensitivity(captured, 'percentage', [10, Number.POSITIVE_INFINITY, 30])).toThrow();
    expect(JSON.stringify(captured)).toBe(original);
  });
  it('runs unit conversion sensitivity through the registered conversion engine', () => {
    const conversion = createCalculationSnapshot({
      calculatorSlug: 'unit-conversion-calculator', calculatorVersion: 1,
      input: { value: 1, fromUnit: 'mi', toUnit: 'km' }, output: { result: 1.609344 },
    });
    const points = calculateScenarioSensitivity(conversion, 'value', [1, 2]);
    expect(points.map(point => point.snapshot.output.result)).toEqual([1.609344, 3.218688]);
    expect(() => calculateScenarioSensitivity(conversion, 'fromUnit', [1])).toThrow();
  });
});
