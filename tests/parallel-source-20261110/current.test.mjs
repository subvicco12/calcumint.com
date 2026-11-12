import test from 'node:test';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {verifyParallelSource,capturePath,parseRows} from './core.mjs';
import {sourceGit} from './baseline-runtime.mjs';
import {ensureParallelSources} from './bootstrap.mjs';
import {factoryPolicy} from '../calculator-factory-source-20261112/policy.mjs';
const authority='tests/parallel-source-20261110/authority.mjs';
const expectedAuthority={blob:'39cdbb481dfd7fab399fb44cfd9517efa463ea83',sha256:'63aa79162bbc1c3e694454f348c32af1bb14aa3d6b051cf07a4288f68bb8fd93'};
test('the entire populated independent authority is fixed before any candidate can attest itself',()=>{
 const actual=readFileSync(authority);assert.equal(sourceGit(['rev-parse','HEAD:'+authority]).toString().trim(),expectedAuthority.blob);assert(actual.equals(sourceGit(['cat-file','blob',expectedAuthority.blob])));assert.equal(createHash('sha256').update(actual).digest('hex'),expectedAuthority.sha256);
});
test('actual current execution passes while unchanged R5 executes at literal A7',()=>assert.equal(verifyParallelSource(),true));
const capture=JSON.parse(readFileSync(capturePath));
for(const record of capture.applicationSources)test('current source reader rejects changed exact app bytes '+record.path,()=>assert.throws(()=>verifyParallelSource(name=>name===record.path?Buffer.from('plausible changed implementation'):readFileSync(name)),/Current target source differs|Independent current target bytes differ|Current factory bytes differ/));
for(const path of ['tests/parallel-source-20261110/core.mjs','tests/parallel-source-20261110/bootstrap.mjs','tests/parallel-source-20261110/baseline-probe.mjs','tests/parallel-source-20261110/historical-tests.mjs','tests/parallel-source-20261110/git-reader.mjs','tests/parallel-source-20261110/source-object-lock.mjs','scripts/product-completion-lineage.mjs'])test('no-op validator cannot nominate itself '+path,()=>assert.throws(()=>verifyParallelSource(name=>name===path?Buffer.from('export function verify(){return true}'):readFileSync(name)),/Independent current target bytes differ/));
test('a closed asynchronous-style target map supplies every current byte without a workspace fallback',()=>{
 const names=new Set([...capture.currentSources,...capture.applicationSources].map(r=>r.path));names.add(capturePath);const target=new Map([...names].map(p=>[p,readFileSync(p)])),seen=new Set();
 assert.equal(verifyParallelSource(path=>{seen.add(path);assert(target.has(path),'Undeclared reader dependency '+path);return target.get(path);}),true);
 for(const row of capture.applicationSources)assert(seen.has(row.path));assert(seen.size>=capture.currentSources.length);
 assert.throws(()=>verifyParallelSource(()=>{throw Error('No target bytes supplied');}),/No target bytes supplied/);
});
test('old valid app bytes cannot replace the reviewed source',()=>{
 const path='src/components/publication20-tool.tsx',old=sourceGit(['show',capture.baselineRef+':'+path]);assert.throws(()=>verifyParallelSource(name=>name===path?old:readFileSync(name)),/Current target source differs|Independent current target bytes differ|Current factory bytes differ/);
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

for(const record of capture.factorySources)test('finite factory stage rejects altered or reverted bytes '+record.path,()=>{for(const bytes of [Buffer.from('tamper'),Buffer.alloc(0)])assert.throws(()=>verifyParallelSource(name=>name===record.path?bytes:readFileSync(name)),/Current factory bytes differ|Current target source differs|Independent current target bytes differ/);});
test('factory capture and literal policy are independently governed',()=>{
 const scheduler=JSON.parse(readFileSync('docs/calculator-factory/unit-scheduler-successor.json'));assert.equal(scheduler.path,'vitest.config.ts');assert.equal(scheduler.predecessor.ref,'9ad7e75641322696f75a018e53513c8158c39870');assert.equal(factoryPolicy.codeRef,'b3f0844e8ec09010464afa3ea33306bc4f384c41');assert.equal(scheduler.current.ref,factoryPolicy.codeRef);
 const contents=[];for(const record of [scheduler.predecessor,scheduler.current]){assert.equal(record.path,'vitest.config.ts');assert.equal(sourceGit(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob);const bytes=sourceGit(['cat-file','blob',record.blob]);assert.equal(bytes.length,record.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);contents.push(bytes.toString());}
 assert.equal(contents[0].split('  test: {').length,2);assert.equal(contents[1],contents[0].replace('  test: {','  test: {\n    // Retained source suites launch bounded child workers; avoid nested outer oversubscription.\n    maxWorkers: 1,'));
 for(const path of ['vitest.config.ts','docs/calculator-factory/unit-scheduler-successor.json','tests/calculator-factory-source-20261112/policy.mjs','docs/calculator-factory/source-stage-20261112.json','tests/calculator-factory-source-20261112/exact-stage.mjs','tests/completion-first-20261112/stage.mjs','tests/completion-first-20261112/policy.mjs','docs/completion-first-20261112/source-stage.json','tests/completion-first-20261112/workflows-stage.mjs','tests/completion-first-20261112/workflows-policy.mjs','tests/completion-first-20261112/retained-stage1-tests.mjs','docs/completion-first-20261112/source-stage2.json','tests/completion-first-20261112/non-source-stage2.mjs','tests/completion-first-20261112/non-source-policy.mjs','docs/completion-first-20261112/non-source-stage2.json','tests/completion-first-20261112/retained-runtime-stage2.mjs'])assert.throws(()=>verifyParallelSource(name=>name===path?Buffer.from('{}'):readFileSync(name)),/Independent current target bytes differ/);
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const tap=execFileSync(process.execPath,['tests/completion-first-20261112/retained-stage1-tests.mjs'],{env,encoding:'utf8',timeout:60000,maxBuffer:4000000});
 assert.match(tap,/# tests 4\b/);assert.match(tap,/# pass 4\b/);assert.match(tap,/# fail 0\b/);assert.match(tap,/# skipped 0\b/);
 const stage2=execFileSync(process.execPath,['--test','tests/completion-first-20261112/personal-stage.test.mjs'],{env,encoding:'utf8',timeout:60000,maxBuffer:4000000});
 assert.match(stage2,/# tests 4\b/);assert.match(stage2,/# pass 4\b/);assert.match(stage2,/# fail 0\b/);assert.match(stage2,/# skipped 0\b/);
 const diagnostics=execFileSync(process.execPath,['--test','tests/gotrue-runtime/login-diagnostics.test.mjs'],{env,encoding:'utf8',timeout:30000,maxBuffer:4000000});
 assert.match(diagnostics,/# tests 4\b/);assert.match(diagnostics,/# pass 4\b/);assert.match(diagnostics,/# fail 0\b/);assert.match(diagnostics,/# skipped 0\b/);
 const workflowConsumers=execFileSync(process.execPath,['--test','tests/full-product-batch13/workflow.test.mjs','tests/full-product-batch14/workflow.test.mjs','tests/full-product-batch17/workflow.test.mjs'],{env,encoding:'utf8',timeout:30000,maxBuffer:4000000});
 assert.match(workflowConsumers,/# tests 10\b/);assert.match(workflowConsumers,/# pass 10\b/);assert.match(workflowConsumers,/# fail 0\b/);assert.match(workflowConsumers,/# skipped 0\b/);
});

