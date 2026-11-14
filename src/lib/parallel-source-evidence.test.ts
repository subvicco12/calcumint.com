import {factoryPolicy} from '../../tests/calculator-factory-source-20261112/policy.mjs';
import {appStage5Policy} from '../../tests/completion-wave-20261113/source-app-stage5-policy.mjs';
import {it,expect} from 'vitest';
import {runSourceNode as runNode} from '../../tests/ci-rpc-recovery-20261113/source-node.mjs';
import {mkdtempSync,readFileSync,rmSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
it('executes fresh current-source, full-authority, reader, reversion and nomination negatives',async(ctx)=>{
 const directory=mkdtempSync(join(tmpdir(),'calcumint-r6-cases-')),output=join(directory,'cases.tap'),env={...process.env};delete env.NODE_TEST_CONTEXT;
 let eventLoopTicks=0;const heartbeat=setInterval(()=>{eventLoopTicks++;},10);
 try{
  try {
  await runNode(['--test','--test-concurrency=2','--test-reporter=tap','--test-reporter-destination='+output,'tests/parallel-source-20261110/application-successor.test.mjs','tests/parallel-source-20261110/current.test.mjs','tests/parallel-source-20261110/git-reader.test.mjs','tests/parallel-source-20261110/retained-vitest.test.mjs','tests/parallel-source-20261110/source-object-lock.test.mjs','tests/parallel-source-20261110/retained-vitest-diagnostics.test.mjs','tests/parallel-source-20261110/historical-group.test.mjs'],{env,signal:ctx.signal,stdio:'inherit',timeout:150000});
  } catch(cause) {
    let diagnostic='TAP report unavailable';
    try{diagnostic=readFileSync(output,'utf8');}catch{}
    throw new Error('Exact source Node suite failed; retained TAP follows:\n'+diagnostic,{cause});
  }
  expect(eventLoopTicks).toBeGreaterThan(0);
  // Preserve all 67 original cases and require every finite new source case plus its authority case.
  const requiredCases=67+factoryPolicy.paths.length+1+appStage5Policy.paths.length+5;
  const tap=readFileSync(output,'utf8');expect(tap).toMatch(new RegExp('# tests '+requiredCases+'\\b'));expect(tap).toMatch(new RegExp('# pass '+requiredCases+'\\b'));expect(tap).toMatch(/# fail 0\b/);
 }finally{clearInterval(heartbeat);rmSync(directory,{recursive:true,force:true});}
},160000);

it('executes the actual shortest-publication CI consumer with current immutable graph edges',async(ctx)=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const output=await runNode(['scripts/check-shortest-publication20.mjs'],{env,signal:ctx.signal,encoding:'utf8',timeout:60000,maxBuffer:4000000});
 expect(JSON.parse(output)).toMatchObject({identities:20,callerBindings:20,canonicalAccepted:0,publicationEligible:0,releaseHold:true});
 const directory=mkdtempSync(join(tmpdir(),'calcumint-shortest-current-')),report=join(directory,'cases.tap');
 try{
  await runNode(['--test','--test-reporter=tap','--test-reporter-destination='+report,'tests/shortest-publication-20/caller-lineage.test.mjs','tests/shortest-publication-20/frequency-presentation-lineage.test.mjs','tests/shortest-publication-20/completion-lineage.test.mjs'],{env,signal:ctx.signal,stdio:'inherit',timeout:60000});
  const tap=readFileSync(report,'utf8');expect(tap).toMatch(/# tests 36\b/);expect(tap).toMatch(/# pass 36\b/);expect(tap).toMatch(/# fail 0\b/);expect(tap).toMatch(/# skipped 0\b/);
 }finally{rmSync(directory,{recursive:true,force:true});}
},65000);

it('executes the actual six-candidate CI lineage consumer with exact tamper refusals',async(ctx)=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const directory=mkdtempSync(join(tmpdir(),'calcumint-six-lineage-')),report=join(directory,'cases.tap');
 try{
  await runNode(['--test','--test-reporter=tap','--test-reporter-destination='+report,'tests/financial-safety-lineage.test.mjs','tests/product-completion-lineage.test.mjs','tests/source-lineage-bootstrap.test.mjs'],{env,signal:ctx.signal,stdio:'inherit',timeout:60000});
  const tap=readFileSync(report,'utf8');expect(tap).toMatch(/# tests 43\b/);expect(tap).toMatch(/# pass 43\b/);expect(tap).toMatch(/# fail 0\b/);expect(tap).toMatch(/# skipped 0\b/);
 }finally{rmSync(directory,{recursive:true,force:true});}
},65000);

it('executes the actual first20 publication manifest consumer and successor refusal cases',async(ctx)=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const result=await runNode(['scripts/first20-publication/evidence.mjs','--check'],{env,signal:ctx.signal,encoding:'utf8',timeout:60000,maxBuffer:4000000});
 expect(JSON.parse(result)).toMatchObject({firstWave:20,formalQaPassesAdded:0,newFullCriterionAcceptances:0,newlyPublicationEligible:0});
 const directory=mkdtempSync(join(tmpdir(),'calcumint-first20-manifest-')),report=join(directory,'cases.tap');
 try{
  await runNode(['--test','--test-reporter=tap','--test-reporter-destination='+report,'tests/first20-publication/evidence.test.mjs','tests/first20-publication/source-admission.test.mjs'],{env,signal:ctx.signal,stdio:'inherit',timeout:60000});
  const tap=readFileSync(report,'utf8');expect(tap).toMatch(/# tests 22\b/);expect(tap).toMatch(/# pass 22\b/);expect(tap).toMatch(/# fail 0\b/);expect(tap).toMatch(/# skipped 0\b/);
 }finally{rmSync(directory,{recursive:true,force:true});}
},65000);

it('executes the actual calculator-sprint source consumers with strict Git refusal diagnostics',async(ctx)=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const sourceDirectory='tests/calculator-sprint-20261108',files=readdirSync(sourceDirectory).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>sourceDirectory+'/'+name);
 expect(files).toHaveLength(5);
 const directory=mkdtempSync(join(tmpdir(),'calcumint-sprint-current-')),report=join(directory,'cases.tap');
 try{
  await runNode(['--test','--test-reporter=tap','--test-reporter-destination='+report,...files],{env,signal:ctx.signal,stdio:'inherit',timeout:60000});
  const tap=readFileSync(report,'utf8');expect(tap).toMatch(/# tests 32\b/);expect(tap).toMatch(/# pass 32\b/);expect(tap).toMatch(/# fail 0\b/);expect(tap).toMatch(/# skipped 0\b/);
 }finally{rmSync(directory,{recursive:true,force:true});}
},65000);

it('executes retained and exact-current authenticated receipt source claims with provenance refusals',async(ctx)=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const directory=mkdtempSync(join(tmpdir(),'calcumint-receipt-source-')),report=join(directory,'cases.tap');
 const files=readdirSync('tests/acceptance-closure-20261108').filter(name=>name.endsWith('.test.mjs')).sort().map(name=>'tests/acceptance-closure-20261108/'+name);
 try{
  await runNode(['--test','--test-reporter=tap','--test-reporter-destination='+report,...files],{env,signal:ctx.signal,stdio:'inherit',timeout:60000});
  const tap=readFileSync(report,'utf8'),count=98+(env.FIRST_TWO_FRESH_RECEIPT?1:0);
  expect(tap).toMatch(new RegExp('# tests '+count+'\\b'));expect(tap).toMatch(new RegExp('# pass '+count+'\\b'));expect(tap).toMatch(/# fail 0\b/);expect(tap).toMatch(/# skipped 0\b/);
 }catch(error){let diagnostic='';try{diagnostic=readFileSync(report,'utf8');}catch{}throw new Error('Actual authenticated receipt source group failed\n'+diagnostic,{cause:error});
 }finally{rmSync(directory,{recursive:true,force:true});}
},65000);
