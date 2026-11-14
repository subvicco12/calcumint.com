import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';
const content=Buffer.from('tree '+'a'.repeat(40)+'\n\nindependent immutable commit fixture\n');
const identity=(type,bytes)=>createHash('sha1').update(Buffer.from(`${type} ${bytes.length}\0`)).update(bytes).digest('hex');
const id=identity('commit',content),query=['cat-file','commit',id];

test('direct exact commit reads use one verified transport request and defensive copies',()=>{
 let calls=0;const supplied=Buffer.from(content),reader=makeGitReader(args=>{assert.deepEqual(args,query);calls++;return supplied;});
 const first=reader(query);assert(first.equals(content));first.fill(0);supplied.fill(0);
 assert(reader(query).equals(content));assert.equal(calls,1);
});
test('wrong commit content is rejected without installing a cache entry',()=>{
 let calls=0,value=Buffer.from('substituted commit');const reader=makeGitReader(()=>{calls++;return value;});
 assert.throws(()=>reader(query),/commit content address differs/);value=content;
 assert(reader(query).equals(content));assert(reader(query).equals(content));assert.equal(calls,2);
});
test('wrong object type identity, nonbinary output and transport errors never install entries',()=>{
 const blobId=identity('blob',content);let calls=0;const wrong=makeGitReader(()=>{calls++;return content;});
 for(let n=0;n<2;n++)assert.throws(()=>wrong(['cat-file','commit',blobId]),/commit content address differs/);assert.equal(calls,2);
 for(const invoke of [()=>content.toString(),()=>{throw Error('missing exact commit');}]){const reader=makeGitReader(invoke);for(let n=0;n<2;n++)assert.throws(()=>reader(query),/binary Buffer|missing exact commit/);}
});
test('explicit options retain the original transport behavior and bypass immutable caching',()=>{
 const observed=[],reader=makeGitReader((args,options)=>{observed.push({args,options});return content;}),options={maxBuffer:4096};
 reader(query);reader(query,options);reader(query,options);reader(query);
 assert.equal(observed.length,3);assert.equal(observed[1].options,options);assert.equal(observed[2].options,options);assert.equal(observed[1].args,query);
});
test('symbolic commit, HEAD, status and origin requests stay fresh and supplied transports stay isolated',()=>{
 let calls=0;const reader=makeGitReader(args=>{calls++;return args[2]===id?content:Buffer.from(String(calls));});reader(query);reader(query);
 for(const args of [['cat-file','commit','HEAD'],['rev-parse','--verify','HEAD^{commit}'],['status','--porcelain'],['remote','get-url','--all','origin']])assert.notDeepEqual(reader(args),reader(args));
 assert.equal(calls,9);let otherCalls=0;const other=makeGitReader(()=>{otherCalls++;return content;});other(query);other(query);assert.equal(otherCalls,1);
 const object={toString:()=>id};reader(['cat-file','commit',object]);reader(['cat-file','commit',object]);assert.equal(calls,11);
});
