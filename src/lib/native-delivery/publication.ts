import 'server-only';
import {getPublishedCalculatorSlugs} from '@/lib/publication-manifest';
import {calculatorRegistry} from '@/calculators/registry';
import {isRepositoryPublicationEligible} from '@/calculators/publication-authority';
import {NativeDeliveryError} from './contract';
import {factoryDeliveryIdentity} from './factory-delivery-catalog';
/** The shared reader requires both repository certification and exact hosted manifest identity/version. */
export async function requireNativePublication(catalogId:number,version:number){
 const identity=factoryDeliveryIdentity(catalogId,version);
 if(!identity)throw new NativeDeliveryError(404,'Native calculator unavailable');
 const definition=calculatorRegistry.getBySlug(identity.slug);
 if(!isRepositoryPublicationEligible(definition)||definition.id!==identity.engineId||definition.slug!==identity.slug||definition.version!==version)throw new NativeDeliveryError(404,'Native calculator unavailable');
 if(!(await getPublishedCalculatorSlugs()).has(identity.slug))throw new NativeDeliveryError(404,'Native calculator unavailable');
}
