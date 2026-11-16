import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {proveSourceStage9} from '../four-worker-integration-20261115/source-stage9.mjs';
import {provePinnedCurrentStage8,proveSourceStage8AndHistoricalInputs,createSourceStage8ObservationInput} from '../milestone100-20261114/source-stage8.mjs';
import {provePinnedSourceStage8,sourceStage8Policy,sourceStage8CapturePath} from '../milestone100-20261114/source-stage8-activation.mjs';
import {sourceStage10Policy} from './source-stage10-current32-policy.mjs';
const root=process.cwd();
test('only the fixed synchronous canonical composition shares its immediately closed Stage9 entry',()=>{
 const calls=[],git=(args,options)=>{calls.push(args);return sourceGit(args,options);};
 const fixed=provePinnedCurrentStage8({read:readFileSync,git,root,policy:'ignored legacy extra'}),fixedStatuses=calls.filter(args=>args[0]==='status').length;calls.length=0;
 const incremental=proveSourceStage9({read:readFileSync,git,root}),generic=proveSourceStage8AndHistoricalInputs({...incremental.historicalInput,policy:sourceStage8Policy,capturePath:sourceStage8CapturePath});
 assert.deepEqual(fixed.live,generic.live);assert(calls.filter(args=>args[0]==='status').length>fixedStatuses,'Generic public construction must retain its fresh entry check');
});
test('a source mutation during canonical Stage8 construction is refused by its unchanged closing proof',()=>{
 const path='src/lib/completion-wave-20261113/sql-successor.test.ts';assert(sourceStage10Policy.paths.includes(path));let changed=false;
 const read=file=>changed&&file===path?Buffer.from('changed during Stage8 construction'):readFileSync(file);
 const git=(args,options)=>{const value=sourceGit(args,options);if(args[0]==='cat-file'&&args[1]==='commit'&&args[2]===sourceStage8Policy.codeRef)changed=true;return value;};
 assert.throws(()=>provePinnedCurrentStage8({read,git,root}),error=>error.message==='Current factory bytes differ: '+path);assert(changed);
});
test('observation aliases still build through their actual providers and replay every current Stage10 path',()=>{
 const original=provePinnedSourceStage8({root,read:readFileSync,git:sourceGit}),observed=createSourceStage8ObservationInput(original.historicalInput);
 assert.equal(provePinnedSourceStage8(observed.input).stage10Live.size,32);observed.collector.seal();
 for(const path of sourceStage10Policy.paths)assert(observed.collector.readPaths().includes(path));observed.collector.replay();observed.collector.assertHealthy();
});
