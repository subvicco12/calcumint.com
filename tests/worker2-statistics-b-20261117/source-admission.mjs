/** Exact worker proposal only; no central source authority is changed. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdtempSync,mkdirSync,copyFileSync,symlinkSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve,join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {withSourceObjectLock,sourceObjectLockName} from '../parallel-source-20261110/source-object-lock.mjs';
const root=process.cwd(),base='6fa8f87433ee8434d1d89aaf93deea0216eb17cb',dir='docs/worker2-statistics-b-20261117';
const raw=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024});
const common=resolve(root,raw(['rev-parse','--git-common-dir']).toString().trim());
const git=args=>{assert(existsSync(join(common,sourceObjectLockName)),'Actual common-directory source lock required');return raw(args);};
const paths=[
 'src/app/admin/worker2-statistics-b-20261117/actions.ts','src/app/admin/worker2-statistics-b-20261117/page.tsx',
 'src/components/worker2-statistics-b-20261117/persistence.tsx','src/components/worker2-statistics-b-20261117/portal.test.tsx','src/components/worker2-statistics-b-20261117/portal.tsx','src/components/worker2-statistics-b-20261117/workbench.tsx',
 'src/lib/worker2-statistics-b-20261117/account.test.ts','src/lib/worker2-statistics-b-20261117/account.ts','src/lib/worker2-statistics-b-20261117/cohort.test.ts','src/lib/worker2-statistics-b-20261117/cohort.ts',
].sort();
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),read=file=>readFileSync(resolve(root,file));
const result=withSourceObjectLock(common,()=>{
 if(process.argv[2]==='--capture'){
  const code=process.argv[3];assert.match(code??'',/^[a-f0-9]{40}$/);
  assert.deepEqual(git(['diff','--name-only','-z',base,code,'--','src']).toString().split('\0').filter(Boolean),paths);
  assert.equal(git(['diff',base,code,'--','src/calculators','src/lib/worker1-construction-20261116','src/components/worker1-construction-20261116','src/app/admin/worker1-construction-20261116','src/lib/calculator-factory/registry.ts','src/lib/registered-snapshot-verification.ts','data','.github','supabase']).length,0);
  const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
  for(const path of paths)assert.equal(git(['ls-tree','--name-only',base,'--',path]).length,0,'Only new reserved files may be added');
  const ancestry=[];let ref=code;while(true){ancestry.push(ref);if(ref===base)break;assert(ancestry.length<64);ref=git(['rev-parse',ref+'^']).toString().trim();}
  const capture=Buffer.from(JSON.stringify({kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef:base,codeRef:code,ancestry,rows:paths.map(path=>({path,predecessor:null,current:record(code,path)}))},null,2)+'\n');
  writeFileSync(dir+'/source-successor.json',capture);writeFileSync(dir+'/source-policy.json',JSON.stringify({predecessorRef:base,codeRef:code,paths,captureSHA256:sha(capture)},null,2)+'\n');
 }
 const policy=JSON.parse(read(dir+'/source-policy.json')),captureBytes=read(dir+'/source-successor.json');assert.equal(policy.predecessorRef,base);assert.deepEqual(policy.paths,paths);
 const input={policy,captureBytes,read,git,root};assert.equal(verifyExactStage(input).size,10);
 for(const path of paths)assert.throws(()=>verifyExactStage({...input,read:p=>p===path?Buffer.from('tamper'):read(p)}),/Current factory bytes differ/);
 assert.throws(()=>verifyExactStage({...input,captureBytes:Buffer.from('{}')}),/capture digest/);
 assert.throws(()=>verifyExactStage({...input,git:a=>a[0]==='status'?Buffer.from('?? src/unapproved.ts\n'):git(a)}),/Dirty or unknown/);
 assert.throws(()=>verifyExactStage({...input,git:a=>a.join(' ')==='rev-parse --verify HEAD^{commit}'?Buffer.from(base+'\n'):git(a)}),/Unreviewed current source delta/);
 const temporary=mkdtempSync(join(tmpdir(),'worker2-stats-source-'));
 try{for(const path of paths){mkdirSync(dirname(join(temporary,path)),{recursive:true});copyFileSync(resolve(root,path),join(temporary,path));}rmSync(join(temporary,paths[0]));symlinkSync(resolve(root,paths[0]),join(temporary,paths[0]));assert.throws(()=>verifyExactStage({...input,root:temporary,read:p=>readFileSync(join(temporary,p))}));}finally{rmSync(temporary,{recursive:true,force:true});}
 const engine='src/calculators/statistics/catalog-batch-4.ts';assert(git(['show',base+':'+engine]).equals(read(engine)));
 return {baseline:base,codeRef:policy.codeRef,verifiedHead:git(['rev-parse','HEAD']).toString().trim(),sourceCaptureSHA256:policy.captureSHA256,paths,ids:[296,297,299],blocked298:true,engineSHA256:sha(read(engine)),currentBytesAndImmutableGitObjectsVerified:true,actualCommonGitLock:true,negativeControls:['all10 current files','capture tamper','dirty/unknown source','HEAD reversion','symlink'],centralSourceAuthorityActivated:false,worker1Untouched:true,engineeringPromotions:0,releaseHold:true};
});
writeFileSync(dir+'/receipts/source-admission.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
