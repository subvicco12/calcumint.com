import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {completionPolicy,completionCapturePath} from './policy.mjs';
import {verifyCompletionAndHistoricalFactory} from './stage.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const captureBytes=readFileSync(completionCapturePath),capture=JSON.parse(captureBytes);
const input={policy:completionPolicy,captureBytes,git:sourceGit,read:readFileSync,root};
test('completion predecessor is exact baseline and every Stage6 byte remains independently historical',()=>{
 assert.equal(completionPolicy.predecessorRef,'16cb2804fa3e9731a7f39a761de9a7a27ee87e67');
 const {live,historical}=verifyCompletionAndHistoricalFactory(input);
 assert.equal(live.size,completionPolicy.paths.length);assert.equal(historical.size,23);
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
});
