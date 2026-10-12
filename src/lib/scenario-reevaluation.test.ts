import { describe, expect, it } from 'vitest';
import { createCalculationSnapshot } from './calculation-snapshot';
import { reevaluateScenario, type ScenarioReevaluationContract } from './scenario-reevaluation';

const original = createCalculationSnapshot({
  calculatorSlug: 'test-calculator',
  calculatorVersion: 1,
  input: { amount: 2 },
  output: { result: 4 },
});
const contract: ScenarioReevaluationContract = {
  calculatorSlug: 'test-calculator',
  calculatorVersion: 1,
  reviewEvidence: 'reviewed-complete-input-contract',
  calculate: input => ({ result: (input.amount as number) * 3 }),
};

describe('explicit scenario re-evaluation boundary', () => {
  it('fails closed when no reviewed contract exists', () => {
    expect(() => reevaluateScenario(original, undefined)).toThrow(/unavailable/);
    expect(() => reevaluateScenario(original, { ...contract, reviewEvidence: '' })).toThrow(/unavailable/);
  });
  it('rejects different calculator identity or version', () => {
    expect(() => reevaluateScenario(original, { ...contract, calculatorVersion: 2 })).toThrow(/mismatch/);
    expect(() => reevaluateScenario(original, { ...contract, calculatorSlug: 'other' })).toThrow(/mismatch/);
  });
  it('returns a separate validated result without mutating the historical snapshot', () => {
    const result = reevaluateScenario(original, contract);
    expect(result.output).toEqual({ result: 6 });
    expect(result.input).toEqual({ amount: 2 });
    expect(original.output).toEqual({ result: 4 });
    expect(result).not.toBe(original);
    expect(Object.isFrozen(result.output)).toBe(true);
  });
  it('rejects invalid engine outputs without changing historical evidence', () => {
    expect(() => reevaluateScenario(original, { ...contract, calculate: () => ({ result: Infinity }) })).toThrow(/Non-finite/);
    expect(original.output).toEqual({ result: 4 });
  });
});
