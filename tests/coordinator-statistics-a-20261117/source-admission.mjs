/** Standalone coordinator proposal; central runtime source authority is untouched. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,copyFileSync,rmSync,symlinkSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {withSourceObjectLock,sourceObjectLockName} from '../parallel-source-20261110/source-object-lock.mjs';
const root=process.cwd(),base='6fa8f87433ee8434d1d89aaf93deea0216eb17cb',worker='0253dc320e6af34afa4ef2f0a1af08bd1812d871',dir='docs/coordinator-statistics-a-20261117';
const rawGit=args=>execFileSync('git',args,{cwd:root,maxBuffer:16*1024*1024}),common=resolve(root,rawGit(['rev-parse','--git-common-dir']).toString().trim()),sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>readFileSync(resolve(root,p));
const paths=[
 'src/app/admin/worker1-statistics-a-20261117/actions.ts','src/app/admin/worker1-statistics-a-20261117/page.tsx',
 'src/components/worker1-statistics-a-20261117/portal.test.tsx','src/components/worker1-statistics-a-20261117/portal.tsx',
 'src/lib/worker1-statistics-a-20261117/account.test.ts','src/lib/worker1-statistics-a-20261117/account.ts','src/lib/worker1-statistics-a-20261117/cohort.test.ts','src/lib/worker1-statistics-a-20261117/cohort.ts',
 'src/components/calculator-factory-workbench.tsx','src/lib/calculator-factory/completion/business.ts','src/lib/calculator-factory/registry.test.ts','src/lib/calculator-factory/registry.ts','src/lib/registered-snapshot-verification.ts',
 'src/lib/coordinator-statistics-a-20261117/contracts.ts','src/lib/coordinator-statistics-a-20261117/shared-integration.test.ts','src/lib/coordinator-statistics-a-20261117/array-workbench.test.tsx',
].sort();
let ownsAvailabilityLock=false;
const underLock=work=>withSourceObjectLock(common,()=>{assert(!ownsAvailabilityLock);ownsAvailabilityLock=true;try{return work();}finally{ownsAvailabilityLock=false;}});
const reader=cache=>args=>{
 assert(ownsAvailabilityLock&&existsSync(join(common,sourceObjectLockName)),'Actual common-directory availability lock required for every reader and wrapper');
 const key=JSON.stringify(args),immutable=args[0]!=='status'&&!args.some(x=>x.includes('HEAD'));
 if(immutable&&cache.has(key))return cache.get(key);
 const bytes=rawGit(args);if(immutable)cache.set(key,bytes);return bytes;
};
assert.throws(()=>reader(new Map())(['cat-file','commit',base]),/availability lock/);
if(process.argv[2]==='--capture'){
 const code=process.argv[3];assert.match(code??'',/^[a-f0-9]{40}$/,'Explicit reviewed code commit required');
 underLock(()=>{
  const git=reader(new Map());assert.deepEqual(git(['diff','--name-only','-z',base,code,'--','src']).toString().split('\0').filter(Boolean),paths);
  assert.equal(git(['diff',worker,code,'--','src/lib/worker1-statistics-a-20261117','src/components/worker1-statistics-a-20261117','src/app/admin/worker1-statistics-a-20261117','docs/worker1-statistics-a-20261117','tests/worker1-statistics-a-20261117']).length,0,'Original worker bytes and evidence stay immutable');
  assert.equal(git(['diff',base,code,'--','src/calculators','src/lib/native-delivery/factory-delivery-catalog.ts','supabase','data/catalog']).length,0,'No math, native allowlist, migration or ledger edits');
  const record=(ref,p)=>{if(!git(['ls-tree','--name-only',ref,'--',p]).toString().trim())return null;const blob=git(['rev-parse',ref+':'+p]).toString().trim(),b=git(['cat-file','blob',blob]);return {path:p,ref,blob,bytes:b.length,sha256:sha(b)};};
  const ancestry=[];let ref=code;while(true){ancestry.push(ref);if(ref===base)break;assert(ancestry.length<64);ref=git(['rev-parse',ref+'^']).toString().trim();}
  assert(ancestry.includes(worker));
  const bytes=Buffer.from(JSON.stringify({kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef:base,codeRef:code,ancestry,rows:paths.map(p=>({path:p,predecessor:record(base,p),current:record(code,p)}))},null,2)+'\n');
  mkdirSync(dir,{recursive:true});writeFileSync(dir+'/source-successor.json',bytes);
  writeFileSync(dir+'/source-policy.mjs','// Proposed independent pin for coordinator review; not central runtime authority.\nexport const policy=Object.freeze('+JSON.stringify({predecessorRef:base,codeRef:code,paths,captureSHA256:sha(bytes)},null,2)+');\n');
 });
}
const {policy}=await import('../../'+dir+'/source-policy.mjs');
const receipt=underLock(()=>{
 const git=reader(new Map()),wrapped=args=>git([...args]),captureBytes=read(dir+'/source-successor.json');
 assert.equal(policy.predecessorRef,base);assert.deepEqual(policy.paths,paths);
 const input={policy,captureBytes,git:wrapped,read,root};assert.equal(verifyExactStage(input).size,16);
 for(const p of paths)assert.throws(()=>verifyExactStage({...input,read:q=>p===q?Buffer.from('tamper'):read(q)}),/Current factory bytes differ/);
 assert.throws(()=>verifyExactStage({...input,captureBytes:Buffer.from('{}')}),/capture digest/);
 assert.throws(()=>verifyExactStage({...input,git:a=>a[0]==='status'?Buffer.from('?? src/unapproved.ts\n'):wrapped(a)}),/Dirty or unknown/);
 assert.throws(()=>verifyExactStage({...input,git:a=>a.join(' ')==='rev-parse --verify HEAD^{commit}'?Buffer.from(base+'\n'):wrapped(a)}),/Unreviewed current source delta/);
 const p=paths[0],capture=JSON.parse(captureBytes),row=capture.rows.find(r=>r.predecessor);
 assert(row);const previous=wrapped(['cat-file','blob',row.predecessor.blob]);assert.throws(()=>verifyExactStage({...input,read:q=>q===row.path?previous:read(q)}),/Current factory bytes differ/);
 const temp=mkdtempSync(join(tmpdir(),'statistics-source-symlink-'));try{for(const q of paths){mkdirSync(dirname(join(temp,q)),{recursive:true});copyFileSync(resolve(root,q),join(temp,q));}rmSync(join(temp,p));symlinkSync(resolve(root,p),join(temp,p));assert.throws(()=>verifyExactStage({...input,root:temp,read:q=>readFileSync(join(temp,q))}));}finally{rmSync(temp,{recursive:true,force:true});}
 return {kind:'ISOLATED_EXACT_SOURCE_ADMISSION_PROPOSAL',baseline:base,workerCommit:worker,codeRef:policy.codeRef,verifiedHead:wrapped(['rev-parse','HEAD']).toString().trim(),captureSHA256:policy.captureSHA256,pathCount:paths.length,sourceObjectAvailabilityLock:'ACTUAL_COMMON_DIRECTORY_READER_AND_WRAPPER_CHECKED',positive:'PASS',negativeControls:['all16 current source tamper','capture digest','unknown source','HEAD predecessor reversion','individual predecessor substitution','symlink','reader outside lock'],centralAdmissionActivated:false,Worker2FilesTouched:false,promotions:0,releaseHold:true};
});
assert.throws(()=>reader(new Map())(['cat-file','commit',base]),/availability lock/);
writeFileSync(dir+'/validation/source-admission.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
