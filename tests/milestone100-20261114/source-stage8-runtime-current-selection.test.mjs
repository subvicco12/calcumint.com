import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
const modulePath='./source-stage8-runtime-current-selection.mjs';
const capturePath='docs/next-engineering-20261115/source/guard-capture-stage9-fixture.json',runtimePath='tests/next-cohort-20261110/source/retained-runtime.mjs';
const captureBytes=readFileSync(capturePath),runtimeBytes=readFileSync(runtimePath),capture=JSON.parse(captureBytes),row=capture.currentSources.find(row=>row.path===runtimePath);
const native=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']}),head=native(['rev-parse','HEAD']).toString().trim();
async function fixture({read=name=>readFileSync(name),git=native,root=process.cwd()}={}){
 const {assertCurrentRuntimeGuard}=await import(modulePath);return()=>assertCurrentRuntimeGuard({root,read,git});
}
test('actual HEAD and physical bytes use the fixed admitted current row while historical95 stays immutable',async()=>{
 const run=await fixture();assert.equal(run(),undefined);assert.equal(row.blob,'b1435076f4a2beaa1afeb66f77101a73408e26e9');
 const old=JSON.parse(readFileSync('docs/parallel-source-20261110/capture-revision95.json')).currentSources.find(row=>row.path===runtimePath);assert.equal(old.blob,'9994a48ea83a831a0159123da5bc377901fbe5ce');assert.notEqual(old.blob,row.blob);
});
test('capture tamper or nonbinary metadata refuses before nominated object or target reads',async()=>{
 for(const bytes of [Buffer.from('{}'),'not binary']){const calls=[],run=await fixture({read:name=>{calls.push(name);return name===capturePath?bytes:readFileSync(name);}});assert.throws(run,/Independent current runtime capture differs/);assert.deepEqual(calls,[capturePath]);}
});
test('path ref or blob changes inside a same-size capture cannot nominate a successor',async()=>{
 for(const [before,after]of [[runtimePath,runtimePath.replace('retained','detained')],[row.ref,'a'.repeat(40)],[row.blob,'b'.repeat(40)]]){const changed=Buffer.from(captureBytes.toString().replace(before,after));assert.equal(changed.length,captureBytes.length);const run=await fixture({read:p=>p===capturePath?changed:readFileSync(p)});assert.throws(run,/Independent current runtime capture differs/);}
});
test('either captured or canonical immutable ref path object substitution refuses',async()=>{
 for(const ref of [row.ref,'7881c915a47f898e26ca9f85a6c62dbd236a0db3']){const run=await fixture({git:args=>args[0]==='rev-parse'&&args[1]===ref+':'+runtimePath?Buffer.from('f'.repeat(40)+'\n'):native(args)});assert.throws(run,/Current runtime immutable path differs/);}
});
test('actual HEAD path cannot be replaced by valid historical95 bytes',async()=>{
 const run=await fixture({git:args=>args[0]==='rev-parse'&&args[1]===head+':'+runtimePath?Buffer.from('9994a48ea83a831a0159123da5bc377901fbe5ce\n'):native(args)});assert.throws(run,/Actual current runtime HEAD object differs/);
});
test('current reader substitution and physical original95 reversion both refuse',async()=>{
 const old=native(['cat-file','blob','9994a48ea83a831a0159123da5bc377901fbe5ce']);
 const run=await fixture({read:p=>p===runtimePath?old:readFileSync(p)});assert.throws(run,/Current runtime reader bytes differ/);
 const root=mkdtempSync(join(tmpdir(),'runtime-current-selection-'));try{
  mkdirSync(dirname(join(root,runtimePath)),{recursive:true});writeFileSync(join(root,runtimePath),old);
  const physical=await fixture({root,read:p=>p===runtimePath?runtimeBytes:readFileSync(p),git:args=>args[0]==='rev-parse'&&args[1]==='--show-toplevel'?Buffer.from(root+'\n'):native(args)});assert.throws(physical,/Physical current runtime bytes differ/);
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('native HEAD movement during proof refuses before a current binding can return',async()=>{
 let heads=0;const run=await fixture({git:args=>JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from((heads++===0?head:'a'.repeat(40))+'\n'):native(args)});assert.throws(run,/Actual HEAD moved during current runtime proof/);
});
