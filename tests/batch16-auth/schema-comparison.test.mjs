import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
const receipt=JSON.parse(await readFile('docs/full-product-batch16/auth-integrity-receipt.json','utf8'));
const descriptor=receipt.batch16.beforeDescriptor;
async function compare(a,b){const directory=await mkdtemp(path.join(os.tmpdir(),'business-descriptor-'));try{
 const paths=[path.join(directory,'model.json'),path.join(directory,'capture.json')];
 await Promise.all(paths.map((p,i)=>writeFile(p,JSON.stringify(i?b:a))));
 const result=spawnSync(process.execPath,['tests/batch16-auth/compare-schema.mjs',...paths],{encoding:'utf8'});
 if(result.error)throw result.error;return result;
}finally{await rm(directory,{recursive:true,force:true});}}
test('complete scoped descriptors compare equally and genuine differences return exit2',async()=>{
 const reordered=Object.fromEntries(Object.entries(descriptor).reverse());
 const equal=await compare(descriptor,reordered);assert.equal(equal.status,0,equal.stderr);assert.equal(JSON.parse(equal.stdout).equal,true);
 const changed=structuredClone(descriptor);changed.relations[0].rls=!changed.relations[0].rls;
 const different=await compare(descriptor,changed);assert.equal(different.status,2,different.stderr);assert.deepEqual(JSON.parse(different.stdout).differentSections,['relations']);
});
test('empty, incomplete, duplicate and malformed captures never report equality',async()=>{
 const mutations=[()=>({}),d=>{delete d.constraints;return d},d=>({...d,columns:null}),d=>({...d,columns:[...d.columns,d.columns[0]]}),d=>({...d,relations:d.relations.slice(1)}),d=>({...d,scope:'unrelated-capture'}),d=>({...d,extra:'not part of this scope'}),d=>({...d,functions:[...d.functions,d.functions[0]]}),d=>({...d,effectiveTableGrants:d.effectiveTableGrants.slice(1)})];
 for(const mutate of mutations){const value=mutate(structuredClone(descriptor));const result=await compare(value,value);assert.equal(result.status,1,`Malformed descriptors accepted: ${JSON.stringify(value).slice(0,120)} ${result.stdout}`);assert(!result.stdout.includes('"equal": true'));}
});
