import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {completionSourceRefs,verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
const source='tests/acceptance-closure-20261108/receipt-source-path.mjs',integrated='4467b5960ce73cd7851332f7248e4d2673dad70b',local='5dc04a0b91d807f72843d3d5c8cc868c26a35e07';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}),hash=x=>createHash('sha256').update(x).digest('hex');
test('active source bootstrap requires integrated helper capture and excludes unpublished local ref',()=>{assert(completionSourceRefs.includes(integrated));assert(!completionSourceRefs.includes(local));});
test('integrated helper retains exact historical local capture bytes without requiring its unpublished Git object',()=>{
 const overlay=JSON.parse(readFileSync('docs/first-five-20261109/source-successors/portability/overlay.json','utf8'));
 const blob=git(['rev-parse',integrated+':'+source]).toString().trim(),bytes=git(['cat-file','blob',blob]);
 assert.equal(overlay.localCapture.ref,local);assert.equal(overlay.localCapture.blob,blob);assert.equal(overlay.localCapture.sha256,hash(bytes));assert.deepEqual(overlay.integratedCapture,{ref:integrated,blob,sha256:hash(bytes)});assert.deepEqual(bytes,readFileSync(source));
});
test('current helper proof retains predecessor claim and refuses source reversion or integrated provenance substitution',()=>{
 const old=git(['show','7086b85437b025225f5736fb6b849415e518dc08:'+source]),bytes=readFileSync(source),claim=hash(old);
 assert.equal(verifyCompletionBinding(source,bytes,claim,git),true);
 assert.throws(()=>verifyCompletionBinding(source,old,claim,git),/current successor/);
 assert.throws(()=>verifyCompletionBinding(source,bytes,claim,args=>args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]===integrated+'^{commit}'?Buffer.from('0'.repeat(40)):git(args)),/source revision unavailable/);
});
