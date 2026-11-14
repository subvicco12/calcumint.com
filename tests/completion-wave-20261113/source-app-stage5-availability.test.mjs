import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdtempSync,chmodSync,rmSync,existsSync,lstatSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {appStage5Policy} from './source-app-stage5-policy.mjs';
import {prepareAppStage5Commits,ensureAppStage5Objects} from '../parallel-source-20261110/bootstrap.mjs';
import {withSourceObjectLock,sourceObjectLockName} from '../parallel-source-20261110/source-object-lock.mjs';
const root=resolve(new URL('../../',import.meta.url).pathname);
const actual=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});
const refs=appStage5Policy.ancestry,origin='https://github.com/subvicco12/calcumint.com.git\n';
const content=new Map(refs.map(ref=>[ref,actual(['cat-file','commit',ref])]));
const batch=()=>Buffer.concat(refs.map(ref=>{const b=content.get(ref);return Buffer.concat([Buffer.from(`${ref} commit ${b.length}\n`),b,Buffer.from('\n')]);}));
function transport(behavior){const calls=[];let batches=0;const git=(args,options)=>{calls.push({args,options});if(args[0]==='remote')return Buffer.from(origin);if(args[0]==='fetch')return Buffer.alloc(0);assert.deepEqual(args,['cat-file','--batch']);assert.equal(options.input.toString(),refs.join('\n')+'\n');assert.deepEqual(options.stdio,['pipe','pipe','pipe']);batches++;return behavior?.(batches)??batch();};return{git,calls,get batches(){return batches;}};}
test('exact independently pinned51 commits batch after origin; malformed content never proves availability',()=>{
 assert.equal(refs.length,51);const t=transport();const reader=prepareAppStage5Commits(t.git);assert.equal(t.batches,1);assert.equal(t.calls[0].args[0],'remote');for(const ref of refs)assert.equal(reader(['rev-parse','--verify',ref+'^{commit}']).toString(),ref+'\n');assert.equal(t.batches,1);
 for(const altered of [Buffer.from('not a batch'),(()=>{const b=batch();b[b.indexOf(10)+1]^=1;return b;})()])assert.throws(()=>prepareAppStage5Commits(transport(()=>altered).git));
});
test('only a missing pinned commit receives one bounded fetch; repeated or outside missing fails closed',()=>{
 const t=transport(n=>n===1?Buffer.from(refs[0]+' missing\n'):batch());prepareAppStage5Commits(t.git);assert.equal(t.batches,2);assert.deepEqual(t.calls.filter(c=>c.args[0]==='fetch').map(c=>c.args),[['fetch','--no-tags','--depth=1','origin',refs[0]]]);
 const repeated=transport(()=>Buffer.from(refs[0]+' missing\n'));assert.throws(()=>prepareAppStage5Commits(repeated.git));assert.equal(repeated.calls.filter(c=>c.args[0]==='fetch').length,1);
 const outside=transport(()=>{const e=Error('foreign missing');e.missingCommit='0'.repeat(40);throw e;});assert.throws(()=>prepareAppStage5Commits(outside.git),/foreign missing/);assert.equal(outside.calls.filter(c=>c.args[0]==='fetch').length,0);
});
test('failed batch is not a successful availability cache and a fresh retry validates actual bytes',()=>{
 const t=transport(n=>n===1?Buffer.from('invalid batch'):batch());assert.throws(()=>prepareAppStage5Commits(t.git));assert.equal(prepareAppStage5Commits(t.git)(['rev-parse','--verify',refs[0]+'^{commit}']).toString(),refs[0]+'\n');assert.equal(t.batches,2);
});
test('custom source transports remain uncached and execute inside owned availability lock',()=>{
 const common=resolve(root,actual(['rev-parse','--git-common-dir']).toString().trim());let origins=0,checked=0;
 const git=args=>{assert(existsSync(join(common,sourceObjectLockName)));if(args[0]==='remote'){origins++;return Buffer.from(origin);}assert.equal(args[0],'rev-parse');checked++;return Buffer.from(args[2].slice(0,40)+'\n');};
 ensureAppStage5Objects(git);ensureAppStage5Objects(git);assert.equal(origins,2);assert.equal(checked,refs.length*4);
 // A different client may acquire immediately after our release. Successful reacquisition
 // proves our calls released their ownership without requiring global lock absence.
 let reacquired=false;withSourceObjectLock(common,()=>{reacquired=true;assert(existsSync(join(common,sourceObjectLockName)));});assert(reacquired);
});
test('default batch transport forwards stdin and caches success only after owned lock release',()=>{
 const temporary=mkdtempSync(join(tmpdir(),'stage5-owned-batch-')),previousPath=process.env.PATH,previousLog=process.env.STAGE5_AVAILABILITY_LOG;
 try{
  const log=join(temporary,'calls.jsonl'),wrapper=join(temporary,'git');writeFileSync(wrapper,"#!/usr/bin/python3\nimport os,sys,json\nwith open(os.environ['STAGE5_AVAILABILITY_LOG'],'a') as f:f.write(json.dumps(sys.argv[1:])+'\\n')\nos.execv('/usr/bin/git',['git',*sys.argv[1:]])\n");chmodSync(wrapper,0o700);process.env.PATH=temporary+':'+previousPath;process.env.STAGE5_AVAILABILITY_LOG=log;
  ensureAppStage5Objects();const first=readFileSync(log,'utf8');const rows=first.trim().split('\n').map(JSON.parse);assert.equal(rows.filter(a=>a.includes('--batch')).length,1);assert(rows.findIndex(a=>a.includes('remote'))<rows.findIndex(a=>a.includes('--batch')));
  const common=resolve(root,actual(['rev-parse','--git-common-dir']).toString().trim());const beforeSecond=readFileSync(log,'utf8');
  // Acquire a new owner's lock after the first call. Cached immutable availability
  // must neither wait for nor remove this protected foreign owner, and emits no Git.
  withSourceObjectLock(common,()=>{const lock=join(common,sourceObjectLockName),owner=lstatSync(lock);ensureAppStage5Objects();const after=lstatSync(lock);assert.equal(after.dev,owner.dev);assert.equal(after.ino,owner.ino);assert.equal(readFileSync(log,'utf8'),beforeSecond);});
 }finally{process.env.PATH=previousPath;if(previousLog===undefined)delete process.env.STAGE5_AVAILABILITY_LOG;else process.env.STAGE5_AVAILABILITY_LOG=previousLog;rmSync(temporary,{recursive:true,force:true});}
});
