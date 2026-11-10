import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {makeGitReader,completionGitReader} from './git-reader.mjs';
const actual=(args,options={})=>execFileSync('git',args,{stdio:['pipe','pipe','pipe'],maxBuffer:16*1024*1024,...options});
const ref='a7bab5b5534d51cea25ba5ffe4aa9b3630176909',path='src/lib/native-delivery/technology-next-five-contract.ts';
test('literal immutable path/blob requests equal actual Git and share cached tree/blob reads',()=>{
 const calls=[],read=makeGitReader((args,options)=>{calls.push(args);return actual(args,options)});
 for(let n=0;n<2;n++)for(const command of [['rev-parse',ref+':'+path],['show',ref+':'+path],['rev-parse','--verify',ref+'^{commit}']])assert.deepEqual(read(command),actual(command));
 const id=actual(['rev-parse',ref+':'+path]).toString().trim();assert.deepEqual(read(['cat-file','blob',id]),actual(['cat-file','blob',id]));
 assert.equal(calls.filter(a=>a[0]==='ls-tree').length,1);assert.equal(calls.filter(a=>a[0]==='cat-file').length,1);assert.equal(calls.filter(a=>a[0]==='rev-parse').length,1);
 const copy=read(['cat-file','blob',id]);copy[0]^=255;assert.deepEqual(read(['cat-file','blob',id]),actual(['cat-file','blob',id]));
});
test('one actual binary cat-file batch preloads unique blobs and rejects missing objects',()=>{
 const directory=mkdtempSync(join(tmpdir(),'git-reader-'));try{
  const git=(args,options={})=>execFileSync('git',args,{cwd:directory,stdio:['pipe','pipe','pipe'],...options});git(['init','-q']);
  const content=Buffer.from([0,255,10,13,128,0,65]),other=Buffer.from('another\n');const id=git(['hash-object','-w','--stdin'],{input:content}).toString().trim(),second=git(['hash-object','-w','--stdin'],{input:other}).toString().trim();
  const calls=[],read=makeGitReader((args,options)=>{calls.push(args);return git(args,options)});read.preloadBlobs([id,second,id]);assert.deepEqual(read(['cat-file','blob',id]),content);assert.deepEqual(read(['cat-file','blob',second]),other);read.preloadBlobs([id]);assert.equal(calls.length,1);assert.deepEqual(calls[0],['cat-file','--batch']);
  assert.throws(()=>read.preloadBlobs(['0'.repeat(40)]),/identity\/type unavailable/);assert.throws(()=>read(['cat-file','blob','0'.repeat(40)]));assert.throws(()=>read(['show',ref+':missing']));
 }finally{rmSync(directory,{recursive:true,force:true})}
});
test('symbolic HEAD and unknown argument forms always use the fresh actual transport',()=>{
 let head='1'.repeat(40);const calls=[],read=makeGitReader((args,options)=>{calls.push({args,options});return Buffer.from(head+'\n')});
 assert.equal(read(['rev-parse','HEAD']).toString(),head+'\n');head='2'.repeat(40);assert.equal(read(['rev-parse','HEAD']).toString(),head+'\n');assert.equal(read(['rev-parse','HEAD:'+path]).toString(),head+'\n');assert.equal(read(['show','HEAD:'+path]).toString(),head+'\n');read(['status','--porcelain']);read(['show',ref+':'+path],{maxBuffer:4096});assert.equal(calls.length,6);
});
test('missing paths and immutable refs propagate actual Git errors',()=>{const read=makeGitReader(actual);assert.throws(()=>read(['show',ref+':missing-no-such-path']));assert.throws(()=>read(['rev-parse',ref+':missing-no-such-path']));assert.throws(()=>read(['show','0'.repeat(40)+':missing']));assert.throws(()=>read(['rev-parse','--verify','0'.repeat(40)+'^{commit}']));});
test('batch validates object identity, type, size, delimiter, content address and trailing bytes',()=>{
 const content=Buffer.from([0,255,10]),id=createHash('sha1').update(Buffer.from('blob 3\0')).update(content).digest('hex');const valid=Buffer.concat([Buffer.from(id+' blob 3\n'),content,Buffer.from('\n')]);
 const bad=[Buffer.from(id+' missing\n'),Buffer.concat([Buffer.from('1'.repeat(40)+' blob 3\n'),content,Buffer.from('\n')]),Buffer.concat([Buffer.from(id+' tree 3\n'),content,Buffer.from('\n')]),Buffer.concat([Buffer.from(id+' blob 4\n'),content,Buffer.from('\n')]),valid.subarray(0,-1),Buffer.concat([Buffer.from(id+' blob 3\n'),Buffer.from([0,254,10]),Buffer.from('\n')]),Buffer.concat([valid,Buffer.from('extra')])];
 for(const output of bad){const read=makeGitReader(()=>output);assert.throws(()=>read.preloadBlobs([id]));}
 const read=makeGitReader(()=>valid);assert.throws(()=>read.preloadBlobs(['HEAD']));read.preloadBlobs([id]);assert.deepEqual(read(['cat-file','blob',id]),content);
});

test('completion checks reuse only the same actual immutable transport and defensive buffers',()=>{
 const calls=[],invoke=(args,options)=>{calls.push(args);return actual(args,options)};
 const reader=completionGitReader(invoke);assert.equal(completionGitReader(invoke),reader);assert.equal(completionGitReader(reader),reader);
 assert.notEqual(completionGitReader((args,options)=>actual(args,options)),reader);
 const command=['show',ref+':'+path],expected=actual(command),first=reader(command);first[0]^=255;assert.deepEqual(reader(command),expected);
 assert.equal(calls.filter(a=>a[0]==='ls-tree').length,1);assert.equal(calls.filter(a=>a[0]==='cat-file').length,1);
});
test('shared completion transport never reuses symbolic HEAD or another providers missing provenance',()=>{
 let head='1'.repeat(40),calls=0;const reader=completionGitReader(()=>{calls++;return Buffer.from(head+'\n')});
 assert.equal(reader(['rev-parse','HEAD']).toString(),head+'\n');head='2'.repeat(40);assert.equal(reader(['rev-parse','HEAD']).toString(),head+'\n');assert.equal(calls,2);
 const missing=completionGitReader(()=>{throw Error('missing provenance')});assert.throws(()=>missing(['show',ref+':'+path]),/missing provenance/);
});
