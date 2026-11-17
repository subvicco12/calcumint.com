import type {Buffer} from 'node:buffer';
/** Exact source proof only; never mathematical or certification acceptance. */
export const financialHistoricalWitnessRefs: readonly string[];
export const financialSafetySourceRefs: readonly string[];
export function verifyFinancialSafetyBinding(
  name: string,
  bytes: Buffer,
  originalClaim: string,
  git: (args: string[]) => Buffer,
): boolean;
