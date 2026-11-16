/** Synthetic native-fixture contracts; current proofs and opaque callbacks remain fresh. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';

const source=readFileSync(new URL('../execution-recovery-20261109/source-lineage.test.mjs',import.meta.url),'utf8');
const addedImport="import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';\n";
const original="const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});";
const successor="const git=makeGitReader((args,options={})=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],...options}));";
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function fixture(invoke){
 const declaration=source.split('\n').find(line=>line.startsWith('const git='));
 return new Function('makeGitReader','execFileSync',declaration+'\nreturn git;')(makeGitReader,invoke);
}

test('only the native fixture import and provider change; every original body and cohort import remain literal',()=>{
 assert.equal(source.split(addedImport).length,2);assert.equal(source.split(successor).length,2);
 assert.equal(sha(source.replace(addedImport,'').replace(successor,original)),'525b189319aea2f96d44b8277a1cfa5561dbff2ed8696d4b2427be726446cc80');
 assert.equal((source.match(/test\('/g)??[]).length,5);
 assert(source.startsWith("import '../cohort22-closure-20261109/caller-source.test.mjs';\n"));
});

test('native immutable preload forwards binary stdin and its larger buffer without changing defaults',()=>{
 const bytes=Buffer.from('synthetic lineage immutable bytes'),id=createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),calls=[];
 const git=fixture((file,args,options)=>{
  calls.push({file,args,options});assert.equal(file,'git');assert.deepEqual(args,['cat-file','--batch']);
  assert.equal(options.timeout,30000);assert.equal(options.maxBuffer,128*1024*1024);
  assert.deepEqual(options.stdio,['pipe','pipe','pipe']);assert(Buffer.isBuffer(options.input));
  assert(options.input.equals(Buffer.from(id+'\n')));
  return Buffer.concat([Buffer.from(`${id} blob ${bytes.length}\n`),bytes,Buffer.from('\n')]);
 });
 git.preloadBlobs([id]);const first=git(['cat-file','blob',id]);first.fill(0);
 assert(git(['cat-file','blob',id]).equals(bytes));assert.equal(calls.length,1);
});

test('HEAD status root and explicit options reach native invocation freshly in their original order',()=>{
 const calls=[],git=fixture((file,args,options)=>{calls.push({file,args:[...args],options});return Buffer.from(String(calls.length));});
 const queries=[['rev-parse','--verify','HEAD^{commit}'],['status','--porcelain','--untracked-files=all','--','src'],['rev-parse','--show-toplevel']];
 for(let round=0;round<2;round++)for(const args of queries)assert.equal(git(args).toString(),String(calls.length));
 assert.deepEqual(calls.map(call=>call.args),[...queries,...queries]);
 for(const call of calls){assert.equal(call.file,'git');assert.deepEqual(call.options,{stdio:['ignore','pipe','pipe']});}
 const options={cwd:'/explicit-lineage-fixture',maxBuffer:1234,env:{FIXTURE:'1'},input:Buffer.from('input'),stdio:['pipe','pipe','pipe']};
 git(['cat-file','blob','a'.repeat(40)],options);assert.deepEqual(calls.at(-1).options,options);
});

test('opaque providers observe each query and substitution before the native immutable fallback',()=>{
 const bytes=Buffer.from('synthetic lineage opaque fallback'),id=createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),native=[];
 const git=fixture((file,args)=>{native.push([...args]);return Buffer.from(bytes);});
 const observed=[];let changed=false;
 const opaque=args=>{observed.push([...args]);return changed?Buffer.from('adversarial substitution'):git(args);};
 for(const name of ['preloadBlobs','preloadCommits','preloadPaths'])assert.equal(opaque[name],undefined);
 const query=['cat-file','blob',id],first=opaque(query);assert(first.equals(bytes));first.fill(0);changed=true;
 assert.equal(opaque(query).toString(),'adversarial substitution');changed=false;
 assert(opaque(query).equals(bytes));assert.deepEqual(observed,[query,query,query]);assert.deepEqual(native,[query]);
});
