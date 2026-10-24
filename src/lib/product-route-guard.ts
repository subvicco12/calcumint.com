import 'server-only';
import {getProductPolicy} from './product-mode-server';
import {FEATURE_UNAVAILABLE,type ProductCapability} from './product-mode';
export function disabledProductResponse(capability: ProductCapability): Response | null {
  return getProductPolicy().capabilities[capability] ? null : Response.json({error:FEATURE_UNAVAILABLE},{status:503,headers:{'cache-control':'no-store'}});
}
