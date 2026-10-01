import type { StructuredCalculationResult } from "./types";

export type RendererTrustSurface = {
  methodology: string;
  sources: readonly { label: string; url?: string }[];
};

export function rendererTrustSurface(result: StructuredCalculationResult): RendererTrustSurface | null {
  const methodology = result.methodology?.trim();
  if (!methodology || !result.sources?.length) return null;
  return { methodology, sources: result.sources };
}
