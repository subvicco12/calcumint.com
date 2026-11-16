/** Isolated worker proposal only. No central manifest, ledger or transport modification. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,copyFileSync,rmSync,symlinkSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {withSourceObjectLock,sourceObjectLockName} from '../parallel-source-20261110/source-object-lock.mjs';
const root=process.cwd(),base='8296454dc7244205ef4cf0b6e0b41c38f90af20f';
const rawGit=args=>execFileSync('git',args,{cwd:root,maxBuffer:16*1024*1024});
const common=resolve(root,rawGit(['rev-parse','--git-common-dir']).toString().trim());
const git=args=>{assert(existsSync(join(common,sourceObjectLockName)),'Immutable source reads require availability lock');return rawGit(args);};
const paths=[
 'src/app/admin/worker1-construction-20261116/actions.ts','src/app/admin/worker1-construction-20261116/page.tsx',
 'src/components/worker1-construction-20261116/persistence.tsx','src/components/worker1-construction-20261116/portal.test.tsx','src/components/worker1-construction-20261116/portal.tsx',
 'src/lib/worker1-construction-20261116/account.test.ts','src/lib/worker1-construction-20261116/account.ts','src/lib/worker1-construction-20261116/cohort.test.ts','src/lib/worker1-construction-20261116/cohort.ts'
].sort();
const ids=[343,344,346,350,354,355,356,359,360,361],dir='docs/worker1-construction-20261116',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>readFileSync(resolve(root,p));
if(process.argv[2]==='--capture'){
 const code=process.argv[3];assert.match(code??'',/^[a-f0-9]{40}$/,'Explicit reviewed code commit required');
 withSourceObjectLock(common,()=>{
  assert.deepEqual(git(['diff','--name-only','-z',base,code,'--','src']).toString().split('\0').filter(Boolean),paths);
  const preserved=['src/calculators/engineering-construction/catalog-batch-1.ts','src/calculators/engineering-construction/catalog-batch-2.ts','src/calculators/engineering-construction/catalog-batch-3.ts','src/lib/registered-snapshot-verification.ts','src/lib/calculator-factory/registry.ts','data/catalog/master-catalog-2026.csv'];
  assert.equal(git(['diff',base,code,'--',...preserved,'.github','supabase']).length,0);
  const record=(ref,p)=>{if(!git(['ls-tree','--name-only',ref,'--',p]).toString().trim())return null;const blob=git(['rev-parse',ref+':'+p]).toString().trim(),b=git(['cat-file','blob',blob]);return{path:p,ref,blob,bytes:b.length,sha256:sha(b)};};
  const ancestry=[];let ref=code;while(true){ancestry.push(ref);if(ref===base)break;assert(ancestry.length<64);ref=git(['rev-parse',ref+'^']).toString().trim();}
  const bytes=Buffer.from(JSON.stringify({kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef:base,codeRef:code,ancestry,rows:paths.map(p=>({path:p,predecessor:record(base,p),current:record(code,p)}))},null,2)+'\n');
  mkdirSync(dir,{recursive:true});writeFileSync(dir+'/source-successor.json',bytes);writeFileSync(dir+'/source-policy.json',JSON.stringify({predecessorRef:base,codeRef:code,paths,captureSHA256:sha(bytes)},null,2)+'\n');
  writeFileSync(dir+'/retained-bindings.json',JSON.stringify({baseline:base,preserved:preserved.map(p=>record(base,p)),canonicalSourceApplicabilityApproved:false},null,2)+'\n');
 });
}
const receipt=withSourceObjectLock(common,()=>{
 const policy=JSON.parse(read(dir+'/source-policy.json')),captureBytes=read(dir+'/source-successor.json');assert.equal(policy.predecessorRef,base);assert.deepEqual(policy.paths,paths);
 const input={policy,captureBytes,git,read,root};assert.equal(verifyExactStage(input).size,9);
 for(const p of paths)assert.throws(()=>verifyExactStage({...input,read:q=>p===q?Buffer.from('tamper'):read(q)}),/Current factory bytes differ/);
 assert.throws(()=>verifyExactStage({...input,captureBytes:Buffer.from('{}')}),/capture digest/);
 assert.throws(()=>verifyExactStage({...input,git:a=>a[0]==='status'?Buffer.from('?? src/unapproved.ts\n'):git(a)}),/Dirty or unknown/);
 assert.throws(()=>verifyExactStage({...input,git:a=>a.join(' ')==='rev-parse --verify HEAD^{commit}'?Buffer.from(base+'\n'):git(a)}),/Unreviewed current source delta/);
 const temp=mkdtempSync(join(tmpdir(),'worker1-source-symlink-'));try{for(const p of paths){mkdirSync(dirname(join(temp,p)),{recursive:true});copyFileSync(resolve(root,p),join(temp,p));}rmSync(join(temp,paths[0]));symlinkSync(resolve(root,paths[0]),join(temp,paths[0]));assert.throws(()=>verifyExactStage({...input,root:temp,read:p=>readFileSync(join(temp,p))}));}finally{rmSync(temp,{recursive:true,force:true});}
 const ledger=JSON.parse(git(['show',base+':docs/milestone100-20261114/requirements-540.json']));
 const qualified=new Set(ledger.rows.filter(r=>['CONFIRMED_SCOPED_ENGINEERING_AT_EXACT_HEAD','PREVIOUSLY_CONFIRMED_SCOPED','SCOPED_ENGINEERING_COMPLETE'].includes(r.engineeringOverlay?.state)).map(r=>r.masterId));
 const previous=JSON.parse(git(['show',base+':docs/four-worker-integration-20261115/candidate-dispositions.json']));for(const r of previous.rows)qualified.add(r.catalogId);assert.equal(qualified.size,81);
 const blocked=new Set(ledger.rows.filter(r=>r.canonicalDisposition==='IDENTITY_OR_SCOPE_BLOCKED').map(r=>r.masterId));assert.equal(blocked.size,43);
 const worker3=new Set([...Array.from({length:8},(_,i)=>284+i),300,329,...Array.from({length:10},(_,i)=>333+i)]),physics=new Set([322,323,324,325,327]);
 for(const id of ids)assert(!qualified.has(id)&&!blocked.has(id)&&!worker3.has(id)&&!physics.has(id));
 return {baseline:base,codeRef:policy.codeRef,verifiedHead:git(['rev-parse','HEAD']).toString().trim(),sourceCaptureSHA256:policy.captureSHA256,paths,ids,qualifiedExclusionCount:81,authorityExclusionCount:43,worker3AndPhysicsExcluded:true,exactObjectsVerified:true,negativeControls:['all9 current bytes','capture tamper','unknown dirty source','HEAD reversion','symlink'],sourceObjectReadsAvailabilityLocked:true,centralSourceManifestActivated:false,engineeringPromotion:false,releaseHold:true};
});
mkdirSync('/tmp/worker1-construction-evidence',{recursive:true});writeFileSync('/tmp/worker1-construction-evidence/source-admission.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
