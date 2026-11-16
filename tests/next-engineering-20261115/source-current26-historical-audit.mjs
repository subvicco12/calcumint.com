/** Authenticate current32 first; execute the complete original26 suite literally at its immutable source. */
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {proveSourceStage10,assertSourceStage10Stable} from './source-stage10.mjs';
const ref='41dd08636532c4930666c76b109526d293186699';
const files=['tests/next-engineering-20261115/source-current26.test.mjs','tests/next-engineering-20261115/source-exact-current26.mjs','tests/next-engineering-20261115/source-stage10-current26-policy.mjs','docs/next-engineering-20261115/source/stage10-current26.json'];
export function runLiteralCurrent26Audit(){
 const root=process.cwd(),git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024});
 const proof=proveSourceStage10({root,git,read:readFileSync});assert.equal(proof.live.size,32);
 const temporary=mkdtempSync(join(tmpdir(),'calcumint-literal-current26-')),tree=join(temporary,'tree');let added=false;
 try{
  assert.equal(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim(),ref);
  git(['worktree','add','--detach',tree,ref]);added=true;
  assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:tree,encoding:'utf8'}).trim(),ref);
  for(const path of files)assert(readFileSync(join(tree,path)).equals(git(['show',ref+':'+path])),'Literal current26 audit bytes differ');
  const env={...process.env};delete env.NODE_TEST_CONTEXT;
  const output=execFileSync(process.execPath,['--test','--test-reporter=tap','tests/next-engineering-20261115/source-current26.test.mjs'],{cwd:tree,env,encoding:'utf8',maxBuffer:8*1024*1024});
  for(const [field,value]of [['tests',3],['pass',3],['fail',0],['skipped',0],['cancelled',0]])assert.match(output,new RegExp('^# '+field+' '+value+'$','m'));
 }finally{try{if(added)git(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
 assertSourceStage10Stable(proof);return{literalAuditRef:ref,currentPaths:proof.live.size,historicalTests:3};
}
