import {restoreWorkflowGraphVerifier} from '../construction-ci-recovery-20261116/workflow-scheduling.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {verifyCompletionBinding} from '../../scripts/product-completion-stage8.mjs';
const path='tests/shortest-publication-20/caller-lineage.test.mjs';
const claim='2c6296e886bc8a58f60b6c8c4ecd7e942301a6dc5479f43aa3cd3b21df1afb03';
test('the exact shortest guard import successor retains its original predecessor claim',()=>{
 assert.equal(verifyCompletionBinding(path,readFileSync(path),claim,sourceGit),true);
});
test('valid target readers cannot hide substituted argument bytes or predecessor reversion',()=>{
 for(const bytes of [Buffer.from('arbitrary argument'),sourceGit(['show','eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8:'+path])])assert.throws(()=>verifyCompletionBinding(path,bytes,claim,sourceGit),/Completion current successor differs/);
 assert.throws(()=>verifyCompletionBinding(path,readFileSync(path),'0'.repeat(64),sourceGit),/Completion predecessor claim differs/);
});
test('the exact verifier successor preserves literal historical bytes and unknown paths cannot invoke Git',()=>{
 const old='eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8',name='scripts/product-completion-lineage.mjs';assert(Buffer.from(restoreWorkflowGraphVerifier(readFileSync(name,'utf8'))).equals(sourceGit(['show',old+':'+name])));
 assert.equal(verifyCompletionBinding('src/unknown-not-owned.ts',Buffer.from(''),claim,()=>{throw Error('Unknown path called Git');}),false);
});
