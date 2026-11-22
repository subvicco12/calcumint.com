import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync,readdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {execA7BatchInput} from './a7-batch-input.mjs';
import {makeGitReader} from './git-reader.mjs';

function fixture(t){
 const root=mkdtempSync(join(tmpdir(),'a7-input-test-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});
 git('init','-q');
 writeFileSync(join(root,'blob'),'a'.repeat(8192));
 const id=git('hash-object','-w','blob').toString().trim();
 const options={cwd:root};
 const invoke=(args,overrides)=>execA7BatchInput(args,{...options,...overrides},root);
 return {root,id,invoke};
}

test('real Git batch completes with EOF and removes request files',t=>{
 const {root,id,invoke}=fixture(t);
 const reader=makeGitReader(invoke);
 reader.preloadBlobs([id,id]);
 assert.equal(reader(['cat-file','blob',id]).length,8192);
 assert(!readdirSync(root).some(name=>name.startsWith('calcumint-a7-batch-')));
});

test('missing, substituted and corrupt objects fail the original parser',t=>{
 const {id,invoke}=fixture(t);
 assert.throws(()=>makeGitReader(invoke).preloadBlobs(['0'.repeat(40)]),/identity\/type unavailable/);
 for(const substitution of [true,false]){
  const reader=makeGitReader((args,options)=>{
   const bytes=invoke(args,options);
   bytes[substitution?0:bytes.indexOf(10)+1]^=1;
   return bytes;
  });
  assert.throws(()=>reader.preloadBlobs([id]),/identity\/type unavailable|content address differs/);
 }
});

test('oversized output propagates ENOBUFS and removes request files',t=>{
 const {root,id,invoke}=fixture(t);
 assert.throws(()=>invoke(['cat-file','--batch'],{input:Buffer.from(id+'\n'),timeout:1000,maxBuffer:64}),{code:'ENOBUFS'});
 assert(!readdirSync(root).some(name=>name.startsWith('calcumint-a7-batch-')));
});

test('timeout terminates the Git child and removes request files',t=>{
 const {root,id,invoke}=fixture(t);
 const pidFile=join(root,'pid');
 writeFileSync(join(root,'git'),'#!/bin/sh\nprintf "%s" "$$" > "$A7_TEST_PID"\nexec /bin/sleep 20\n',{mode:0o700});
 assert.throws(()=>invoke(['cat-file','--batch'],{
  input:Buffer.from(id+'\n'),timeout:300,maxBuffer:1024,
  env:{...process.env,PATH:root+':'+process.env.PATH,A7_TEST_PID:pidFile},
 }),{code:'ETIMEDOUT'});
 assert.throws(()=>process.kill(Number(readFileSync(pidFile,'utf8')),0),{code:'ESRCH'});
 assert(!readdirSync(root).some(name=>name.startsWith('calcumint-a7-batch-')));
});
