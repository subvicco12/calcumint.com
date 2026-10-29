import {describe,it,expect} from 'vitest';
import {finalPrivateDiscovery,finalPrivateExamples,exportFinalPrivate,importFinalPrivate,finalPrivateHeadline} from './final-private-workbench';
import {exportFinancialContract,financialExamples} from './financial-contracts';
const cohort=[21,32,36,43,46,49,80,81,84,85,86,125,126,127,134,198,199,468,469,470,472,488,516];
describe('closed private final workbench adapters',()=>{
 it('discovers the exact50, reconciles all23, and keeps198/199 blocked',()=>{
  expect(finalPrivateDiscovery).toHaveLength(50);expect(new Set(finalPrivateDiscovery.map(r=>r.masterId)).size).toBe(50);
  expect(finalPrivateDiscovery.filter(r=>r.available)).toHaveLength(29);
  expect(finalPrivateDiscovery.filter(r=>cohort.includes(r.masterId)&&r.available)).toHaveLength(21);
  for(const id of [198,199]){
   expect(finalPrivateDiscovery.find(r=>r.masterId===id)).toMatchObject({available:false,canonicalCompleted:false});
   expect(()=>exportFinalPrivate(id,{})).toThrow();
  }
  expect(finalPrivateDiscovery.every(r=>r.remainingGaps.length>0&&r.canonicalCompleted===false)).toBe(true);
 });
 it.each([21,32,35,36,43,46,49,80,81,82,84,85,86,88,89,90,91,96,125,126,127,133,134,468,469,470,472,488,516])('%i runs unchanged adapters or new contracts with immutable all-plan parity',id=>{
  const s=exportFinalPrivate(id,finalPrivateExamples[id],'free');
  expect(exportFinalPrivate(id,finalPrivateExamples[id],'pro')).toEqual(s);
  expect(exportFinalPrivate(id,finalPrivateExamples[id],'business')).toEqual(s);
  expect(importFinalPrivate(JSON.parse(JSON.stringify(s)))).toEqual(s);
  expect(finalPrivateHeadline(s).length).toBeGreaterThan(0);
  expect(Object.isFrozen(s.payload.calculation.input)).toBe(true);expect(Object.isFrozen(s.payload.calculation.output)).toBe(true);
 });
 it('preserves original financial payload bytes beneath the new container',()=>{
  expect(exportFinalPrivate(472,financialExamples['private.financial.472']).payload).toEqual(exportFinancialContract('private.financial.472',financialExamples['private.financial.472']));
 });
 it.each(['outer-id','kind','inner-output','source','extra'])('rejects forged adapter envelope %s',kind=>{
  const s=JSON.parse(JSON.stringify(exportFinalPrivate(81,finalPrivateExamples[81])));
  if(kind==='outer-id')s.masterId=85;if(kind==='kind')s.engineKind='financial';
  if(kind==='inner-output')s.payload.calculation.output.balance={numerator:'999',denominator:'1'};
  if(kind==='source')s.payload.sources[0].sha256='0'.repeat(64);if(kind==='extra')s.published=true;
  expect(()=>importFinalPrivate(s)).toThrow();
 });
 it('rejects unknown plans and definitions',()=>{
  expect(()=>exportFinalPrivate(81,finalPrivateExamples[81],'enterprise' as 'free')).toThrow();
  expect(()=>exportFinalPrivate(999,{})).toThrow();
 });
 it.each([[81,85],[36,49],[126,133],[469,82]])('rejects valid foreign payload %i <- %i within a shared replay family',(selected,foreign)=>{
  const outer=JSON.parse(JSON.stringify(exportFinalPrivate(selected,finalPrivateExamples[selected])));
  outer.payload=JSON.parse(JSON.stringify(exportFinalPrivate(foreign,finalPrivateExamples[foreign]).payload));
  expect(()=>importFinalPrivate(outer)).toThrow();
 });
});
