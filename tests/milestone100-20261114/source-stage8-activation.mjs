import {resolve} from 'node:path';
import assert from 'node:assert/strict';
/** Pinned immutable Stage8 candidate; independent admission review remains required. */
import {provePinnedCurrentStage8,sourceStage8HistoricalView,refreshPrivatePinnedStage8} from './source-stage8.mjs';
import {sourceStage8Policy,sourceStage8CapturePath} from './source-stage8-policy-v3.mjs';
export {sourceStage8Policy,sourceStage8CapturePath};
export function provePinnedSourceStage8(input){
 const retained=sourceStage8HistoricalView(input.git);
 if(retained){assert.equal(input.read,retained.historicalInput.read,'Historical Stage8 reader capability differs');assert.equal(resolve(input.root),resolve(retained.historicalInput.root),'Historical Stage8 root differs');const refreshed=refreshPrivatePinnedStage8(input);if(refreshed)return refreshed;input=retained.actualInput;}
 return provePinnedCurrentStage8({read:input.read,git:input.git,root:input.root});
}
