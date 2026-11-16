/** Synthetic fixture contracts only; no source verdict or native Git process is reused. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';

const source=readFileSync(new URL('../four-worker-integration-20261115/source-stage9.test.mjs',import.meta.url),'utf8');
const addedImport="import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';\n";
const original="const root=process.cwd(),git=args=>execFileSync('git',args,{cwd:root,maxBuffer:16*1024*1024}),read=p=>readFileSync(path.join(root,p));";
const successor="const root=process.cwd(),git=makeGitReader((args,options={})=>execFileSync('git',args,{cwd:root,maxBuffer:16*1024*1024,...options})),read=p=>readFileSync(path.join(root,p));";
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function fixture(invoke){
 const declaration=source.split('\n').find(line=>line.startsWith('const root=process.cwd(),git='));
 return new Function('makeGitReader','execFileSync','readFileSync','path','process',declaration+'\nreturn {root,git,read};')(makeGitReader,invoke,readFileSync,path,{cwd:()=>'/native-stage9-fixture'});
}

test('only the native fixture import and provider change; all five original bodies remain literal',()=>{
 assert.equal(source.split(addedImport).length,2);assert.equal(source.split(successor).length,2);
 const restored=source.replace(addedImport,'').replace(successor,original);
 assert.equal(sha(restored),'78cdb2a01519dcb46495c8c5e32363457622cd0fa1744ffd33cf604c3541f901');
 assert.equal((source.match(/^test\(/gm)??[]).length,5);
 // Existing mandatory current32 still exercises the opaque raw exact verifier and native full proof.
 const raw=readFileSync(new URL('./source-current32.test.mjs',import.meta.url));
 assert.equal(sha(raw),'dce9ab31f02577cc410559d559fcec9bbb376ccc1326c513412c69d2677de52d');
 const mandatory=readFileSync(new URL('./source-fresh-git-mandatory-children.mjs',import.meta.url),'utf8');
 assert(mandatory.includes("['tests/next-engineering-20261115/source-current32.test.mjs',4]"));
});

test('native immutable blob preload forwards binary stdin options and returns private copies',()=>{
 const bytes=Buffer.from('synthetic immutable Stage9 fixture bytes'),id=createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),calls=[];
 const {git}=fixture((file,args,options)=>{
  calls.push({file,args,options});assert.equal(file,'git');assert.deepEqual(args,['cat-file','--batch']);
  assert.equal(options.cwd,'/native-stage9-fixture');assert.equal(options.timeout,30000);
  assert.equal(options.maxBuffer,128*1024*1024);assert.deepEqual(options.stdio,['pipe','pipe','pipe']);
  assert(Buffer.isBuffer(options.input));assert(options.input.equals(Buffer.from(id+'\n')));
  return Buffer.concat([Buffer.from(`${id} blob ${bytes.length}\n`),bytes,Buffer.from('\n')]);
 });
 git.preloadBlobs([id]);const first=git(['cat-file','blob',id]);first.fill(0);
 assert(git(['cat-file','blob',id]).equals(bytes));assert.equal(calls.length,1);
});

test('symbolic HEAD status root and explicit options reach native invocation in original order',()=>{
 const calls=[],{git}=fixture((file,args,options)=>{calls.push({file,args:[...args],options});return Buffer.from(String(calls.length));});
 const queries=[['rev-parse','--verify','HEAD^{commit}'],['status','--porcelain','--untracked-files=all','--','src'],['rev-parse','--show-toplevel']];
 for(let round=0;round<2;round++)for(const args of queries)assert.equal(git(args).toString(),String(calls.length));
 assert.deepEqual(calls.map(call=>call.args),[...queries,...queries]);
 for(const call of calls){assert.equal(call.options.cwd,'/native-stage9-fixture');assert.equal(call.options.maxBuffer,16*1024*1024);}
 const options={cwd:'/explicit-fixture',maxBuffer:1234,env:{FIXTURE:'1'},input:Buffer.from('input')};
 git(['cat-file','blob','a'.repeat(40)],options);assert.deepEqual(calls.at(-1).options,options);
});

test('opaque adversarial providers receive each immutable query before native fallback caching',()=>{
 const bytes=Buffer.from('synthetic opaque fallback'),id=createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),native=[];
 const {git}=fixture((file,args)=>{native.push([...args]);return Buffer.from(bytes);});
 const observed=[];let changed=false;
 const opaque=args=>{observed.push([...args]);return changed?Buffer.from('adversarial substitution'):git(args);};
 for(const name of ['preloadBlobs','preloadCommits','preloadPaths'])assert.equal(opaque[name],undefined);
 const query=['cat-file','blob',id];assert(opaque(query).equals(bytes));changed=true;
 assert.equal(opaque(query).toString(),'adversarial substitution');changed=false;
 assert(opaque(query).equals(bytes));assert.deepEqual(observed,[query,query,query]);assert.deepEqual(native,[query]);
});
