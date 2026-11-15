import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {retainedCompletionExecutable} from './source-completion-prewarm-admission.mjs';import {verifyReceiptLineageExtension,receiptLineagePolicy} from '../milestone60-20261113/source-receipt-lineage.mjs';
const path='scripts/product-completion-lineage.mjs',git=args=>execFileSync('git',args,{maxBuffer:32*1024*1024}),old=git(['show','9b70d14069cba27e5a4463865686c182ae6ad9cd:'+path]).toString(),current=readFileSync(path,'utf8'),previous=git(['show',receiptLineagePolicy.retainedGraphRef+':'+path]).toString();
test('only the exact availability wrapper projects to the literal retained verifier and graph',()=>{
 assert.equal(retainedCompletionExecutable(old),old);assert.equal(retainedCompletionExecutable(current),old);
 assert.equal(verifyReceiptLineageExtension({previous,current:old,git}),true);assert.equal(verifyReceiptLineageExtension({previous,current,git}),true);
});
test('changed wrapper binding table or verifier tail never bypasses the unchanged historical predicate',()=>{
 for(const altered of [current.replace("typeof git.preloadCommits==='function'","typeof git.preloadCommits==='string'"),current.replace(receiptLineagePolicy.current.blob,'0'.repeat(40)),current+'\n// unreviewed executable tail',current.replace("return retainedVerifyCompletionBinding(name,bytes,claim,git,read);","return true;")])assert.throws(()=>verifyReceiptLineageExtension({previous,current:altered,git}));
});
