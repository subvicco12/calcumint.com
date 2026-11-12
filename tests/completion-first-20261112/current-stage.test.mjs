import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {completionPolicy,completionCapturePath} from './policy.mjs';
import {completionRecords,verifyCompletionAndHistoricalFactory} from './stage.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const captureBytes=readFileSync(completionCapturePath),capture=JSON.parse(captureBytes);
const input={policy:completionPolicy,captureBytes,git:sourceGit,read:readFileSync,root};
test('completion predecessor is exact baseline and every Stage6 byte remains independently historical',()=>{
 assert.equal(completionPolicy.predecessorRef,'16cb2804fa3e9731a7f39a761de9a7a27ee87e67');
 const {live,historical}=verifyCompletionAndHistoricalFactory(input);
 assert.equal(live.size,completionPolicy.paths.length);assert.equal(historical.size,23);
 const first=completionRecords(readFileSync),path=completionPolicy.paths[0],row=first.get(path);
 assert(Object.isFrozen(row)&&Object.isFrozen(row.current));if(row.predecessor)assert(Object.isFrozen(row.predecessor));
 assert.throws(()=>{row.current.sha256='0'.repeat(64);},TypeError);
 assert.throws(()=>{row.path='src/substitution.ts';},TypeError);
 first.clear();const next=completionRecords(readFileSync);assert(next.has(path));assert.equal(next.get(path).current.sha256,capture.rows[0].current.sha256);
 let reads=0;const reader=p=>{assert.equal(p,completionCapturePath);reads++;return captureBytes;};completionRecords(reader);completionRecords(reader);assert.equal(reads,2);
 assert.throws(()=>completionRecords(()=>Buffer.from('{}')),/Independent completion capture digest differs/);
 const mutable=Buffer.from(captureBytes);completionRecords(()=>mutable);mutable[0]^=1;assert.throws(()=>completionRecords(()=>mutable),/Independent completion capture digest differs/);

});
test('each finite successor rejects predecessor reversion or substituted current bytes',()=>{
 for(const row of capture.rows){
  const replacements=[Buffer.from('substituted current source')];
  if(row.predecessor)replacements.push(sourceGit(['cat-file','blob',row.predecessor.blob]));
  for(const bytes of replacements){assert.throws(()=>verifyExactStage({...input,read:p=>p===row.path?bytes:readFileSync(p)}),/Current factory bytes differ/);}
 }
});
test('completion capture substitution and immutable commit substitution cannot attest current source',()=>{
 assert.throws(()=>verifyExactStage({...input,captureBytes:Buffer.from('{}')}),/digest differs/);
 assert.throws(()=>verifyExactStage({...input,git:a=>a[0]==='cat-file'&&a[1]==='commit'?Buffer.from('substituted commit'):sourceGit(a)}),/Commit content address differs/);
});
test('new-stage historic projection cannot hide actual live SRC drift',()=>{
 const git=a=>a[0]==='diff'&&a[3]===completionPolicy.codeRef?Buffer.from('src/unreviewed.ts\0'):sourceGit(a);
 assert.throws(()=>verifyCompletionAndHistoricalFactory({...input,git}),/Unreviewed current source delta/);
 for(const row of capture.auxiliaryRows)for(const bytes of [Buffer.from('tampered auxiliary source'),sourceGit(['cat-file','blob',row.predecessor.blob])])assert.throws(()=>verifyCompletionAndHistoricalFactory({...input,read:p=>p===row.path?bytes:readFileSync(p)}),/Current target source differs/);
});
