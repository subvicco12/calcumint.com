/** Exact reviewed successor layer. Retained historical guard remains a separate proof. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
export const retainedSourceRef='9fe66f65cd7da2536f9f2f21d32fbc771bee0892';
export const applicationSourceRef='b282c57cc6b1e72adf7435fac1e849b2bdddd85a';
export const evolutionCapturePath='docs/publication-workflows-20261109/source-successors/capture.json';
const lineage='scripts/product-completion-lineage.mjs';
const guard='tests/acceptance-closure-20261108/converter-final-source.test.mjs';
const caller='src/components/calculator-interactive.tsx';
const analysis='src/components/technology-five-analysis.tsx';
const receiptHelper='tests/acceptance-closure-20261108/receipt-source-path.mjs';
const addedPaths=['src/lib/technology-five-batch.ts','src/lib/technology-five-batch.test.ts','src/components/technology-five-batch.tsx','src/components/technology-five-batch.test.tsx'];
const hash=value=>createHash('sha256').update(value).digest('hex');
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export const parseCompletionBindings=source=>JSON.parse(source.slice(source.indexOf('const bindings=')+'const bindings='.length,source.indexOf('\n];\nexport const completionSourceRefs')+2));
export function assertCurrentSourceEvolution(rows,read=readFileSync,sourceGit=git){
 const capture=JSON.parse(read(evolutionCapturePath));
 assert.equal(capture.retainedSourceRef,retainedSourceRef);assert.equal(capture.applicationSourceRef,applicationSourceRef);
 assert.equal(capture.historicalRecordsEdited,false);assert.equal(capture.productionWrites,false);
 const baseline=sourceGit(['show',retainedSourceRef+':'+lineage]);
 const expected=parseCompletionBindings(baseline.toString());
 // This fixed retained snapshot is independently governed by the old f41 anchor.
 assert.equal(hash(baseline),'44b2fe0ac1d954a2492069667c21bedec06b93c392a5314b7331769cfc9cb113');
 assert.equal(capture.retainedMetadataSHA256,hash(baseline));
 const currentCaller=expected.find(row=>row.path===caller);
 assert.equal(currentCaller.supplementalSources.length,83);
 assert.deepEqual(capture.changedDependencies.map(row=>row.path),['src/components/technology-five-analysis.tsx']);
 assert.deepEqual(capture.addedSources.map(row=>row.path),addedPaths);
 for(const dependency of capture.changedDependencies){
  assert.equal(dependency.current.ref,applicationSourceRef);
  const previous=currentCaller.supplementalSources.find(row=>row.path===dependency.path);assert(previous);
  assert.deepEqual(dependency.predecessor,previous);
  Object.assign(previous,dependency.current);
 }
 for(const dependency of capture.addedSources){assert.equal(dependency.ref,applicationSourceRef);assert(!currentCaller.supplementalSources.some(row=>row.path===dependency.path));currentCaller.supplementalSources.push(dependency);}
 const analysisCurrent=capture.changedDependencies[0].current;
 assert.equal(analysisCurrent.path,analysis);
 const oldAnalysis=capture.changedDependencies[0].predecessor;
 assert.deepEqual(capture.analysisBinding,{path:analysis,predecessorRef:oldAnalysis.ref,predecessorBlob:oldAnalysis.blob,predecessorSHA256:oldAnalysis.sha256,successorRef:analysisCurrent.ref,successorBlob:analysisCurrent.blob,successorSHA256:analysisCurrent.sha256,supplementalSources:[currentCaller.supplementalSources.find(dep=>dep.path==='src/lib/technology-five-analysis.ts'),...capture.addedSources]});
 expected.push(capture.analysisBinding);
 const oldHelper=expected.find(row=>row.path===receiptHelper);
 assert.deepEqual(capture.helperPredecessor,{ref:oldHelper.successorRef,blob:oldHelper.successorBlob,sha256:oldHelper.successorSHA256});
 oldHelper.intermediateSources.push(capture.helperPredecessor);
 Object.assign(oldHelper,{successorRef:capture.helperCurrent.ref,successorBlob:capture.helperCurrent.blob,successorSHA256:capture.helperCurrent.sha256});
 const helperConsumers=expected.filter(row=>(row.supplementalSources??[]).some(dep=>dep.path===receiptHelper));
 assert.deepEqual(helperConsumers.map(row=>row.path),['scripts/publication20-caller-lineage.mjs']);
 for(const row of helperConsumers)for(const dependency of row.supplementalSources)if(dependency.path===receiptHelper){assert.deepEqual(dependency,{path:receiptHelper,...capture.helperPredecessor});Object.assign(dependency,{path:receiptHelper,...capture.helperCurrent});}
 const guarded=expected.filter(row=>(row.supplementalSources??[]).some(dep=>dep.path===guard));
 assert.deepEqual(guarded.map(row=>row.path),['scripts/publication20-caller-lineage.mjs']);
 for(const row of guarded)for(const dependency of row.supplementalSources)if(dependency.path===guard){assert.deepEqual(dependency,capture.guardPredecessor);Object.assign(dependency,capture.guardCurrent);}
 assert.deepEqual(rows,expected,'Only the exact reviewed current dependencies may advance');
 const current=read(lineage).toString();assert.equal(current.slice(current.indexOf('export const completionSourceRefs')),baseline.toString().slice(baseline.toString().indexOf('export const completionSourceRefs')));
 // Validate every source through the supplied target reader, never process cwd.
 for(const row of rows){
  const stages=[{ref:row.predecessorRef,blob:row.predecessorBlob,sha256:row.predecessorSHA256},{ref:row.successorRef,blob:row.successorBlob,sha256:row.successorSHA256},...row.intermediateSources??[]];
  for(const stage of stages)verify(stage,row.path,false);
  assert(read(row.path).equals(sourceGit(['show',row.successorRef+':'+row.path])));
  for(const dependency of row.supplementalSources??[])verify(dependency,dependency.path,true);
 }
 function verify(stage,path,current){
  assert.equal(sourceGit(['rev-parse','--verify',stage.ref+'^{commit}']).toString().trim(),stage.ref);
  assert.equal(sourceGit(['rev-parse',stage.ref+':'+path]).toString().trim(),stage.blob);
  const bytes=sourceGit(['cat-file','blob',stage.blob]);assert.equal(hash(bytes),stage.sha256);
  if(current)assert(read(path).equals(bytes),'Current target source differs: '+path);
 }
 return capture;
}
