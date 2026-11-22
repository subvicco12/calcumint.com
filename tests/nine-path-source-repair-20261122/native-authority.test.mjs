import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {nativeNinePathAuthorityInput,verifyNinePathRetainedCore} from './proof.mjs';

const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});
const headQuery=['rev-parse','--verify','HEAD^{commit}'];
const nativeHead=git(headQuery).toString().trim();
const core='tests/parallel-source-20261110/core.mjs';
const historical='0fd467880b5b0142898d3010c4d3ab9fe1b64958';
const input={read:readFileSync,root:process.cwd()};

test('ordinary or lookalike readers have no native authority capability',()=>{
 assert.equal(nativeNinePathAuthorityInput(readFileSync,git),undefined);
 assert.equal(nativeNinePathAuthorityInput(readFileSync,args=>git(args)),undefined);
});
test('a historical core blob is not accepted as the native authority blob',async()=>{
 const historicalBlob=git(['rev-parse',historical+':'+core]);
 assert.notEqual(historicalBlob.toString(),git(['rev-parse',nativeHead+':'+core]).toString());
 await assert.rejects(verifyNinePathRetainedCore({...input,git:args=>
  args[0]==='rev-parse'&&args[1]===nativeHead+':'+core?historicalBlob:git(args)
 }),/Independent parallel HEAD authority differs: tests\/parallel-source-20261110\/core\.mjs/);
});
test('native HEAD movement during current authority verification is refused',async()=>{
 let enteredAuthority=false;
 await assert.rejects(verifyNinePathRetainedCore({...input,git:args=>{
  if(args[0]==='rev-parse'&&args[1]===nativeHead+':'+core)enteredAuthority=true;
  if(enteredAuthority&&args.join(' ')===headQuery.join(' '))return Buffer.from(historical+'\n');
  return git(args);
 }}),/Native HEAD moved during current authority verification/);
});
