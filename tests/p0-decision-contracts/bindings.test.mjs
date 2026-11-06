import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {callerPaths,verifyCallerSuccessor} from './caller-successor.mjs';
const load=n=>JSON.parse(readFileSync(new URL('../../docs/p0-decision-contracts/'+n+'.json',import.meta.url)));
test('historical mathematical closure remains exact with explicit Git-bound draft caller successors',()=>{
 const files={...load('calculus').currentSourceClosure.files,...load('writers-acl').sourceBindings};
 for(const [path,sha]of Object.entries(files)){assert(!path.startsWith('/')&&!path.split('/').includes('..'));const bytes=readFileSync(new URL('../../'+path,import.meta.url));if(callerPaths.includes(path)){verifyCallerSuccessor(path,bytes,sha);}else{assert.equal(createHash('sha256').update(bytes).digest('hex'),sha,path);}}
});
test('three profile keys bind one exact v3 engine with distinct operation and preserved v1 identity',()=>{
 const c=load('calculus');assert.deepEqual(c.contracts.map(x=>x.catalogId),[246,247,248]);
 const operations=['derivative','integral','limit'];
 for(const [i,x]of c.contracts.entries()){
  assert.equal(x.decisionId,'OC-01-CALCULUS');assert.equal(x.status,'PENDING');assert.equal(x.reviewTarget.profileId,'private.canonical-calculus.'+x.catalogId);assert.equal(x.reviewTarget.engineId,'private.canonical-calculus');assert.notEqual(x.reviewTarget.engineId,x.reviewTarget.profileId);assert.equal(x.reviewTarget.technicalRevision,3);assert.equal(x.reviewTarget.presentationRevision,1);assert.equal(x.reviewTarget.operation,operations[i]);assert.equal(x.legacy.engineId,'advanced-math.'+operations[i]);assert.equal(x.legacy.technicalRevision,1);assert(x.independentProofTasks.length>0);assert(x.independentProofTasks.every(t=>t.status==='PENDING'));
 }
 for(const [k,v]of Object.entries(c.governance))assert.equal(v,k==='releaseHold');
});
test('exact four decisions remain unanswered and cannot inherit package recommendations as approval',()=>{
 const r=load('owner-register');assert.deepEqual(r.decisions.map(d=>d.decisionId),['OC-01-CALCULUS','OPS-01-MEMBERSHIP','OPS-02-WRITERS-ACL','OPS-03-ADOPTION']);
 assert.equal(r.approvalGranted,false);assert.equal(r.activationAuthorized,false);assert.equal(r.canonicalAccepted,false);assert.equal(r.releaseHold,true);
 for(const d of r.decisions){assert.equal(d.status,'PENDING');assert.equal(d.ownerAnswer,null);assert.equal(d.approvedBy,null);assert.equal(d.approvedAt,null);}
});
test('byte-integrity evidence does not claim publisher authentication or owner authority',()=>{
 const p=load('input-integrity');assert.equal(p.crc,'PASS');assert.equal(p.outputManifest.entriesVerified,201);assert.equal(p.inputManifest.entriesVerified,125);assert.equal(p.nestedTriage.manifestEntriesVerified,125);assert.equal(p.repositorySnapshotComparisons.length,52);assert(p.repositorySnapshotComparisons.every(r=>r.equal));assert.equal(p.blueprintMatchesRepository,true);assert.equal(p.allFourAnswersPending,true);assert.equal(p.companionReport.equalsBaselineP0Report,true);
});
