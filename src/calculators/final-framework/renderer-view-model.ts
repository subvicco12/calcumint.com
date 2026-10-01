import type { FinalPlan, FinalProductCapability } from "./product-capabilities";
import type { PresentationDefinition } from "./types";
import { resolveFinalRendererCapabilities } from "./renderer-capability-policy";

export type FinalRendererViewModel = {
  presentationId: string;
  freeVisualization: PresentationDefinition["freeVisualization"];
  capabilities: ReturnType<typeof resolveFinalRendererCapabilities>;
};

export function createFinalRendererViewModel(plan: FinalPlan, definition: PresentationDefinition, capabilities: readonly FinalProductCapability[]): FinalRendererViewModel {
  return {
    presentationId: definition.id,
    freeVisualization: definition.freeVisualization,
    capabilities: resolveFinalRendererCapabilities(plan, capabilities)
  };
}
