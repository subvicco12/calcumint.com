import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({published:new Set<string>(),definition:undefined as unknown}));
vi.mock('server-only',()=>({}));
vi.mock('@/lib/publication-manifest',()=>({getPublishedCalculatorSlugs:async()=>state.published}));
vi.mock('@/calculators/registry',()=>({calculatorRegistry:{getBySlug:()=>state.definition}}));
import {requireNativePublication} from './publication';
import {factoryDeliveryCatalog} from './factory-delivery-catalog';
beforeEach(()=>{state.published=new Set();state.definition=undefined;});
it.each(factoryDeliveryCatalog)('fails closed on absent, stale or uncertified publication for $catalogId',async identity=>{
 const valid={id:identity.engineId,slug:identity.slug,version:1,reviewStatus:'certified',formulas:[{}],examples:[{}],sources:[{}]};
 state.definition={...valid};
 await expect(requireNativePublication(identity.catalogId,1)).rejects.toMatchObject({status:404});
 state.published.add(identity.slug);
 await expect(requireNativePublication(identity.catalogId,1)).resolves.toBeUndefined();
 for(const patch of [{id:'different'},{slug:'different'},{version:2},{reviewStatus:'draft'},{sources:[]}]){
  state.definition={...valid,...patch};
  await expect(requireNativePublication(identity.catalogId,1)).rejects.toMatchObject({status:404});
 }
});
