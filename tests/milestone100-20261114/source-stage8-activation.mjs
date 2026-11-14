import assert from 'node:assert/strict';
/** Pinned immutable Stage8 candidate; independent admission review remains required. */
import {proveSourceStage8AndHistoricalInputs,sourceStage8HistoricalView} from './source-stage8.mjs';
import {sourceStage8Policy,sourceStage8CapturePath} from './source-stage8-policy-v2.mjs';
export {sourceStage8Policy,sourceStage8CapturePath};
export function provePinnedSourceStage8(input){
 const retained=sourceStage8HistoricalView(input.git);
 if(retained){assert.equal(input.read,retained.historicalInput.read,'Historical Stage8 reader capability differs');return proveSourceStage8AndHistoricalInputs({...retained.actualInput,policy:sourceStage8Policy,capturePath:sourceStage8CapturePath});}
 return proveSourceStage8AndHistoricalInputs({...input,policy:sourceStage8Policy,capturePath:sourceStage8CapturePath});
}
