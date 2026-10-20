/** @vitest-environment jsdom */
import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { sipV2Candidate } from '../finance/sip-v2-candidate';
import { sipCalculator } from '../finance/sip';
import { calculatorRegistry } from '../registry';
import { runCalculator } from '../engine';
import { createCalculationSnapshot, serializeCalculationJson } from '../../lib/calculation-snapshot';
import { FinalCalculatorRenderer } from '../../components/final-calculator-renderer';
afterEach(cleanup);
const input = { monthlyContribution: 10000, annualReturnPercent: 1e-12, termMonths: 1200, contributionTiming: 'end' as const };
it('keeps public registration on v1 and leaves captured legacy values immutable', () => {
  expect(calculatorRegistry.getBySlug('sip-calculator')).toBe(sipCalculator);
  expect(calculatorRegistry.getById('finance.sip')).toBe(sipCalculator);
  expect(calculatorRegistry.list()).not.toContain(sipV2Candidate);
  expect(sipCalculator.version).toBe(1); expect(sipV2Candidate.version).toBe(2);
  expect(sipV2Candidate.reviewStatus).toBe('draft');
  // A historical observation, NOT an assertion that the old arithmetic is correct.
  const old = createCalculationSnapshot({ calculatorSlug: 'sip-calculator', calculatorVersion: 1, input,
    output: { futureValue: 12789769.24, investedAmount: 12000000, estimatedGain: 789769.24 } });
  const before = serializeCalculationJson(old);
  const corrected = runCalculator(sipV2Candidate, input);
  expect(corrected.output).toEqual({ futureValue: 12000000, investedAmount: 12000000, estimatedGain: 0 });
  expect(corrected.version).toBe(2);
  expect(serializeCalculationJson(old)).toBe(before);
  expect(Object.isFrozen(old.output)).toBe(true);
  expect(JSON.parse(before).calculatorVersion).toBe(1);
  const prospective = createCalculationSnapshot({ calculatorSlug: corrected.slug, calculatorVersion: corrected.version, input: corrected.input, output: corrected.output });
  expect(JSON.parse(serializeCalculationJson(prospective)).calculatorVersion).toBe(2);
});
for (const plan of ['free', 'pro', 'business'] as const) {
  it(`renders identical draft arithmetic for ${plan} without a mathematical entitlement branch`, () => {
    const run = runCalculator(sipV2Candidate, input);
    // Verification-only draft presentation; do not reuse certified-v1 trust metadata.
    render(<FinalCalculatorRenderer plan={plan} result={{
      primaryResult: { id: 'draft-future', label: 'Draft v2 projected future value', value: run.output.futureValue },
      metrics: [{ id: 'draft-principal', label: 'Contributions', value: run.output.investedAmount }, { id: 'draft-gain', label: 'Growth', value: run.output.estimatedGain }],
      methodology: 'Unregistered v2 arithmetic candidate; recertification and specialist review required.',
      sources: sipV2Candidate.sources,
      warnings: ['Draft candidate; not approved for publication.']
    }} />);
    expect(within(screen.getByRole('status')).getByText('12,000,000')).toBeTruthy();
    expect(screen.getByText('Draft candidate; not approved for publication.')).toBeTruthy();
    expect(screen.queryByText(/certified/i)).toBeNull();
  });
}
