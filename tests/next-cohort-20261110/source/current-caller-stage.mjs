/** Exact current caller stage; original1ec/d416/f41 proofs remain independent. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
export const priorStageRef='1ec63cd11626df15063546c7e5bfedecec33f6ee';
export const callerAppRef='2d0e2622292930d1992813998608d933ddf5024e';
export const contextAppRef='2d0e2622292930d1992813998608d933ddf5024e';
export const stageCapturePath='docs/next-cohort-20261110/source-successors/caller-capture-revision3.json';
const metadata='scripts/product-completion-lineage.mjs',caller='src/components/calculator-interactive.tsx',helper='tests/acceptance-closure-20261108/receipt-source-path.mjs',guard='tests/acceptance-closure-20261108/converter-final-source.test.mjs';
export const newCallerDependencies=Object.freeze(['src/components/technology-next-analysis.test.tsx','src/components/technology-next-analysis.tsx','src/components/technology-next-batch.tsx','src/components/technology-next-integration.test.tsx','src/lib/native-delivery/technology-next-catalog.ts','src/lib/technology-next-analysis.test.ts','src/lib/technology-next-analysis.ts','src/lib/technology-next-batch.test.ts','src/lib/technology-next-batch.ts','src/lib/technology-next-capture-trust.test.ts','src/lib/technology-next-capture-trust.ts','src/lib/technology-current-presentation.ts','src/lib/technology-current-presentation.test.ts']);
export const stageVerificationPaths=Object.freeze(['tests/next-cohort-20261110/source/current-caller-stage.mjs','tests/publication-workflows-20261109/source-evolution.test.mjs','tests/first-five-20261109/crossed-dependency-source.test.mjs']);
const hash=b=>createHash('sha256').update(b).digest('hex');
export const stageGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export const parseStageRows=s=>JSON.parse(s.slice(s.indexOf('const bindings=')+'const bindings='.length,s.indexOf('\n];\nexport const completionSourceRefs')+2));
export function priorStageRead(path,git=stageGit){return git(['show',priorStageRef+':'+path]);}
export function verifyNextCallerStage(rows,read=readFileSync,git=stageGit){
 // Cache immutable Git objects within this proof only; target reads remain live.
 const rawGit=git,objects=new Map();git=args=>{const key=JSON.stringify(args);if(!objects.has(key))objects.set(key,rawGit(args));return objects.get(key);};
 const c=JSON.parse(read(stageCapturePath)),oldDraft=JSON.parse(read('docs/next-cohort-20261110/source-successors/caller-capture.json')),stage2=JSON.parse(read('docs/next-cohort-20261110/source-successors/caller-capture-revision2.json')),baseline=priorStageRead(metadata,git),expected=parseStageRows(baseline.toString());
 assert.equal(c.stageRevision,3);assert.equal(hash(JSON.stringify(stage2)),'0433050bb117e6a6bb622b71965d1e98f8f4f0d47706131147825e6ceaa99102');assert.deepEqual(c.supersededStage2Helper,stage2.helperSource);assert.equal(hash(JSON.stringify(oldDraft)),'ac4c5551dd3d9029a998672d6f7a1d6f7034d504518285610f2b72a0aba963a8');
 assert.deepEqual(c.supersededDraftCaller,oldDraft.callerSource);assert.deepEqual(c.supersededDraftHelper,oldDraft.helperSource);
 assert.equal(hash(read('docs/next-cohort-20261110/source-successors/retained-stage1/manifest.json')),c.supersededArchiveSHA256);assert.equal(hash(read('docs/next-cohort-20261110/source-successors/retained-stage2/manifest.json')),c.supersededStage2ArchiveSHA256);
 assert.equal(c.priorStageRef,priorStageRef);assert.equal(c.historicalRecordsEdited,false);assert.equal(c.productionWrites,false);assert.equal(c.callerSource.ref,callerAppRef);assert.equal(c.callerSource.path,caller);
 assert.equal(hash(baseline),'1caa7ff7c8ba0fa56cdbec5dd7d4fe066137947be57b3a66cb4ee40dcabf90f2');
 assert.deepEqual(c.addedSources.map(d=>d.path),newCallerDependencies);
 const row=expected.find(r=>r.path===caller),previous={ref:row.successorRef,blob:row.successorBlob,sha256:row.successorSHA256};
 assert.deepEqual(c.callerPrevious,previous);
 row.intermediateSources.push(previous,{ref:'d416617b5c0533fe5d4d8a3f9fa5b15b9b539cbb',blob:previous.blob,sha256:previous.sha256},{ref:priorStageRef,blob:previous.blob,sha256:previous.sha256},{ref:c.supersededDraftCaller.ref,blob:c.supersededDraftCaller.blob,sha256:c.supersededDraftCaller.sha256},{ref:oldDraft.addedSources[0].ref,blob:c.supersededDraftCaller.blob,sha256:c.supersededDraftCaller.sha256},{ref:stage2.callerSource.ref,blob:stage2.callerSource.blob,sha256:stage2.callerSource.sha256},{ref:stage2.addedSources[0].ref,blob:stage2.callerSource.blob,sha256:stage2.callerSource.sha256});
 Object.assign(row,{successorRef:c.callerSource.ref,successorBlob:c.callerSource.blob,successorSHA256:c.callerSource.sha256});
 for(const d of c.addedSources){assert.equal(d.ref,contextAppRef);assert(!row.supplementalSources.some(old=>old.path===d.path));row.supplementalSources.push(d);}
 const legacyPath='src/components/technology-five-analysis.tsx',legacy=expected.find(r=>r.path===legacyPath),legacyPrevious={ref:legacy.successorRef,blob:legacy.successorBlob,sha256:legacy.successorSHA256};
 assert.deepEqual(c.legacyAnalysisPrevious,legacyPrevious);assert.equal(c.legacyAnalysisSource.path,legacyPath);assert.equal(c.legacyAnalysisSource.ref,contextAppRef);
 legacy.intermediateSources.push(legacyPrevious);Object.assign(legacy,{successorRef:c.legacyAnalysisSource.ref,successorBlob:c.legacyAnalysisSource.blob,successorSHA256:c.legacyAnalysisSource.sha256});
 const legacyDependency=row.supplementalSources.find(d=>d.path===legacyPath);assert.deepEqual(legacyDependency,{path:legacyPath,...legacyPrevious});Object.assign(legacyDependency,c.legacyAnalysisSource);
 const crossed=expected.filter(r=>(r.supplementalSources??[]).some(d=>d.path===caller));
 assert.deepEqual(crossed.map(r=>r.path).sort(),['src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts',helper].sort());
 for(const r of crossed)for(const d of r.supplementalSources)if(d.path===caller)Object.assign(d,c.callerSource);
 const h=expected.find(r=>r.path===helper),oldHelper={ref:h.successorRef,blob:h.successorBlob,sha256:h.successorSHA256};assert.deepEqual(c.helperPrevious,oldHelper);
 h.intermediateSources.push(oldHelper,{ref:c.supersededDraftHelper.ref,blob:c.supersededDraftHelper.blob,sha256:c.supersededDraftHelper.sha256},{ref:c.supersededStage2Helper.ref,blob:c.supersededStage2Helper.blob,sha256:c.supersededStage2Helper.sha256});Object.assign(h,{successorRef:c.helperSource.ref,successorBlob:c.helperSource.blob,successorSHA256:c.helperSource.sha256});
 assert.equal(c.helperSource.path,helper);assert.equal(c.guardSource.path,guard);assert.equal(c.helperSource.ref,c.guardSource.ref);
 const consumers=expected.filter(r=>(r.supplementalSources??[]).some(d=>d.path===guard));assert.deepEqual(consumers.map(r=>r.path),['scripts/publication20-caller-lineage.mjs']);
 assert.deepEqual(c.verificationSources.map(d=>d.path),stageVerificationPaths);for(const d of c.verificationSources)assert.equal(d.ref,c.guardSource.ref);
 for(const r of consumers){for(const d of r.supplementalSources){if(d.path===guard){assert.deepEqual(d,c.guardPrevious);Object.assign(d,c.guardSource);}if(d.path===helper){assert.deepEqual(d,{path:helper,...oldHelper});Object.assign(d,c.helperSource);}}r.supplementalSources.push(...c.verificationSources);}
 assert.deepEqual(rows,expected,'Only the reviewed caller-stage delta may advance');
 const current=read(metadata).toString();assert.equal(current.slice(current.indexOf('export const completionSourceRefs')),baseline.toString().slice(baseline.toString().indexOf('export const completionSourceRefs')));
 for(const r of rows){for(const s of [{ref:r.predecessorRef,blob:r.predecessorBlob,sha256:r.predecessorSHA256},{ref:r.successorRef,blob:r.successorBlob,sha256:r.successorSHA256},...r.intermediateSources??[]])verify(s,r.path,false);assert(read(r.path).equals(git(['show',r.successorRef+':'+r.path])));for(const d of r.supplementalSources??[])verify(d,d.path,true);}
 for(const name of ['tests/publication-workflows-20261109/current-source-evolution.mjs','tests/publication-workflows-20261109/accepted-current-source-guard.mjs','tests/first-five-20261109/accepted-evolution-guard.mjs'])assert(read(name).equals(priorStageRead(name,git)),'Independent current target bytes differ: '+name);
 function verify(s,path,isCurrent){assert.equal(git(['rev-parse','--verify',s.ref+'^{commit}']).toString().trim(),s.ref);assert.equal(git(['rev-parse',s.ref+':'+path]).toString().trim(),s.blob);const bytes=git(['cat-file','blob',s.blob]);assert.equal(hash(bytes),s.sha256);if(isCurrent)assert(read(path).equals(bytes),'Current target source differs; Independent current target bytes differ: '+path);}
 return c;
}
