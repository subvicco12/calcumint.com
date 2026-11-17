import {it,expect,vi,beforeEach} from 'vitest';
const state=vi.hoisted(()=>({published:new Set<string>(),definition:undefined as unknown}));
vi.mock('server-only',()=>({}));vi.mock('@/lib/publication-manifest',()=>({getPublishedCalculatorSlugs:async()=>state.published}));vi.mock('@/calculators/registry',()=>({calculatorRegistry:{getBySlug:()=>state.definition}}));
import {requireTechnologyFivePublication} from './technology-five-publication';
const valid={id:'technology.base64-size',slug:'base64-size-calculator',version:1,reviewStatus:'certified',formulas:[{}],examples:[{}],sources:[{}]};beforeEach(()=>{state.published=new Set();state.definition={...valid};});
it('requires both exact repository certified identity and current hosted publication',async()=>{await expect(requireTechnologyFivePublication(386,1)).rejects.toMatchObject({status:404});state.published.add(valid.slug);await expect(requireTechnologyFivePublication(386,1)).resolves.toMatchObject({catalogId:386});for(const patch of [{reviewStatus:'reviewed'},{id:'technology.bandwidth'},{version:2},{sources:[]}]){state.definition={...valid,...patch};await expect(requireTechnologyFivePublication(386,1)).rejects.toMatchObject({status:404});}});
it('unknown or mismatched version cannot use another published tuple',async()=>{state.published.add(valid.slug);for(const [id,version] of [[440,1],[386,2],[369,1]])await expect(requireTechnologyFivePublication(id,version)).rejects.toMatchObject({status:404});});
it('next-five composition still requires independent certified exact identity and hosted publication',async()=>{
 for(const [catalogId,id,slug] of [[369,'technology.cidr','cidr-calculator'],[375,'technology.raid-capacity','raid-capacity-calculator'],[380,'technology.battery-runtime','battery-runtime-calculator'],[381,'technology.ups-runtime','ups-runtime-calculator'],[387,'technology.password-entropy','password-entropy-calculator']] as const){
  state.definition={...valid,id,slug};state.published=new Set();
  await expect(requireTechnologyFivePublication(catalogId,1)).rejects.toMatchObject({status:404});
  state.published.add(slug);
  await expect(requireTechnologyFivePublication(catalogId,1)).resolves.toMatchObject({catalogId,engineId:id,version:1});
  state.definition={...valid,id,slug,reviewStatus:'reviewed'};
  await expect(requireTechnologyFivePublication(catalogId,1)).rejects.toMatchObject({status:404});
  await expect(requireTechnologyFivePublication(catalogId,2)).rejects.toMatchObject({status:404});
 }
});
