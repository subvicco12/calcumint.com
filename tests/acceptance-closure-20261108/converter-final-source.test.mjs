import {assertCurrentSourceEvolution,retainedSourceRef} from '../publication-workflows-20261109/current-source-evolution.mjs';
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

// The original cohort comparisons run against the exact retained metadata stage,
// whose bytes are still available at the already-governed00651 application capture.
// Current evolution is independently and completely checked below.
const retainedCohortRef='00651cc382be5dcbd596882071787fd6702c13d3';
const parseBindings=source=>JSON.parse(source.slice(source.indexOf('const bindings=')+'const bindings='.length,source.indexOf('\n];\nexport const completionSourceRefs')+2));
function readRetainedCohortSource(name,encoding){
 const lineage='scripts/product-completion-lineage.mjs',source=git(['show',retainedCohortRef+':'+lineage]);
 if(name===lineage)return encoding==='utf8'?source.toString():source;
 const rows=parseBindings(source.toString()),row=rows.find(row=>row.path===name),dep=rows.flatMap(row=>row.supplementalSources??[]).find(dep=>dep.path===name);
 const ref=row?.successorRef??dep?.ref;assert(ref,'Missing exact retained cohort source '+name);
 const bytes=git(['show',ref+':'+name]);return encoding==='utf8'?bytes.toString():bytes;
}
test('retained cohort guard evolution preserves historical stages and exact captured targets',()=>{
 const name='scripts/product-completion-lineage.mjs',base='a7a656f71b04b50192485a49b0b56b3fa6bd86b9';
 const old=git(['show',base+':'+name]).toString(),now=readRetainedCohortSource(name,'utf8');
 const parse=s=>JSON.parse(s.slice(s.indexOf('const bindings=')+'const bindings='.length,s.indexOf('\n];\nexport const completionSourceRefs')+2));
 const before=parse(old),after=parse(now),capture=json('docs/execution-recovery-20261109/source-successors/guard-capture.json').capture;
 const forwarding=json('docs/execution-recovery-20261109/source-successors/reader-forwarding/capture.json');
 const cohort=json('docs/cohort22-closure-20261109/source-successors/methodology-revision.json');
 const evolved=['scripts/publication20-caller-lineage.mjs','scripts/check-shortest-publication20.mjs','tests/shortest-publication-20/caller-lineage.test.mjs','tests/adoption1535/lineage.test.mjs'];
 for(const b of before){
  const a=after.find(row=>row.path===b.path);assert(a);
  if(!evolved.includes(b.path)){assert.deepEqual(a,b);continue;}
  for(const key of ['path','predecessorRef','predecessorBlob','predecessorSHA256'])assert.equal(a[key],b[key]);
  assert.deepEqual(a.intermediateSources.slice(0,(b.intermediateSources??[]).length),b.intermediateSources??[]);
  assert(a.intermediateSources.some(row=>row.ref===b.successorRef&&row.blob===b.successorBlob&&row.sha256===b.successorSHA256));
  const target=b.path==='scripts/publication20-caller-lineage.mjs'?cohort.guardCapture:b.path==='scripts/check-shortest-publication20.mjs'?forwarding.wrapperCapture:capture;
  assert.equal(a.successorRef,target);assert.equal(git(['rev-parse',target+':'+a.path]).toString().trim(),a.successorBlob);
  const bytes=git(['show',target+':'+a.path]);assert.equal(hash(bytes),a.successorSHA256);assert(readRetainedCohortSource(a.path).equals(bytes));
  // Old dependency facts remain exact historical Git proof, not rewritten claims.
  for(const dep of b.supplementalSources??[]){assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);assert.equal(hash(git(['show',dep.ref+':'+dep.path])),dep.sha256);}
  for(const dep of a.supplementalSources??[]){assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);const bytes=git(['show',dep.ref+':'+dep.path]);assert.equal(hash(bytes),dep.sha256);assert(readRetainedCohortSource(dep.path).equals(bytes));}
 }
 assert.deepEqual(after.filter(row=>!before.some(old=>old.path===row.path)).map(row=>row.path).sort(),['src/components/calculator-interactive.tsx','src/lib/registered-snapshot-verification.ts','tests/acceptance-closure-20261108/receipt-source-path.mjs','scripts/check-current-six-candidate-evidence.mjs','src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts'].sort());
 assert.equal(now.slice(now.indexOf('export const completionSourceRefs')),old.slice(old.indexOf('export const completionSourceRefs')));
 const guard='tests/acceptance-closure-20261108/converter-final-source.test.mjs';assert(readRetainedCohortSource(guard).equals(git(['show',cohort.guardCapture+':'+guard])));
 // Independently retain all stages present immediately before the reader-forwarding repair.
 const previous=parse(git(['show',forwarding.wrapperCapture+':'+name]).toString());
 for(const b of previous){const a=after.find(row=>row.path===b.path);assert(a);
  if(b.path==='src/components/calculator-interactive.tsx'){
   for(const key of ['path','predecessorRef','predecessorBlob','predecessorSHA256'])assert.equal(a[key],b[key]);
   assert.deepEqual(a.supplementalSources.slice(0,b.supplementalSources.length),b.supplementalSources);
   const extra=a.supplementalSources.slice(b.supplementalSources.length);
   assert.deepEqual(extra.map(dep=>dep.path).sort(),['src/components/technology-worked-example.tsx','src/lib/presentation-entitlements.ts','src/lib/technology-capture-trust.ts'].sort());
   for(const dep of extra){assert.equal(dep.ref,cohort.helperCapture);assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);const bytes=git(['show',dep.ref+':'+dep.path]);assert.equal(hash(bytes),dep.sha256);assert(readRetainedCohortSource(dep.path).equals(bytes));}
   assert.deepEqual(a.intermediateSources.slice(0,(b.intermediateSources??[]).length),b.intermediateSources??[]);
   assert(a.intermediateSources.some(row=>row.ref===b.successorRef&&row.blob===b.successorBlob&&row.sha256===b.successorSHA256));
   assert.equal(a.successorRef,cohort.uiCapture);assert.equal(git(['rev-parse',a.successorRef+':'+a.path]).toString().trim(),a.successorBlob);
   const bytes=git(['show',a.successorRef+':'+a.path]);assert.equal(hash(bytes),a.successorSHA256);assert(readRetainedCohortSource(a.path).equals(bytes));continue;
  }
  if(b.path==='tests/acceptance-closure-20261108/receipt-source-path.mjs'){
   for(const key of ['path','predecessorRef','predecessorBlob','predecessorSHA256'])assert.equal(a[key],b[key]);
   assert.deepEqual(a.intermediateSources.slice(0,(b.intermediateSources??[]).length),b.intermediateSources??[]);
   assert(a.intermediateSources.some(row=>row.ref===b.successorRef&&row.blob===b.successorBlob&&row.sha256===b.successorSHA256));
   assert.equal(a.successorRef,cohort.guardCapture);assert.equal(git(['rev-parse',a.successorRef+':'+a.path]).toString().trim(),a.successorBlob);
   const bytes=git(['show',a.successorRef+':'+a.path]);assert.equal(hash(bytes),a.successorSHA256);assert(readRetainedCohortSource(a.path).equals(bytes));
   for(const dep of b.supplementalSources??[]){assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);assert.equal(hash(git(['show',dep.ref+':'+dep.path])),dep.sha256);}
   for(const dep of a.supplementalSources??[]){assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);const bytes=git(['show',dep.ref+':'+dep.path]);assert.equal(hash(bytes),dep.sha256);assert(readRetainedCohortSource(dep.path).equals(bytes));}continue;
  }
  if(!['scripts/publication20-caller-lineage.mjs','scripts/check-shortest-publication20.mjs'].includes(b.path)){assert.deepEqual(a,b);continue;}for(const key of ['path','predecessorRef','predecessorBlob','predecessorSHA256'])assert.equal(a[key],b[key]);assert.deepEqual(a.intermediateSources.slice(0,(b.intermediateSources??[]).length),b.intermediateSources??[]);assert(a.intermediateSources.some(row=>row.ref===b.successorRef&&row.blob===b.successorBlob&&row.sha256===b.successorSHA256));for(const dep of b.supplementalSources??[]){assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);assert.equal(hash(git(['show',dep.ref+':'+dep.path])),dep.sha256);}}
});

test('retained cohort inventory evolution preserves its exact caller dependency history',()=>{
 const capture=json('docs/cohort22-closure-20261109/source-successors/methodology-revision.json');
 const s=readRetainedCohortSource('scripts/product-completion-lineage.mjs','utf8'),rows=JSON.parse(s.slice(s.indexOf('const bindings=')+'const bindings='.length,s.indexOf('\n];\nexport const completionSourceRefs')+2));
 const current=rows.find(row=>row.path===capture.inventoryBefore.path),old=capture.inventoryBefore;
 assert.equal(old.path,'src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts');
 const beforeSource=git(['show',capture.inventoryBaselineCapture+':scripts/product-completion-lineage.mjs']).toString();
 const beforeRows=JSON.parse(beforeSource.slice(beforeSource.indexOf('const bindings=')+'const bindings='.length,beforeSource.indexOf('\n];\nexport const completionSourceRefs')+2));
 assert.deepEqual(old,beforeRows.find(row=>row.path===old.path));
 assert.deepEqual({...current,supplementalSources:old.supplementalSources},old);
 assert.equal(current.supplementalSources.length,old.supplementalSources.length);
 for(const [index,dep] of current.supplementalSources.entries()){
  const historical=old.supplementalSources[index];assert.equal(git(['rev-parse',historical.ref+':'+historical.path]).toString().trim(),historical.blob);assert.equal(hash(git(['show',historical.ref+':'+historical.path])),historical.sha256);
  if(dep.path==='src/components/calculator-interactive.tsx')assert.equal(dep.ref,capture.uiCapture);else assert.deepEqual(dep,historical);
  assert.equal(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);const bytes=git(['show',dep.ref+':'+dep.path]);assert.equal(hash(bytes),dep.sha256);assert(readRetainedCohortSource(dep.path).equals(bytes));
 }
});

function proveRetainedSourceEvolution(rows,read=readFileSync,sourceGit=git){
 const evidence=json('docs/first-five-20261109/ci-recovery/source-evolution/capture.json');
 const name='scripts/product-completion-lineage.mjs',captured=sourceGit(['show',evidence.capture+':'+name]).toString(),expected=parseBindings(captured);
 assert.equal(hash(Buffer.from(captured)),'61d41da20bcb497e2c8d3825af55a327dac30af75843edc6ae6902c404d430b4','Exact adopted598 metadata snapshot required');
 const guard=evidence.guardPath,guardBytes=sourceGit(['show',evidence.capture+':'+guard]);
 assert.equal(hash(guardBytes),evidence.guardSHA256);assert.equal(sourceGit(['rev-parse',evidence.capture+':'+guard]).toString().trim(),evidence.guardBlob);assert(read(guard).equals(guardBytes));
 const consumers=expected.filter(row=>(row.supplementalSources??[]).some(dep=>dep.path===guard));assert.deepEqual(consumers.map(row=>row.path),evidence.guardConsumers);
 // Exactly one current test-source dependency advances. Every other metadata field
 // is byte-for-byte the adopted main-ancestor capture, including all older stages.
 for(const row of consumers)for(const dep of row.supplementalSources)if(dep.path===guard)Object.assign(dep,{ref:evidence.capture,blob:evidence.guardBlob,sha256:evidence.guardSHA256});
 assert.deepEqual(rows,expected);
 const retained=parseBindings(sourceGit(['show',retainedCohortRef+':'+name]).toString());
 for(const before of retained){const after=rows.find(row=>row.path===before.path);assert(after);
  for(const key of ['path','predecessorRef','predecessorBlob','predecessorSHA256'])assert.equal(after[key],before[key]);
  assert.deepEqual((after.intermediateSources??[]).slice(0,(before.intermediateSources??[]).length),before.intermediateSources??[]);
  if(after.successorRef!==before.successorRef)assert(after.intermediateSources.some(stage=>stage.ref===before.successorRef&&stage.blob===before.successorBlob&&stage.sha256===before.successorSHA256));
  for(const dep of before.supplementalSources??[]){assert.equal(sourceGit(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);assert.equal(hash(sourceGit(['show',dep.ref+':'+dep.path])),dep.sha256);}
 }
 assert.deepEqual(rows.filter(row=>!retained.some(old=>old.path===row.path)).map(row=>row.path),['tests/full-product-batch17/workflow.test.mjs']);
 for(const row of rows){
  for(const stage of [{ref:row.predecessorRef,blob:row.predecessorBlob,sha256:row.predecessorSHA256},{ref:row.successorRef,blob:row.successorBlob,sha256:row.successorSHA256},...row.intermediateSources??[]]){assert.equal(sourceGit(['rev-parse',stage.ref+':'+row.path]).toString().trim(),stage.blob);assert.equal(hash(sourceGit(['show',stage.ref+':'+row.path])),stage.sha256);}
  assert(read(row.path).equals(sourceGit(['show',row.successorRef+':'+row.path])));
  for(const dep of row.supplementalSources??[]){assert.equal(sourceGit(['rev-parse',dep.ref+':'+dep.path]).toString().trim(),dep.blob);const bytes=sourceGit(['show',dep.ref+':'+dep.path]);assert.equal(hash(bytes),dep.sha256);assert(read(dep.path).equals(bytes));}
 }
 const previous=sourceGit(['show','a7a656f71b04b50192485a49b0b56b3fa6bd86b9:'+name]).toString(),current=read(name).toString();assert.equal(current.slice(current.indexOf('export const completionSourceRefs')),previous.slice(previous.indexOf('export const completionSourceRefs')));
}
// Current bytes require a complete exact successor proof. The unchanged historical
// assertions above additionally run on the exact retained source tree, preserving
// the f41 guard's adopted598 hash, predecessor expectations and verifier tail.
function proveCurrentSourceEvolution(rows,read=readFileSync,sourceGit=git){
 assertCurrentSourceEvolution(rows,read,sourceGit);
 const retained=name=>sourceGit(['show',retainedSourceRef+':'+name]);
 proveRetainedSourceEvolution(parseBindings(retained('scripts/product-completion-lineage.mjs').toString()),retained,sourceGit);
}
test('current first-five source evolution requires exact adopted rows, source bytes and every retained stage',()=>proveCurrentSourceEvolution(parseBindings(readFileSync('scripts/product-completion-lineage.mjs','utf8'))));
test('current first-five evolution rejects metadata reversion, same-target dependency drift and missing provenance',()=>{
 const rows=parseBindings(readFileSync('scripts/product-completion-lineage.mjs','utf8')),reverted=structuredClone(rows),workflow=reverted.find(row=>row.path==='.github/workflows/ci.yml');workflow.successorRef='b2d72aa66293b752739b7924745a57a51c4b5acb';assert.throws(()=>proveCurrentSourceEvolution(reverted));
 assert.throws(()=>proveCurrentSourceEvolution(rows,name=>name==='src/components/calculator-interactive.tsx'?Buffer.from('tampered current caller'):readFileSync(name)));
 assert.throws(()=>proveCurrentSourceEvolution(rows,readFileSync,()=>{throw Error('Missing exact evolution provenance');}),/Missing exact evolution provenance/);
});
