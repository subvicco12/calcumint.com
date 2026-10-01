import type { FinalPlan, FinalProductCapability } from "./product-capabilities";
import type { CapabilityPresentation } from "./capability-presentation";
import { resolveCapabilityPresentation } from "./capability-presentation";

export type FinalRendererCapability = {
  capability: FinalProductCapability;
  presentation: CapabilityPresentation;
};

export function resolveFinalRendererCapabilities(
  plan: FinalPlan,
  capabilities: readonly FinalProductCapability[]
): readonly FinalRendererCapability[] {
  return capabilities.map(capability => ({
    capability,
    presentation: resolveCapabilityPresentation(plan, capability)
  }));
}

export function executableRendererCapabilities(
  plan: FinalPlan,
  capabilities: readonly FinalProductCapability[]
): readonly FinalProductCapability[] {
  return resolveFinalRendererCapabilities(plan, capabilities)
    .filter(item => item.presentation.canExecute)
    .map(item => item.capability);
}
