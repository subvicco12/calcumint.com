import {it,expect} from 'vitest';
import {assertScaledGolden,validateScaledContract} from './scaled-contract-validation';
import {scaledContractAdapters,allContractAdapters,exportScaledContract,importScaledContract} from './scaled-contract-adapters';
import {scaledVectors} from './scaled-contract-vectors';
import {canonicalContractAdapters,exportValidatedContract} from './canonical-contract-adapters';
import {canonicalVectors} from './canonical-contract-vectors';
it('does not let tolerance erase a nonzero witness into zero',()=>{expect(()=>assertScaledGolden({value:0},{value:1e-8},1e-7)).toThrow();});
it('rejects sign crossing even inside absolute tolerance',()=>{expect(()=>assertScaledGolden({value:-1e-8},{value:1e-8},1e-7)).toThrow();expect(()=>assertScaledGolden({value:1e-8},{value:-1e-8},1e-7)).toThrow();});
it('bounds tolerance and keeps nonprimary fields and types exact',()=>{
 for(const tol of [NaN,Infinity,-1,1.000001e-7])expect(()=>assertScaledGolden({value:1},{value:1},tol)).toThrow();
 for(const [actual,expected] of [[{value:1e-8},{value:0}],[{value:'1'},{value:1}],[{value:null},{value:0}],[{value:1,unit:'g'},{value:1,unit:'kg'}]])expect(()=>assertScaledGolden(actual,expected,1e-7)).toThrow();
 expect(()=>assertScaledGolden({value:1+5e-8},{value:1},1e-7)).not.toThrow();
});
it('preserves selected identity/version and actual invalid/golden failures',()=>{const a=scaledContractAdapters[0],v=scaledVectors.find(v=>v.id===a.catalogId)!;expect(validateScaledContract({...a,version:a.version+1},v.witnesses,v.invalid).engineeringPassed).toBe(false);expect(validateScaledContract({...a,catalogId:540},v.witnesses,v.invalid).engineeringPassed).toBe(false);expect(validateScaledContract(a,v.witnesses,[v.witnesses[0].input]).engineeringPassed).toBe(false);});
it('retains79 unique adapters and unchanged v1 packet dispatch',()=>{expect(allContractAdapters).toHaveLength(79);expect(new Set(allContractAdapters.map(a=>a.catalogId)).size).toBe(79);const a=canonicalContractAdapters[0],v=canonicalVectors.find(v=>v.id===a.catalogId)!,p=exportValidatedContract(a.key,v.witnesses[0].input);expect(exportScaledContract(a.key,v.witnesses[0].input)).toEqual(p);expect(importScaledContract(p)).toEqual(p);});
it('rejects v2 source and revision tampering with all-plan parity',()=>{const a=scaledContractAdapters[0],v=scaledVectors.find(v=>v.id===a.catalogId)!,p=exportScaledContract(a.key,v.witnesses[0].input);for(const plan of ['pro','business'] as const)expect(exportScaledContract(a.key,v.witnesses[0].input,plan)).toEqual(p);expect(importScaledContract(p)).toEqual(p);for(const mutate of [(x:typeof p)=>{x.validationRevision=1;},(x:typeof p)=>{x.catalogId=540;},(x:typeof p)=>{x.sourceBinding.technicalSourceTreeSHA256='0'.repeat(64);}]){const f=structuredClone(p);mutate(f);expect(()=>importScaledContract(f)).toThrow();}});
