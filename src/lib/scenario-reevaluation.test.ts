import { describe, expect, it } from 'vitest';
import { createCalculationSnapshot } from './calculation-snapshot';
import { eligibleScenarioContract, reevaluateScenario, type ScenarioReevaluationContract } from './scenario-reevaluation';

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

describe('calculator-specific complete-input eligibility', () => {
  const percentage = createCalculationSnapshot({
    calculatorSlug: 'percentage-of-value-calculator',
    calculatorVersion: 1,
    input: { percentage: 20, value: 250 },
    output: { result: 50 },
  });
  it('reuses the registered certified percentage engine', () => {
    const result = reevaluateScenario(percentage, eligibleScenarioContract(percentage));
    expect(result.output).toEqual({ result: 50 });
    expect(result.input).toEqual(percentage.input);
  });
  it('re-evaluates edited inputs without rewriting captured evidence', () => {
    const result = reevaluateScenario(percentage, eligibleScenarioContract(percentage), { percentage: 30, value: 250 });
    expect(result.output).toEqual({ result: 75 });
    expect(result.input).toEqual({ percentage: 30, value: 250 });
    expect(percentage.input).toEqual({ percentage: 20, value: 250 });
    expect(percentage.output).toEqual({ result: 50 });
  });
  it('rejects invalid edited inputs and preserves historical results', () => {
    const approved = eligibleScenarioContract(percentage);
    expect(() => reevaluateScenario(percentage, approved, { percentage: Infinity, value: 2 })).toThrow();
    expect(() => reevaluateScenario(percentage, approved, { percentage: 20 })).toThrow();
    expect(percentage.output).toEqual({ result: 50 });
  });
  it('excludes Mortgage, unsupported identities and versions', () => {
    for (const slug of ['mortgage-calculator', 'sip-calculator', 'unknown']) {
      expect(eligibleScenarioContract({ ...percentage, calculatorSlug: slug })).toBeUndefined();
    }
    expect(eligibleScenarioContract({ ...percentage, calculatorVersion: 2 })).toBeUndefined();
  });
  it('rejects incomplete and extra-field input without changing historical output', () => {
    const contract = eligibleScenarioContract(percentage);
    expect(() => reevaluateScenario({ ...percentage, input: { value: 250 } }, contract)).toThrow();
    expect(() => reevaluateScenario({ ...percentage, input: { percentage: 20, value: 250, unexpected: 1 } }, contract)).toThrow();
    expect(percentage.output).toEqual({ result: 50 });
  });
});
