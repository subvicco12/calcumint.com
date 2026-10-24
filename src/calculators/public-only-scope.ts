import type {ProductMode} from '@/lib/product-mode';
import type {CalculatorDefinition} from './types';
export const PUBLIC_ONLY_IDENTITIES = [
  {id:'core.percentage-of-value',slug:'percentage-of-value-calculator',version:1,category:'math'},
  {id:'core.unit-conversion',slug:'unit-conversion-calculator',version:1,category:'unit-conversions'}
] as const;
/** Narrow already-composed authority; never grant repository-only publication. */
export function restrictPublishedSlugs(mode: ProductMode, definitions: readonly CalculatorDefinition<unknown,unknown>[], publishedSlugs: ReadonlySet<string>): ReadonlySet<string> {
  if (mode === 'full') return publishedSlugs;
  if (mode !== 'public-only') return new Set();
  return new Set(PUBLIC_ONLY_IDENTITIES.filter(identity => publishedSlugs.has(identity.slug) && definitions.some(d => d.id === identity.id && d.slug === identity.slug && d.version === identity.version && d.category === identity.category)).map(d=>d.slug));
}
