import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyParallelSource} from '../parallel-source-20261110/core.mjs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {verifyExecutionManifest} from '../../scripts/first20-publication/evidence.mjs';
const targets=['src/lib/registered-snapshot-verification.ts','src/lib/calculator-factory/completion/next-engineering.ts'];
test('actual parallel source entrypoint passes its complete proof and rejects altered latest bytes',()=>{
 assert.equal(verifyParallelSource(readFileSync,sourceGit),true);
 for(const target of targets)assert.throws(()=>verifyParallelSource(path=>path===target?Buffer.from('altered current source'):readFileSync(path),sourceGit),error=>error.message==='Independent current target bytes differ: '+target);
});
test('actual first20 historical evidence consumer requires the same full positive source proof and fresh bytes',async()=>{
 await verifyExecutionManifest(readFileSync,sourceGit);
 for(const target of targets)await assert.rejects(()=>verifyExecutionManifest(path=>path===target?Buffer.from('altered current source'):readFileSync(path),sourceGit),error=>error.message==='Independent current target bytes differ: '+target);
});
