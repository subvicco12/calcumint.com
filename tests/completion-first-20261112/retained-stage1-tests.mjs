/** Literal Stage1 tests execute at their real5008 checkout; never current acceptance. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {workflowPolicy} from './workflows-policy.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),baseline='5008aa4cadd77f7a9a5dc1523cace694f3bbdf47';
assert.equal(workflowPolicy.predecessorRef,baseline);
const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:4*1024*1024});
assert.equal(git(['rev-parse','--verify',baseline+'^{commit}']).toString().trim(),baseline);
const temporary=mkdtempSync(join(tmpdir(),'calcumint-historical-stage1-')),tree=join(temporary,'tree');let added=false;
try{
 git(['worktree','add','--detach',tree,baseline]);added=true;
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const tap=execFileSync(process.execPath,['--test','tests/completion-first-20261112/current-stage.test.mjs'],{cwd:tree,env,encoding:'utf8',timeout:60000,maxBuffer:4*1024*1024});
 for(const expected of [/# tests 4\b/,/# pass 4\b/,/# fail 0\b/,/# skipped 0\b/])assert.match(tap,expected);
 process.stdout.write(tap);
}finally{try{if(added)git(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
