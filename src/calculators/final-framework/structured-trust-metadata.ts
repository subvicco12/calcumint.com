import type { StructuredResultContract } from "./structured-result";

export type StructuredFinalTrustMetadata = {
  methodology: string;
  sources: StructuredResultContract["sources"];
  technicalVersion: string;
};

export function resolveStructuredFinalTrustMetadata(
  result: StructuredResultContract,
  technicalVersion: string
): StructuredFinalTrustMetadata | null {
  const methodology = result.methodology.trim();
  const version = technicalVersion.trim();
  if (!methodology || result.sources.length === 0 || !version) return null;
  return { methodology, sources: result.sources, technicalVersion: version };
}
