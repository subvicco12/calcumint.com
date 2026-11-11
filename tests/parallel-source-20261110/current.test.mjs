import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {verifyParallelSource,capturePath,parseRows} from './core.mjs';
import {sourceGit} from './baseline-runtime.mjs';
import {ensureParallelSources} from './bootstrap.mjs';
const authority='tests/parallel-source-20261110/authority.mjs';
const expectedAuthority={blob:'1d78b24ba9750dd8f243a84fe6567b3906e0f64b',sha256:'f4219cdb7f88110a6426fb51c838ca49080a9bbb26d35a3108838361041acd75'};
test('the entire populated independent authority is fixed before any candidate can attest itself',()=>{
 const actual=readFileSync(authority);assert.equal(sourceGit(['rev-parse','HEAD:'+authority]).toString().trim(),expectedAuthority.blob);assert(actual.equals(sourceGit(['cat-file','blob',expectedAuthority.blob])));assert.equal(createHash('sha256').update(actual).digest('hex'),expectedAuthority.sha256);
});
test('actual current execution passes while unchanged R5 executes at literal A7',()=>assert.equal(verifyParallelSource(),true));
const capture=JSON.parse(readFileSync(capturePath));
for(const record of capture.applicationSources)test('current source reader rejects changed exact app bytes '+record.path,()=>assert.throws(()=>verifyParallelSource(name=>name===record.path?Buffer.from('plausible changed implementation'):readFileSync(name)),/Current target source differs|Independent current target bytes differ/));
for(const path of ['tests/parallel-source-20261110/core.mjs','tests/parallel-source-20261110/bootstrap.mjs','tests/parallel-source-20261110/baseline-probe.mjs','tests/parallel-source-20261110/historical-tests.mjs','tests/parallel-source-20261110/git-reader.mjs','tests/parallel-source-20261110/source-object-lock.mjs','scripts/product-completion-lineage.mjs'])test('no-op validator cannot nominate itself '+path,()=>assert.throws(()=>verifyParallelSource(name=>name===path?Buffer.from('export function verify(){return true}'):readFileSync(name)),/Independent current target bytes differ/));
test('a closed asynchronous-style target map supplies every current byte without a workspace fallback',()=>{
 const names=new Set([...capture.currentSources,...capture.applicationSources].map(r=>r.path));names.add(capturePath);const target=new Map([...names].map(p=>[p,readFileSync(p)])),seen=new Set();
 assert.equal(verifyParallelSource(path=>{seen.add(path);assert(target.has(path),'Undeclared reader dependency '+path);return target.get(path);}),true);
 for(const row of capture.applicationSources)assert(seen.has(row.path));assert(seen.size>=capture.currentSources.length);
 assert.throws(()=>verifyParallelSource(()=>{throw Error('No target bytes supplied');}),/No target bytes supplied/);
});
test('old valid app bytes cannot replace the reviewed source',()=>{
 const path='src/components/publication20-tool.tsx',old=sourceGit(['show',capture.baselineRef+':'+path]);assert.throws(()=>verifyParallelSource(name=>name===path?old:readFileSync(name)),/Current target source differs|Independent current target bytes differ/);
});
test('coordinated capture edits, removed dependencies and unsafe paths are not admission authority',()=>{
 for(const mutate of [c=>{c.currentSources=[]},c=>{c.currentSources[0].path='../outside'},c=>{c.codeRef='0'.repeat(40)},c=>{c.applicationSources.pop()},c=>{c.guardSources=[]}]){
  const altered=structuredClone(capture);mutate(altered);assert.throws(()=>verifyParallelSource(name=>name===capturePath?Buffer.from(JSON.stringify(altered)):readFileSync(name)),/Independent current target bytes differ/);
 }
});
test('missing or substituted actual Git provenance is never supplied by a receipt',()=>{
 assert.throws(()=>verifyParallelSource(readFileSync,()=>{throw Error('Missing current provenance')}),/Missing current provenance/);
 assert.throws(()=>verifyParallelSource(readFileSync,()=>Buffer.from('0'.repeat(40))));
});
test('the complete binding graph cannot be truncated by a supplied caller',()=>{
 const rows=parseRows(readFileSync('scripts/product-completion-lineage.mjs','utf8'));assert.throws(()=>verifyParallelSource(readFileSync,sourceGit,rows.slice(1)),/Only the reviewed parallel source rows/);
});
test('source availability refuses unsafe or multiple origins and substituted commits before fetching',()=>{
 for(const url of ['file:///tmp/untrusted','https://example.invalid/repo','https://github.com/subvicco12/calcumint.com.git\nhttps://example.invalid/repo']){
  const calls=[];assert.throws(()=>ensureParallelSources(capture,args=>{calls.push(args);return Buffer.from(url)}),/Exact HTTPS/);assert.equal(calls.length,1);assert.equal(calls[0][0],'remote');
 }
 assert.throws(()=>ensureParallelSources(capture,args=>Buffer.from(args[0]==='remote'?'https://github.com/subvicco12/calcumint.com.git':'0'.repeat(40))),/Source commit was substituted/);
});
