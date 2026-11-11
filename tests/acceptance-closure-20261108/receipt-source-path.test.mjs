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

import {readFile as readCurrentSource} from 'node:fs/promises';
import {execFileSync as exactSourceGit} from 'node:child_process';
import {completionBindingDependencies} from '../../scripts/product-completion-lineage.mjs';
const registeredPath='src/lib/registered-snapshot-verification.ts';
const reviewedVerifierRef='f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5';
const reviewedVerifierSHA='24bf6f31ef7283d9fc319598268c1047ff1c58cd95bda787d55b396e9e3bde4c';
const reviewedBinding=Object.freeze({path:registeredPath,sha256:reviewedVerifierSHA});
const sha=source=>createHash('sha256').update(source).digest('hex');
const gitSource=ref=>exactSourceGit('git',['show',ref+':'+registeredPath],{maxBuffer:8*1024*1024});
const boundaryDependency='src/lib/technology-cidr-snapshot-verification.ts';
test('the exact reviewed F042 verifier claim proves actual current source and every supplied dependency',async()=>{
 const original=gitSource(reviewedVerifierRef);assert.equal(sha(original),reviewedVerifierSHA);assert(original.equals(await readCurrentSource(registeredPath)));
 const dependencies=completionBindingDependencies(registeredPath),names=[registeredPath,...dependencies],target=new Map(await Promise.all(names.map(async path=>[path,await readCurrentSource(path)]))),reads=[];
 assert.equal(await verifyCapturedSource(reviewedBinding,async path=>{assert(target.has(path),'Undeclared target reader path: '+path);reads.push(path);return target.get(path);}),registeredPath);
 assert.deepEqual(reads,names);
});
test('both original immutable verifier receipt claims still require the current complete binding',async()=>{
 for(const ref of ['a7a656f71b04b50192485a49b0b56b3fa6bd86b9','7086b85437b025225f5736fb6b849415e518dc08'])assert.equal(await verifyCapturedSource({path:registeredPath,sha256:sha(gitSource(ref))}),registeredPath);
});
test('an arbitrary registered verifier claim is refused before dependency resolution',async()=>{
 const reads=[];await assert.rejects(verifyCapturedSource({path:registeredPath,sha256:'0'.repeat(64)},async path=>{reads.push(path);assert.equal(path,registeredPath);return readCurrentSource(path);}),/Captured source historical claim differs/);assert.deepEqual(reads,[registeredPath]);
});
test('the exact F042 claim cannot admit changed current verifier bytes',async()=>{
 await assert.rejects(verifyCapturedSource(reviewedBinding,async path=>path===registeredPath?Buffer.concat([await readCurrentSource(path),Buffer.from('\n// unreviewed current source')]):readCurrentSource(path)),error=>error instanceof Error&&error.message==='Completion current successor differs');
});
test('the exact F042 claim cannot admit a valid historical verifier reversion',async()=>{
 const original=gitSource('a7a656f71b04b50192485a49b0b56b3fa6bd86b9');assert.notEqual(sha(original),reviewedVerifierSHA);
 await assert.rejects(verifyCapturedSource(reviewedBinding,async path=>path===registeredPath?original:readCurrentSource(path)),error=>error instanceof Error&&error.message==='Completion current successor differs');
});
test('the exact F042 claim rejects altered dependency bytes from the same supplied reader',async()=>{
 assert(completionBindingDependencies(registeredPath).includes(boundaryDependency));
 await assert.rejects(verifyCapturedSource(reviewedBinding,async path=>path===boundaryDependency?Buffer.from('unreviewed dependency'):readCurrentSource(path)),error=>error instanceof Error&&error.message==='Completion supplemental source bytes differ: '+boundaryDependency);
});
test('a missing supplied F042 dependency never falls back to the existing workspace file',async()=>{
 assert((await readCurrentSource(boundaryDependency)).length>0);
 await assert.rejects(verifyCapturedSource(reviewedBinding,async path=>{if(path===boundaryDependency)throw Error('Supplied dependency unavailable');return readCurrentSource(path);}),/Supplied dependency unavailable/);
});
