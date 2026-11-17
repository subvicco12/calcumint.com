import test from 'node:test';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {verifyParallelSource,capturePath,parseRows} from './core.mjs';
import {sourceGit} from './baseline-runtime.mjs';
import {ensureParallelSources} from './bootstrap.mjs';
import {appStage5Policy,appStage5CapturePath} from '../completion-wave-20261113/source-app-stage5-policy.mjs';
import {proveCurrentAppStage5AndHistoricalInputs} from '../completion-wave-20261113/source-test-stage6.mjs';
import {factoryPolicy} from '../calculator-factory-source-20261112/policy.mjs';
const authority='tests/parallel-source-20261110/authority.mjs';
const retainedStage6Authority={blob:'c2b5df7c2c06f13fbb62b7e61b61dd5df8c8d557',sha256:'cac1eed35a22b764bb3a665324392681689a8a0786618c6c82fdc89bba263408'};
const retainedStage7Authority={ref:'f00acbfdb882688eb1d0c22bc68305eb4984ac41',blob:'398e63f1f3e7c465856ea9958095d2f5269f046d',sha256:'c4a951c795d43b20715d5b1ffeb1afd8d5fcea295bb3d72ffb3a56b7676813f2'};
const retainedStage7V6Authority={ref:'49cac9941e81646aca6ef4a7e70acd7374e15d92',blob:'b2a71dd91b5d34c1e3271556004e258559fe7ef9',sha256:'7df9a80f58991d4cbd4b68758de242e62161088e01878ce318ed0273eca76691'};
const retainedStage7V7Authority={ref:'36434788baf38632ca6e04d9b8867dc92e7ef1b8',blob:'b17ad92955b8f15479bc5a6c0c80aef10f26c623',sha256:'6d7592f29200b26a498c333b0876452fe9a305660d9caf245b72243ac9d232e2'};
const retainedStage7V8Authority={ref:'63d2214c731332540c48d2c64c3793294d515980',blob:'9b8a853a577ffe5b424d955a732715c22569c11f',sha256:'5ff20f1e234aeb17670529b66577cef1b3e6b4d85a58a0e5ea22a48571779f5a'};
// Independently reviewed exact clean authority successor; the original anchor is still proved below.
const expectedAuthority={blob:'75fd2d0ca34e940a865013a9e3d78e3908c00fdf',sha256:'786081f5301987911d4cfccd53cd5b7df31464ff511307c323e583e2a30d68b0'};
test('the entire populated independent authority is fixed before any candidate can attest itself',()=>{
 const retainedRef='2d5d105892134f8af46fc2a02edd5932c431b845';
 assert.equal(sourceGit(['rev-parse',retainedRef+':'+authority]).toString().trim(),retainedStage6Authority.blob);
 const retained=sourceGit(['cat-file','blob',retainedStage6Authority.blob]);assert(retained.equals(sourceGit(['show',retainedRef+':'+authority])));assert.equal(createHash('sha256').update(retained).digest('hex'),retainedStage6Authority.sha256);
 assert.equal(sourceGit(['rev-parse',retainedStage7Authority.ref+':'+authority]).toString().trim(),retainedStage7Authority.blob);
 const qualified=sourceGit(['cat-file','blob',retainedStage7Authority.blob]);assert.equal(createHash('sha256').update(qualified).digest('hex'),retainedStage7Authority.sha256);assert(qualified.equals(readFileSync('docs/milestone60-20261113/source-stage7-qualified-authority64.mjs')));
 assert.equal(sourceGit(['rev-parse',retainedStage7V6Authority.ref+':'+authority]).toString().trim(),retainedStage7V6Authority.blob);
 const qualifiedV6=sourceGit(['cat-file','blob',retainedStage7V6Authority.blob]);assert.equal(createHash('sha256').update(qualifiedV6).digest('hex'),retainedStage7V6Authority.sha256);assert(qualifiedV6.equals(readFileSync('docs/milestone60-20261113/source-stage7-qualified-authority65.mjs')));
 assert.equal(sourceGit(['rev-parse',retainedStage7V7Authority.ref+':'+authority]).toString().trim(),retainedStage7V7Authority.blob);
 const qualifiedV7=sourceGit(['cat-file','blob',retainedStage7V7Authority.blob]);assert.equal(createHash('sha256').update(qualifiedV7).digest('hex'),retainedStage7V7Authority.sha256);assert(qualifiedV7.equals(readFileSync('docs/milestone60-20261113/source-stage7-qualified-authority66.mjs')));
 assert.equal(sourceGit(['rev-parse',retainedStage7V8Authority.ref+':'+authority]).toString().trim(),retainedStage7V8Authority.blob);
 const qualifiedV8=sourceGit(['cat-file','blob',retainedStage7V8Authority.blob]);assert.equal(createHash('sha256').update(qualifiedV8).digest('hex'),retainedStage7V8Authority.sha256);assert(qualifiedV8.equals(readFileSync('docs/milestone60-20261113/source-stage7-qualified-authority67.mjs')));
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


// Stage5 reads actual complete current SRC before any literal Stage4 projection.
test('exact Stage5 actual application source is live and finite',()=>{
 const result=proveCurrentAppStage5AndHistoricalInputs({read:readFileSync,git:sourceGit,root:process.cwd()});assert.equal(result.testOnly.size,1);assert.equal(result.actualCurrent.size,20);
 assert.deepEqual([...result.live.keys()],appStage5Policy.paths);assert.equal(result.live.size,19);assert.equal(appStage5Policy.ancestry.length,51);

});
for(const path of appStage5Policy.paths)test('Stage5 refuses altered actual current application bytes '+path,()=>assert.throws(()=>proveCurrentAppStage5AndHistoricalInputs({read:name=>name===path?Buffer.from('tampered actual frozen application'):readFileSync(name),git:sourceGit,root:process.cwd(),policy:appStage5Policy,capturePath:appStage5CapturePath}),/Current factory bytes differ/));
for(const path of ['tests/completion-wave-20261113/source-app-stage5.mjs','tests/completion-wave-20261113/source-app-stage5-policy.mjs',appStage5CapturePath])test('Stage5 proof imports and finite capture remain independent authority '+path,()=>assert.throws(()=>verifyParallelSource(name=>name===path?Buffer.from('{}'):readFileSync(name)),/Independent current target bytes differ/));

test('mandatory source guard regressions exercise exact source and immutable availability without skips',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 for(const [file,count]of [['source-app-stage5.test.mjs',7],['source-app-stage5-availability.test.mjs',5],['source-authority-preload.test.mjs',6],['source-preflight.test.mjs',5],['source-preflight-stage.test.mjs',5],['source-test-stage6.test.mjs',6]]){
  let tap;try{tap=execFileSync(process.execPath,['tests/completion-wave-20261113/'+file],{env,encoding:'utf8',timeout:30000,maxBuffer:1000000});}catch(error){throw new Error('Mandatory source guard child failed: '+file+'\nstdout:\n'+(error.stdout??'')+'\nstderr:\n'+(error.stderr??''),{cause:error});}
  for(const [name,value]of [['tests',count],['pass',count],['fail',0],['skipped',0]])assert.match(tap,new RegExp('# '+name+' '+value+'\\b'));
 }
});
