import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {accepted} from '../parallel-source-20261110/authority.mjs';
import {verifyParallelSource} from '../parallel-source-20261110/core.mjs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {provePinnedSourceStage8,sourceStage8Policy,sourceStage8CapturePath} from './source-stage8-activation.mjs';

test('declared current byte tamper is refused before any Git or retained proof can run',()=>{
 const path=accepted[0].path;let gitCalls=0;
 const git=()=>{gitCalls++;throw Error('Original full proof reached');};
 for(const bytes of [Buffer.from('tamper'),Buffer.alloc(0),undefined])assert.throws(()=>verifyParallelSource(name=>name===path?bytes:readFileSync(name),git),/Independent current target bytes differ/);
 assert.equal(gitCalls,0);
});
test('passing the finite byte preflight always continues into the unchanged full proof',()=>{
 const names=new Set(accepted.map(row=>row.path)),seen=new Set();let gitCalls=0;
 const read=path=>{seen.add(path);return readFileSync(path);};
 assert.throws(()=>verifyParallelSource(read,()=>{gitCalls++;for(const path of names)assert(seen.has(path),'Current authority read omitted: '+path);throw Error('Original full proof reached');}),/Original full proof reached/);
 assert.equal(gitCalls,1);
});
test('a supplied closed reader keeps its own missing-dependency error with no filesystem fallback',()=>{
 let gitCalls=0;
 assert.throws(()=>verifyParallelSource(()=>{throw Error('Closed target unavailable');},()=>{gitCalls++;throw Error('Git must not run');}),/Closed target unavailable/);
 assert.equal(gitCalls,0);
});
test('historical capabilities retain reader identity and freshly inspect their actual target bytes',()=>{
 const names=new Set([sourceStage8CapturePath,...sourceStage8Policy.paths,...accepted.map(row=>row.path)]),target=new Map([...names].map(path=>[path,readFileSync(path)]));
 const read=path=>{assert(target.has(path),'Undeclared target '+path);return target.get(path);};let stop=false,calls=0;
 const git=(args,options)=>{if(stop){calls++;throw Error('Git must not run before negative refusal');}return sourceGit(args,options);};
 for(const name of ['preloadCommits','preloadPaths','preloadBlobs'])git[name]=values=>sourceGit[name](values);
 const view=provePinnedSourceStage8({read,git,root:process.cwd()});stop=true;
 assert.throws(()=>verifyParallelSource(readFileSync,view.historicalInput.git),/Historical Stage8 reader capability differs/);
 target.set(accepted[0].path,Buffer.from('changed after historical view construction'));
 assert.throws(()=>verifyParallelSource(view.historicalInput.read,view.historicalInput.git),/Independent current target bytes differ/);
 assert.equal(calls,0);
});
