import type { CapabilityState, FinalPlan, FinalProductCapability } from "./product-capabilities";
import { resolveFinalCapability } from "./product-capabilities";

export type CapabilityPresentation = {
  state: CapabilityState;
  canExecute: boolean;
  showPreview: boolean;
  showUpgradePrompt: boolean;
};

export function resolveCapabilityPresentation(
  plan: FinalPlan,
  capability: FinalProductCapability
): CapabilityPresentation {
  const state = resolveFinalCapability(plan, capability);
  return {
    state,
    canExecute: state === "active",
    showPreview: state === "preview" || state === "limited",
    showUpgradePrompt: state === "preview" || state === "locked" || state === "limited"
  };
}
