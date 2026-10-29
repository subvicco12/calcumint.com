import {readFileSync} from 'node:fs';
import {it,expect} from 'vitest';
import {buildImplementationReconciliation,classifyImplementation} from './implementation-reconciliation';
it('classifies scoped implementation separately from canonical authority and rejects stale absence',()=>{
 expect(classifyImplementation({privateCount:1,exactRegisteredCount:1,componentCount:1,blocked:true,currentAbsenceProven:false})).toBe('PRIVATE_COMPLETE');
 expect(classifyImplementation({privateCount:0,exactRegisteredCount:1,componentCount:1,blocked:false,currentAbsenceProven:false})).toBe('REGISTERED_IMPLEMENTED');
 expect(classifyImplementation({privateCount:0,exactRegisteredCount:0,componentCount:1,blocked:false,currentAbsenceProven:false})).toBe('COMPONENT_ONLY');
 expect(classifyImplementation({privateCount:0,exactRegisteredCount:0,componentCount:0,blocked:true,currentAbsenceProven:false})).toBe('CONTRACT_BLOCKED');
 expect(classifyImplementation({privateCount:0,exactRegisteredCount:0,componentCount:1,blocked:true,currentAbsenceProven:false})).toBe('CONTRACT_BLOCKED');
 expect(classifyImplementation({privateCount:0,exactRegisteredCount:0,componentCount:0,blocked:false,currentAbsenceProven:false})).toBe('UNKNOWN');
 expect(classifyImplementation({privateCount:0,exactRegisteredCount:0,componentCount:0,blocked:false,currentAbsenceProven:true})).toBe('MISSING_ENGINE');
});
it('reconciles exact540 identities with current registry/private definitions and truthful lifecycle separation',()=>{
 const m=buildImplementationReconciliation();
 expect(m.rows).toHaveLength(540);expect(new Set(m.rows.map(r=>r.masterId)).size).toBe(540);
 expect(m.summary.classes).toEqual({REGISTERED_IMPLEMENTED:305,PRIVATE_COMPLETE:116,COMPONENT_ONLY:76,CONTRACT_BLOCKED:43,MISSING_ENGINE:0,UNKNOWN:0});
 expect(m.engines).toHaveLength(574);
 for(const r of m.rows){
  expect(r.canonicalMappingApproved).toBe(false);expect(r.lifecycle.currentPublicPublication).toBe('UNKNOWN');expect(r.lifecycle.protectedCertification).toBe('UNKNOWN');expect(r.lifecycle.publicationAuthorized).toBe(false);
  expect(r.nextAction.length).toBeGreaterThan(0);expect(r.canonicalRequirements.missing.length).toBeGreaterThan(0);
  if(r.implementationClass==='PRIVATE_COMPLETE')expect(r.privateImplementations.length).toBeGreaterThan(0);
  if(r.implementationClass==='REGISTERED_IMPLEMENTED')expect(r.registeredEvidence.some(e=>e.exactCurrentBinding)).toBe(true);
 }
 for(const id of [491,495,535,536,539])expect(m.rows.find(r=>r.masterId===id)?.implementationClass).toBe('PRIVATE_COMPLETE');
 for(const id of [9,442,198,199])expect(m.rows.find(r=>r.masterId===id)?.implementationClass).toBe('CONTRACT_BLOCKED');
 const originals=m.rows.flatMap(r=>r.privateImplementations).filter(p=>p.family==='original-14-drafts');
 expect(originals).toHaveLength(14);
 for(const p of originals){expect(p.id).toBeNull();expect(p.declaredExampleOutputKeys.length).toBeGreaterThan(0);expect(p).toMatchObject({implementationProbe:{kind:'ACTUAL_DISPATCH_NOT_INDEPENDENT_ACCEPTANCE',calculatorSlug:p.slug,calculatorVersion:p.version}});}
});
it('fails closed for canonical identity drift instead of silently joining by title',()=>{
 const csv=readFileSync('data/catalog/master-catalog-2026.csv','utf8').replace('Loan Payment Calculator','Wrong identity');
 expect(()=>buildImplementationReconciliation(csv)).toThrow();
});
it('retains known historical example diagnostic discrepancies without relabeling them as current acceptance',()=>{
 const m=buildImplementationReconciliation();
 expect(m.engines.filter(e=>e.historicalExampleDiagnostics.issues.length).map(e=>e.slug).sort()).toEqual(['derivative-calculator','integral-calculator','limit-calculator']);
 for(const e of m.engines.filter(e=>e.historicalExampleDiagnostics.issues.length))expect(e.historicalExampleDiagnostics.status).toBe('HISTORICAL_NOT_REATTESTED');
 expect(m.rows.some(r=>r.acceptanceEvidence.historicalDiagnosticIssues.length>0)).toBe(true);
});
