import type { StructuredCalculationResult } from "./types";

export type FinalTrustMetadata = {
  methodology: string;
  sources: readonly { label: string; url?: string }[];
  technicalVersion: string;
};

export function resolveFinalTrustMetadata(
  result: StructuredCalculationResult,
  technicalVersion: string
): FinalTrustMetadata | null {
  const methodology = result.methodology?.trim();
  if (!methodology || !result.sources?.length || !technicalVersion.trim()) return null;
  return { methodology, sources: result.sources, technicalVersion: technicalVersion.trim() };
}
