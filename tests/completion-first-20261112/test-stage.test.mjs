import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {proveTestStageAndHistoricalInputs} from './test-stage.mjs';
import {testStageCapturePath,testStagePolicy} from './test-stage-policy.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],timeout:30000,maxBuffer:8000000});
const input={read:readFileSync,git,root:process.cwd()},file='src/lib/thirteen-program-evidence.test.ts';
test('test-only successor proves both exact tests before constructing its historical input',()=>{
 const proved=proveTestStageAndHistoricalInputs(input);assert.equal(proved.live.size,2);assert.equal(proved.historicalInput.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),testStagePolicy.predecessorRef);
 assert(proved.historicalInput.read(file).equals(git(['show',testStagePolicy.predecessorRef+':'+file])));
});
test('test-only successor refuses retained-valid reversion and arbitrary current test tampering',()=>{
 for(const bytes of [git(['show',testStagePolicy.predecessorRef+':'+file]),Buffer.from('tampered current test')])assert.throws(()=>proveTestStageAndHistoricalInputs({...input,read:path=>path===file?bytes:readFileSync(path)}));
});
test('test-only successor refuses substituted current Git identities',()=>{
 assert.throws(()=>proveTestStageAndHistoricalInputs({...input,git:args=>args[0]==='rev-parse'&&args[1].endsWith(':'+file)?Buffer.from('0'.repeat(40)+'\n'):git(args)}));
});
test('test-only successor refuses extra current source and dirty source',()=>{
 assert.throws(()=>proveTestStageAndHistoricalInputs({...input,git:args=>args[0]==='diff'&&args[2]!==testStagePolicy.codeRef&&args[1]===testStagePolicy.codeRef?Buffer.from('src/unauthorized.ts\0'):git(args)}));
 assert.throws(()=>proveTestStageAndHistoricalInputs({...input,git:args=>args[0]==='status'?Buffer.from('?? src/unauthorized.ts\n'):git(args)}));
});
test('test-only successor refuses modified capture metadata before using any historical view',()=>{
 assert.throws(()=>proveTestStageAndHistoricalInputs({...input,read:path=>path===testStageCapturePath?Buffer.from('{}'):readFileSync(path)}),/capture digest/);
});
