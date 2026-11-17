/** Execute original assertions at literal A7; register their unchanged results as explicitly historical cases. */
import assert from 'node:assert/strict';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyParallelSource} from './core.mjs';
import {baselineRef,sourceGit} from './baseline-runtime.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
export const historicalEntries=Object.freeze([
 'tests/p0-decision-contracts/next-five-runtime-successor.test.mjs',
 'tests/p0-decision-contracts/next-cohort-runtime-successor.test.mjs',
 'tests/p0-decision-contracts/business-current-source.test.mjs',
 'tests/next-cohort-20261110/source/caller-stage.test.mjs',
 'tests/next-cohort-20261110/source/current-anchor.test.mjs',
 'tests/next-cohort-20261110/source/retained-stage1.test.mjs',
 'tests/publication-workflows-20261109/source-evolution.test.mjs',
 'tests/first-five-20261109/source-lineage.test.mjs',
 'tests/first-five-20261109/crossed-dependency-source.test.mjs',
 'tests/first-five-20261109/workflow-budget.test.mjs',
 'tests/first-five-20261109/artifact-file.test.mjs',
 'tests/first-five-20261109/lineage-portability.test.mjs',
 'tests/ci-gate-recovery/batch17-budget-successor.test.mjs',
 'tests/first-five-20261109/accepted-evolution-guard.test.mjs',
 'tests/acceptance-closure-20261108/converter-final-source.test.mjs',
]);
export function registerRetainedA7Tests(url){
 const entry=relative(root,fileURLToPath(url));assert(historicalEntries.includes(entry),'Only exact retained source suites may execute');
 assert.equal(verifyParallelSource(),true,'Current source qualification must pass BEFORE historical execution');
 const temporary=mkdtempSync(join(tmpdir(),'calcumint-a7-tests-')),tree=join(temporary,'tree'),output=join(temporary,'original.tap');let added=false;
 try{
  sourceGit(['worktree','add','--detach',tree,baselineRef]);added=true;
  assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:tree,encoding:'utf8'}).trim(),baselineRef);
  assert(readFileSync(join(tree,entry)).equals(sourceGit(['show',baselineRef+':'+entry])),'Original test bytes differ');
  const env={...process.env,FORCE_COLOR:'0'};delete env.NODE_TEST_CONTEXT;
  try{execFileSync(process.execPath,['--test','--test-reporter=tap','--test-reporter-destination='+output,entry],{cwd:tree,env,stdio:'inherit',timeout:40000});}
  catch(error){throw Error('Original retained A7 suite failed: '+entry+'\n'+(readFileSync(output,'utf8')),{cause:error});}
  const tap=readFileSync(output,'utf8');assert.match(tap,/# fail 0(?:\r?\n|$)/);assert.match(tap,/# skipped 0(?:\r?\n|$)/);
  const count=Number(/# tests (\d+)/.exec(tap)?.[1]),cases=[...tap.matchAll(/^(ok|not ok) \d+ - (.+)$/gm)].map(m=>({status:m[1],name:m[2]}));assert(count>0);assert.equal(cases.length,count,'Every original assertion case must remain represented');
  for(const result of cases)test('RETAINED A7 — '+result.name,()=>assert.equal(result.status,'ok','Complete original assertion case executes in literal A7; current source has separate qualification'));
 }finally{try{if(added)sourceGit(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
}

// One finite original group avoids seven redundant current qualification/checkouts.
// The original registerRetainedA7Tests implementation above remains byte-identical.
import {createHash} from 'node:crypto';
const firstFiveDescriptorPath='docs/parallel-source-20261110/recovery/first-five-group.json';
const firstFiveDescriptorSHA='46385923997449cf96ab026f29db4371823d042a08588f546ad4ea8680a95355';
const firstFiveEntries=Object.freeze([
 'tests/first-five-20261109/source-lineage.test.mjs',
 'tests/first-five-20261109/crossed-dependency-source.test.mjs',
 'tests/first-five-20261109/workflow-budget.test.mjs',
 'tests/first-five-20261109/artifact-file.test.mjs',
 'tests/first-five-20261109/lineage-portability.test.mjs',
 'tests/ci-gate-recovery/batch17-budget-successor.test.mjs',
 'tests/first-five-20261109/accepted-evolution-guard.test.mjs',
]);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export function runFirstFiveGroup(){
 assert.equal(verifyParallelSource(),true,'Current source qualification must pass BEFORE retained group execution');
 const beforeHead=sourceGit(['rev-parse','HEAD']).toString().trim();
 const raw=readFileSync(join(root,firstFiveDescriptorPath));assert.equal(digest(raw),firstFiveDescriptorSHA,'Fixed original group descriptor differs');
 const descriptor=JSON.parse(raw);assert.equal(descriptor.sourceGit,baselineRef);assert.equal(descriptor.caseCount,21);assert.equal(descriptor.historical,true);assert.equal(descriptor.originalAssertionsChanged,false);assert.equal(descriptor.productionWrites,false);assert.equal(descriptor.certificationGranted,false);assert.deepEqual(descriptor.paths.map(row=>row.path),firstFiveEntries);assert.equal(descriptor.caseNames.length,21);
 const temporary=mkdtempSync(join(tmpdir(),'calcumint-a7-first-five-group-')),tree=join(temporary,'tree'),output=join(temporary,'original.tap');let added=false;
 try{
  sourceGit(['worktree','add','--detach',tree,baselineRef]);added=true;
  const checkOriginal=()=>{
   assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:tree,encoding:'utf8'}).trim(),baselineRef,'Real literal A7 group checkout required');
   for(const row of descriptor.paths){assert.equal(row.ref,baselineRef);assert.equal(sourceGit(['rev-parse',baselineRef+':'+row.path]).toString().trim(),row.blob);const original=sourceGit(['cat-file','blob',row.blob]),actual=readFileSync(join(tree,row.path));assert.equal(original.length,row.bytes);assert.equal(digest(original),row.sha256);assert(actual.equals(original),'Original group source bytes changed: '+row.path);}
  };
  checkOriginal();const env={...process.env,FORCE_COLOR:'0'};delete env.NODE_TEST_CONTEXT;let failure;
  try{execFileSync(process.execPath,['--test','--test-reporter=tap','--test-reporter-destination='+output,...firstFiveEntries],{cwd:tree,env,stdio:'inherit',timeout:40000});}catch(error){failure=error;}
  let tap;try{tap=readFileSync(output,'utf8');}catch(error){if(!failure)throw error;tap='Original TAP unavailable: '+String(error);}
  checkOriginal();assert.equal(verifyParallelSource(),true,'Current source qualification must pass AFTER retained group execution');assert.equal(sourceGit(['rev-parse','HEAD']).toString().trim(),beforeHead,'Current source HEAD changed during retained group');
  if(failure)throw Error('Original retained A7 first-five group failed\n'+tap,{cause:failure});
  for(const [key,value]of[['tests',21],['pass',21],['fail',0],['skipped',0],['cancelled',0],['todo',0]])assert.match(tap,new RegExp('^# '+key+' '+value+'(?:\\r?\\n|$)','m'),'Complete original group result required: '+key);
  const cases=[...tap.matchAll(/^(ok|not ok) \d+ - (.+)$/gm)].map(match=>({status:match[1],name:match[2]}));assert.equal(cases.length,21);assert(cases.every(row=>row.status==='ok'),'Every original group case must pass');assert.deepEqual(cases.map(row=>row.name).sort(),[...descriptor.caseNames].sort(),'Every original exact case identity must execute');
  return {tap,diagnostic:{scope:'RETAINED_ORIGINAL_A7_NOT_CURRENT_ACCEPTANCE',sourceGit:baselineRef,currentHead:beforeHead,currentBefore:true,currentAfter:true,originalCases:21,descriptorSHA256:firstFiveDescriptorSHA,tapSHA256:digest(Buffer.from(tap))}};
 }finally{try{if(added)sourceGit(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 assert.deepEqual(process.argv.slice(2),['--first-five-group'],'Only the exact fixed first-five group CLI is authorized');
 const result=runFirstFiveGroup();process.stdout.write(result.tap);process.stdout.write('# current-before-after '+JSON.stringify(result.diagnostic)+'\n');
}
