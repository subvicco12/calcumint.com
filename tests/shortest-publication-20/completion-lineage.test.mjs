import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {verifyShortestSourceBinding,verifyShortestManifest} from '../../scripts/check-shortest-publication20.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});
const manifest=JSON.parse(readFileSync('docs/shortest-publication-20/implementation-manifest.json'));
for(const path of ['.github/workflows/ci.yml','scripts/publication20-caller-lineage.mjs','scripts/check-shortest-publication20.mjs']){
 const claim=manifest.sourceHashes[path];
 test('exact current committed source accepted: '+path,()=>verifyShortestSourceBinding(path,claim));
 test('predecessor reversion denied even with original hash: '+path,()=>assert.throws(()=>verifyShortestSourceBinding(path,claim,()=>git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+path])),/current successor/));
 test('tampering denied: '+path,()=>assert.throws(()=>verifyShortestSourceBinding(path,claim,()=>Buffer.concat([readFileSync(path),Buffer.from('\n// tamper')])),/current successor/));
 test('provenance loss denied: '+path,()=>assert.throws(()=>verifyShortestSourceBinding(path,claim,readFileSync,()=>{throw Error('Missing exact Git source');}),/Missing exact/));
}
test('unrelated historical binding remains strict',()=>assert.throws(()=>verifyShortestSourceBinding('src/lib/publication20/network.ts',manifest.sourceHashes['src/lib/publication20/network.ts'],()=>Buffer.from('tamper')),/Source binding differs/));

test("historical manifest cannot silently rewrite current source claims",()=>{const changed={...manifest,sourceHashes:{...manifest.sourceHashes,".github/workflows/ci.yml":"0".repeat(64)}};assert.throws(()=>verifyShortestManifest(Buffer.from(JSON.stringify(changed))),/Historical shortest-publication manifest differs/);});
