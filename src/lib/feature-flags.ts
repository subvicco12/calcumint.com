import {getProductPolicy} from './product-mode-server';
import {capabilityNames,type ProductCapabilities} from './product-mode';
/** Read current server policy rather than freezing flags at module initialization. */
export const featureFlags = Object.defineProperties({},Object.fromEntries(capabilityNames.map(name=>[name,{enumerable:true,get:()=>getProductPolicy().capabilities[name]}]))) as ProductCapabilities;
