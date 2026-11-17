import 'server-only';
import {getPublishedCalculatorSlugs} from '@/lib/publication-manifest';
import {calculatorRegistry} from '@/calculators/registry';
import {isRepositoryPublicationEligible} from '@/calculators/publication-authority';
import {NativeDeliveryError} from './contract';
import {technologyFiveIdentity} from './technology-five-catalog';
/** Same repository + hosted exact-version publication composition as native440. Never grants publication. */
export async function requireTechnologyFivePublication(catalogId:number,version:number){
 const identity=technologyFiveIdentity(catalogId,version);if(!identity)throw new NativeDeliveryError(404,'Technology delivery unavailable');
 const definition=calculatorRegistry.getBySlug(identity.slug);
 if(!isRepositoryPublicationEligible(definition)||definition.id!==identity.engineId||definition.version!==identity.version||!(await getPublishedCalculatorSlugs()).has(identity.slug))throw new NativeDeliveryError(404,'Technology delivery unavailable');
 return identity;
}
