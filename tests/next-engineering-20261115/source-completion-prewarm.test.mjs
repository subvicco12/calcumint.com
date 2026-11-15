import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';import {completionGitReader} from '../parallel-source-20261110/git-reader.mjs';
const real=(args,options={})=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:128*1024*1024,...options});
const original=real(['show','9b70d14069cba27e5a4463865686c182ae6ad9cd:scripts/product-completion-lineage.mjs']).toString(),bindings=JSON.parse(/const bindings=(\[[\s\S]*?\]);\nexport const completionSourceRefs/.exec(original)[1]),b=bindings.find(row=>row.path==='src/components/final-private-workbench.tsx');
test('supplied existing native immutable capabilities warm availability while every original byte check still runs',()=>{
 const git=completionGitReader(real),calls=[];for(const name of ['preloadCommits','preloadPaths','preloadBlobs']){const own=git[name];git[name]=values=>{calls.push(name);return own(values);};}
 const target=new Map(b.supplementalSources.map(row=>[row.path,real(['cat-file','blob',row.blob])])),read=path=>{assert(target.has(path),'Undeclared retained dependency');return target.get(path);},bytes=real(['cat-file','blob',b.successorBlob]);
 assert.equal(verifyCompletionBinding(b.path,bytes,b.predecessorSHA256,git,read),true);assert.deepEqual(calls.slice(0,3),['preloadCommits','preloadPaths','preloadBlobs']);
 assert.throws(()=>verifyCompletionBinding(b.path,Buffer.concat([bytes,Buffer.from('changed')]),b.predecessorSHA256,git,read),/Completion current successor differs/);
 const path=b.supplementalSources[0].path;assert.throws(()=>verifyCompletionBinding(b.path,bytes,b.predecessorSHA256,git,name=>name===path?Buffer.from('changed dependency'):read(name)),/Completion supplemental source bytes differ/);
});
test('opaque transports gain no batching and the entire retained verifier body is byte-literal',()=>{
 let reads=0;assert.throws(()=>verifyCompletionBinding(b.path,Buffer.alloc(0),b.predecessorSHA256,()=>{throw Error('Original opaque Git reached');},()=>{reads++;throw Error('Unexpected read');}),/Original opaque Git reached/);assert.equal(reads,0);
 const current=readFileSync('scripts/product-completion-lineage.mjs','utf8'),oldStart=original.indexOf('export function verifyCompletionBinding('),newStart=current.indexOf('function retainedVerifyCompletionBinding(');
 assert.equal(current.slice(current.indexOf('\n',newStart)+1),original.slice(original.indexOf('\n',oldStart)+1));
});

test('a failed supplied preload never becomes a proof, including after an earlier successful invocation',()=>{
 const git=completionGitReader((args,options)=>real(args,options)),own=git.preloadCommits;let refuse=true;git.preloadCommits=values=>{if(refuse)throw Error('Supplied immutable preload refused');return own(values);};
 const target=new Map(b.supplementalSources.map(row=>[row.path,real(['cat-file','blob',row.blob])])),read=path=>target.get(path),bytes=real(['cat-file','blob',b.successorBlob]);
 assert.throws(()=>verifyCompletionBinding(b.path,bytes,b.predecessorSHA256,git,read),/Supplied immutable preload refused/);refuse=false;assert.equal(verifyCompletionBinding(b.path,bytes,b.predecessorSHA256,git,read),true);refuse=true;assert.throws(()=>verifyCompletionBinding(b.path,bytes,b.predecessorSHA256,git,read),/Supplied immutable preload refused/);
});
