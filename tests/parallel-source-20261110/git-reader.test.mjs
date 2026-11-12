import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {ensureParallelSources} from './bootstrap.mjs';
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
 const commit=Buffer.from('tree '+ref+'\n\nimmutable finite commit\n'),cid=createHash('sha1').update(Buffer.from(`commit ${commit.length}\0`)).update(commit).digest('hex');const packet=Buffer.concat([Buffer.from(cid+' commit '+commit.length+'\n'),commit,Buffer.from('\n')]);
 const commitBad=[Buffer.from(cid+' missing\n'),Buffer.concat([Buffer.from('1'.repeat(40)+' commit '+commit.length+'\n'),commit,Buffer.from('\n')]),Buffer.concat([Buffer.from(cid+' blob '+commit.length+'\n'),commit,Buffer.from('\n')]),Buffer.concat([Buffer.from(cid+' commit '+(commit.length+1)+'\n'),commit,Buffer.from('\n')]),packet.subarray(0,-1),Buffer.concat([packet,Buffer.from('extra')]),Buffer.from(packet.map((v,i)=>i===packet.length-3?v^1:v))];
 for(const output of commitBad){const reader=makeGitReader(()=>output);assert.throws(()=>reader.preloadCommits([cid]));}
 const missingCommitReader=makeGitReader(()=>Buffer.from(cid+' missing\n'));assert.throws(()=>missingCommitReader.preloadCommits([cid]),error=>error.missingCommit===cid);
 const only=makeGitReader(()=>packet);assert.throws(()=>only.preloadCommits(['HEAD']));only.preloadCommits([cid,cid]);const poisoned=only(['cat-file','commit',cid]);poisoned[0]^=255;assert.deepEqual(only(['cat-file','commit',cid]),commit);const identity=only(['rev-parse','--verify',cid+'^{commit}']);identity[0]^=1;assert.equal(only(['rev-parse','--verify',cid+'^{commit}']).toString(),cid+'\n');
 const other=Buffer.from('other commit'),oid=createHash('sha1').update(Buffer.from(`commit ${other.length}\0`)).update(other).digest('hex');let invoked=0;const transactional=makeGitReader(args=>{invoked++;if(args[1]==='--batch')return Buffer.concat([packet,Buffer.from(oid+' missing\n')]);throw Error('No partially admitted commit');});assert.throws(()=>transactional.preloadCommits([cid,oid]));assert.throws(()=>transactional(['cat-file','commit',cid]),/No partially admitted commit/);assert.equal(invoked,2);

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
 const capture=JSON.parse(readFileSync('docs/parallel-source-20261110/capture-revision42.json')),original=actual(['show',capture.baselineRef+':scripts/product-completion-lineage.mjs']);
 function fixture(mode){let origin=false,fetches=0,batches=0,identities=0,fetched=false;const missing=capture.codeRef;
  const git=args=>{if(args[0]==='remote'){origin=true;return Buffer.from('https://github.com/subvicco12/calcumint.com.git\n');}if(args[0]==='rev-parse'&&args[1]==='--verify'){identities++;const id=args[2].slice(0,40);if(mode==='missing'&&id===missing&&!fetched)throw Error('missing exact object');return Buffer.from(id+'\n');}if(args[0]==='fetch'){fetches++;assert.deepEqual(args,['fetch','--no-tags','--depth=1','origin',missing]);fetched=true;return Buffer.alloc(0);}if(args[0]==='show')return original;throw Error('Unexpected bootstrap command '+JSON.stringify(args));};
  git.preloadCommits=ids=>{assert(origin,'Canonical origin precedes availability batch');assert(ids.every(id=>/^[a-f0-9]{40}$/.test(id)));batches++;if(mode==='custom')throw Error('Custom caller must not opt in');if(mode==='wrongtype')throw Error('wrong immutable commit type');if(mode==='wronghash')throw Error('wrong immutable commit hash');if(mode==='unapproved'){const error=Error('Unapproved missing object');error.missingCommit='0'.repeat(40);throw error;}if(mode==='missing'&&!fetched){assert(ids.includes(missing));const error=Error('Exact selected missing');error.missingCommit=missing;throw error;}};
  return{git,stats:()=>({fetches,batches,identities})};
 }
 const custom=fixture('custom');assert.equal(ensureParallelSources(capture,custom.git),true);assert.equal(custom.stats().batches,0);assert(custom.stats().identities>100);
 const batch=fixture('valid');assert.equal(ensureParallelSources(capture,batch.git,{defaultRetainedCommitBatch:true}),true);assert.equal(batch.stats().batches,2);assert.equal(batch.stats().fetches,0);
 const recovered=fixture('missing');assert.equal(ensureParallelSources(capture,recovered.git,{defaultRetainedCommitBatch:true}),true);assert.equal(recovered.stats().fetches,1);assert.equal(recovered.stats().batches,3);
 for(const mode of ['wrongtype','wronghash','unapproved']){const denied=fixture(mode);assert.throws(()=>ensureParallelSources(capture,denied.git,{defaultRetainedCommitBatch:true}));assert.equal(denied.stats().fetches,0);}
 const missing=completionGitReader(()=>{throw Error('missing provenance')});assert.throws(()=>missing(['show',ref+':'+path]),/missing provenance/);
});
