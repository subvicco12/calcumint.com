import type {Buffer} from 'node:buffer';
/** Exact implementation provenance, never source/math/certification approval. */
export const completionSourceRefs: readonly string[];
export function verifyCompletionBinding(
  name: string,
  bytes: Buffer,
  originalClaim: string,
  git: (args: string[]) => Buffer,
  read?: (name: string) => Buffer,
): boolean;
