import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {provePinnedSourceStage8} from '../milestone100-20261114/source-stage8-activation.mjs';
import {proveNamedCurrentContext} from '../parallel-source-20261110/core.mjs';
import {sourceStage10Policy} from './source-stage10-current26-policy.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('actual26 source rows survive every historical layer without changing old recorded claim hashes',()=>{
 const p=provePinnedSourceStage8({root:process.cwd(),read:readFileSync,git:sourceGit});assert.equal(p.stage10Live.size,26);
 const current=proveNamedCurrentContext();
 for(const path of sourceStage10Policy.paths){const row=current.get(path);assert(row,'Actual source row missing: '+path);assert.equal(row.current.ref,sourceStage10Policy.codeRef);assert.equal(row.current.sha256,sha(readFileSync(path)));assert(readFileSync(path).equals(sourceGit(['cat-file','blob',row.current.blob])));}
 const verifier=current.get('src/lib/registered-snapshot-verification.ts');assert.match(verifier.recordedSHA256,/^[a-f0-9]{64}$/);assert.notEqual(verifier.recordedSHA256,verifier.current.sha256);
 const added=current.get('src/lib/calculator-factory/completion/next-engineering.ts');assert.equal(added.recordedSHA256,undefined,'New source has no inherited historical receipt claim');
});
