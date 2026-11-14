import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {sourceObjectLockName} from '../parallel-source-20261110/source-object-lock.mjs';
const module=await import('./source-stage8-authority-availability.mjs').catch(error=>{if(error.code==='ERR_MODULE_NOT_FOUND')return {};throw error;});
const root=fileURLToPath(new URL('../../',import.meta.url)),authorityPath='tests/parallel-source-20261110/authority.mjs';
const actual=(args,cwd=root,options={})=>execFileSync('git',args,{cwd,stdio:['pipe','pipe','pipe'],...options});
const common=resolve(root,actual(['rev-parse','--git-common-dir']).toString().trim());
const sha=b=>createHash('sha256').update(b).digest('hex');
function fixture(){
 const dir=mkdtempSync(join(tmpdir(),'calcumint-authority-availability-')),remote=join(dir,'remote'),clone=join(dir,'clone');mkdirSync(remote);
 actual(['init','-q'],remote);actual(['config','user.name','Isolated source fixture'],remote);actual(['config','user.email','fixture@example.invalid'],remote);
 const p=join(remote,authorityPath);mkdirSync(join(remote,'tests/parallel-source-20261110'),{recursive:true});const original=Buffer.from('// ISOLATED SYNTHETIC FIXTURE; NOT AN APPROVAL '+randomUUID()+'\n');writeFileSync(p,original);actual(['add','.'],remote);actual(['commit','-qm','fixture authority'],remote);
 const record={ref:actual(['rev-parse','HEAD'],remote).toString().trim(),blob:actual(['rev-parse','HEAD:'+authorityPath],remote).toString().trim(),sha256:sha(original)};
 actual(['rm',authorityPath],remote);actual(['commit','-qm','fixture without authority'],remote);const withoutPath=actual(['rev-parse','HEAD'],remote).toString().trim();
 actual(['clone','-q','--depth=1',pathToFileURL(remote).href,clone],dir);actual(['remote','set-url','origin','https://github.com/subvicco12/calcumint.com.git'],clone);const calls=[];
 const git=(args,options={})=>{assert(existsSync(join(common,sourceObjectLockName)),'Every supplied operation must execute under the actual source common-directory lock');calls.push([...args]);if(args[0]==='fetch'){assert.deepEqual(args,['fetch','--no-tags','--depth=1','origin',record.ref]);return actual(['-c','protocol.file.allow=always','fetch','--no-tags','--depth=1',pathToFileURL(remote).href,record.ref],clone,options);}return actual(args,clone,options);};
 return {dir,remote,clone,record,withoutPath,original,calls,git,close:()=>rmSync(dir,{recursive:true,force:true})};
}
const requireFeature=()=>assert.equal(typeof module.ensurePinnedAuthorityRecord,'function','Bounded locked authority-object preparation is required');
test('a genuinely shallow store retrieves the exact missing authority once and preserves its bytes',()=>{
 requireFeature();const f=fixture();try{
  assert.notEqual(spawnSync('git',['cat-file','-e',f.record.ref+'^{commit}'],{cwd:f.clone}).status,0);
  assert.notEqual(spawnSync('git',['cat-file','-e',f.record.ref+'^{commit}'],{cwd:root}).status,0,'Synthetic fixture objects must not enter the real repository');
  const result=module.ensurePinnedAuthorityRecord(f.record,f.git);assert.equal(result.availabilityOnly,true);assert.equal(result.sourceAdmission,false);assert.equal(result.ref,f.record.ref);
  assert(actual(['show',f.record.ref+':'+authorityPath],f.clone).equals(f.original));assert.equal(f.calls.filter(a=>a[0]==='fetch').length,1);assert(!existsSync(join(common,sourceObjectLockName)));
  const count=f.calls.length;module.ensurePinnedAuthorityRecord(f.record,f.git);assert(f.calls.length>count,'Supplied availability must not be cached');assert.equal(f.calls.filter(a=>a[0]==='fetch').length,1);
  assert.notEqual(spawnSync('git',['cat-file','-e',f.record.ref+'^{commit}'],{cwd:root}).status,0,'The fixture must not fabricate real historical objects');
 }finally{f.close();}
});
test('present commits with wrong authority path, blob or SHA are refused without a corrective fetch',()=>{
 requireFeature();const f=fixture();try{
  assert.throws(()=>module.ensurePinnedAuthorityRecord({...f.record,ref:f.withoutPath},f.git),/authority path|Authority path/);assert.equal(f.calls.filter(a=>a[0]==='fetch').length,0);
  module.ensurePinnedAuthorityRecord(f.record,f.git);f.calls.length=0;
  for(const record of [{...f.record,blob:'1'.repeat(40)},{...f.record,sha256:'0'.repeat(64)}])assert.throws(()=>module.ensurePinnedAuthorityRecord(record,f.git),/authority blob|Authority blob|authority bytes|Authority bytes/);
  assert.equal(f.calls.filter(a=>a[0]==='fetch').length,0);assert(!existsSync(join(common,sourceObjectLockName)));
 }finally{f.close();}
});
test('a failed bounded fetch preserves Git shallow locks and releases only its owned coordination lock',()=>{
 requireFeature();const f=fixture();try{
  const lock=join(f.clone,'.git/shallow.lock');writeFileSync(lock,'foreign fixture owner');assert.throws(()=>module.ensurePinnedAuthorityRecord(f.record,f.git),/shallow.lock/);assert.equal(f.calls.filter(a=>a[0]==='fetch').length,1);assert.equal(readFileSync(lock,'utf8'),'foreign fixture owner');assert(!existsSync(join(common,sourceObjectLockName)));
 }finally{f.close();}
});
test('invalid records and origins cannot nominate another authority path or perform a fetch',()=>{
 requireFeature();let calls=0;const git=()=>{calls++;assert(existsSync(join(common,sourceObjectLockName)));return Buffer.from('https://example.invalid/repo\n');};
 for(const record of [{ref:'HEAD',blob:'1'.repeat(40),sha256:'2'.repeat(64)},{ref:'1'.repeat(40),blob:'1'.repeat(40),sha256:'2'.repeat(64),path:'../outside'}])assert.throws(()=>module.ensurePinnedAuthorityRecord(record,git));assert.equal(calls,0);
 assert.throws(()=>module.ensurePinnedAuthorityRecord({ref:'1'.repeat(40),blob:'1'.repeat(40),sha256:'2'.repeat(64)},git),/Exact HTTPS/);assert.equal(calls,1);assert(!existsSync(join(common,sourceObjectLockName)));
});
test('transport failures propagate without fabricating availability and the owned lock is released',()=>{
 requireFeature();const failure=Error('Exact fixture transport failure');assert.throws(()=>module.ensurePinnedAuthorityRecord({ref:'1'.repeat(40),blob:'1'.repeat(40),sha256:'2'.repeat(64)},()=>{assert(existsSync(join(common,sourceObjectLockName)));throw failure;}),error=>error===failure);assert(!existsSync(join(common,sourceObjectLockName)));
});
test('substituted commit content is rejected even after a successful preparation',()=>{
 requireFeature();const f=fixture();try{module.ensurePinnedAuthorityRecord(f.record,f.git);f.calls.length=0;const git=(args,options)=>{if(args[0]==='cat-file'&&args[1]==='commit'){assert(existsSync(join(common,sourceObjectLockName)));return Buffer.from('substituted commit');}return f.git(args,options);};assert.throws(()=>module.ensurePinnedAuthorityRecord(f.record,git),/commit content address|Commit content address/);assert.equal(f.calls.filter(a=>a[0]==='fetch').length,0);assert(!existsSync(join(common,sourceObjectLockName)));}finally{f.close();}
});
