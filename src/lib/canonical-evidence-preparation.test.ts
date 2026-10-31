import {describe,it,expect} from 'vitest';
import {prepareCanonicalContractEvidence,validatePreparedCanonicalEvidence,validateTechnicalIdentity} from './canonical-evidence-preparation';
const master={masterId:1,title:'Exact title'};
const candidate={id:'engine.one',slug:'engine-one',version:1,basis:'FAMILY_VARIANT'};
const runtime=[{id:'engine.one',slug:'engine-one',version:1}];
describe('technical identity rejection independent of approval',()=>{
 it('accepts exact technical identity without promoting family approval',()=>expect(()=>validateTechnicalIdentity(master,master,candidate,runtime)).not.toThrow());
 for(const patch of [{id:'alias.one'},{slug:'alias-one'},{version:2},{version:0}])it(`rejects altered identity ${JSON.stringify(patch)}`,()=>expect(()=>validateTechnicalIdentity(master,master,{...candidate,...patch},runtime)).toThrow());
 for(const record of [{...master,masterId:2},{...master,title:'exact title'}])it(`rejects master alias ${JSON.stringify(record)}`,()=>expect(()=>validateTechnicalIdentity(master,record,candidate,runtime)).toThrow());
 it('rejects duplicate IDs and slugs',()=>{for(const extra of [{id:'engine.one',slug:'second',version:1},{id:'second',slug:'engine-one',version:1}])expect(()=>validateTechnicalIdentity(master,master,candidate,[...runtime,extra])).toThrow('Duplicate');});
});
describe('all 540 source-preserving evidence',()=>{
 it('pins exact identities and preserves private, component, source/applicability restrictions',()=>{
  const report=prepareCanonicalContractEvidence();
  expect(report.rows).toHaveLength(540);expect(new Set(report.rows.map(r=>r.masterId)).size).toBe(540);
  expect(report.rows.every(r=>r.canonicalAccepted===false&&r.canonicalMappingApproved===false&&r.releaseHold)).toBe(true);
  const amortization=report.rows.find(r=>r.masterId===3)!;
  expect(amortization.privateAdapterBinding?.adapterKey).toBe('private.component.3');
  expect(amortization.registeredCandidates.some(c=>c.associationStatus==='PROPOSED_FAMILY_ASSOCIATION')).toBe(true);
  expect(amortization.sourceAndReviewRestrictions.methodology.normativeVersionApplicability).toBe('UNAPPROVED_OR_UNKNOWN');
  expect(report.limitations.join(' ')).toContain('refinements');
  expect(validatePreparedCanonicalEvidence(report).contentSHA256).toBe(report.contentSHA256);
 });
 it('rejects changed identity, stale digest, acceptance and applicability tampering',()=>{
  const report=prepareCanonicalContractEvidence();
  const mutations=[(r:typeof report)=>{r.rows[0].title='Alias';},(r:typeof report)=>{r.contentSHA256='stale';},(r:typeof report)=>{Object.assign(r.rows[0],{canonicalAccepted:true});},(r:typeof report)=>{r.rows[0].sourceAndReviewRestrictions.methodology.normativeVersionApplicability='APPROVED';},(r:typeof report)=>{r.rows[0].registeredCandidates[0].version++;}];
  for(const mutate of mutations){const changed=structuredClone(report);mutate(changed);expect(()=>validatePreparedCanonicalEvidence(changed)).toThrow('differs');}
 });
});

describe('untrusted evidence must be pure JSON before comparison',()=>{
 it('rejects accessors without invoking them',()=>{
  const report=prepareCanonicalContractEvidence();let getterCalls=0;
  Object.defineProperty(report,'contentSHA256',{enumerable:true,get(){getterCalls++;return 'tamper';}});
  expect(()=>validatePreparedCanonicalEvidence(report)).toThrow();
  expect(getterCalls).toBe(0);
 });
 it('rejects toJSON without invoking it',()=>{
  const report=prepareCanonicalContractEvidence();let calls=0;
  Object.assign(report,{toJSON(){calls++;return report;}});
  expect(()=>validatePreparedCanonicalEvidence(report)).toThrow();expect(calls).toBe(0);
 });
 for(const value of [undefined,()=>true])it(`rejects an added ${typeof value} authority field`,()=>{
  const report=prepareCanonicalContractEvidence();Object.assign(report.rows[0],{extraAuthority:value});
  expect(()=>validatePreparedCanonicalEvidence(report)).toThrow();
 });
});
