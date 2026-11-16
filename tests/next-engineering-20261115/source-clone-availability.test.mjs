import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync,mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {fetchSourceLineage} from '../../scripts/fetch-source-lineage.mjs';
const url=new URL('./source-clone-availability.mjs',import.meta.url),prefix='refs/heads/calcumint-source-availability/';
const approved=[],available=new Set();
fetchSourceLineage(args=>{if(args[0]==='fetch'){for(const id of args.slice(4)){approved.push(id);available.add(id);}return Buffer.alloc(0);}const id=args[2].slice(0,40);if(!available.has(id))throw Error('Missing cold source');return Buffer.from(id+'\n');});
const objects=resolve(execFileSync('git',['rev-parse','--git-common-dir']).toString().trim(),'objects');
const install=async()=>{assert(existsSync(url),'Fixed-roster clone availability installer is required');return(await import(url)).ensureClonableSourceLineage;};
function fixture(){
 const previous=process.cwd(),root=mkdtempSync(join(tmpdir(),'calcumint-clone-refs-')),args=[];
 const native=(argv,options={})=>{args.push(argv);return execFileSync('git',argv,{cwd:root,stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:1024*1024,...options});};
 native(['init','-q']);native(['remote','add','origin','https://github.com/subvicco12/calcumint.com.git']);
 mkdirSync(join(root,'.git/objects/info'),{recursive:true});writeFileSync(join(root,'.git/objects/info/alternates'),objects+'\n');writeFileSync(join(root,'untouched'),'exact working bytes\n');
 process.chdir(root);
 const before=readFileSync(join(root,'.git/HEAD')),refs=()=>native(['for-each-ref','--format=%(refname)%00%(objectname)%00%(symref)',prefix]).toString();
 return{root,native,args,refs,assertUnchanged(){assert.deepEqual(readFileSync(join(root,'.git/HEAD')),before);assert.equal(readFileSync(join(root,'untouched'),'utf8'),'exact working bytes\n');assert(!existsSync(join(root,'.git/index')));assert(!existsSync(join(root,'.git/calcumint-source-object-availability.lock')));},cleanup(){process.chdir(previous);rmSync(root,{recursive:true,force:true});}};
}
test('fixed clone installer forbids caller-nominated refs before invoking Git',async()=>{
 const run=await install();let calls=0;const git=()=>{calls++;throw Error('No Git expected');};
 assert.throws(()=>run(git,['0'.repeat(40)]),/forbidden|Only|nominated/i);assert.equal(calls,0);assert.throws(()=>run({}),/Git|transport|function/i);assert.equal(calls,0);
});
test('fixed source refs are installed by one create-only transaction and warm calls revalidate without writes',async()=>{
 const run=await install(),f=fixture();try{
  const first=run(f.native);assert.equal(first.sourceRevisions,approved.length);assert.equal(first.created,approved.length);assert.equal(first.sourceAdmission,false);assert.equal(first.productionWrites,false);
  const rows=f.refs().trim().split('\n');assert.equal(rows.length,approved.length);for(const row of rows){const[name,id,symbolic]=row.split('\0');assert.equal(name,prefix+id);assert(approved.includes(id));assert.equal(symbolic,'');}
  const second=run(f.native);assert.equal(second.created,0);assert.equal(f.args.filter(a=>a.includes('update-ref')).length,1);assert.equal(f.args.filter(a=>a[0]==='cat-file').length,2);assert(f.args.every(a=>a[0]!=='fetch'&&a[0]!=='push'));f.assertUnchanged();
 }finally{f.cleanup();}
});
test('missing substituted wrong-type and malformed immutable commits refuse before ref creation',async()=>{
 const run=await install();for(const kind of ['missing','substitution','type','length']){const f=fixture();try{
  const git=(argv,options)=>{const bytes=f.native(argv,options);if(argv[0]!=='cat-file')return bytes;const copy=Buffer.from(bytes),newline=copy.indexOf(10);if(kind==='missing')return Buffer.from(approved[0]+' missing\n');if(kind==='substitution'){copy[newline+2]^=1;return copy;}if(kind==='type')return Buffer.from(copy.toString().replace(' commit ',' blob '));return Buffer.from(copy.toString().replace(/ commit \d+\n/,' commit 999999999\n'));};
  assert.throws(()=>run(git));assert.equal(f.args.filter(a=>a.includes('update-ref')).length,0);assert.equal(f.refs(),'');f.assertUnchanged();
 }finally{f.cleanup();}}
});
test('foreign conflicting symbolic and injected availability refs never get overwritten',async()=>{
 const run=await install();for(const kind of ['foreign','conflict','symbolic','injected']){const f=fixture();try{
  if(kind==='foreign')f.native(['update-ref',prefix+'f'.repeat(40),approved[0]]);
  if(kind==='conflict')f.native(['update-ref',prefix+approved[0],approved[1]]);
  if(kind==='symbolic'){f.native(['update-ref','refs/heads/other-owner',approved[0]]);f.native(['symbolic-ref',prefix+approved[0],'refs/heads/other-owner']);}
  const before=f.refs(),start=f.args.length,git=(argv,options)=>argv[0]==='for-each-ref'&&kind==='injected'?Buffer.from(prefix+approved[0]+'\0'+approved[0]+'\0\ninvalid ref command\n'):f.native(argv,options);
  assert.throws(()=>run(git));assert.equal(f.args.slice(start).filter(a=>a.includes('update-ref')).length,0);assert.equal(f.refs(),before);f.assertUnchanged();
 }finally{f.cleanup();}}
});
test('foreign Git locks abort the whole create transaction and remain untouched',async()=>{
 const run=await install(),f=fixture();try{
  const lock=join(f.root,'.git',prefix+approved[Math.floor(approved.length/2)]+'.lock');mkdirSync(dirname(lock),{recursive:true});writeFileSync(lock,'foreign owner remains\n');
  assert.throws(()=>run(f.native));assert.equal(f.refs(),'');assert.equal(readFileSync(lock,'utf8'),'foreign owner remains\n');assert.equal(f.args.filter(a=>a.includes('update-ref')).length,1);f.assertUnchanged();
 }finally{f.cleanup();}
});
test('dangling symbolic refs cannot redirect create-only updates into another branch',async()=>{
 const run=await install(),f=fixture();try{
  const ref=prefix+approved[0];f.native(['symbolic-ref',ref,'refs/heads/foreign-unborn']);assert.equal(f.refs(),'');
  assert.throws(()=>run(f.native));assert.equal(f.native(['symbolic-ref',ref]).toString().trim(),'refs/heads/foreign-unborn');assert.throws(()=>f.native(['rev-parse','--verify','refs/heads/foreign-unborn']));assert.equal(f.refs(),'');f.assertUnchanged();
 }finally{f.cleanup();}
});
test('post-transaction ref loss refuses without retry rollback deletion or overwrites',async()=>{
 const run=await install(),f=fixture();try{
  const git=(argv,options)=>{const bytes=f.native(argv,options);if(argv.includes('update-ref'))f.native(['update-ref','-d',prefix+approved[0]]);return bytes;};
  assert.throws(()=>run(git));assert.equal(f.args.filter(a=>a.includes('update-ref')&&a.includes('--stdin')).length,1);assert.equal(f.refs().trim().split('\n').length,approved.length-1);f.assertUnchanged();
 }finally{f.cleanup();}
});

test('opaque transports cannot nominate another repository lock and every callback runs under the native lock',async()=>{
 const run=await install(),f=fixture(),foreign=mkdtempSync(join(tmpdir(),'calcumint-foreign-common-'));try{
  writeFileSync(join(foreign,'untouched'),'foreign directory remains exact\n');let calls=0;
  const git=argv=>{calls++;assert.deepEqual(argv,['rev-parse','--path-format=absolute','--git-common-dir']);assert(existsSync(join(f.root,'.git/calcumint-source-object-availability.lock')));assert.deepEqual(readdirSync(foreign),['untouched']);return Buffer.from(foreign+'\n');};
  assert.throws(()=>run(git),/Actual source Git common directory differs/);assert.equal(calls,1);assert.deepEqual(readdirSync(foreign),['untouched']);assert.equal(readFileSync(join(foreign,'untouched'),'utf8'),'foreign directory remains exact\n');assert.equal(f.refs(),'');f.assertUnchanged();
 }finally{f.cleanup();rmSync(foreign,{recursive:true,force:true});}
});
test('private availability transactions never execute configured repository hooks',async()=>{
 const run=await install(),f=fixture();try{
  const directory=join(f.root,'hooks'),marker=join(f.root,'hook-ran');mkdirSync(directory);
  writeFileSync(join(directory,'reference-transaction'),"#!/bin/sh\ncat >/dev/null\nprintf 'executed\\n' > '"+marker+"'\nprintf 'changed by hook\\n' > '"+join(f.root,'untouched')+"'\n: > '"+join(f.root,'.git/index')+"'\n",{mode:0o700});f.native(['config','core.hooksPath',directory]);
  f.native(['update-ref','refs/heads/hook-control',approved[0]]);assert(existsSync(marker),'The configured reference hook must execute in the positive control');
  rmSync(marker);rmSync(join(f.root,'.git/index'));writeFileSync(join(f.root,'untouched'),'exact working bytes\n');
  assert.equal(run(f.native).created,approved.length);assert(!existsSync(marker),'Availability ref installation must not execute repository hooks');f.assertUnchanged();
 }finally{f.cleanup();}
});
