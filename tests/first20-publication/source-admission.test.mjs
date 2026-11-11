import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {verifyExecutionManifest} from '../../scripts/first20-publication/evidence.mjs';
import {sourceGit,baselineRef} from '../parallel-source-20261110/baseline-runtime.mjs';
const preview='src/lib/first20/preview-security.test.ts',self='scripts/first20-publication/evidence.mjs',manifest='docs/first20-publication/execution-manifest.json';
const reader=(path,bytes)=>name=>name===path?bytes:readFileSync(name);
const refusedAt=path=>error=>error instanceof Error&&error.message.includes(path)&&/Current target source differs|Independent current target bytes differ|Current source binding drift/.test(error.message);
test('actual current manifest admits only reviewed exact verifier and preview successors',async()=>{
 assert.equal(await verifyExecutionManifest(),undefined);
 const bytes=readFileSync(manifest);assert(bytes.equals(sourceGit(['show',baselineRef+':'+manifest])),'Historical source hashes must remain byte-identical');
});
test('refuses extra preview assertion changes',async()=>{
 await assert.rejects(verifyExecutionManifest(reader(preview,Buffer.concat([readFileSync(preview),Buffer.from('\n// unreviewed change')]))),refusedAt(preview));
});
test('refuses a valid old preview preimage as a silent current-source reversion',async()=>{
 await assert.rejects(verifyExecutionManifest(reader(preview,sourceGit(['show',baselineRef+':'+preview]))),refusedAt(preview));
});
test('unrelated browser source still requires its original exact bytes',async()=>{
 const path='tests/first20-publication/browser.mjs';await assert.rejects(verifyExecutionManifest(reader(path,Buffer.from('unreviewed browser'))),refusedAt(path));
});
test('refuses changing the retained predecessor claim',async()=>{
 const m=JSON.parse(readFileSync(manifest));m.sourceHashes[preview]='0'.repeat(64);await assert.rejects(verifyExecutionManifest(reader(manifest,Buffer.from(JSON.stringify(m)))),refusedAt(manifest));
});
test('refuses missing immutable Git provenance without substituting receipt hashes',async()=>{
 await assert.rejects(verifyExecutionManifest(readFileSync,()=>{throw Error('Missing immutable first20 provenance');}),error=>error instanceof Error&&error.message==='Missing immutable first20 provenance');
});
test('refuses the old valid verifier despite its unchanged manifest hash',async()=>{
 await assert.rejects(verifyExecutionManifest(reader(self,sourceGit(['show',baselineRef+':'+self]))),refusedAt(self));
});
test('coordinated verifier and manifest edits cannot nominate their own source approval',async()=>{
 const bytes=Buffer.concat([readFileSync(self),Buffer.from('\n// self-nomination')]),m=JSON.parse(readFileSync(manifest));m.sourceHashes[self]=createHash('sha256').update(bytes).digest('hex');
 await assert.rejects(verifyExecutionManifest(name=>name===self?bytes:name===manifest?Buffer.from(JSON.stringify(m)):readFileSync(name)),error=>refusedAt(self)(error)||refusedAt(manifest)(error));
});
