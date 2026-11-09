import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,copyFileSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {completionBindingDependencies,verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
import {verifyN1PublicationBinding} from '../../scripts/n1-publication-lineage.mjs';
import {verifyPublication20CallerLineage} from '../../scripts/publication20-caller-lineage.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const hash=b=>createHash('sha256').update(b).digest('hex');
const tool='src/components/publication20-tool.tsx',oldRef='a955cdad7019a645b7ed2950299d0603ba1784a7';
const historical=git(['show',oldRef+':'+tool]),claim=hash(historical);
const originalClaim=JSON.parse(readFileSync('docs/shortest-publication-20/caller-lineage.json')).sourceHashes[tool];
test('preserves original frequency-to-N1 proof before exact Final successor proof',()=>{
 assert.equal(verifyN1PublicationBinding(tool,historical,originalClaim,git),true);
 assert.equal(verifyCompletionBinding(tool,readFileSync(tool),claim,git),true);
 assert.equal(verifyPublication20CallerLineage(process.cwd()).sourceBindings,20);
});
test('current Final proof rejects a historical caller reversion',()=>assert.throws(()=>verifyCompletionBinding(tool,historical,claim,git),/current successor differs/));
test('current Final proof rejects arbitrary caller tamper',()=>assert.throws(()=>verifyCompletionBinding(tool,Buffer.from('tamper'),claim,git),/current successor differs/));
test('original caller hash claim cannot be replaced by current Final hash',()=>assert.throws(()=>verifyN1PublicationBinding(tool,historical,hash(readFileSync(tool)),git),/historical claim/));
test('historical N1 object corruption cannot be hidden by a valid current source',()=>assert.throws(()=>verifyN1PublicationBinding(tool,historical,originalClaim,args=>args[0]==='cat-file'&&args[2]==='d905119cbb745eee673b4215bcc59359d9692fe1'?Buffer.from('corrupt predecessor'):git(args)),/predecessor binding/));
const finalBinding=JSON.parse(readFileSync('docs/competent-closure-20261108/converter-source-successors.json')).bindings[0];
for(const dep of finalBinding.supplementalSources)test('current Final proof rejects dependency tamper '+dep.path,()=>assert.throws(()=>verifyCompletionBinding(tool,readFileSync(tool),claim,git,p=>p===dep.path?Buffer.from('tamper'):readFileSync(p)),/supplemental source bytes differ/));
function copiedTree(){
 const root=mkdtempSync(path.join(os.tmpdir(),'converter-final-target-'));
 const manifest='docs/shortest-publication-20/caller-lineage.json';
 const names=new Set([...completionBindingDependencies('src/components/calculator-interactive.tsx'),manifest,'docs/calculator-first-20261105/execution-manifest.json','src/lib/frequency-presentation.ts','src/lib/n1-publication-methodology.ts',...Object.keys(JSON.parse(readFileSync(manifest)).sourceHashes),...finalBinding.supplementalSources.map(d=>d.path)]);
 for(const name of names){const p=path.join(root,name);mkdirSync(path.dirname(p),{recursive:true});copyFileSync(name,p);}
 symlinkSync(git(['rev-parse','--absolute-git-dir']).toString().trim(),path.join(root,'.git'),'dir');return root;
}
test('composed proof reads dependencies from its target tree, not process cwd',()=>{
 const root=copiedTree();try{const dep=finalBinding.supplementalSources[0].path;writeFileSync(path.join(root,dep),'tampered target tree');assert.throws(()=>verifyPublication20CallerLineage(root),/supplemental source bytes differ/);}finally{rmSync(root,{recursive:true,force:true});}
});
test('composed proof rejects symlinked target dependency even with correct bytes',()=>{
 const root=copiedTree();try{const dep=finalBinding.supplementalSources[0].path;rmSync(path.join(root,dep));symlinkSync(path.resolve(dep),path.join(root,dep));assert.throws(()=>verifyPublication20CallerLineage(root),/symlink/);}finally{rmSync(root,{recursive:true,force:true});}
});
test('composed proof rejects silent target-tree N1 reversion under the valid original manifest',()=>{
 const root=copiedTree();try{writeFileSync(path.join(root,tool),historical);assert.throws(()=>verifyPublication20CallerLineage(root),/current successor differs/);}finally{rmSync(root,{recursive:true,force:true});}
});
const dir='docs/competent-closure-20261108/';
const json=p=>JSON.parse(readFileSync(p));
test('13cohort ledger preserves540 prior dispositions and adds bounded scopes only',()=>{
 const raw=readFileSync('docs/first-live-closure-20261108/requirements-540.json'),prior=JSON.parse(raw),current=json(dir+'requirements-540.json');assert.equal(hash(raw),current.parentLedgerSHA256);assert.deepEqual(current.counts,prior.counts);assert.equal(current.rows.length,540);
 const ids=[423,424,425,427,428,429,430,431,433,434,437,438,439];
 for(let i=0;i<540;i++){
  const row=current.rows[i],old=prior.rows[i];assert.equal(row.masterId,i+1);assert.equal(row.disposition,old.disposition);assert.equal(row.canonicalAccepted,false);assert.equal(row.certificationGranted,false);assert.equal(row.publicationEligibleEstablished,false);assert.deepEqual(row.newScopedChecks.slice(0,old.newScopedChecks.length),old.newScopedChecks);
  assert.equal(row.newScopedChecks.length-old.newScopedChecks.length,ids.includes(i+1)?2:[432,440].includes(i+1)?1:0);
 }
 assert.equal(current.newFullEngineeringComplete,0);assert.equal(current.newPublicationEligible,0);
});
test('source facts reproduce against native bytes without changing retained output',()=>{
 const file=dir+'converter-source-facts.json',before=readFileSync(file);const result=JSON.parse(execFileSync('python3',[dir+'converter-source-audit.py','--check'],{encoding:'utf8'}));assert.equal(result.ids,13);assert.equal(result.supported,9);assert.equal(result.partial,4);assert.equal(result.approval,false);assert(readFileSync(file).equals(before));
});
test('isolated lock receipt binds final producer but does not attest production freeze',()=>{
 const r=json(dir+'operational-locks-receipt.json');assert.equal(r.passed,true);assert.equal(r.checks.length,2);assert.equal(r.syntheticOnly,true);assert.equal(r.productionWrites,false);assert.equal(r.freezeAttested,false);
 for(const [name,expected] of Object.entries(r.sourceHashes))assert.equal(hash(readFileSync(name)),expected);
 const script=readFileSync('tests/competent-closure-20261108/operational-locks.mjs','utf8');assert.doesNotMatch(script,/\bpg_read_file\b/);assert.match(script,/OPERATIONAL_LOCKS_REPORT/);assert.match(script,/\/tmp\/calcumint-operational-locks-receipt\.json/);
});
test('native renderer proof distinguishes13partial targets and2regressions without authority promotion',()=>{
 const r=json(dir+'converter-final-browser-report.json');assert.equal(r.passed,true);assert.equal(r.journeys.length,60);assert.equal(r.canonicalAccepted,false);assert.equal(r.journeys.filter(x=>x.keyboardExport).length,45);assert.equal(r.journeys.filter(x=>x.batchExportPreserved).length,15);
 const packet=json(dir+'440-reviewer-decision.json');assert.equal(packet.certificationGo,'NO_GO');assert.equal(packet.publicationGo,'NO_GO');assert(Object.values(packet.goNoGoFields).every(v=>v===null));
});
test('all older source bindings and verifier logic remain intact except explicit checker successor',()=>{
 const old=git(['show','9c0b5dc3e3aec18ed03fb6849562ebddc854db06:scripts/product-completion-lineage.mjs']).toString(),now=git(['show','a7a656f71b04b50192485a49b0b56b3fa6bd86b9:scripts/product-completion-lineage.mjs']).toString();
 const parse=s=>JSON.parse(s.slice(s.indexOf('const bindings=')+'const bindings='.length,s.indexOf('\n];\nexport const completionSourceRefs')+2));const before=parse(old),after=parse(now);
 for(const b of before){const a=after.find(x=>x.path===b.path);assert(a);if(b.path==='scripts/publication20-caller-lineage.mjs'){for(const key of ['predecessorRef','predecessorBlob','predecessorSHA256'])assert.equal(a[key],b[key]);assert(a.intermediateSources.some(x=>x.ref===b.successorRef&&x.blob===b.successorBlob&&x.sha256===b.successorSHA256));}else assert.deepEqual(a,b);}
 assert.equal(now.slice(now.indexOf('export const completionSourceRefs')),old.slice(old.indexOf('export const completionSourceRefs')));
});
test('appointment absence is explicitly observed with privileged read-only visibility',()=>{
 const r=json(dir+'reviewer-appointment-counts.json');assert.equal(r.readOnly,true);assert.equal(r.identityCollected,false);assert.equal(r.certificationGranted,false);assert.equal(r.publicationAuthorized,false);
 assert.deepEqual(r.rows.map(x=>x.master_id),[432,440]);for(const row of r.rows){assert.equal(row.read_only,'on');assert.equal(row.observed_actor,'postgres');assert.equal(row.actor_bypass_rls,true);assert.equal(row.exact_candidate_count,0);assert.equal(row.assigned_candidate_count,0);}
});

test('current guard evolution independently preserves historical stages and exact captured targets',()=>{
 const name='scripts/product-completion-lineage.mjs',base='a7a656f71b04b50192485a49b0b56b3fa6bd86b9';
 const old=git(['show',base+':'+name]).toString(),now=readFileSync(name,'utf8');
 const parse=s=>JSON.parse(s.slice(s.indexOf('const bindings=')+'const bindings='.length,s.indexOf('\n];\nexport const completionSourceRefs')+2));
 const before=parse(old),after=parse(now),capture=json('docs/execution-recovery-20261109/source-successors/guard-capture.json').capture;
 const evolved=['scripts/publication20-caller-lineage.mjs','tests/shortest-publication-20/caller-lineage.test.mjs','tests/adoption1535/lineage.test.mjs'];
 for(const b of before){
  const a=after.find(row=>row.path===b.path);assert(a);
  if(!evolved.includes(b.path)){assert.deepEqual(a,b);continue;}
  for(const key of ['path','predecessorRef','predecessorBlob','predecessorSHA256'])assert.equal(a[key],b[key]);
  assert.deepEqual(a.intermediateSources.slice(0,(b.intermediateSources??[]).length),b.intermediateSources??[]);
  assert(a.intermediateSources.some(row=>row.ref===b.successorRef&&row.blob===b.successorBlob&&row.sha256===b.successorSHA256));
  assert.equal(a.successorRef,capture);assert.equal(git(['rev-parse',capture+':'+a.path]).toString().trim(),a.successorBlob);
  const bytes=git(['show',capture+':'+a.path]);assert.equal(hash(bytes),a.successorSHA256);assert(readFileSync(a.path).equals(bytes));
  // Old dependency facts remain exact historical Git proof, not rewritten claims.
  for(const dep of b.supplementalSources??[]){assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);assert.equal(hash(git(['show',dep.ref+':'+dep.path])),dep.sha256);}
  for(const dep of a.supplementalSources??[]){assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);const bytes=git(['show',dep.ref+':'+dep.path]);assert.equal(hash(bytes),dep.sha256);assert(readFileSync(dep.path).equals(bytes));}
 }
 assert.deepEqual(after.filter(row=>!before.some(old=>old.path===row.path)).map(row=>row.path).sort(),['src/components/calculator-interactive.tsx','src/lib/registered-snapshot-verification.ts','tests/acceptance-closure-20261108/receipt-source-path.mjs'].sort());
 assert.equal(now.slice(now.indexOf('export const completionSourceRefs')),old.slice(old.indexOf('export const completionSourceRefs')));
 const guard='tests/acceptance-closure-20261108/converter-final-source.test.mjs';assert(readFileSync(guard).equals(git(['show',capture+':'+guard])));
});
