import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {pathToFileURL} from 'node:url';import {execFileSync} from 'node:child_process';
import {withActualAuthorityWitness,replayActualAuthorityWitness} from './source-stage8-authority-scope.mjs';
import {createSourceStage8ObservationInput,sourceStage8HistoricalView} from './source-stage8.mjs';
import {provePinnedSourceStage8,sourceStage8Policy,sourceStage8CapturePath} from './source-stage8-activation.mjs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
const root=process.cwd(),runtime='tests/next-cohort-20261110/source/retained-runtime.mjs';
const registered=(read=readFileSync,git=sourceGit)=>provePinnedSourceStage8({read,git,root}).historicalInput;
test('reactivated observation aliases record all24 actual source paths and replay original operations',()=>{
 const observed=createSourceStage8ObservationInput(registered());assert.equal(provePinnedSourceStage8(observed.input).live.size,24);observed.collector.seal();
 for(const path of sourceStage8Policy.paths)assert(observed.collector.readPaths().includes(path),'Unrecorded actual source path '+path);
 observed.collector.replay();observed.collector.assertHealthy();
});
test('unchanged full authority must succeed before a callback or witness can exist',()=>{
 let bad=false,called=false;const input=registered(path=>bad&&path===runtime?Buffer.from('changed guard'):readFileSync(path));bad=true;
 assert.throws(()=>withActualAuthorityWitness(input,()=>{called=true;}),/Independent current target bytes differ/);assert.equal(called,false);
});
test('a valid synchronous witness revalidates inside its callback and expires on return',()=>{
 const input=registered();let saved;assert.equal(withActualAuthorityWitness(input,token=>{saved=token;replayActualAuthorityWitness(token,input);return 7;}),7);
 assert.throws(()=>replayActualAuthorityWitness(saved,input),/Unknown or expired/);assert.throws(()=>replayActualAuthorityWitness({},input),/Unknown or expired/);
});
test('post-issue non-runtime reader tamper poisons even when the callback catches it',()=>{
 let bad=false;const target=sourceStage8Policy.paths[0],input=registered(path=>bad&&path===target?Buffer.from('changed source'):readFileSync(path));
 assert.throws(()=>withActualAuthorityWitness(input,token=>{bad=true;try{assert.throws(()=>replayActualAuthorityWitness(token,input));}finally{bad=false;}}),/observation|replay|differ|poison/i);
});
test('opaque post-issue raw commit and blob substitutions cannot reuse an initial proof',()=>{
 const current=JSON.parse(readFileSync(sourceStage8CapturePath)).rows[0].current;
 for(const kind of ['commit','blob']){
  let bad=false;const object=kind==='commit'?sourceStage8Policy.codeRef:current.blob;
  const git=(args,options)=>bad&&args[0]==='cat-file'&&args[1]===kind&&args[2]===object?Buffer.from('substituted opaque bytes'):sourceGit(args,options),input=registered(readFileSync,git);
  assert.throws(()=>withActualAuthorityWitness(input,token=>{bad=true;try{replayActualAuthorityWitness(token,input);}finally{bad=false;}}),/observation|replay|differ|poison/i);
 }
});
test('provided preload method identity and capability presence remain fixed',()=>{
 for(const added of [false,true]){
  const git=(args,options)=>sourceGit(args,options);git.preloadBlobs=values=>sourceGit.preloadBlobs(values);const input=registered(readFileSync,git),actual=sourceStage8HistoricalView(input.git).actualInput.git,name=added?'preloadPaths':'preloadBlobs',before=actual[name];
  assert.throws(()=>withActualAuthorityWitness(input,token=>{actual[name]=()=>{};try{replayActualAuthorityWitness(token,input);}finally{if(before===undefined)delete actual[name];else actual[name]=before;}}),/preload|capability|method/i);
 }
});
test('nested scopes, thenables and caught forged-witness attempts fail closed',()=>{
 const input=registered();assert.throws(()=>withActualAuthorityWitness(input,()=>Promise.resolve()),/synchronous/);
 assert.throws(()=>withActualAuthorityWitness(input,()=>{assert.throws(()=>withActualAuthorityWitness(input,()=>{}),/Nested/);}),/Nested/);
 assert.throws(()=>withActualAuthorityWitness(input,()=>{assert.throws(()=>withActualAuthorityWitness(input,()=>{},'unexpected'),/Nested/);}),/Nested/);
 assert.throws(()=>withActualAuthorityWitness(input,()=>{assert.throws(()=>replayActualAuthorityWitness({},input),/Unknown or expired/);}),/Unknown or expired/);
});
test('live actual HEAD and status changes refuse at the replay boundary',()=>{
 for(const kind of ['head','status']){
  let changed=false;const git=(args,options)=>changed&&kind==='head'&&JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(sourceStage8Policy.codeRef+'\n'):changed&&kind==='status'&&args[0]==='status'?Buffer.from('?? src/unknown-source.ts\n'):sourceGit(args,options),input=registered(readFileSync,git);
  assert.throws(()=>withActualAuthorityWitness(input,token=>{changed=true;try{replayActualAuthorityWitness(token,input);}finally{changed=false;}}),/HEAD moved|status changed/i);
 }
});
test('reader, Git, root and view identities cannot be substituted inside an active scope',()=>{
 const input=registered();for(const patch of [{read:path=>input.read(path)},{git:(args,options)=>input.git(args,options)},{root:root+'/unrelated'}])assert.throws(()=>withActualAuthorityWitness(input,token=>replayActualAuthorityWitness(token,{...input,...patch})),/witness.*differs/i);
});
test('same-byte physical symlinks refuse and modified observers never run before original-reader preflight',()=>{
 const directory=mkdtempSync(join(tmpdir(),'authority-scope-owned-')),tree=join(directory,'tree'),marker=join(directory,'untrusted-ran');let added=false;
 const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:4000000});
 const run=script=>execFileSync(process.execPath,['--input-type=module','-e',script],{cwd:tree,encoding:'utf8',timeout:20000,maxBuffer:4000000});
 try{
  git(['worktree','add','--detach',tree,'HEAD']);added=true;const base=pathToFileURL(tree+'/').href;
  run(`import assert from 'node:assert/strict';import{readFileSync,writeFileSync,rmSync,symlinkSync}from'node:fs';import{execFileSync}from'node:child_process';const base=${JSON.stringify(base)},root=${JSON.stringify(tree)};const{makeGitReader}=await import(base+'tests/parallel-source-20261110/git-reader.mjs');const{provePinnedSourceStage8}=await import(base+'tests/milestone100-20261114/source-stage8-activation.mjs');const{withActualAuthorityWitness,replayActualAuthorityWitness}=await import(base+'tests/milestone100-20261114/source-stage8-authority-scope.mjs');const git=makeGitReader((args,options={})=>args[0]==='status'?Buffer.alloc(0):execFileSync('git',args,{cwd:root,...options})),input=provePinnedSourceStage8({read:readFileSync,git,root}).historicalInput,target='tests/milestone100-20261114/authority-observation-collector.mjs',bytes=readFileSync(target),copy=${JSON.stringify(join(directory,'same-bytes.mjs'))};writeFileSync(copy,bytes);assert.throws(()=>withActualAuthorityWitness(input,token=>{rmSync(target);symlinkSync(copy,target);try{replayActualAuthorityWitness(token,input);}finally{rmSync(target);writeFileSync(target,bytes);}}),/Regular|Redirected/);`);
  const path=join(tree,'tests/milestone100-20261114/authority-observation-collector.mjs'),original=readFileSync(path,'utf8'),needle='export function createAuthorityObservationCollector(){';assert.equal(original.split(needle).length,2);
  writeFileSync(path,"import{writeFileSync as untrustedMarker}from'node:fs';\n"+original.replace(needle,needle+'untrustedMarker('+JSON.stringify(marker)+",'executed');"));
  run(`import assert from'node:assert/strict';import{existsSync}from'node:fs';const{proveNamedCurrentContext}=await import(${JSON.stringify(base+'tests/parallel-source-20261110/core.mjs')});assert.throws(()=>proveNamedCurrentContext(),/Independent authority scope implementation differs/);assert.equal(existsSync(${JSON.stringify(marker)}),false);`);
 }finally{try{if(added)git(['worktree','remove','--force',tree]);}finally{rmSync(directory,{recursive:true,force:true});}}
});
