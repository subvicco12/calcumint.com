import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {runtimeAuxiliarySource,runtimeAuxiliaryBatchPredecessor,runtimeAuxiliaryBoundHeadPredecessor,runtimeAuxiliaryPrimePredecessor,runtimeAuxiliaryBatchSuccessor,runtimeAuxiliaryImmutableRefs,proveRuntimeAuxiliarySuccessor} from './source-stage8-runtime-auxiliary.mjs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {provePinnedSourceStage8,sourceStage8Policy} from './source-stage8-activation.mjs';
const root=process.cwd(),path='tests/next-cohort-20261110/source/retained-runtime.mjs',helper='tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs';
const args=()=>({record:runtimeAuxiliarySource.prior,currentBytes:readFileSync(path),input:{read:readFileSync,git:sourceGit,root}});
test('the one current runtime object joins its literal personal auxiliary claim before historical projection',()=>{
 assert.equal(proveRuntimeAuxiliarySuccessor(args()),true);
 let armed=false;const malicious=(commands,options)=>armed&&commands[0]==='cat-file'&&commands[1]==='commit'&&commands[2]===runtimeAuxiliaryBoundHeadPredecessor.ref?Buffer.from('changed after successful preload'):sourceGit(commands,options);
 for(const method of ['preloadCommits','preloadPaths','preloadBlobs'])malicious[method]=values=>{if(method==='preloadCommits'&&values.length===runtimeAuxiliaryImmutableRefs.length&&runtimeAuxiliaryImmutableRefs.every(ref=>values.includes(ref)))armed=true;return sourceGit[method](values);};
 assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input:{...args().input,git:malicious}}));assert.equal(armed,true,'Literal preload reached before the original opaque immutable rejection');

 assert.equal(sourceGit(['rev-parse',runtimeAuxiliaryBatchSuccessor.ref+':'+path]).toString().trim(),runtimeAuxiliaryBatchSuccessor.blob);
 const falseNext=(commands,options)=>commands[0]==='rev-parse'&&commands[1]===runtimeAuxiliaryBatchSuccessor.ref+':'+path?Buffer.from('0'.repeat(40)+'\n'):sourceGit(commands,options);assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input:{...args().input,git:falseNext}}));
 const input=provePinnedSourceStage8(args().input).historicalInput;assert.equal(proveRuntimeAuxiliarySuccessor({...args(),input}),true);
});
test('unknown old tuples and caller-nominated current records cannot access Git',()=>{
 for(const [key,value]of [['path','unknown/path'],['ref','0'.repeat(40)],['blob','1'.repeat(40)],['bytes',1],['sha256','0'.repeat(64)]]){
  const input={...args().input,git:()=>{throw Error('Unknown must not use Git');}};assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input,record:{...runtimeAuxiliarySource.prior,[key]:value}}),/literal personal auxiliary/);
 }
 assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),currentRecord:runtimeAuxiliarySource.current}),/Caller-nominated/);
});
test('current tamper and retained-valid old runtime bytes refuse',()=>{
 const old=sourceGit(['cat-file','blob','99666fd1d09a2b7f782b05d4dbd9f9656be08eea']),g20=sourceGit(['cat-file','blob',runtimeAuxiliarySource.current.blob]),g24=sourceGit(['cat-file','blob',runtimeAuxiliaryBatchPredecessor.blob]),g26=sourceGit(['cat-file','blob',runtimeAuxiliaryBoundHeadPredecessor.blob]),g34=sourceGit(['cat-file','blob',runtimeAuxiliaryPrimePredecessor.blob]);
 for(const bytes of [Buffer.from('tamper'),old,g20,g24,g26,g34]){
  const input={...args().input,read:name=>name===path?bytes:readFileSync(name)};assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input,currentBytes:bytes}));
  assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),currentBytes:bytes}));
 }
});
test('the non-SRC current runtime requires its independent exact G20 Git object join',()=>{
 const git=(commands,options)=>commands[0]==='rev-parse'&&commands[1]===runtimeAuxiliarySource.current.ref+':'+path?Buffer.from('0'.repeat(40)+'\n'):sourceGit(commands,options);
 assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input:{...args().input,git}}));
});
test('registered readers, missing guard dependencies and absent Git cannot be substituted',()=>{
 const historical=provePinnedSourceStage8(args().input).historicalInput;
 assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input:{...historical,read:()=>Buffer.from('forged reader')}}),/reader capability/);
 assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input:{...args().input,read:name=>{if(name===helper)throw Error('Missing runtime auxiliary guard');return readFileSync(name);}}}),/Missing runtime auxiliary guard/);
 assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input:{...args().input,git:()=>{throw Error('Missing source Git');}}}),/Missing source Git/);
});
test('raw actual HEAD movement refuses for current and historical capabilities',()=>{
 const current=sourceGit(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.notEqual(current,sourceStage8Policy.codeRef);
 for(const historical of [false,true]){
  let head=current,armed=false;
  const git=(commands,options)=>JSON.stringify(commands)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(head+'\n'):sourceGit(commands,options);
  const read=name=>{if(armed&&name===helper)head=sourceStage8Policy.codeRef;return readFileSync(name);};
  const actual={read,git,root},input=historical?provePinnedSourceStage8(actual).historicalInput:actual;armed=true;
  assert.throws(()=>proveRuntimeAuxiliarySuccessor({...args(),input}),/HEAD moved|HEAD changed/);
 }
});
