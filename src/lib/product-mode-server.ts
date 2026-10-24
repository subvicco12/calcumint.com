import 'server-only';
import {capabilitiesForMode, resolveProductMode, FeatureUnavailableError, type ProductCapability} from './product-mode';
export function getProductPolicy() {
  const mode = resolveProductMode(process.env.CALCUMINT_PRODUCT_MODE);
  return {mode, capabilities: capabilitiesForMode(mode)};
}
export function requireProductCapability(capability: ProductCapability): void {
  if (!getProductPolicy().capabilities[capability]) throw new FeatureUnavailableError();
}
