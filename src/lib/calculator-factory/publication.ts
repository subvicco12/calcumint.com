import 'server-only';
import { calculatorRegistry } from '@/calculators/registry';
import { isRepositoryPublicationEligible } from '@/calculators/publication-authority';
import { getPublishedCalculatorSlugs } from '@/lib/publication-manifest';
import { NativeDeliveryError } from '@/lib/native-delivery/contract';
import { getFactoryContract } from './registry';

/** Consumes current publication authority; never promotes a factory or engine status. */
export async function requireFactoryPublication(catalogId: number, version: number) {
  const contract = getFactoryContract(catalogId);
  if (!contract || !contract.registered || contract.version !== version)
    throw new NativeDeliveryError(404, 'Factory delivery unavailable');
  const definition = calculatorRegistry.getBySlug(contract.slug);
  if (!isRepositoryPublicationEligible(definition) || definition.id !== contract.engineId ||
      definition.slug !== contract.slug || definition.version !== contract.version ||
      !(await getPublishedCalculatorSlugs()).has(contract.slug))
    throw new NativeDeliveryError(404, 'Factory delivery unavailable');
  return contract;
}
