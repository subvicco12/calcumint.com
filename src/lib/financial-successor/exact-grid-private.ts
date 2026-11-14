import { z } from 'zod';
import { loanPaymentCalculator } from '../../calculators/finance/loan-payment';
import { compoundInterestCalculator } from '../../calculators/finance/compound-interest';
import { roundFinancialExactGridCandidate as round } from '../financial-exact-grid';
import { createCalculationSnapshot, type CalculationSnapshot } from '../calculation-snapshot';
import { parsePublicationFactoryInput } from '../publication-factory-contracts-input';
import { sameRecordedJson } from '../recorded-json-equality';

/** Private experimental identity only. No registry, routing or certification adoption. */
export const financialSuccessorRevision = 'private-financial-exact-grid-20261108.1';
function finite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new RangeError(`${label} exceeds supported numeric range`);
  return value;
}

export const loanPaymentExactGridSuccessor = Object.freeze({
  id: 'finance.loan-payment.exact-grid-private', originalEngineId: 'finance.loan-payment', originalEngineVersion: 1, allocatedSuccessorVersion: null,
  slug: 'loan-payment-exact-grid-private',
  inputSchema: loanPaymentCalculator.inputSchema,
  calculate(input: unknown) {
    const { principal, annualRatePercent, termMonths } = loanPaymentCalculator.inputSchema.parse(input);
    const monthlyRate = annualRatePercent / 100 / 12;
    const unroundedPayment = monthlyRate === 0 ? principal / termMonths
      : principal * monthlyRate / (1 - (1 + monthlyRate) ** -termMonths);
    finite(unroundedPayment, 'Loan payment');
    if (unroundedPayment < 0) throw new RangeError('Loan payment exceeds supported numeric range');
    const monthlyPayment = round(unroundedPayment, 2);
    const totalPayment = round(finite(monthlyPayment * termMonths, 'Total loan payment'), 2);
    return { monthlyPayment, totalPayment, totalInterest: round(totalPayment - principal, 2) };
  }
});

export const compoundInterestExactGridSuccessor = Object.freeze({
  id: 'finance.compound-interest.exact-grid-private', originalEngineId: 'finance.compound-interest', originalEngineVersion: 1, allocatedSuccessorVersion: null,
  slug: 'compound-interest-exact-grid-private',
  inputSchema: compoundInterestCalculator.inputSchema,
  calculate(input: unknown) {
    const { principal, annualRatePercent, years, compoundsPerYear } = compoundInterestCalculator.inputSchema.parse(input);
    const periodicRate = annualRatePercent / 100 / compoundsPerYear;
    if (periodicRate <= -1) throw new Error('Periodic rate must be greater than -100%');
    const futureValue = round(finite(principal * Math.pow(1 + periodicRate, compoundsPerYear * years), 'Future value'), 2);
    const totalInterest = round(finite(futureValue - principal, 'Total interest'), 2);
    return { futureValue, totalInterest };
  }
});

const successors = [loanPaymentExactGridSuccessor, compoundInterestExactGridSuccessor] as const;
export type FinancialSuccessorId = (typeof successors)[number]['id'];
export type PrivateFinancialArtifact = Readonly<{
  transportVersion: 1;
  implementationRevision: typeof financialSuccessorRevision;
  baselineEngineId: string;
  baselineEngineVersion: 1;
  snapshot: CalculationSnapshot;
}>;
export function createFinancialSuccessorSnapshot(id: FinancialSuccessorId, input: unknown): PrivateFinancialArtifact {
  const engine = successors.find(row => row.id === id);
  if (!engine) throw new Error('Unknown private financial successor');
  const parsed = engine.inputSchema.parse(input);
  return Object.freeze({ transportVersion: 1, implementationRevision: financialSuccessorRevision,
    baselineEngineId: engine.originalEngineId, baselineEngineVersion: 1,
    snapshot: createCalculationSnapshot({ calculatorSlug: engine.slug, calculatorVersion: 1, input: parsed, output: engine.calculate(parsed) }) });
}

const snapshotSchema = z.object({
  calculatorSlug: z.string(), calculatorVersion: z.literal(1),
  input: z.record(z.string(), z.unknown()), output: z.record(z.string(), z.unknown())
}).strict();
/** Snapshot calculatorVersion=1 is private transport schema only, not a mathematical version. */
/** Explicit private replay only. Never falls back to v1 or a registered latest engine. */
export function replayFinancialSuccessorSnapshot(text: string): PrivateFinancialArtifact {
  if (text.length > 2000000) throw new Error('Financial snapshot size bound');
  const envelope = z.object({ transportVersion: z.literal(1), implementationRevision: z.literal(financialSuccessorRevision), baselineEngineId: z.string(), baselineEngineVersion: z.literal(1), snapshot: snapshotSchema }).strict().parse(parsePublicationFactoryInput(text));
  const snapshot = envelope.snapshot;
  const engine = successors.find(row => row.slug === snapshot.calculatorSlug);
  if (!engine) throw new Error('Unknown private financial successor');
  const expected = createFinancialSuccessorSnapshot(engine.id, snapshot.input);
  if (!sameRecordedJson(envelope, expected)) throw new Error('Financial snapshot input/output mismatch');
  return expected;
}
/** Envelope transportVersion is not an allocated mathematical engine version. */
export function exportFinancialSuccessorSnapshot(artifact: PrivateFinancialArtifact): string {
  const verified = replayFinancialSuccessorSnapshot(JSON.stringify(artifact));
  return JSON.stringify(verified, null, 2);
}
