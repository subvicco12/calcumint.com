import {execNativeGit} from '../construction-ci-recovery-20261116/native-git.mjs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeGitReader} from './git-reader.mjs';
import {captureA7Child} from './a7-child-bootstrap.mjs';
export const baselineRef='a7bab5b5534d51cea25ba5ffe4aa9b3630176909';
const root=fileURLToPath(new URL('../../',import.meta.url));
// This owned cumulative proof exceeds the generic128MiB byte envelope. Keep
// generic readers and native callers' original options unchanged. Deadlines and
// all immutable authentication remain in makeGitReader; no observation is cached.
const runtimeGit=(args,options={})=>{
 const cumulativeBatch=args.length===2&&args[0]==='cat-file'&&args[1]==='--batch'&&options.maxBuffer===128*1024*1024&&options.timeout===30000&&Buffer.isBuffer(options.input);
 return execNativeGit(args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024,...options,...(cumulativeBatch?{maxBuffer:192*1024*1024}:{})});
};
export const execCumulativeNativeGit=runtimeGit;
export const sourceGit=makeGitReader(runtimeGit);
let cached;
export function retainedA7Proof(){
 if(cached)return cached;
 const temporary=mkdtempSync(join(tmpdir(),'calcumint-r6-retained-')),tree=join(temporary,'tree');let added=false;
 const env={...process.env};
 for(const name of ['NODE_TEST_CONTEXT','NODE_OPTIONS','NODE_PATH','NODE_COMPILE_CACHE'])delete env[name];
 try{
  sourceGit(['worktree','add','--detach',tree,baselineRef]);added=true;
  const output=join(temporary,'proof.json');
  const launch=captureA7Child({root,tree,git:runtimeGit});
  execFileSync(process.execPath,[...launch.args,output,launch.packet,launch.digest],{cwd:tree,env,stdio:['ignore','pipe','pipe'],timeout:90000,maxBuffer:16*1024*1024});
  launch.check();
  const proof=JSON.parse(readFileSync(output,'utf8'));assert.equal(proof.baseline,baselineRef);assert.equal(proof.passed,true);assert(proof.rows.length>50);cached=proof;return proof;
 }finally{try{if(added)sourceGit(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
}
