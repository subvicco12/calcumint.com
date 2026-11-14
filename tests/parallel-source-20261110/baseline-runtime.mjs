import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeGitReader} from './git-reader.mjs';
export const baselineRef='a7bab5b5534d51cea25ba5ffe4aa9b3630176909';
const root=fileURLToPath(new URL('../../',import.meta.url));
export const sourceGit=makeGitReader((args,options={})=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024,...options}));
let cached;
export function retainedA7Proof(){
 if(cached)return cached;
 const temporary=mkdtempSync(join(tmpdir(),'calcumint-r6-retained-')),tree=join(temporary,'tree');let added=false;
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 try{
  sourceGit(['worktree','add','--detach',tree,baselineRef]);added=true;
  const output=join(temporary,'proof.json');
  execFileSync(process.execPath,[join(root,'tests/parallel-source-20261110/baseline-probe.mjs'),output],{cwd:tree,env,stdio:['ignore','pipe','pipe'],timeout:90000,maxBuffer:16*1024*1024});
  const proof=JSON.parse(readFileSync(output,'utf8'));assert.equal(proof.baseline,baselineRef);assert.equal(proof.passed,true);assert(proof.rows.length>50);cached=proof;return proof;
 }finally{try{if(added)sourceGit(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
}
