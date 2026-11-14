import 'server-only';
import {factoryDeliveryIdentity} from './factory-delivery-catalog';
import {requireFactoryPublication} from '@/lib/calculator-factory/publication';
import {requireTechnologyFivePublication} from './technology-five-publication';
/** Reuses existing publication gates; does not create publication authority. */
export async function requireAutomationPublication(catalogId:number,version:number){
 if(factoryDeliveryIdentity(catalogId,version))return requireFactoryPublication(catalogId,version);
 return requireTechnologyFivePublication(catalogId,version);
}
