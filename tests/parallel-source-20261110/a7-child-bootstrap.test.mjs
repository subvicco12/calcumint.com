import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {captureA7Child} from './a7-child-bootstrap.mjs';

test('A7 child executable bytes are closed and fail closed',async t=>{
 const temporary=mkdtempSync(join(tmpdir(),'a7-child-test-'));
 const root=join(temporary,'live'),tree=join(temporary,'historical');
 const a7='a7bab5b5534d51cea25ba5ffe4aa9b3630176909';
 const systemGit=(args,cwd=process.cwd())=>execFileSync('git',args,{cwd,stdio:['ignore','pipe','pipe'],timeout:30000,maxBuffer:16*1024*1024});
 const git=args=>systemGit(args,root);
 const worktrees=[];
 t.after(()=>{
  try{for(const path of worktrees.reverse())systemGit(['worktree','remove','--force',path]);}
  finally{rmSync(temporary,{recursive:true,force:true});}
 });
 for(const [path,ref] of [[root,'HEAD'],[tree,a7]]){
  systemGit(['worktree','add','--detach',path,ref]);
  worktrees.push(path);
 }
 const input={root,tree,git};
 const helper=join(root,'tests/parallel-source-20261110/a7-batch-input.mjs');
 const original=readFileSync(helper);
 const launch=(capture,packet=capture.packet,digest=capture.digest)=>{
  const env={...process.env};
  for(const name of ['NODE_TEST_CONTEXT','NODE_OPTIONS','NODE_PATH','NODE_COMPILE_CACHE'])delete env[name];
  return execFileSync(process.execPath,[...capture.args,join(temporary,'proof.json'),packet,digest],{
   cwd:tree,env,stdio:['ignore','pipe','pipe'],timeout:90000,maxBuffer:16*1024*1024,
  });
 };
 await t.test('missing module refuses before launching',()=>{
  rmSync(helper);
  try{assert.throws(()=>captureA7Child(input),{code:'ENOENT'});}
  finally{writeFileSync(helper,original);}
 });
 await t.test('substituted live module refuses even with matching Git bindings',()=>{
  writeFileSync(helper,'unexpected bytes');
  try{assert.throws(()=>captureA7Child(input),/Live A7 module differs/);}
  finally{writeFileSync(helper,original);}
 });
 await t.test('changed module between capture and child import refuses',()=>{
  const capture=captureA7Child(input);
  writeFileSync(helper,'moved after capture');
  try{assert.throws(()=>launch(capture),/A7 runtime module moved/);}
  finally{writeFileSync(helper,original);}
 });
 await t.test('unexpected runtime import refuses in a closed test packet',()=>{
  const capture=captureA7Child(input);
  const policy=JSON.parse(Buffer.from(capture.packet,'base64'));
  policy.edges=policy.edges.filter(edge=>edge.specifier!=='./a7-batch-input.mjs');
  const packet=Buffer.from(JSON.stringify(policy));
  assert.throws(()=>launch(capture,packet.toString('base64'),createHash('sha256').update(packet).digest('hex')),/Unexpected A7 import/);
 });
 await t.test('the complete original historical probe executes from the captured graph',()=>{
  const capture=captureA7Child(input);
  launch(capture);
  capture.check();
  const proof=JSON.parse(readFileSync(join(temporary,'proof.json'),'utf8'));
  assert.equal(proof.baseline,a7);
  assert.equal(proof.passed,true);
  assert(proof.rows.length>50);
 });
});
