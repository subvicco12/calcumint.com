import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {verifyFinancialSafetyBinding} from '../../scripts/financial-safety-lineage.mjs';
import {callerPaths,verifyCallerSuccessor} from './caller-successor.mjs';
const load=n=>JSON.parse(readFileSync(new URL('../../docs/p0-decision-contracts/'+n+'.json',import.meta.url)));
const files={...load('calculus').currentSourceClosure.files,...load('writers-acl').sourceBindings};
const root=new URL('../../',import.meta.url);
const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function verifyDecisionBinding(path,bytes,sha,readGit=git){
 assert(!path.startsWith('/')&&!path.split('/').includes('..'));
 // A known successor must never fall through to historical-byte equality:
 // reversion to the valid old hash is not the approved current implementation.
 if(verifyFinancialSafetyBinding(path,bytes,sha,readGit))return;
 if(callerPaths.includes(path)){verifyCallerSuccessor(path,bytes,sha);return;}
 assert.equal(hash(bytes),sha,path);
}
test('historical mathematical closure remains exact with explicit Git-bound caller and financial successors',()=>{
 for(const [path,sha]of Object.entries(files))verifyDecisionBinding(path,readFileSync(new URL('../../'+path,import.meta.url)),sha);
});
for(const path of ['src/calculators/finance/compound-interest.ts','src/calculators/finance/loan-payment.ts','src/calculators/precision.ts']){
 test(path+': decision binding rejects valid predecessor reversion before hash fallback',()=>{
  const predecessor=git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+path]);
  assert.equal(hash(predecessor),files[path]);
  assert.throws(()=>verifyDecisionBinding(path,predecessor,files[path]),/current successor differs/);
 });
 test(path+': decision binding rejects tamper and rewritten historical claim',()=>{
  const current=readFileSync(new URL('../../'+path,import.meta.url));const tampered=Buffer.concat([current,Buffer.from('\n//tampered')]);
  assert.throws(()=>verifyDecisionBinding(path,tampered,files[path]),/current successor differs/);
  assert.throws(()=>verifyDecisionBinding(path,tampered,hash(tampered)),/historical claim differs/);
 });
 test(path+': decision binding requires exact immutable source context',()=>{
  const current=readFileSync(new URL('../../'+path,import.meta.url));
  assert.throws(()=>verifyDecisionBinding(path,current,files[path],()=>{throw Error('missing exact source');}),/missing exact source/);
  assert.throws(()=>verifyDecisionBinding(path,current,files[path],()=>Buffer.from('0'.repeat(40))),/unavailable/);
 });
}
test('unknown mathematical closure entries retain strict hash equality',()=>{
 assert.throws(()=>verifyDecisionBinding('src/unknown.ts',Buffer.from('changed'),'0'.repeat(64)),/src\/unknown.ts/);
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
