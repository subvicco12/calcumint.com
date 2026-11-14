import {ensurePinnedAuthorityRecord} from '../milestone100-20261114/source-stage8-authority-availability.mjs';
import test from 'node:test';
import {execFileSync,execFile} from 'node:child_process';
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
const retainedStage8Authority={ref:'eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8',blob:'75fd2d0ca34e940a865013a9e3d78e3908c00fdf',sha256:'786081f5301987911d4cfccd53cd5b7df31464ff511307c323e583e2a30d68b0'};
const retainedStage8V2Authority={ref:'b5a07bb4b7023dd9427e2edca36c36aebe665737',blob:'b797600afd2608566b717bd0ca1cedd727e92080',sha256:'b23f60a4e6b19a73a5eda7f276618a800b53d555707f9095616fd4006cf85ca2'};
const retainedStage8V3Authority={ref:'1f8898e4afdc88f0c13f49f5fb41c9891517efc7',blob:'bd1ae56560eb444a765976b5dd5ffd9f7e391c73',sha256:'f05dc7722cacc7c5f1734689e3fb8e801fc3e32d2d42d5ae0584d4608f85f50b'};
const retainedStage8V4Authority={ref:'a058ff261af1678854c79ecc725c54f2fc2273a1',blob:'54908614adff483d03d364e157eb10db6c0b507d',sha256:'ce5085cee2bda7b18858c7a902c9f7a1cffe54207fb54b74ae0b2db187b63250'};
const retainedStage8V5Authority={ref:'4beb54069f0946ddf9a92328e2b252af371a02ea',blob:'1746d74804984bb1caf8c506545b1b36f2285068',sha256:'ada789af2ea5af7f53815a6d423b4e4ad6a721f16e00dc89ea59c1a40ef0fd1f'};
const retainedStage8V6Authority={ref:'f3d53bb69754646618d56cb47e42727ed712fa59',blob:'cd51f5bd1c2b95f1bf2fd2eccd27d8b628a0ea07',sha256:'77a1f01b8d4e98501065a12aa3f07743e45ab37b3143e083d8ff675db4e788b1'};
const retainedStage8V7Authority={ref:'53514d75971e67b08703af6fe7c1aa77e810ee3c',blob:'18ccc3522d12394a414751d4251c0cede8322cdb',sha256:'02bc4aea2ea7cf111ac172b0e2ef32288c773028fc0812d495c5130ab57382b1'};
const retainedStage8V8Authority={ref:'34a22620e62c4321dfbeda2a8fe0a6cea032daed',blob:'48e6d4d432ac337ad63c38742a33fcbbdf2cfaa7',sha256:'e5578b7fdc8ab69fbedd627b643b0addeb0a610555b6167790be9ec46840545c'};
const retainedStage8V9Authority={ref:'70e1b89f9a0bb7e18cfedec56b556b390a712535',blob:'455f9ea2b4cf14f0b576124b7ec0b50291872500',sha256:'afbb92d0a38489af94e9961ff7eaac9f40e292628be6c36f664fa6633488c7b7'};
const retainedStage8V10Authority={ref:'80a29e843722e435155a0073f90202b3c41d1aa7',blob:'b87d073d73a431f2057c35270ca057fe608293a4',sha256:'dccd2b6a3bd5f8c12757726ed1673ff14da381b39295304ab2834d6b2fb85bab'};
const retainedStage8V11Authority={ref:'0d25c657424e9aa66d253d43f45f2c27e9b44d0f',blob:'90a3df69c4feec64e25e96262cb1d9e5632270d3',sha256:'0bb8d4c4ed6dc1a62aed07cfd01f06f15de68e8fc03313d4cfcd6c3559071890'};
const retainedStage8V12Authority={ref:'5448d902ee954bf0d2929d835b28a0df23fae282',blob:'ed4d92a8134232385d3d39d12cbd20d8b5bcc007',sha256:'c0db7d4b8b45aa4cfca0fa9a27cb6c90ebced32d59c995ceaec525d5fb8c61dd'};
const retainedStage8V13Authority={ref:'101bdd56f6c5d195c85c340ac9ab4ff0cb643fa3',blob:'c230f9727903ddec8337bb4f966576b48ab234ec',sha256:'184fb36421da43b6ee6eb10da7edba6834f7770fec3c6bba598f09304a2415bb'};
const retainedStage8V14Authority={ref:'7ef48c91767b955269a481ef3fa1822d80dfd1d3',blob:'a1e984a7255bddd0d7a0e0e9a15c93341df193e5',sha256:'d9d2726a697022f6ba6618e303a22fcccdafd334b0421404c7c8be50b5415b34'};
const retainedStage8V15Authority={ref:'4fb1b82927264f432c16521b1d6437e62a45411d',blob:'67f3ca10a49991b7a09cc7eafd25c7f97b9bbf26',sha256:'c2bfaeb61ad809f39430ef8e547a220fcebae9bad2b9f3cf8e3935a0765acdd1'};
const retainedStage8V16Authority={ref:'0c2221df406558a8d0017913ae3b621ccd51f655',blob:'49225451a774e1078b728661a17c67db730b15a2',sha256:'fc786dd109037fefe0076bc221f7b0de2f2a33f3d6da20cff7d520d262db9755'};
const retainedStage8V17Authority={ref:'7fc8c4b561dbc2a3f41f0811576e6105b8099abc',blob:'aa01c1b64fcedab86c79995a7c4054583e058979',sha256:'21c735f94f003635b9465f6955fe17ca7b559bb36e109e1fc81c1988f0838b77'};
const retainedStage8V18Authority={ref:'3deafda9a9c10ccc26b1fb4372883e8ced5c2d4d',blob:'bc089b70e76f0a93501db985bb4439090bef6354',sha256:'4102ee4601c51c197f1867af6bc7e9a97ea2e3bb8c28505b7f4b0a57671d8b09'};
const retainedStage8V19Authority={ref:'3ba261b877000eadbffff7ce5cbc3f478763775d',blob:'a397a741d8f19499daa7af42984682fb199e2831',sha256:'8e1be88ddf532801b7c1938aac61b8b761f378f89d1921fd366122bcf3b47d2d'};
const retainedStage8V20Authority={ref:'c68e764f4add773661a3fd3bb24401139f16ec80',blob:'bca14f2489ef074ac6558ac173aebd4147da4600',sha256:'2814b32cda60b6b068061e51b7767433d8c0b0319f91f3b2c1b96c57c7934312'};
const retainedStage8V21Authority={ref:'9082899332cd5bafce60cf6114fb4a23ffb5ffc5',blob:'374681cc1db460734301aeba6b6ae52a18b53122',sha256:'3ada91ea9af64f8e73e3b061cc6e13ba10a35a0686d9664b1c86910f85985f86'};
const retainedStage8V22Authority={ref:'f8bde88653c923c932eb3248c0c6fc4e50280c09',blob:'4cb373801a379faac3c8bc2f3c2d3fb5b766817e',sha256:'7cf7bee8b9e3b54a5aa7dfa42d72f42ff73f3e80f02d137a0b027e0922c64bf8'};
const retainedStage8V23Authority={ref:'2759a75ab1e12effcc8798aacaa11e294b4dfb0f',blob:'a4dc95abedb21ff6f7f6882f4c1a71d41b692440',sha256:'07b7e792dba55ade6407a8125684b3b4a7733ec838ea85055429c7625191e8fa'};
const retainedStage8V24Authority={ref:'e0abee1f8940ee0f352db60ffe338bde869c2f83',blob:'bb430eee794819333c24c9df2bcc1f0a94f06428',sha256:'5e20461a9be0888b4e3f9d835216d73017f8af8e85b7c187966ec6f5730db198'};
const expectedAuthority={ref:'8ca7982a47763ada58eba9eeb381d8893ff47dcb',blob:'4afa73a54ee6c9aee9ea04c9f75281a9a5ae71c0',sha256:'ad00806463d05b38d8d64048d26ca2182ee0bc67e5fb8c6723ee1879d5db9cda'};
ensurePinnedAuthorityRecord(expectedAuthority);
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
 for(const record of [retainedStage8Authority,retainedStage8V2Authority,retainedStage8V3Authority,retainedStage8V4Authority,retainedStage8V5Authority,retainedStage8V6Authority,retainedStage8V7Authority,retainedStage8V8Authority,retainedStage8V9Authority,retainedStage8V10Authority,retainedStage8V11Authority,retainedStage8V12Authority,retainedStage8V13Authority,retainedStage8V14Authority,retainedStage8V15Authority,retainedStage8V16Authority,retainedStage8V17Authority,retainedStage8V18Authority,retainedStage8V19Authority,retainedStage8V20Authority,retainedStage8V21Authority,retainedStage8V22Authority,retainedStage8V23Authority,retainedStage8V24Authority,expectedAuthority]){assert.equal(sourceGit(['rev-parse',record.ref+':'+authority]).toString().trim(),record.blob);const bytes=sourceGit(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);}
 const actual=readFileSync(authority);assert.equal(sourceGit(['rev-parse','HEAD:'+authority]).toString().trim(),expectedAuthority.blob);assert(actual.equals(sourceGit(['cat-file','blob',expectedAuthority.blob])));assert.equal(createHash('sha256').update(actual).digest('hex'),expectedAuthority.sha256);
});
test('actual current execution passes while unchanged R5 executes at literal A7',()=>{
 assert.equal(verifyParallelSource(),true);
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const output=execFileSync(process.execPath,['--test','--test-reporter=tap','--test-concurrency=1','tests/milestone100-20261114/source-stage8-saved-actions-claim.test.mjs','tests/milestone100-20261114/source-stage8-test-only-successor.test.mjs','tests/milestone100-20261114/source-stage8-guard-selection.test.mjs','tests/milestone100-20261114/source-preflight-stage8.test.mjs','tests/milestone100-20261114/source-stage8-shortest-guard.test.mjs','tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs','tests/milestone100-20261114/source-stage8-shortest-fixture.test.mjs','tests/milestone100-20261114/source-stage8-publication-transport.test.mjs','tests/milestone100-20261114/source-stage8-direct-commit-cache.test.mjs','tests/milestone100-20261114/source-stage8-negative-authority.test.mjs','tests/milestone100-20261114/source-stage8-authority-availability.test.mjs','tests/milestone100-20261114/source-stage8-supplied-lock.test.mjs','tests/ci-rpc-recovery-20261113/source-node.test.mjs'],{env,encoding:'utf8',timeout:45000,maxBuffer:4000000});
 assert.match(output,/# tests 60\b/);assert.match(output,/# pass 60\b/);assert.match(output,/# fail 0\b/);assert.match(output,/# skipped 0\b/);assert.match(output,/# cancelled 0\b/);
});
const capture=JSON.parse(readFileSync(capturePath));
for(const record of capture.applicationSources)test('current source reader rejects changed exact app bytes '+record.path,()=>assert.throws(()=>verifyParallelSource(name=>name===record.path?Buffer.from('plausible changed implementation'):readFileSync(name)),/Current target source differs|Independent current target bytes differ|Current factory bytes differ/));
for(const path of ['tests/parallel-source-20261110/core.mjs','tests/parallel-source-20261110/bootstrap.mjs','tests/parallel-source-20261110/baseline-probe.mjs','tests/parallel-source-20261110/historical-tests.mjs','tests/parallel-source-20261110/git-reader.mjs','tests/parallel-source-20261110/source-object-lock.mjs','scripts/product-completion-lineage.mjs'])test('no-op validator cannot nominate itself '+path,()=>{
 assert.throws(()=>verifyParallelSource(name=>name===path?Buffer.from('export function verify(){return true}'):readFileSync(name)),/Independent current target bytes differ/);
 if(path==='tests/parallel-source-20261110/git-reader.mjs'){
  const runtime='tests/next-cohort-20261110/source/retained-runtime.mjs',old=sourceGit(['cat-file','blob','99666fd1d09a2b7f782b05d4dbd9f9656be08eea']);
  for(const bytes of [Buffer.from('tampered owned runtime'),old])assert.throws(()=>verifyParallelSource(name=>name===runtime?bytes:readFileSync(name)),/Independent current target bytes differ/);
 }
});
test('a closed asynchronous-style target map supplies every current byte without a workspace fallback',()=>{
 const names=new Set([...capture.currentSources,...capture.applicationSources].map(r=>r.path));names.add(capturePath);names.add('tests/milestone100-20261114/source-stage8-guard-policy.mjs');const target=new Map([...names].map(p=>[p,readFileSync(p)])),seen=new Set();
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

test('mandatory source guard regressions exercise exact source and immutable availability without skips',async context=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const files=[['source-app-stage5.test.mjs',7],['source-app-stage5-availability.test.mjs',5],['source-authority-preload.test.mjs',6],['source-preflight.test.mjs',5],['source-preflight-stage.test.mjs',5],['source-test-stage6.test.mjs',6],['tests/next-cohort-20261110/source/runtime-evidence-batch.test.mjs',11],['tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs',6],['tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs',6],['tests/milestone100-20261114/authority-observation-collector.test.mjs',23],['tests/milestone100-20261114/source-stage8-authority-scope.test.mjs',10],['tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs',9],['tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs',9],['tests/milestone100-20261114/source-stage8-negative-factory.test.mjs',9],['tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs',9],['tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs',9]];
 const run=([file])=>new Promise((resolve,reject)=>{
  if(context.signal.aborted){reject(new Error('Mandatory source guard queue cancelled: '+file,{cause:context.signal.reason}));return;}
  // Inherit the outer verifier's owned process group; never detach nested children.
  execFile(process.execPath,[file.startsWith('tests/')?file:'tests/completion-wave-20261113/'+file],{env,encoding:'utf8',timeout:30000,maxBuffer:1000000,signal:context.signal},(error,stdout,stderr)=>{if(error)reject(Object.assign(error,{stdout,stderr}));else resolve(stdout);});
 });
 const results=new Map(),cold=files.find(([file])=>file==='source-app-stage5-availability.test.mjs');
 // The original eight-worker availability case owns its entire window alone.
 results.set(cold[0],(await Promise.allSettled([run(cold)]))[0]);
 const remaining=files.filter(row=>row!==cold);
 let nextIndex=0;
 const worker=async()=>{while(nextIndex<remaining.length){const row=remaining[nextIndex++],result=(await Promise.allSettled([run(row)]))[0];results.set(row[0],result);}};
 await Promise.all([worker(),worker()]);
 const failures=[];
 // Report every child in the original declared order, even when an earlier child failed.
 for(const [file,count]of files){
  const result=results.get(file);
  try{
   if(result.status==='rejected'){const error=result.reason;throw new Error('Mandatory source guard child failed: '+file+'\nstdout:\n'+(error.stdout??'')+'\nstderr:\n'+(error.stderr??''),{cause:error});}
   const tap=result.value;
   for(const [name,value]of [['tests',count],['pass',count],['fail',0],['skipped',0]])assert.match(tap,new RegExp('# '+name+' '+value+'\\b'));
   if(file.startsWith('tests/'))assert.match(tap,/# cancelled 0\b/);
  }catch(error){failures.push(error);}
 }
 if(failures.length===1)throw failures[0];
 if(failures.length>1)throw new AggregateError(failures,'Mandatory source guard children failed: '+failures.map(error=>error.message).join('\n'));
});
