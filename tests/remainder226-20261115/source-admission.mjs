/** Explicit isolated worker admission. Never edits active captures or policies. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,copyFileSync,rmSync,symlinkSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {withSourceObjectLock,sourceObjectLockName} from '../parallel-source-20261110/source-object-lock.mjs';
const root=process.cwd(),base='3ccdd6d026ca0ec51063ff4501901ac92e8ace6a';
const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:16*1024*1024});
const expected=[
 'src/components/calculator-factory-portal.tsx',
 'src/components/remainder-capture-successor.tsx',
 'src/components/remainder-private-delivery.test.tsx',
 'src/components/remainder-private-delivery.tsx',
 'src/lib/calculator-factory/completion/business.ts',
 'src/lib/calculator-factory/completion/remainder-business-recovery.test.ts',
 'src/lib/calculator-factory/completion/remainder-private-delivery.test.ts',
 'src/lib/calculator-factory/private-delivery.ts',
 'src/lib/surface-area-dispatch.test.ts',
].sort();
const dir='docs/remainder226-20261115',captureFile=join(dir,'source-successor.json'),policyFile=join(dir,'source-policy.json');
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>readFileSync(resolve(root,p));
const common=resolve(root,git(['rev-parse','--git-common-dir']).toString().trim());
const checkedGit=args=>{assert(existsSync(join(common,sourceObjectLockName)),'Git source transport must execute under availability lock');return git(args);};
if(process.argv[2]==='--capture'){
 const code=process.argv[3];assert.match(code??'',/^[a-f0-9]{40}$/,'Explicit reviewed code commit required');
 withSourceObjectLock(common,()=>{
  assert.deepEqual(checkedGit(['diff','--name-only','-z',base,code,'--','src']).toString().split('\0').filter(Boolean),expected);
  assert.equal(checkedGit(['diff',base,code,'--','src/calculators','src/lib/registered-snapshot-verification.ts','src/lib/launch-snapshot-verification.ts','src/lib/calculator-factory/registry.ts','src/lib/calculator-factory/completion/remainder-capture-successor.ts','.github','supabase']).length,0,'Historical engines, capture and central controls must be unchanged');
  const record=(ref,p)=>{if(!checkedGit(['ls-tree','--name-only',ref,'--',p]).toString().trim())return null;const blob=checkedGit(['rev-parse',ref+':'+p]).toString().trim(),bytes=checkedGit(['cat-file','blob',blob]);return {path:p,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
  const ancestry=[];let current=code;while(true){ancestry.push(current);if(current===base)break;assert(ancestry.length<64);current=checkedGit(['rev-parse',current+'^']).toString().trim();}
  const capture={kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef:base,codeRef:code,ancestry,rows:expected.map(p=>({path:p,predecessor:record(base,p),current:record(code,p)}))};
  const bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');mkdirSync(dir,{recursive:true});writeFileSync(captureFile,bytes);writeFileSync(policyFile,JSON.stringify({predecessorRef:base,codeRef:code,paths:expected,captureSHA256:sha(bytes)},null,2)+'\n');
 });
}
const policy=JSON.parse(read(policyFile)),captureBytes=read(captureFile);assert.equal(policy.predecessorRef,base);assert.deepEqual(policy.paths,expected);
const result=withSourceObjectLock(common,()=>{
 const input={policy,captureBytes,git:checkedGit,read,root};
 assert.equal(verifyExactStage(input).size,expected.length);
 assert.throws(()=>verifyExactStage({...input,captureBytes:Buffer.from('{}')}),/capture digest/);
 for(const row of JSON.parse(captureBytes).rows){
  assert.throws(()=>verifyExactStage({...input,read:p=>p===row.path?Buffer.from('unapproved substitution'):read(p)}),/Current factory bytes differ/);
  if(row.predecessor)assert.throws(()=>verifyExactStage({...input,read:p=>p===row.path?checkedGit(['cat-file','blob',row.predecessor.blob]):read(p)}),/Current factory bytes differ/);
 }
 assert.throws(()=>verifyExactStage({...input,git:args=>args[0]==='status'?Buffer.from('?? src/unapproved.ts\n'):checkedGit(args)}),/Dirty or unknown/);
 assert.throws(()=>verifyExactStage({...input,git:args=>args.join(' ')==='rev-parse --verify HEAD^{commit}'?Buffer.from(base+'\n'):checkedGit(args)}),/Unreviewed current source delta/);
 const temp=mkdtempSync(join(tmpdir(),'remainder226-symlink-'));
 try{
  for(const p of expected){mkdirSync(dirname(join(temp,p)),{recursive:true});copyFileSync(resolve(root,p),join(temp,p));}
  rmSync(join(temp,expected[0]));symlinkSync(resolve(root,expected[0]),join(temp,expected[0]));
  assert.throws(()=>verifyExactStage({...input,root:temp,read:p=>readFileSync(join(temp,p))}));
 }finally{rmSync(temp,{recursive:true,force:true});}
 return {base,codeRef:policy.codeRef,verifiedHead:checkedGit(['rev-parse','HEAD']).toString().trim(),sourcePaths:expected,sourceCaptureSHA256:policy.captureSHA256,positiveExactObjects:true,negativeControls:['capture tamper','all current paths substituted','all predecessors reverted','unknown dirty source','HEAD reversion','symlink'],allGitReadsAvailabilityLocked:true,historicalMathematicalAndCaptureSourcesUnchanged:true,centralPolicyActivated:false,releaseHold:true};
});
mkdirSync('/tmp/remainder226-evidence',{recursive:true});writeFileSync('/tmp/remainder226-evidence/source-admission.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
