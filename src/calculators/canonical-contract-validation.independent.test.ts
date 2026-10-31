import {z} from 'zod';
import {it,expect} from 'vitest';
import {canonicalContractAdapters,evaluateCanonicalContract,exportValidatedContract,importValidatedContract,compareValidatedScenarios} from './canonical-contract-adapters';
import {canonicalVectors} from './canonical-contract-vectors';
import {validateContract,assertGolden} from './canonical-contract-validation';
it('fails closed when declared adapter version differs from actual immutable artifact',()=>{
 const a=canonicalContractAdapters[0],v=canonicalVectors.find(v=>v.id===a.catalogId)!;
 expect(validateContract({...a,version:a.version+100},v.witnesses,v.invalid).engineeringPassed).toBe(false);
});
it('fails closed when adapter catalog identity is relabeled',()=>{
 const a=canonicalContractAdapters[0],v=canonicalVectors.find(v=>v.id===a.catalogId)!;
 expect(validateContract({...a,catalogId:540,key:'private.forged.540'},v.witnesses,v.invalid).engineeringPassed).toBe(false);
});
it('all actual selected adapters retain unapproved engineering scope',()=>{
 expect(canonicalContractAdapters).toHaveLength(28);
 for(const a of canonicalContractAdapters){const r=evaluateCanonicalContract(a.key);expect(r.engineeringPassed).toBe(true);expect(r.canonicalAccepted).toBe(false);expect(r.releaseHold).toBe(true);}
});
it('strict golden comparisons reject array shape and number/string substitution',()=>{expect(()=>assertGolden([1,2],[1])).toThrow();expect(()=>assertGolden({x:'1'},{x:1})).toThrow();expect(()=>assertGolden({},{x:undefined})).toThrow();});
it('replay binds packet source, selected ID and governance; scenarios require same adapter',()=>{
 const a=canonicalContractAdapters[0],v=canonicalVectors.find(v=>v.id===a.catalogId)!,p=exportValidatedContract(a.key,v.witnesses[0].input);
 expect(importValidatedContract(p)).toEqual(p);expect(Object.isFrozen(p.sourceBinding)).toBe(true);
 for(const mutation of [(f:typeof p)=>{f.catalogId=540;},(f:typeof p)=>{f.engineVersion+=1;},(f:typeof p)=>{f.governance.canonicalAccepted=true as false;}]){const f=structuredClone(p);mutation(f);expect(()=>importValidatedContract(f)).toThrow();}
 const b=canonicalContractAdapters[1],w=canonicalVectors.find(v=>v.id===b.catalogId)!;expect(()=>compareValidatedScenarios([p,exportValidatedContract(b.key,w.witnesses[0].input)])).toThrow();
});

it('fails closed when schema, negative or golden evidence is ineffective',()=>{
 const a=canonicalContractAdapters[0],v=canonicalVectors.find(v=>v.id===a.catalogId)!;
 expect(validateContract({...a,output:z.never()},v.witnesses,v.invalid).engineeringPassed).toBe(false);
 expect(validateContract({...a,input:z.any()},v.witnesses,v.invalid).engineeringPassed).toBe(false);
 expect(validateContract(a,v.witnesses,[v.witnesses[0].input]).engineeringPassed).toBe(false);
 expect(validateContract(a,v.witnesses.map(w=>({...w,expected:{value:'incorrect'}})),v.invalid).engineeringPassed).toBe(false);
});
it('rejects malformed replay and accessors without executing them',()=>{
 let invoked=0;const evil={get adapterKey(){invoked++;return canonicalContractAdapters[0].key;}};
 expect(()=>importValidatedContract(evil)).toThrow();expect(invoked).toBe(0);
 for(const raw of [null,[],{}, {adapterKey:canonicalContractAdapters[0].key,artifact:null}])expect(()=>importValidatedContract(raw)).toThrow();
});
it('packet source replacement is rejected and vectors are immutable',()=>{
 const a=canonicalContractAdapters[0],v=canonicalVectors.find(v=>v.id===a.catalogId)!,p=structuredClone(exportValidatedContract(a.key,v.witnesses[0].input));
 p.sourceBinding.technicalSourceTreeSHA256='0'.repeat(64);expect(()=>importValidatedContract(p)).toThrow();
 expect(Object.isFrozen(canonicalVectors)).toBe(true);expect(Object.isFrozen(v.witnesses[0].expected)).toBe(true);
});
