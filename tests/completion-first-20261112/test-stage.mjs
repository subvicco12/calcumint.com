/** Live exact two-test proof precedes the unchanged Stage3 application proof. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {ensureTestStageObjects} from '../parallel-source-20261110/bootstrap.mjs';
import {testStagePolicy,testStageCapturePath} from './test-stage-policy.mjs';
import {personalPolicy} from './personal-policy.mjs';
export function testStageRecords(read){const bytes=read(testStageCapturePath);assert.equal(createHash('sha256').update(bytes).digest('hex'),testStagePolicy.captureSHA256,'Exact test-only capture digest required');return new Map(JSON.parse(bytes).rows.map(row=>[row.path,row]));}
export function proveTestStageAndHistoricalInputs({read,git,root}){
 const bytes=read(testStageCapturePath);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),testStagePolicy.captureSHA256,'Exact test-only capture digest required');
 assert.deepEqual(testStagePolicy.paths,['src/lib/ci-retained-workflow-availability.test.ts','src/lib/thirteen-program-evidence.test.ts']);
 assert(testStagePolicy.paths.every(path=>path.endsWith('.test.ts')),'Only tests may enter this successor');
 ensureTestStageObjects();
 const live=verifyExactStage({policy:testStagePolicy,captureBytes:bytes,read,git,root});
 assert.equal(git(['diff','--name-only','-z',personalPolicy.codeRef,testStagePolicy.predecessorRef,'--','src']).length,0,'Test predecessor must preserve the entire Stage3 source image');
 const historicalGit=(args,options)=>args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}'?Buffer.from(testStagePolicy.predecessorRef+'\n'):args[0]==='status'&&args.at(-1)==='src'?Buffer.alloc(0):git(args,options);
 const projected=new Set(testStagePolicy.paths),historicalRead=path=>projected.has(path)?git(['show',testStagePolicy.predecessorRef+':'+path]):read(path);
 return {live,historicalInput:{read:historicalRead,git:historicalGit,root}};
}
