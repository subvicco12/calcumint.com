import type { StructuredCalculationResult } from "./types";

export type RendererTrustSurface = {
  methodology: string;
  sources: readonly { label: string; url?: string }[];
};

export function rendererTrustSurface(result: StructuredCalculationResult): RendererTrustSurface | null {
  const methodology = typeof result.methodology === "string" ? result.methodology.trim() : undefined;
  if (!methodology || !Array.isArray(result.sources) || !result.sources.length || result.sources.some(source=>!source || typeof source.label!=="string" || (source.url!==undefined && typeof source.url!=="string"))) return null;
  return { methodology, sources: result.sources };
}
