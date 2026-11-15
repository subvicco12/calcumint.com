import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {proveSourceStage9,assertSourceStage9Stable} from '../four-worker-integration-20261115/source-stage9.mjs';
import {sourceStage9Policy,sourceStage9CapturePath} from '../four-worker-integration-20261115/source-stage9-policy.mjs';
import {sourceStage8CapturePath} from '../milestone100-20261114/source-stage8-policy-v3.mjs';
import {provePinnedSourceStage8} from '../milestone100-20261114/source-stage8-activation.mjs';
import {assertSourceStage8HeadStable,createSourceStage8ObservationInput,sourceStage8HistoricalView} from '../milestone100-20261114/source-stage8.mjs';
import {sourceStage10Policy} from './source-stage10-current-policy.mjs';
const root=process.cwd();
test('private bound stability freshly checks old captures, non24 source and all current bytes',()=>{
 let changed;const read=path=>path===changed?Buffer.from('freshly changed live bytes'):readFileSync(path),view=proveSourceStage9({root,read,git:sourceGit});
 const unchanged=sourceStage9Policy.paths.find(path=>!sourceStage10Policy.paths.includes(path));assert(unchanged);
 for(const path of [sourceStage8CapturePath,sourceStage9CapturePath,unchanged,'src/lib/completion-wave-20261113/sql-successor.test.ts']){changed=path;assert.throws(()=>assertSourceStage9Stable(view),/capture digest differs|Current factory bytes differ/);changed=undefined;assertSourceStage9Stable(view);}
 assert.throws(()=>assertSourceStage9Stable({...view}),/Private verified/);
});
test('Stage8 private closing checks retain fresh source status and actual HEAD refusals',()=>{
 let dirty=false;const git=(args,options)=>dirty&&args[0]==='status'?Buffer.from('?? src/unadopted.ts\n'):sourceGit(args,options),p=provePinnedSourceStage8({root,read:readFileSync,git});
 dirty=true;assert.throws(()=>assertSourceStage8HeadStable(p),/Dirty or unknown current source/);dirty=false;assertSourceStage8HeadStable(p);
 assert.throws(()=>assertSourceStage8HeadStable({...p}),/Private fresh/);
});
test('observation aliases closing checks record and replay every actual24 source path',()=>{
 const original=provePinnedSourceStage8({root,read:readFileSync,git:sourceGit}),observed=createSourceStage8ObservationInput(original.historicalInput);
 assertSourceStage8HeadStable(sourceStage8HistoricalView(observed.input.git));
 for(const path of sourceStage10Policy.paths)assert(observed.collector.readPaths().includes(path),'Closing proof bypassed observed source '+path);
 observed.collector.seal();observed.collector.replay();observed.collector.assertHealthy();
});
