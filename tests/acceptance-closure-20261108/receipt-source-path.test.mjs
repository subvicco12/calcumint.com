import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyCapturedSource} from './receipt-source-path.mjs';
const bytes=Buffer.from('synthetic locked package source\n'),sha256=createHash('sha256').update(bytes).digest('hex');
test('verifies the retained cache capture against the same canonical dependency bytes',async()=>{
 const binding=Object.freeze({path:'../batch13-deps/node_modules/zod/index.js',sha256}),reads=[];
 const selected=await verifyCapturedSource(binding,async path=>{reads.push(path);return bytes;});
 assert.deepEqual(reads,['node_modules/zod/index.js']);assert.equal(selected,'node_modules/zod/index.js');assert.equal(binding.path,'../batch13-deps/node_modules/zod/index.js');
});
test('retains byte-for-byte hash rejection after cache relocation',async()=>{
 await assert.rejects(verifyCapturedSource({path:'../batch13-deps/node_modules/zod/index.js',sha256},async()=>Buffer.from('tampered')),/bytes differ/);
});
test('canonical repository and dependency paths remain exact',async()=>{
 for(const path of ['src/lib/math.ts','tests/example.mjs','node_modules/zod/index.js'])assert.equal(await verifyCapturedSource({path,sha256},async()=>bytes),path);
});
test('unknown cache aliases, traversal and absolute paths fail before any read',async()=>{
 for(const path of ['../other-cache/node_modules/zod/index.js','../batch13-deps/node_modules/../../secret','node_modules/../secret','/etc/passwd','C:\\tmp\\secret','../batch13-deps/node_modules/']){
  let calls=0;await assert.rejects(verifyCapturedSource({path,sha256},async()=>{calls++;return bytes;}));assert.equal(calls,0);
 }
});
test('clean checkout reads canonical dependency file without the historical cache directory',async()=>{
 const {mkdtemp,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');const {join}=await import('node:path');const {tmpdir}=await import('node:os');
 const directory=await mkdtemp(join(tmpdir(),'calcumint-capture-relocation-'));
 try{await mkdir(join(directory,'node_modules/zod'),{recursive:true});await writeFile(join(directory,'node_modules/zod/index.js'),bytes);assert.equal(await verifyCapturedSource({path:'../batch13-deps/node_modules/zod/index.js',sha256},path=>readFile(join(directory,path))),'node_modules/zod/index.js');}
 finally{await rm(directory,{recursive:true,force:true});}
});
test('original receipt and dependency lock retain their exact immutable capture bytes',async()=>{
 const {readFile}=await import('node:fs/promises');const {execFileSync}=await import('node:child_process');
 for(const path of ['docs/acceptance-closure-20261108/first-two-auth-receipt.json','package-lock.json']){
  const captured=execFileSync('git',['show','b2d72aa66293b752739b7924745a57a51c4b5acb:'+path],{maxBuffer:8*1024*1024});const current=await readFile(path);assert(current.equals(captured),'Historical source evidence changed: '+path);
 }
});
