import 'server-only';
import {getPublishedCalculatorSlugs} from '@/lib/publication-manifest';
import {calculatorRegistry} from '@/calculators/registry';
import {isRepositoryPublicationEligible} from '@/calculators/publication-authority';
import {nativeIdentity,NativeDeliveryError} from './contract';
/** The shared reader requires both repository certification and exact hosted manifest identity/version. */
export async function requireNativePublication(catalogId:number,version:number){if(catalogId!==nativeIdentity.catalogId||version!==nativeIdentity.version)throw new NativeDeliveryError(404,'Native calculator unavailable');const definition=calculatorRegistry.getBySlug(nativeIdentity.slug);if(!isRepositoryPublicationEligible(definition)||definition.id!==nativeIdentity.engineId||definition.version!==version)throw new NativeDeliveryError(404,'Native calculator unavailable');if(!(await getPublishedCalculatorSlugs()).has(nativeIdentity.slug))throw new NativeDeliveryError(404,'Native calculator unavailable');}
