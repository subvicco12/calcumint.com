/** Test-only outer stage proves actual SRC20 before retaining the literal APP19 Stage5. */
import { provePinnedSourceStage7 } from '../milestone60-20261113/source-stage7-activation.mjs';
import assert from 'node:assert/strict';import{createHash}from'node:crypto';
import{verifyExactStage}from'../calculator-factory-source-20261112/exact-stage.mjs';
import{proveAppStage5AndHistoricalInputs}from'./source-app-stage5.mjs';
import{appStage5Policy,appStage5CapturePath}from'./source-app-stage5-policy.mjs';
import{testStage6Policy,testStage6CapturePath}from'./source-test-stage6-policy.mjs';
import{ensureTestStage6Objects}from'../parallel-source-20261110/bootstrap.mjs';
const path='src/lib/parallel-source-evidence.test.ts',hash=b=>createHash('sha256').update(b).digest('hex');
function captureFor(read,policy,capturePath){const bytes=read(capturePath);assert.equal(hash(bytes),policy.captureSHA256,'Independent Stage6 capture digest differs');const capture=JSON.parse(bytes);assert.equal(policy.predecessorRef,'8cbf39c4fd62e4c4a5cf08447cd669171ae32e79');assert.deepEqual(policy.paths,[path]);assert.deepEqual(capture.ancestry,policy.ancestry);assert.deepEqual(capture.rows.map(row=>row.path),policy.paths);return{capture,bytes};}
export const testStage6Records=read=>new Map(captureFor(read,testStage6Policy,testStage6CapturePath).capture.rows.map(row=>[row.path,row]));
export function proveSourceTestStage6AndHistoricalInputs({read,git,root,policy=testStage6Policy,capturePath=testStage6CapturePath}){
 const{capture,bytes}=captureFor(read,policy,capturePath);if(policy===testStage6Policy)ensureTestStage6Objects();if(typeof git.preloadCommits==='function')git.preloadCommits(policy.ancestry);
 const live=verifyExactStage({policy,captureBytes:bytes,read,git,root});
 const historicalRead=name=>name===path?git(['cat-file','blob',capture.rows[0].predecessor.blob]):read(name);
 const historicalGit=(args,options)=>args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}'?Buffer.from(policy.predecessorRef+'\n'):args[0]==='status'&&args.at(-1)==='src'?Buffer.alloc(0):git(args,options);
 return{live,historicalInput:{read:historicalRead,git:historicalGit,root}};
}
export function proveCurrentAppStage5AndHistoricalInputs(input){
 // Stage7 proves actual SRC first. The original body below receives only its exact historical view.
 const result=provePinnedSourceStage7(input,proveLiteralCurrentAppStage5AndHistoricalInputs);
 return {...result,actualCurrent:result.historicalStage6,stage7Actual:result.actualCurrent};
}
export function proveLiteralCurrentAppStage5AndHistoricalInputs(input){
 const outer=proveSourceTestStage6AndHistoricalInputs({read:input.read,git:input.git,root:input.root});
 if(typeof input.git.preloadCommits==='function')input.git.preloadCommits(appStage5Policy.ancestry);
 const app=proveAppStage5AndHistoricalInputs({...outer.historicalInput,policy:appStage5Policy,capturePath:appStage5CapturePath});
 return{...app,testOnly:outer.live,actualCurrent:new Map([...app.live,...outer.live])};
}
