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
