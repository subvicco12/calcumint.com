import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';
import {immutableTreeQueryReader} from '../milestone100-20261114/source-immutable-queries.mjs';
import {provePinnedSourceStage8} from '../milestone100-20261114/source-stage8-activation.mjs';
import {lineageNativePath,lineageNativeCapturePath,lineageNativePredecessor,lineageNativeCurrent,expectedLineageNativeFixture,lineageNativeArgumentBytes,proveLineageNativeSuccessor} from './source-lineage-native-contract.mjs';

const native=makeGitReader((args,options={})=>{try{return execFileSync('git',args,{cwd:process.cwd(),stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024,...options});}catch(error){error.message+='\nNative contract fixture '+JSON.stringify({args,stdio:options.stdio,inputBytes:options.input?.length,timeout:options.timeout,stdout:String(error.stdout??''),stderr:String(error.stderr??'')});throw error;}});
const old=()=>native(['cat-file','blob',lineageNativePredecessor.blob]);
const read=p=>readFileSync(p);

test('the exact native fixture transformation retains every original body and the imported cohort',()=>{
 const previous=old().toString(),current=read(lineageNativePath);
 assert(current.equals(Buffer.from(expectedLineageNativeFixture(previous))));
 assert(current.equals(lineageNativeArgumentBytes(native)));
 for(const bad of [previous.replace("const git=args=>",'const git= args=>'),previous+"\nimport {makeGitReader} from 'unapproved';",previous.replace('const git=args=>','const git=()=>')])assert.throws(()=>expectedLineageNativeFixture(bad));
});

test('the named relation returns independent bytes only after current native and physical checks',()=>{
 const result=proveLineageNativeSuccessor(native,read);assert(result.equals(read(lineageNativePath)));result.fill(0);
 assert(proveLineageNativeSuccessor(native,read).equals(read(lineageNativePath)));
});

test('every original and current immutable identity remains exact for opaque providers',()=>{
 const rows=[lineageNativePredecessor,lineageNativeCurrent];
 for(const row of rows)for(const command of ['commit','path','blob']){
  const opaque=args=>command==='commit'&&args[0]==='rev-parse'&&args[2]===row.ref+'^{commit}'?Buffer.from('0'.repeat(40)+'\n'):command==='path'&&args[0]==='rev-parse'&&args[1]===row.ref+':'+row.path?Buffer.from('0'.repeat(40)+'\n'):command==='blob'&&args[0]==='cat-file'&&args[2]===row.blob?Buffer.from('tampered immutable bytes'):native(args);
  assert.equal(opaque.preloadBlobs,undefined);assert.throws(()=>proveLineageNativeSuccessor(opaque,read));
 }
});

test('capture digest precedes parsing and cannot nominate an arbitrary dependency',()=>{
 let unexpected=0;const capture=JSON.parse(read(lineageNativeCapturePath));capture.sourceStage10FixtureBindings.guardPaths.push('../unapproved');capture.currentSources[0].path='../unapproved';
 const changed=Buffer.from(JSON.stringify(capture));
 const supplied=p=>{if(p==='../unapproved'){unexpected++;throw Error('Unapproved access');}return p===lineageNativeCapturePath?changed:read(p);};
 assert.throws(()=>proveLineageNativeSuccessor(native,supplied),/capture differs/);assert.equal(unexpected,0);
 assert.throws(()=>proveLineageNativeSuccessor(native,p=>p===lineageNativeCapturePath?Buffer.from('{'):read(p)),/capture differs/);
});

test('root HEAD and current reads remain fresh and fabricated provider properties confer no history',()=>{
 for(const mismatch of ['root','head-path','closing-head']){
  let heads=0;const opaque=args=>{
   if(mismatch==='root'&&args[0]==='rev-parse'&&args[1]==='--show-toplevel')return Buffer.from('/tmp/wrong-root\n');
   if(mismatch==='head-path'&&args[0]==='rev-parse'&&args[1]?.endsWith(':'+lineageNativePath)&&!rowsRefs.includes(args[1].split(':')[0]))return Buffer.from('0'.repeat(40)+'\n');
   if(args[0]==='rev-parse'&&args[2]==='HEAD^{commit}'&&++heads>1&&mismatch==='closing-head')return Buffer.from('0'.repeat(40)+'\n');
   return native(args);
  };
  const rowsRefs=[lineageNativePredecessor.ref,lineageNativeCurrent.ref];
  assert.throws(()=>proveLineageNativeSuccessor(opaque,read));
 }
 const forged=Object.assign(args=>native(args),{historicalInput:{read},actualInput:{git:native,read}});
 assert.throws(()=>proveLineageNativeSuccessor(forged,p=>p===lineageNativePath?old():read(p)),/supplemental source bytes differ/);
});

test('registered history recovers actual inputs while mismatched readers and unregistered aliases refuse',()=>{
 // This is an actual opaque supplied transport: no batching capability is nominated.
 const opaque=(args,options)=>native(args,options);
 for(const name of ['preloadBlobs','preloadCommits','preloadPaths'])assert.equal(opaque[name],undefined);
 const proof=provePinnedSourceStage8({root:process.cwd(),git:opaque,read});
 assert(proveLineageNativeSuccessor(proof.historicalInput.git,proof.historicalInput.read).equals(read(lineageNativePath)));
 assert.throws(()=>proveLineageNativeSuccessor(proof.historicalInput.git,read),/reader capability differs/);
 // Unregistered wrappers cannot borrow an exact private historical capability.
 assert.throws(()=>proveLineageNativeSuccessor(immutableTreeQueryReader(proof.historicalInput.git),proof.historicalInput.read));
});

test('a same-byte physical symlink cannot be hidden by an approved supplied reader',()=>{
 const root=process.cwd(),fixedRef='6b013fbf483e69b1016d238f84cc55e5057bb717';
 const actual=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});
 const original=read(lineageNativePath),head=actual(['rev-parse','--verify','HEAD^{commit}']);
 const indexPath=actual(['rev-parse','--path-format=absolute','--git-path','index']).toString().trim(),index=readFileSync(indexPath);
 const directory=mkdtempSync(join(tmpdir(),'lineage-contract-')),tree=join(directory,'tree');
 try{
  // Share immutable objects only; the checkout, HEAD, index and mutated guard belong to this clone.
  actual(['clone','--shared','--no-checkout',root,tree]);
  const isolated=args=>execFileSync('git',args,{cwd:tree,stdio:['ignore','pipe','pipe']});
  isolated(['checkout','--detach',fixedRef]);
  assert.equal(isolated(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),fixedRef);
  isolated(['remote','set-url','origin','https://github.com/subvicco12/calcumint.com.git']);
  const child=String.raw`import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,rmSync,symlinkSync} from 'node:fs';
import {join} from 'node:path';
import {lineageNativePath,proveLineageNativeSuccessor} from './tests/next-engineering-20261115/source-lineage-native-contract.mjs';
const native=(args,options={})=>execFileSync('git',args,{cwd:process.cwd(),stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024,...options});
assert.equal(native(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),${JSON.stringify(fixedRef)});
const read=p=>readFileSync(p),original=read(lineageNativePath),copy=join(process.cwd(),'same-bytes.mjs');
writeFileSync(copy,original);
try{
 rmSync(lineageNativePath);symlinkSync(copy,lineageNativePath);
 assert.throws(()=>proveLineageNativeSuccessor(native,p=>p===lineageNativePath?Buffer.from(original):read(p)),/Regular current lineage source required/);
}finally{rmSync(lineageNativePath,{force:true});writeFileSync(lineageNativePath,original);rmSync(copy,{force:true});}
process.stdout.write('PASS isolated lineage symlink refusal\n');`;
  const env={...process.env};delete env.NODE_TEST_CONTEXT;
  const childPath=join(tree,'lineage-symlink-negative.mjs');writeFileSync(childPath,child);
  const output=execFileSync(process.execPath,[childPath],{cwd:tree,env,encoding:'utf8',timeout:15000,maxBuffer:1000000});
  assert.match(output,/^PASS isolated lineage symlink refusal$/m);
 }finally{
  rmSync(directory,{recursive:true,force:true});
  assert(read(lineageNativePath).equals(original),'Parent lineage source changed during isolated negative');
  assert(actual(['rev-parse','--verify','HEAD^{commit}']).equals(head),'Parent HEAD changed during isolated negative');
  assert(readFileSync(indexPath).equals(index),'Parent index changed during isolated negative');
 }
});
