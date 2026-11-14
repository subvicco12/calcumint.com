import {describe,it,expect,vi} from 'vitest';
import original from '../../docs/full-product-batch14/contract-evidence.json';
import {validateHistoricalCanonicalEvidence,validateHistoricalBatch16Report} from './historical-canonical-evidence';
import {collectBatch16RequirementEvidence} from './batch16-requirement-evidence';
import * as preparation from './canonical-evidence-preparation';
describe('immutable historical canonical evidence with exact guard succession',()=>{
 it('reproduces the original without advancing acceptance or source claims',()=>{
  const result=validateHistoricalCanonicalEvidence(original);
  expect(result).toEqual(original);
  expect(result.rows.every(row=>!row.canonicalAccepted&&!row.publicationAuthorized&&row.releaseHold)).toBe(true);
 });
 it('rejects artifact identity, source hash and authority tampering',()=>{
  for(const mutate of [(r:typeof original)=>{r.rows[0].title='alias';},(r:typeof original)=>{r.implementationSourceSnapshot.files[0].sha256='tampered';},(r:typeof original)=>{r.rows[0].canonicalAccepted=true as false;}]){
   const changed=structuredClone(original);mutate(changed);
   expect(()=>validateHistoricalCanonicalEvidence(changed)).toThrow('differs');
  }
 });
 it('rejects unrelated current metadata and source membership drift',()=>{
  const current=preparation.prepareCanonicalContractEvidence();
  const spy=vi.spyOn(preparation,'prepareCanonicalContractEvidence');
  try{
   const metadata=structuredClone(current);metadata.rows[0].title='alias';spy.mockReturnValue(metadata);
   expect(()=>validateHistoricalCanonicalEvidence(original)).toThrow('metadata');
   const source=structuredClone(current);source.implementationSourceSnapshot.files[0].sha256='tampered';spy.mockReturnValue(source);
   expect(()=>validateHistoricalCanonicalEvidence(original)).toThrow('source differs');
   const membership=structuredClone(current);membership.implementationSourceSnapshot.files.pop();spy.mockReturnValue(membership);
   expect(()=>validateHistoricalCanonicalEvidence(original)).toThrow('membership');
  }finally{spy.mockRestore();}
 });
});

describe('historical Batch16 retains fresh witness comparison',()=>{
 it('admits exact caller transitions but rejects changed witnesses and unrelated source claims',()=>{
  const fresh=collectBatch16RequirementEvidence();
  const historical=validateHistoricalBatch16Report(fresh);
  expect(historical.summary).toEqual(fresh.summary);
  const changed=structuredClone(fresh);changed.rows[0].canonicalAccepted=true as false;
  expect(()=>validateHistoricalBatch16Report(changed)).toThrow('witnesses');
  const source=structuredClone(fresh);source.sourceHashes['src/calculators/canonical-contract-vectors.ts']='tampered';
  expect(()=>validateHistoricalBatch16Report(source)).toThrow('sources');
  const caller=structuredClone(fresh);caller.sourceHashes['src/lib/batch16-requirement-evidence.ts']='tampered';
  expect(()=>validateHistoricalBatch16Report(caller)).toThrow('transition');
 });
});


describe('exact supplemental technology presentation preserves historical membership',()=>{
 it('rejects missing, duplicate, unknown and stale supplemental membership without rewriting historical412',()=>{
  const current=preparation.prepareCanonicalContractEvidence();
  const name='src/calculators/final-framework/technology-scalar-presentation.ts';
  expect(current.implementationSourceSnapshot.files).toHaveLength(413);
  expect(original.implementationSourceSnapshot.files).toHaveLength(412);
  expect(validateHistoricalCanonicalEvidence(original)).toEqual(original);
  const spy=vi.spyOn(preparation,'prepareCanonicalContractEvidence');
  try{
   for(const mutate of [
    (rows:typeof current.implementationSourceSnapshot.files)=>rows.filter(row=>row.path!==name),
    (rows:typeof current.implementationSourceSnapshot.files)=>[...rows,rows.find(row=>row.path===name)!],
    (rows:typeof current.implementationSourceSnapshot.files)=>[...rows,{path:'src/calculators/unreviewed.ts',sha256:'0'.repeat(64)}],
    (rows:typeof current.implementationSourceSnapshot.files)=>rows.map(row=>row.path===name?{...row,sha256:'0'.repeat(64)}:row),
   ]){
    const altered=structuredClone(current);altered.implementationSourceSnapshot.files=mutate(altered.implementationSourceSnapshot.files);spy.mockReturnValue(altered);
    expect(()=>validateHistoricalCanonicalEvidence(original)).toThrow(/membership|supplemental/);
   }
  }finally{spy.mockRestore();}
 });
});
