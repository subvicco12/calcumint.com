import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
// @ts-expect-error Node strip-types requires an explicit TypeScript extension.
import {validatePublicationFactoryPreparation,type FactoryPacket} from '../../src/lib/publication-factory-gates.ts';
const sha=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const registerPath='docs/calculator-first/publication-readiness-540.json';
const ledgerPath='docs/full-product-batch16/requirements-540.json';
const evidencePath='docs/full-product-six-closure/qa-evidence-six.json';
function fixture(){
 const rawFiles=Object.fromEntries([registerPath,ledgerPath,evidencePath].map(p=>[p,readFileSync(p)]));
 const trustedPins=Object.fromEntries(Object.entries(rawFiles).map(([p,b])=>[p,sha(b)]));
 const ref=(path:string,pointer:string)=>({path,pointer,sha256:trustedPins[path]});
 const ledger=JSON.parse(rawFiles[ledgerPath].toString());
 const rows=JSON.parse(rawFiles[evidencePath].toString()).rows;
 const packets:FactoryPacket[]=rows.map((r:Record<string,unknown>,index:number)=>({masterId:r.masterId as number,engineId:r.engineId as string,slug:r.slug as string,version:r.version as number,requirements:ledger.rows.find((l:{masterId:number})=>l.masterId===r.masterId).requirements.map((q:{requirementId:string})=>q.requirementId),evidence:[{...ref(evidencePath,`/rows/${index}`),role:'engineering' as const,scope:'identity' as const}]}));
 return {register:ref(registerPath,''),ledger:ref(ledgerPath,''),packets,trustedPins,rawFiles};
}
test('joins real 540 register and 14293 requirements and six exact closure identities without granting authority',()=>{
 const result=validatePublicationFactoryPreparation(fixture());
 assert.equal(result.integrityVerified,true);assert.equal(result.registerCount,540);assert.equal(result.requirementCount,14293);assert.equal(result.decisions.length,6);
 assert(result.decisions.every(d=>!d.publicationEligible&&d.preparationBlockers.includes('MISSING_CANONICAL_PREPARATION')));
});
test('rejects nonexistent and substituted identity pointers within trusted bytes',()=>{
 const f=fixture();f.packets[0].evidence[0].pointer='/rows/999';assert(validatePublicationFactoryPreparation(f).errors.includes('EVIDENCE_POINTER_UNRESOLVED'));
 f.packets[0].evidence[0].pointer='/rows/1';assert(validatePublicationFactoryPreparation(f).errors.includes('EVIDENCE_IDENTITY_VERSION_MISMATCH'));
});
test('rejects version drift and family evidence used for canonical preparation',()=>{
 const f=fixture();f.packets[0].version++;assert(validatePublicationFactoryPreparation(f).errors.includes('EVIDENCE_IDENTITY_VERSION_MISMATCH'));
 const g=fixture();Object.assign(g.packets[0].evidence[0],{role:'canonical',scope:'family'});assert(validatePublicationFactoryPreparation(g).errors.includes('NON_IDENTITY_AUTHORITY_EVIDENCE'));
});
test('rejects missing requirement, duplicate identity and raw-byte drift',()=>{
 const f=fixture();f.packets[0].requirements=f.packets[0].requirements.slice(1);assert(validatePublicationFactoryPreparation(f).errors.includes('REQUIREMENT_SET_MISMATCH'));
 const g=fixture();g.packets.push(g.packets[0]);assert(validatePublicationFactoryPreparation(g).errors.includes('DUPLICATE_PACKET_IDENTITY'));
 const h=fixture();h.rawFiles[evidencePath]=Buffer.from('{}');assert(validatePublicationFactoryPreparation(h).errors.includes('RAW_SOURCE_SHA_MISMATCH'));
});
test('untrusted asserted approval fields cannot remove authority blockers',()=>{
 const f=fixture();Object.assign(f.packets[0],{approved:true,publicationEligible:true,canonicalAccepted:true});
 const result=validatePublicationFactoryPreparation(f);assert.equal(result.decisions[0].publicationEligible,false);assert(result.decisions[0].authorityBlockers.includes('AUTHENTICATED_AUTHORITY_UNESTABLISHED'));
});

test('role labels cannot turn identity-only payloads into complete preparation',()=>{
 const f=fixture();const roles=['identity','engineering','canonical','source','reviewer','qa','lifecycle'] as const;
 // The real closure contains QA and explicit gaps, so it can support those preparation roles, never approvals.
 f.packets[0].evidence=roles.map(role=>({...f.packets[0].evidence[0],role}));
 const result=validatePublicationFactoryPreparation(f);assert.equal(result.decisions[0].publicationEligible,false);
 const g=fixture();const original=JSON.parse(g.rawFiles[evidencePath].toString());delete original.rows[0].qaRequests;
 g.rawFiles[evidencePath]=Buffer.from(JSON.stringify(original));g.trustedPins[evidencePath]=sha(g.rawFiles[evidencePath]);for(const p of g.packets)for(const e of p.evidence)e.sha256=g.trustedPins[evidencePath];
 g.packets[0].evidence=roles.map(role=>({...g.packets[0].evidence[0],role,sha256:g.trustedPins[evidencePath]}));
 const broken=validatePublicationFactoryPreparation(g);assert.equal(broken.integrityVerified,true);assert(broken.decisions[0].preparationBlockers.includes('MISSING_QA_PREPARATION'));
});
test('self-consistent forged packet and pinned evidence must still match register candidate',()=>{
 const f=fixture();const source=JSON.parse(f.rawFiles[evidencePath].toString());
 f.packets[0].engineId='forged.engine';f.packets[0].slug='forged-slug';f.packets[0].version=999;
 Object.assign(source.rows[0],{engineId:'forged.engine',slug:'forged-slug',version:999});
 f.rawFiles[evidencePath]=Buffer.from(JSON.stringify(source));f.trustedPins[evidencePath]=sha(f.rawFiles[evidencePath]);
 for(const p of f.packets)for(const e of p.evidence)e.sha256=f.trustedPins[evidencePath];
 assert(validatePublicationFactoryPreparation(f).errors.includes('REGISTER_CANDIDATE_IDENTITY_VERSION_MISMATCH'));
});

test('private candidate requires exact ledger adapter and support candidate cannot substitute',()=>{
 const f=fixture();const ledger=JSON.parse(f.rawFiles[ledgerPath].toString());
 const requirements=ledger.rows[2].requirements.map((r:{requirementId:string})=>r.requirementId);
 f.packets=[{masterId:3,engineId:'private.component.3',slug:'private-component-3',version:1,requirements,evidence:[]}];
 assert.equal(validatePublicationFactoryPreparation(f).integrityVerified,true);
 const register=JSON.parse(f.rawFiles[registerPath].toString());
 const support=register.rows[2].candidates[0];Object.assign(f.packets[0],{engineId:support.engineId,slug:support.slug,version:support.version});
 assert(validatePublicationFactoryPreparation(f).errors.includes('REGISTER_CANDIDATE_IDENTITY_VERSION_MISMATCH'));
});
test('risk and rule-pack applicability require complete pending QA preparation',()=>{
 const make=(riskClass:string,ruleRequired:boolean|undefined,omit?:string)=>{
  const f=fixture();const source=JSON.parse(f.rawFiles[evidencePath].toString());const row=source.rows[0];row.riskClass=riskClass;
  row.conditionalRulePack={required:ruleRequired,applicability:ruleRequired===undefined?'UNDETERMINED':'EXPLICIT_EXACT_VERSION_PREPARATION'};
  if(riskClass!=='standard')row.qaRequests.push({checkType:'ymyl-review',status:'pending',reviewer:null,decisionEvidence:null});
  if(ruleRequired)row.qaRequests.push({checkType:'rule-pack-validation',status:'pending',reviewer:null,decisionEvidence:null});
  if(omit)row.qaRequests=row.qaRequests.filter((q:{checkType:string})=>q.checkType!==omit);
  f.rawFiles[evidencePath]=Buffer.from(JSON.stringify(source));f.trustedPins[evidencePath]=sha(f.rawFiles[evidencePath]);
  for(const p of f.packets)for(const e of p.evidence)e.sha256=f.trustedPins[evidencePath];
  f.packets[0].evidence=[{...f.packets[0].evidence[0],role:'qa'}];return validatePublicationFactoryPreparation(f).decisions[0];
 };
 assert(!make('financial',false).preparationBlockers.includes('MISSING_QA_PREPARATION'));
 assert(!make('financial',true).preparationBlockers.includes('MISSING_QA_PREPARATION'));
 assert(make('financial',false,'ymyl-review').preparationBlockers.includes('MISSING_QA_PREPARATION'));
 assert(make('financial',true,'rule-pack-validation').preparationBlockers.includes('MISSING_QA_PREPARATION'));
 assert(make('unknown',false).preparationBlockers.includes('MISSING_QA_PREPARATION'));
 assert(make('standard',undefined).preparationBlockers.includes('MISSING_QA_PREPARATION'));
});
test('source preparation requires real publisher and revision metadata',()=>{
 const check=(publisher:unknown,publicationDate:unknown,revision?:string)=>{
  const f=fixture();const source=JSON.parse(f.rawFiles[evidencePath].toString());const row=source.rows[0];
  row.sourceReferences=[{masterIds:[row.masterId],title:'Reference',publisher,publicationDate,revision,sourceRevisionApproved:false,applicabilityApproved:false}];
  f.rawFiles[evidencePath]=Buffer.from(JSON.stringify(source));f.trustedPins[evidencePath]=sha(f.rawFiles[evidencePath]);
  for(const p of f.packets)for(const e of p.evidence)e.sha256=f.trustedPins[evidencePath];
  f.packets[0].evidence=[{...f.packets[0].evidence[0],role:'source'}];return validatePublicationFactoryPreparation(f).decisions[0];
 };
 assert(check([null],['2026']).preparationBlockers.includes('MISSING_SOURCE_PREPARATION'));
 assert(check(['Publisher'],[]).preparationBlockers.includes('MISSING_SOURCE_PREPARATION'));
 assert(check([' '],['2026']).preparationBlockers.includes('MISSING_SOURCE_PREPARATION'));
 assert(!check(['Publisher'],[],'edition 2').preparationBlockers.includes('MISSING_SOURCE_PREPARATION'));
 assert(!check(['Publisher'],['2026']).preparationBlockers.includes('MISSING_SOURCE_PREPARATION'));
});
