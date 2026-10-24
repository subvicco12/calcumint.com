/** Pure policy; server callers select the mode, never a request parameter. */
export type ProductMode = 'full' | 'public-only' | 'invalid';
export const capabilityNames = ['calculatorEngine','accounts','proBilling','businessWorkspace','calculatorBuilder','embedsAndLeads','apiAndWebhooks','aiAssistant','adminConsole','savedData','exports','ads'] as const;
export type ProductCapability = typeof capabilityNames[number];
export type ProductCapabilities = Readonly<Record<ProductCapability, boolean>>;
export function resolveProductMode(value: string | undefined): ProductMode {
  return value === undefined || value === 'full' ? 'full' : value === 'public-only' ? 'public-only' : 'invalid';
}
export function capabilitiesForMode(mode: ProductMode): ProductCapabilities {
  return Object.fromEntries(capabilityNames.map(name => [name, mode === 'full' || (mode === 'public-only' && name === 'calculatorEngine')])) as ProductCapabilities;
}
export const FEATURE_UNAVAILABLE = 'Feature unavailable in this release';
export class FeatureUnavailableError extends Error {
  constructor() { super(FEATURE_UNAVAILABLE); this.name = 'FeatureUnavailableError'; }
}
