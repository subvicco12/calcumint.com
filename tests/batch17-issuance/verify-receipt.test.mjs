import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import os from 'node:os';
const verifier=fileURLToPath(new URL('./verify-receipt.mjs',import.meta.url));
assert(process.env.ISSUANCE_VALID_RECEIPT,'Set ISSUANCE_VALID_RECEIPT to a fresh genuine campaign receipt');
const fixture=JSON.parse(await readFile(process.env.ISSUANCE_VALID_RECEIPT));
test('fresh valid receipt verifies and malformed bindings fail before source reads',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'issuance-verifier-'));
 const run=async(receipt)=>{const target=path.join(dir,'receipt.json');await writeFile(target,JSON.stringify(receipt));try{return {status:0,output:execFileSync(process.execPath,[verifier,target],{encoding:'utf8',stdio:'pipe'})};}catch(error){return {status:error.status,output:String(error.stderr)};}};
 try{
  assert.equal((await run(fixture)).status,0);
  const mutations=[
   r=>{r.sources=[];r.modelProvenance.sources=[];},
   r=>{delete r.sources;},
   r=>{r.sources.pop();},
   r=>{r.modelProvenance.sources.pop();},
   r=>{r.sources.push(r.sources[0]);},
   r=>{r.modelProvenance.sources.push(r.modelProvenance.sources[0]);},
   r=>{r.sources[0].sha256='invalid';},
   r=>{r.sources[0].path='../../must-not-read-sensitive';},
   r=>{r.modelProvenance.sources[0].path='file:///must-not-read-sensitive';},
   r=>{r.checks=Array(10).fill('made up');}
  ];
  for(const mutate of mutations){const r=structuredClone(fixture);mutate(r);const result=await run(r);assert.notEqual(result.status,0);assert.match(result.output,/Invalid receipt/);assert.doesNotMatch(result.output,/ENOENT/);}
 }finally{await rm(dir,{recursive:true,force:true});}
});
