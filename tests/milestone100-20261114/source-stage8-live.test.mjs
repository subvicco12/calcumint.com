import {sourceStage8Policy as retainedStage8Policy} from './source-stage8-policy.mjs';
import {assertSourceStage8HeadStable,proveCurrentStage8AndHistoricalInputs} from './source-stage8.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {provePinnedSourceStage8,sourceStage8Policy,sourceStage8CapturePath} from './source-stage8-activation.mjs';
import {proveSourceStage8AndHistoricalInputs} from './source-stage8.mjs';
const root=process.cwd(),input={read:readFileSync,git:sourceGit,root};
test('exact Stage8 rows prove current bytes and historical reads only after full Git proof',()=>{
 const proof=provePinnedSourceStage8(input),capture=JSON.parse(readFileSync(sourceStage8CapturePath));
 assert.deepEqual([...proof.live.keys()],sourceStage8Policy.paths);assert.equal([...proof.live.keys()].filter(path=>retainedStage8Policy.paths.includes(path)).length,22);assert.equal(proof.live.size,23);
 for(const row of capture.rows){assert(readFileSync(row.path).equals(sourceGit(['cat-file','blob',row.current.blob])));if(row.predecessor)assert(proof.historicalInput.read(row.path).equals(sourceGit(['cat-file','blob',row.predecessor.blob])));else assert.throws(()=>proof.historicalInput.read(row.path),/no historical bytes/);}
});
test('closed supplied reader provides capture and every current source with no reader fallback',()=>{
 const names=[sourceStage8CapturePath,...sourceStage8Policy.paths],map=new Map(names.map(p=>[p,readFileSync(p)])),seen=new Set(),calls=[];
 const git=(args,options)=>{calls.push(args);return sourceGit(args,options);};git.preloadCommits=refs=>sourceGit.preloadCommits(refs);
 const read=path=>{assert(map.has(path),'Undeclared reader dependency '+path);seen.add(path);return map.get(path);};
 const proof=provePinnedSourceStage8({read,git,root});assert.deepEqual([...seen].sort(),names.sort());assert.equal([...proof.live.keys()].filter(path=>retainedStage8Policy.paths.includes(path)).length,22);assert.equal(proof.live.size,23);assert(calls.length>0);
 const pass='opaque-not-a-source-path';assert.throws(()=>proof.historicalInput.read(pass),/Undeclared reader dependency/);
});
test('each Stage8 row rejects mutation and every retained valid reversion before projection',()=>{
 const capture=JSON.parse(readFileSync(sourceStage8CapturePath));
 for(const row of capture.rows)for(const bytes of [Buffer.from('tamper'),...(row.predecessor?[sourceGit(['cat-file','blob',row.predecessor.blob])]:[])])assert.throws(()=>provePinnedSourceStage8({...input,read:path=>path===row.path?bytes:readFileSync(path)}),/Current factory bytes differ/);
});
test('capture and application identity substitution refuse',()=>{
 assert.throws(()=>provePinnedSourceStage8({...input,read:p=>p===sourceStage8CapturePath?Buffer.from('{}'):readFileSync(p)}));
 const policy={...sourceStage8Policy,codeRef:sourceStage8Policy.predecessorRef};assert.throws(()=>proveSourceStage8AndHistoricalInputs({...input,policy,capturePath:sourceStage8CapturePath}));
});

test('unknown current source is rejected before any projection',()=>{
 const git=(args,options)=>args[0]==='status'?Buffer.from('?? src/unreviewed.ts\n'):sourceGit(args,options);
 assert.throws(()=>provePinnedSourceStage8({...input,git}),/Dirty or unknown current source/);
});

test('a retained historical transport cannot cache a current proof across source mutation',()=>{
 const names=[sourceStage8CapturePath,...sourceStage8Policy.paths],target=new Map(names.map(path=>[path,readFileSync(path)]));
 const read=path=>{assert(target.has(path));return target.get(path);};
 const first=provePinnedSourceStage8({read,git:sourceGit,root});
 target.set(sourceStage8Policy.paths[0],Buffer.from('changed after the first proof'));
 assert.throws(()=>provePinnedSourceStage8(first.historicalInput),/Current factory bytes differ/);
});

test('exported current maps cannot mutate the private historical projection',()=>{
 const proof=provePinnedSourceStage8(input),path=sourceStage8Policy.paths.find(path=>proof.live.get(path).predecessor),expected=proof.historicalInput.read(path);
 const row=proof.live.get(path);row.predecessor.blob='0'.repeat(40);proof.live.set(path,{predecessor:null});
 assert(proof.historicalInput.read(path).equals(expected));
 assert.throws(()=>{proof.actualInput.read=()=>Buffer.from('tamper');},TypeError);
 assert.throws(()=>{proof.historicalInput.read=()=>Buffer.from('tamper');},TypeError);
});

test('historical capability reuse rechecks live HEAD and source status',()=>{
 for(const mutation of ['head','status']){
  let changed=false;
  const git=(args,options)=>changed&&mutation==='head'&&JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(sourceStage8Policy.predecessorRef+'\n'):changed&&mutation==='status'&&args[0]==='status'?Buffer.from('?? src/unreviewed.ts\n'):sourceGit(args,options);
  const first=provePinnedSourceStage8({...input,git});changed=true;
  assert.throws(()=>provePinnedSourceStage8(first.historicalInput),/Unreviewed current source delta|Dirty or unknown current source/);
 }
});
test('historical capability cannot nominate a substituted source reader',()=>{
 const first=provePinnedSourceStage8(input);
 assert.throws(()=>provePinnedSourceStage8({...first.historicalInput,read:()=>Buffer.from('forged source')}),/reader capability differs/);
});

test('metadata HEAD paths share only a per-proof observation and movement refuses at return',()=>{
 const current=sourceGit(['rev-parse','--verify','HEAD^{commit}']).toString().trim();let head=current,headReads=0;
 const git=(args,options)=>JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?(headReads++,Buffer.from(head+'\n')):sourceGit(args,options);
 const proof=provePinnedSourceStage8({...input,git}),before=headReads;
 for(let index=0;index<3;index++)assert.equal(proof.historicalInput.git(['rev-parse','HEAD:package.json']).toString(),sourceGit(['rev-parse',current+':package.json']).toString());
 assert.equal(headReads,before,'Metadata paths use the observed immutable commit, not cached HEAD responses');
 head=sourceStage8Policy.codeRef;assert.throws(()=>assertSourceStage8HeadStable(proof),/HEAD moved/);
 const next=provePinnedSourceStage8({...input,git});assertSourceStage8HeadStable(next);assert(headReads>before,'Every new proof and stability check observes live HEAD');
});

test('a metadata-only HEAD switch inside the retained callback is rejected before return',()=>{
 let head=sourceGit(['rev-parse','--verify','HEAD^{commit}']).toString().trim();
 const git=(args,options)=>JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(head+'\n'):sourceGit(args,options);
 assert.throws(()=>proveCurrentStage8AndHistoricalInputs({...input,git,policy:sourceStage8Policy,capturePath:sourceStage8CapturePath},()=>{head=sourceStage8Policy.codeRef;return {actualCurrent:new Map()};}),/HEAD moved during public source proof/);
});
