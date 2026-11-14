import { describe, expect, it } from 'vitest';
import { loanPaymentCalculator as legacyLoan } from '../../calculators/finance/loan-payment';
import { compoundInterestCalculator as legacyCompound } from '../../calculators/finance/compound-interest';
import { compoundInterestExactGridSuccessor as compound, loanPaymentExactGridSuccessor as loan, createFinancialSuccessorSnapshot, exportFinancialSuccessorSnapshot, replayFinancialSuccessorSnapshot } from './exact-grid-private';

describe('unregistered exact-grid financial successor', () => {
  const principal = 12000000000000.25; // exact dyadic 48000000000001 / 4
  it('fixes actual engines against independent zero-period and single-payment identities', () => {
    const c = { principal, annualRatePercent: 5, years: 0, compoundsPerYear: 12 };
    const l = { principal, annualRatePercent: 0, termMonths: 1 };
    expect(legacyCompound.calculate(c, {})).toEqual({ futureValue: 12000000000000.26, totalInterest: 0.01 });
    expect(legacyLoan.calculate(l, {})).toEqual({ monthlyPayment: 12000000000000.26, totalPayment: 12000000000000.27, totalInterest: 0.02 });
    expect(compound.calculate(c)).toEqual({ futureValue: principal, totalInterest: 0 });
    expect(loan.calculate(l)).toEqual({ monthlyPayment: principal, totalPayment: principal, totalInterest: 0 });
  });
  it.each([0.25, 0.5, 0.75, 1000000000000.25, 12000000000000.25, 2 ** 50 + 0.25])('preserves exact quarter-grid identity at %s', p => {
    expect(compound.calculate({ principal: p, annualRatePercent: -99.999999, years: 0, compoundsPerYear: 365 })).toEqual({ futureValue: p, totalInterest: 0 });
    expect(loan.calculate({ principal: p, annualRatePercent: 0, termMonths: 1 })).toEqual({ monthlyPayment: p, totalPayment: p, totalInterest: 0 });
  });
  it('retains independently specified ordinary formula examples and off-grid policy', () => {
    expect(loan.calculate({ principal: 100000, annualRatePercent: 6, termMonths: 360 })).toEqual({ monthlyPayment: 599.55, totalPayment: 215838, totalInterest: 115838 });
    expect(compound.calculate({ principal: 10000, annualRatePercent: 5, years: 10, compoundsPerYear: 12 })).toEqual({ futureValue: 16470.09, totalInterest: 6470.09 });
    expect(loan.calculate({ principal: 1, annualRatePercent: 0, termMonths: 3 })).toEqual({ monthlyPayment: 0.33, totalPayment: 0.99, totalInterest: -0.01 });
    expect(compound.calculate({ principal: 1.005, annualRatePercent: 0, years: 0, compoundsPerYear: 1 })).toEqual(legacyCompound.calculate({ principal: 1.005, annualRatePercent: 0, years: 0, compoundsPerYear: 1 }, {}));
  });
  it('reuses schemas and retains direct-call and nonfinite guards from 1370/1231/1230', () => {
    expect(loan.inputSchema).toBe(legacyLoan.inputSchema);
    expect(compound.inputSchema).toBe(legacyCompound.inputSchema);
    for (const overrides of [{ termMonths: 1.5 }, { termMonths: 0 }, { termMonths: 1201 }, { annualRatePercent: -1 }, { annualRatePercent: 1001 }, { principal: Infinity }, { principal: 0 }]) {
      expect(() => loan.calculate({ principal: 100, annualRatePercent: 0, termMonths: 1, ...overrides })).toThrow();
    }
    for (const overrides of [{ years: -1 }, { years: 201 }, { annualRatePercent: -100 }, { annualRatePercent: 1001 }, { compoundsPerYear: 0 }, { compoundsPerYear: 366 }, { compoundsPerYear: 1.5 }, { principal: NaN }]) {
      expect(() => compound.calculate({ principal: 100, annualRatePercent: 0, years: 1, compoundsPerYear: 1, ...overrides })).toThrow();
    }
    expect(() => loan.calculate({ principal: 1e308, annualRatePercent: 1000, termMonths: 1 })).toThrow();
    expect(() => loan.calculate({ principal: 1e308, annualRatePercent: 1000, termMonths: 1200 })).toThrow();
    expect(() => loan.calculate({ principal: 1e308, annualRatePercent: 100, termMonths: 1200 })).toThrow();
    expect(() => compound.calculate({ principal: 1e308, annualRatePercent: 1000, years: 200, compoundsPerYear: 365 })).toThrow();
    expect(compound.calculate({ principal: 1e308, annualRatePercent: -50, years: 10, compoundsPerYear: 1 })).toEqual({ futureValue: 9.765625e304, totalInterest: -9.990234375e307 });
  });
  it('exports frozen snapshots and rejects changed revision, identity, fields, version and outputs', () => {
    const input = { principal, annualRatePercent: 0, termMonths: 1 };
    const snapshot = createFinancialSuccessorSnapshot(loan.id, input);
    input.principal = 1;
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.snapshot.input)).toBe(true);
    expect(Object.isFrozen(snapshot.snapshot.output)).toBe(true);
    expect(Object.isFrozen(snapshot.snapshot)).toBe(true);
    expect(snapshot.implementationRevision).toBe('private-financial-exact-grid-20261108.1');
    expect(snapshot.baselineEngineId).toBe(legacyLoan.id);
    expect(snapshot.baselineEngineVersion).toBe(1);
    const text = exportFinancialSuccessorSnapshot(snapshot);
    expect(replayFinancialSuccessorSnapshot(text)).toEqual(snapshot);
    expect(() => replayFinancialSuccessorSnapshot(text.replace('"calculatorVersion": 1', '"calculatorVersion": 1.0000000000000001'))).toThrow(/precision/);
    expect(() => replayFinancialSuccessorSnapshot(text.replace('"termMonths": 1', '"termMonths": 1.0000000000000001'))).toThrow(/precision/);
    expect(() => replayFinancialSuccessorSnapshot(text.replace('"totalInterest": 0', '"totalInterest": 1e-999'))).toThrow(/underflow/);
    expect(() => replayFinancialSuccessorSnapshot(JSON.stringify(snapshot.snapshot))).toThrow();
    expect(() => exportFinancialSuccessorSnapshot(snapshot.snapshot as unknown as typeof snapshot)).toThrow();
    type Envelope = { implementationRevision: string; baselineEngineId: string; baselineEngineVersion: number; snapshot: { calculatorVersion: number; calculatorSlug: string; output: Record<string, number>; input: Record<string, number> } };
    const edits = [
      (row: Envelope) => { row.implementationRevision = 'latest'; },
      (row: Envelope) => { row.baselineEngineId = legacyCompound.id; },
      (row: Envelope) => { row.baselineEngineVersion = 2; },
      (row: Envelope) => { row.snapshot.calculatorVersion = 2; },
      (row: Envelope) => { row.snapshot.calculatorSlug = legacyLoan.slug; },
      (row: Envelope) => { row.snapshot.output.totalInterest = 1; },
      (row: Envelope) => { row.snapshot.input.extra = 1; }
    ];
    for (const edit of edits) { const row = JSON.parse(text); edit(row); expect(() => replayFinancialSuccessorSnapshot(JSON.stringify(row))).toThrow(); }
  });
});
