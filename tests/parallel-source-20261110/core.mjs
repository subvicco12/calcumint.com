import {proveSavedActionsClaim} from '../milestone100-20261114/source-stage8-saved-actions-claim.mjs';
import {selectStage8GuardSuccessor} from '../milestone100-20261114/source-stage8-guard-selection.mjs';
import {sourceStage8HistoricalView,assertSourceStage8HeadStable} from '../milestone100-20261114/source-stage8.mjs';
import {provePinnedSourceStage8,sourceStage8Policy,sourceStage8CapturePath} from '../milestone100-20261114/source-stage8-activation.mjs';
/** Named exact-Git successor. Historical R5 executes unchanged; current targets never use its view. */
import assert from 'node:assert/strict';
import {selectStage7HistoricalSource} from '../milestone60-20261113/source-stage7-historical.mjs';
import {verifyStage7Lineage} from '../milestone60-20261113/source-lineage-stage7.mjs';
import {receiptLineagePolicy,verifyReceiptLineageExtension} from '../milestone60-20261113/source-receipt-lineage.mjs';
import {pinnedSourceStage7Records,sourceStage7Policy,sourceStage7CapturePath} from '../milestone60-20261113/source-stage7-activation.mjs';
import {appStage5Records} from '../completion-wave-20261113/source-app-stage5.mjs';
import {proveCurrentAppStage5AndHistoricalInputs,testStage6Records} from '../completion-wave-20261113/source-test-stage6.mjs';
import {testStage6Policy,testStage6CapturePath} from '../completion-wave-20261113/source-test-stage6-policy.mjs';
import {appStage5Policy,appStage5CapturePath} from '../completion-wave-20261113/source-app-stage5-policy.mjs';
import {ensureAppStage5Objects} from './bootstrap.mjs';
const stage5Paths=new Set([...appStage5Policy.paths,...testStage6Policy.paths,...sourceStage7Policy.paths]);
const stage5Input=(read,git)=>({read,git,root,policy:appStage5Policy,capturePath:appStage5CapturePath});
const stage5Rows=read=>new Map([...appStage5Records({read,policy:appStage5Policy,capturePath:appStage5CapturePath}),...testStage6Records(read),...pinnedSourceStage7Records(read)]);
function proveStage5(read,git){ensureAppStage5Objects(git);return proveCurrentAppStage5AndHistoricalInputs(stage5Input(read,git)).stage7Actual;}

import {retainedWorkflowRecord} from '../ci-balance-20261113/workflow.mjs';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {retainedA7Proof,sourceGit,baselineRef} from './baseline-runtime.mjs';
import {accepted,verifyParallelAuthority} from './authority.mjs';
import {ensureParallelSources} from './bootstrap.mjs';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {factoryPolicy,factoryCapturePath} from '../calculator-factory-source-20261112/policy.mjs';
import {completionPolicy,completionCapturePath} from '../completion-first-20261112/policy.mjs';
import {completionRecords,completionAuxiliaryRecords,verifyCompletionAndHistoricalFactory} from '../completion-first-20261112/stage.mjs';
import {workflowPolicy} from '../completion-first-20261112/workflows-policy.mjs';
import {workflowRecords,workflowGuardRecords,verifyWorkflowAndHistoricalCompletion} from '../completion-first-20261112/workflows-stage.mjs';
import {nonSourcePolicy} from '../completion-first-20261112/non-source-policy.mjs';
import {nonSourceRecords} from '../completion-first-20261112/non-source-stage2.mjs';
const workflowPaths=new Set(workflowPolicy.paths),completionPaths=new Set(completionPolicy.paths),nonSourcePaths=new Set(nonSourcePolicy.paths),workflowGuardPaths=new Set(workflowPolicy.guardPaths);
import {testStagePolicy} from '../completion-first-20261112/test-stage-policy.mjs';
import {testStageRecords,proveTestStageAndHistoricalInputs} from '../completion-first-20261112/test-stage.mjs';
import {ensureTestStageObjects} from './bootstrap.mjs';
import {personalPolicy,personalCapturePath} from '../completion-first-20261112/personal-policy.mjs';
import {personalRecords,personalAuxiliaryRecords,verifyPersonalAndHistoricalWorkflow} from '../completion-first-20261112/personal-stage.mjs';
const personalPaths=new Set(personalPolicy.paths),personalAuxiliaryPaths=new Set(personalPolicy.auxiliaryPaths);
export const appRef='f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5';
export const applicationBaselineRef='cef0352fca135b252b981b959c3529170b1f0c81';
export const applicationSuccessorRef='25b56970c05aaffaad2dd856809aaf077ab70554';
export const retainedStage6CapturePath='docs/parallel-source-20261110/capture-revision62.json';
export const retainedStage7CapturePath='docs/parallel-source-20261110/capture-revision64.json';
export const retainedStage7V6CapturePath='docs/parallel-source-20261110/capture-revision65.json';
export const retainedStage7V7CapturePath='docs/parallel-source-20261110/capture-revision66.json';
export const retainedStage7V8CapturePath='docs/parallel-source-20261110/capture-revision67.json';
const retainedStage8CapturePath='docs/parallel-source-20261110/capture-revision68.json';
export const capturePath='docs/parallel-source-20261110/capture-revision75.json';
const root=fileURLToPath(new URL('../../',import.meta.url)),hash=b=>createHash('sha256').update(b).digest('hex');
const immutableCaches=new WeakMap();
function currentGit(source){
 if(sourceStage8HistoricalView(source))return source;
 const head=source(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 let cache=immutableCaches.get(source);if(!cache){cache=new Map();immutableCaches.set(source,cache);}
 const reader=(args,options)=>{if(options!==undefined)return source(args,options);if(args[0]==='status')return source(args);const exact=args.map(a=>a.startsWith('HEAD:')?head+a.slice(4):a);if(exact.some(a=>a==='HEAD'||a.startsWith('HEAD^')))return source(exact);const key=JSON.stringify(exact);if(!cache.has(key))cache.set(key,source(exact));return cache.get(key);};
 for(const name of ['preloadBlobs','preloadCommits','preloadPaths'])if(typeof source[name]==='function')reader[name]=values=>source[name](values);
 return reader;
}
export function parseRows(text){const match=/const bindings=(\[[\s\S]*?\n\]);/.exec(text);assert(match,'Exact completion bindings required');return JSON.parse(match[1]);}
function sourceRecord(record,read,git){
 if(stage5Paths.has(record.path)){const row=proveStage5(read,git).get(record.path);assert(row);immutableRecord(record,git);return currentSourceRecord(row.current,read,git);}
 return currentSourceRecord(record,read,git);
}
function currentSourceRecord(record,read,git){
 const stage8View=sourceStage8HistoricalView(git);
 if(stage8View&&!record.path.startsWith('src/')){
  const currentCapture=JSON.parse(stage8View.actualInput.read(capturePath));
  const successor=selectStage8GuardSuccessor(currentCapture,record.path);
  if(successor&&successor.blob!==record.blob){immutableRecord(record,git);return exactCurrentSourceRecord(successor,read,git);}
 }

 if(stage5Paths.has(record.path))return exactCurrentSourceRecord(record,read,git);
 if(testStagePolicy.paths.includes(record.path)){const row=testStageRecords(read).get(record.path);assert(row);if(record.ref!==row.current.ref){immutableRecord(record,git);record=row.current;}}
 if(personalAuxiliaryPaths.has(record.path)){const row=personalAuxiliaryRecords(read).get(record.path);assert(row);if(record.ref!==row.current.ref){immutableRecord(record,git);record=row.current;}}else if(workflowGuardPaths.has(record.path)){const row=workflowGuardRecords(read).get(record.path);assert(row);if(record.ref!==row.current.ref){immutableRecord(record,git);record=row.current;}}else if(nonSourcePaths.has(record.path)){const row=nonSourceRecords(read).get(record.path);assert(row);if(record.ref!==row.current.ref){immutableRecord(record,git);record=row.current;}}else if(record.path==='tests/next-cohort-20261110/source/retained-runtime.mjs'){const row=completionAuxiliaryRecords(read).get(record.path);assert(row);if(record.ref!==row.current.ref){immutableRecord(record,git);record=row.current;}}
 if(record.path.startsWith('src/')){const row=personalPaths.has(record.path)?(record.ref===personalPolicy.codeRef?null:personalRecords(read).get(record.path)):workflowPaths.has(record.path)?(record.ref===workflowPolicy.codeRef?null:workflowRecords(read).get(record.path)):completionPaths.has(record.path)?(record.ref===completionPolicy.codeRef?null:completionRecords(read).get(record.path)):null;if(row){immutableRecord(record,git);record=row.current;}}
 return exactCurrentSourceRecord(record,read,git);
}
function exactCurrentSourceRecord(record,read,git){
 assert.equal(typeof record.path,'string');assert(!isAbsolute(record.path)&&!record.path.split('/').includes('..'));
 assert.match(record.ref,/^[0-9a-f]{40}$/);assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref);
 assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob,'Exact reviewed source object differs: '+record.path);
 assert.equal(git(['rev-parse','HEAD:'+record.path]).toString().trim(),record.blob,'Current HEAD source object differs: '+record.path);
 const expected=git(['cat-file','blob',record.blob]);assert.equal(expected.length,record.bytes);assert.equal(hash(expected),record.sha256);
 const target=resolve(root,record.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current source required: '+record.path);assert.equal(realpathSync(target),target,'Current source path was redirected');
 assert(read(record.path).equals(expected),'Current target source differs; Independent current target bytes differ: '+record.path);
}
/** Historical objects are validated as historical; they never fill a current reader. */
function immutableRecord(record,git){
 assert.equal(typeof record.path,'string');assert(!isAbsolute(record.path)&&!record.path.split('/').includes('..'));
 assert.match(record.ref,/^[0-9a-f]{40}$/);assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref);
 assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob);
 const bytes=git(['cat-file','blob',record.blob]);assert.equal(bytes.length,record.bytes);assert.equal(hash(bytes),record.sha256);return bytes;
}
function applicationSuccession(capture,read,git){
 assert.equal(capture.applicationBaselineRef,applicationBaselineRef);assert.equal(capture.applicationSuccessorRef,applicationSuccessorRef);
 assert.equal(capture.applicationSuccessionKind,'EXACT_FINAL_TWO_APP_AND_TEST_SUCCESSOR_NOT_CANONICAL_ACCEPTANCE');
 const changed=git(['diff','--name-only',applicationBaselineRef,applicationSuccessorRef,'--','src']).toString().trim().split('\n');
 assert.equal(changed.length,21);assert.deepEqual(capture.applicationSuccessors.map(r=>r.path),changed);
 assert.equal(git(['diff','--name-only',applicationBaselineRef,applicationSuccessorRef,'--','src/calculators']).toString().trim(),'','Historical mathematical engines must remain immutable');
 const {historicalFactory:factory,historicalCompletion:completion,live:workflow,nonSource,personal,personalAuxiliary}=verifyPersonalAndHistoricalWorkflow({git,read,root});
 assert.deepEqual([...personal.values()].map(r=>r.current),capture.personalSources);assert.deepEqual([...personalAuxiliary.values()].map(r=>r.current),capture.personalAuxiliarySources);
 assert.deepEqual([...workflow.values()].map(r=>r.current),capture.workflowSources,'Workflow sources must enter closed current capture');
 assert.deepEqual([...nonSource.values()].map(r=>r.current),capture.workflowNonSourceSources,'Exact NS current sources required');
 assert.deepEqual(capture.workflowGuardSources.map(r=>r.path),workflowPolicy.guardPaths);for(const row of capture.workflowGuardSources){assert.equal(row.ref,workflowPolicy.guardRef);sourceRecord(row,read,git);}
 assert.deepEqual([...completion.values()].map(r=>r.current),capture.completionSources,'Completion sources must enter closed current capture');
 assert.deepEqual([...factory.values()].map(r=>r.current),capture.factorySources,'Factory sources must enter closed current capture');
 const appPaths=changed.filter(p=>!(/\.test\.(?:ts|tsx)$/.test(p)));
 assert.equal(appPaths.length,14);assert.deepEqual(git(['diff','--name-only',applicationBaselineRef,'HEAD','--','src']).toString().trim().split('\n').filter(p=>p&&!(/\.test\.(?:ts|tsx)$/.test(p))),[...new Set([...appPaths,...factoryPolicy.paths.filter(p=>!(/\.test\.(?:ts|tsx)$/.test(p))),...completionPolicy.paths.filter(p=>!(/\.test\.(?:ts|tsx)$/.test(p))),...workflowPolicy.paths.filter(p=>!(/\.test\.(?:ts|tsx)$/.test(p))),...personalPolicy.paths.filter(p=>!(/\.test\.(?:ts|tsx)$/.test(p))),...appStage5Policy.paths.filter(p=>!(/\.test\.(?:ts|tsx)$/.test(p))),...sourceStage7Policy.paths.filter(p=>!(/\.test\.(?:ts|tsx)$/.test(p)))])].sort(),'Only historical app14 plus finite independently pinned factory stage may change non-test source');
 const parentPaths=new Set(git(['ls-tree','-r','--name-only',applicationBaselineRef,'--','src']).toString().trim().split('\n'));
 const originalPaths=new Set(git(['ls-tree','-r','--name-only',appRef,'--','src']).toString().trim().split('\n'));
 const result=new Map();
 for(const row of capture.applicationSuccessors){
  assert(row.path.startsWith('src/')&&!row.path.startsWith('src/calculators/'));assert.equal(row.current.path,row.path);assert.equal(row.current.ref,applicationSuccessorRef);
  if(parentPaths.has(row.path)){assert.equal(row.parent.path,row.path);assert.equal(row.parent.ref,applicationBaselineRef);immutableRecord(row.parent,git);}else assert.equal(row.parent,null);
  if(originalPaths.has(row.path)){assert.equal(row.historical.path,row.path);assert.equal(row.historical.ref,appRef);immutableRecord(row.historical,git);}else assert.equal(row.historical,null);
  sourceRecord(row.current,read,git);result.set(row.path,row);
 }
 for(const [path,row]of completion)result.set(path,{path,current:row.current,historical:capture.applicationSuccessors.find(r=>r.path===path)?.historical});
 const retainedWorkflowPaths=["src/app/api/business/native-embeds/route.ts","src/app/api/business/technology-embeds/route.ts","src/app/api/internal/technology-webhooks/process/route.ts","src/app/api/native-embed/[grant]/calculate/route.ts","src/app/embed/native/[grant]/page.tsx","src/components/native-embed-grant-form.tsx","src/components/native-frequency-embed.tsx","src/lib/native-delivery/contract.ts","src/lib/native-delivery/embed-request.ts","src/lib/native-delivery/grant.ts","src/lib/native-delivery/metering.ts","src/lib/native-delivery/publication.ts","src/lib/native-delivery/technology-five-job-storage.ts","src/lib/native-delivery/technology-five-webhook-worker.ts","src/lib/native-delivery/contract.test.ts"];
 assert.deepEqual(capture.workflowHistoricalClaims.map(row=>row.path),retainedWorkflowPaths);
 const retainedWorkflow=new Map(capture.workflowHistoricalClaims.map(row=>{assert.equal(row.ref,appRef);assert(workflow.has(row.path));immutableRecord(row,git);return[row.path,row];}));
 for(const [path,row]of workflow)result.set(path,{path,current:row.current,historical:result.get(path)?.historical??retainedWorkflow.get(path),contextPredecessor:row.predecessor});
 for(const [path,row]of personal)result.set(path,{path,current:row.current,historical:result.get(path)?.historical,contextPredecessor:row.predecessor});
 for(const [path,row]of proveStage5(read,git)){
  const prior=result.get(path),original=capture.applicationSources.find(source=>source.path===path);
  const historical=prior?.historical??selectStage7HistoricalSource({path,stage7Paths:sourceStage7Policy.paths,row,original,appRef});
  if(historical)immutableRecord(historical,git);
  result.set(path,{path,current:row.current,historical,contextPredecessor:row.predecessor});
 }
 return result;
}
export const sevenTestRef='f68c077b63b1dfabbe9ca3f21e4f195ef645ad97';
export const sevenTestPaths=Object.freeze(['src/app/business/shared/[id]/page.test.tsx','src/lib/native-delivery/technology-next-composition.test.ts','src/lib/thirteen-program-evidence.test.ts']);
function sevenTestSuccession(capture,read,git){
 assert.equal(capture.sevenTestRef,sevenTestRef);assert.deepEqual(capture.sevenTestSuccessors.map(r=>r.path),sevenTestPaths);
 const result=new Map();for(const row of capture.sevenTestSuccessors){
  assert.equal(row.current.path,row.path);assert.equal(row.current.ref,sevenTestRef);assert.equal(row.predecessor.path,row.path);
  assert.equal(row.predecessor.ref,row.path==='src/lib/thirteen-program-evidence.test.ts'?'05129e2a74e70e23160578c63a984c4bf035ed0f':appRef);
  immutableRecord(row.predecessor,git);sourceRecord(row.current,read,git);result.set(row.path,{path:row.path,current:stage5Paths.has(row.path)?stage5Rows(read).get(row.path).current:testStagePolicy.paths.includes(row.path)?testStageRecords(read).get(row.path).current:row.current});
 }return result;
}
function retainedAssertSevenTestSuccessor(file,claim,currentBytes,read=readFileSync,git=sourceGit){
 assert(sevenTestPaths.includes(file),'Only three exact seven-failure test successors');git=currentGit(git);
 // Reject altered buffers before the complete successful-claim proof, with no cache of mutable bytes.
 const testOnly=testStagePolicy.paths.includes(file);if(testOnly)ensureTestStageObjects(git);
 const current=stage5Paths.has(file)?proveStage5(read,git).get(file).current:testOnly?testStageRecords(read).get(file).current:null;
 assert(currentBytes.equals(git(['show',(current?.ref??sevenTestRef)+':'+file])),'Exact seven-failure current test bytes required');
 verifyParallelAuthority(read,git);const capture=JSON.parse(read(retainedStage8CapturePath));ensureParallelSources(capture,git);if(testOnly)proveTestStageAndHistoricalInputs({read,git,root});sevenTestSuccession(capture,read,git);
 const row=capture.sevenTestSuccessors.find(r=>r.path===file);assert.equal(claim,row.predecessor.sha256,'Exact immutable test predecessor claim required');
 return {successorGit:current?.ref??sevenTestRef,successorSHA256:current?.sha256??row.current.sha256,testOnly:true};
}
/** One invocation proves all named current bytes; callers must not retain this proof across reads. */
function retainedProveNamedCurrentContext(read=readFileSync,git=sourceGit){
 git=currentGit(git);verifyParallelAuthority(read,git);const capture=JSON.parse(read(retainedStage8CapturePath));ensureParallelSources(capture,git);
 const rows=new Map([...applicationSuccession(capture,read,git),...sevenTestSuccession(capture,read,git)]);
 return new Map([...rows].map(([path,row])=>{const original=capture.sevenTestSuccessors.find(r=>r.path===path)?.predecessor??row.historical??row.contextPredecessor;return[path,{current:row.current,recordedSHA256:original?.sha256}];}));
}
function retainedAssertNamedApplicationSuccessor(file,recordedSHA256,currentBytes,read=readFileSync,git=sourceGit){
 git=currentGit(git);
 verifyParallelAuthority(read,git);const capture=JSON.parse(read(retainedStage8CapturePath));ensureParallelSources(capture,git);
 const row=applicationSuccession(capture,read,git).get(file);assert(row&&row.historical,'Only an exact historical named final-two source claim is admitted');
 assert.equal(recordedSHA256,row.historical.sha256,'Exact original F042 source claim required');assert.equal(hash(currentBytes),row.current.sha256,'Current named application successor differs');assert(currentBytes.equals(immutableRecord(row.current,git)));
 return {file,recordedApplicationGit:appRef,currentApplicationGit:row.current.ref,historicalEvidenceOnly:true};
}
function retainedAssertFinalTwoScopeTestSuccessor(file,intermediateBytes,currentBytes,git=sourceGit,read=readFileSync){
 assert(['src/components/technology-five-delivery.test.tsx','src/components/technology-next-native.test.tsx'].includes(file),'Only two named native test successors');
 // Reject malformed supplied bytes before expensive full-graph proof; successful claims still prove every edge below.
 assert(currentBytes.equals(git(['show',applicationSuccessorRef+':'+file])),'Current final-two scope test differs from exact reviewed Git');
 verifyParallelAuthority(read,git);const capture=JSON.parse(read(retainedStage8CapturePath));ensureParallelSources(capture,git);
 const row=applicationSuccession(capture,read,git).get(file);assert(row?.parent);const prior='a1014a3914977af8a8d9e85aa2bf08269fccf504';
 assert.equal(git(['rev-parse','--verify',prior+'^{commit}']).toString().trim(),prior);assert(intermediateBytes.equals(git(['show',prior+':'+file])),'Original exact A101 test stage must remain proved');
 assert(intermediateBytes.equals(immutableRecord(row.parent,git)),'Prior current test stage must match the frozen baseline');
 assert.equal(hash(currentBytes),row.current.sha256,'Current final-two scope test differs from exact reviewed Git');assert(currentBytes.equals(immutableRecord(row.current,git)));
 return {successorGit:applicationSuccessorRef,successorSHA256:row.current.sha256};
}
function retainedVerifyParallelSource(read=readFileSync,git=sourceGit,suppliedRows){
 const actualGit=git;
 git=currentGit(git);
 verifyParallelAuthority(read,git);
 const capture=JSON.parse(read(retainedStage8CapturePath));assert.equal(capture.baselineRef,baselineRef);assert.equal(capture.appRef,appRef);assert.equal(capture.productionWrites,false);assert.equal(capture.historicalRecordsEdited,false);
 ensureParallelSources(capture,git);
 if(actualGit===sourceGit)sourceGit.preloadBlobs([...capture.currentSources,...capture.applicationSources,...capture.guardSources].map(r=>r.blob));
 const delta=new Map([...applicationSuccession(capture,read,git),...sevenTestSuccession(capture,read,git)]);
 const baseline=retainedA7Proof();assert.deepEqual(capture.retainedReads,baseline.rows,'Original R5 read closure differs');
 const appPaths=git(['diff','--name-only',baselineRef,appRef,'--','src']).toString().trim().split('\n');assert.equal(appPaths.length,27);assert.deepEqual(capture.applicationSources.map(r=>r.path),appPaths);
 for(const row of capture.applicationSources){assert.equal(row.ref,appRef);if(delta.has(row.path)){immutableRecord(row,git);sourceRecord(delta.get(row.path).current,read,git);}else sourceRecord(row,read,git);}
 const guardPaths=['tests/next-five-20261110/source/current-proof.mjs','tests/publication-workflows-20261109/source-evolution.test.mjs','tests/first-five-20261109/crossed-dependency-source.test.mjs','tests/acceptance-closure-20261108/converter-final-source.test.mjs'];
 assert.deepEqual(capture.guardSources.map(r=>r.path),guardPaths,'Only the exact historical-test and proof entry successors may advance');
 for(const row of capture.guardSources)sourceRecord(row,read,git);
 const all=[...capture.currentSources,...capture.applicationSources];assert.equal(new Set(capture.currentSources.map(r=>r.path)).size,capture.currentSources.length);
 for(const row of capture.currentSources)sourceRecord(row,read,git);
 // Every byte observed by the old complete proof remains guarded in the new view.
 for(const row of baseline.rows)assert(all.some(r=>r.path===row.path),'Unbound original current source: '+row.path);
 const metadata='scripts/product-completion-lineage.mjs',old=git(['show',baselineRef+':'+metadata]).toString(),current=read(metadata).toString();
 const qualifiedStage7Graph=git(['show',receiptLineagePolicy.retainedGraphRef+':'+metadata]).toString();
 verifyStage7Lineage({previous:git(['show',sourceStage7Policy.predecessorRef+':'+metadata]).toString(),current:qualifiedStage7Graph,records:pinnedSourceStage7Records(read)});
 verifyReceiptLineageExtension({previous:qualifiedStage7Graph,current,git});
 const historicalTail=old.slice(old.indexOf('export const completionSourceRefs'));
 const insertion=" if(claim!==b.predecessorSHA256)throw Error('Completion predecessor claim differs: '+name);";
 assert.equal(historicalTail.split(insertion).length,2,'Exact unchanged guard insertion preimage required');
 assert.equal(current.slice(current.indexOf('export const completionSourceRefs')),historicalTail.replace(insertion,insertion+'\n git=completionGitReader(git);'),'Only the independently bound immutable Git transport insertion may extend the unchanged executable guard');
 assert.equal(capture.workflowGraphPredecessor.path,metadata);assert.equal(capture.workflowGraphPredecessor.ref,workflowPolicy.predecessorRef);
 const workflowPrior=parseRows(immutableRecord(capture.workflowGraphPredecessor,git).toString());
 const before=parseRows(old),after=parseRows(current);assert.deepEqual(after.map(r=>r.path),before.map(r=>r.path));if(suppliedRows)assert.deepEqual(suppliedRows,after,'Only the reviewed parallel source rows are admitted');
 const apps=new Map(capture.applicationSources.map(r=>[r.path,delta.get(r.path)?.current??r]));for(const [path,row]of delta)apps.set(path,row.current);
 for(const row of capture.completionSources)apps.set(row.path,row);
 for(const row of capture.workflowSources)apps.set(row.path,row);
 for(const row of capture.personalSources)apps.set(row.path,row);
 for(const [path,row]of proveStage5(read,git))apps.set(path,row.current);
 const auxiliary=new Map([...capture.workflowNonSourceSources,...capture.workflowGuardSources,...capture.personalAuxiliarySources].map(r=>[r.path,r]));
 const evolutions=new Map([...apps,...auxiliary,...capture.guardSources.map(r=>[r.path,r])]);
 const reviewedPath='src/lib/execution-recovery-evidence.test.ts',reviewedRef='05129e2a74e70e23160578c63a984c4bf035ed0f';
 const reviewed=capture.currentSources.find(r=>r.path===reviewedPath);assert(reviewed,'Reviewed exact test successor must remain captured');
 assert.equal(git(['rev-parse',reviewedRef+':'+reviewedPath]).toString().trim(),reviewed.blob);
 assert.equal(hash(git(['show',reviewedRef+':'+reviewedPath])),reviewed.sha256);
 const owners=before.filter(b=>b.supplementalSources?.some(d=>d.path===reviewedPath)).map(b=>b.path).sort();
 assert.deepEqual(owners,['scripts/publication20-caller-lineage.mjs','tests/acceptance-closure-20261108/receipt-source-path.mjs']);
 evolutions.set(reviewedPath,{...reviewed,ref:reviewedRef});
 const nodePath='tests/shortest-publication-20/caller-lineage.test.mjs',nodeRef='756922bebd73e66a2900a35a92a3854ad2813d73';
 const nodeRecord=capture.currentSources.find(r=>r.path===nodePath);assert(nodeRecord,'Exact current caller-tamper test must remain captured');
 assert.equal(git(['rev-parse',nodeRef+':'+nodePath]).toString().trim(),nodeRecord.blob);assert.equal(hash(git(['show',nodeRef+':'+nodePath])),nodeRecord.sha256);
 assert.deepEqual(before.filter(b=>b.supplementalSources?.some(d=>d.path===nodePath)).map(b=>b.path),['scripts/publication20-caller-lineage.mjs']);
 const ownedEvolutions=new Map([...apps,...auxiliary]);ownedEvolutions.set(nodePath,{...nodeRecord,ref:nodeRef});evolutions.set(nodePath,{...nodeRecord,ref:nodeRef});
 const diagnosticPath='tests/product-completion-lineage.test.mjs',diagnosticRef='a963ef7aaa04664d07709cc431d6214511bc0573';
 const diagnostic=capture.currentSources.find(r=>r.path===diagnosticPath);assert(diagnostic,'Exact reviewed Git diagnostic successor must remain captured');
 assert.equal(git(['rev-parse',diagnosticRef+':'+diagnosticPath]).toString().trim(),diagnostic.blob);assert.equal(hash(git(['show',diagnosticRef+':'+diagnosticPath])),diagnostic.sha256);
 assert.deepEqual(before.filter(b=>b.supplementalSources?.some(d=>d.path===diagnosticPath)).map(b=>b.path),['scripts/check-current-six-candidate-evidence.mjs']);
 evolutions.set(diagnosticPath,{...diagnostic,ref:diagnosticRef});
 const receiptPath='tests/acceptance-closure-20261108/receipt-source-path.mjs',receiptRef='71f285544bd85b46e51da109897c12bfff7b798f';
 const receipt=capture.currentSources.find(r=>r.path===receiptPath);assert(receipt,'Exact fresh-receipt claim verifier successor must remain captured');
 const retainedReceipt=JSON.parse(read(retainedStage7V7CapturePath)).currentSources.find(row=>row.path===receiptPath);assert(retainedReceipt,'Literal capture66 receipt helper is required');
 assert.equal(git(['rev-parse',receiptRef+':'+receiptPath]).toString().trim(),retainedReceipt.blob);assert.equal(hash(git(['show',receiptRef+':'+receiptPath])),retainedReceipt.sha256);
 for(const key of ['path','blob','bytes','sha256']){assert.equal(retainedReceipt[key],receiptLineagePolicy.predecessor[key]);assert.equal(receipt[key],receiptLineagePolicy.current[key]);}
 immutableRecord(receiptLineagePolicy.current,git);
 assert.deepEqual(before.filter(b=>b.supplementalSources?.some(d=>d.path===receiptPath)).map(b=>b.path),['scripts/publication20-caller-lineage.mjs']);
 assert.equal(before.filter(b=>b.path===receiptPath).length,1,'Exact owned receipt verifier predecessor required');
 ownedEvolutions.set(receiptPath,{...receipt,ref:receiptLineagePolicy.current.ref});evolutions.set(receiptPath,{...receipt,ref:receiptLineagePolicy.current.ref});
 const allowedExtras=new Map([...apps,...auxiliary]);
 const retainedPaths=['src/components/technology-bounded-analysis.test.tsx','src/components/technology-bounded-analysis.tsx','src/components/technology-next-five-integration.test.tsx','src/lib/native-delivery/technology-next-five-catalog.ts','src/lib/native-delivery/technology-next-five-contract.test.ts','src/lib/native-delivery/technology-next-five-contract.ts','src/lib/technology-next-five-analysis.test.ts','src/lib/technology-next-five-analysis.ts'];
 for(const path of retainedPaths){const bytes=git(['show',baselineRef+':'+path]);allowedExtras.set(path,{path,ref:baselineRef,blob:git(['rev-parse',baselineRef+':'+path]).toString().trim(),sha256:hash(bytes)});}
 const short=r=>({path:r.path,ref:r.ref,blob:r.blob,sha256:r.sha256});
 for(let i=0;i<before.length;i++){
  const prior=before[i],now=after[i],expected=structuredClone(prior),app=ownedEvolutions.get(prior.path);
  if(app){expected.intermediateSources??=[];if(prior.path===receiptPath){const ref='881c62c140d881b8c7fe70ce9bd5dcc187b54c32',bytes=git(['show',ref+':'+receiptPath]);expected.intermediateSources.push({ref:prior.successorRef,blob:prior.successorBlob,sha256:prior.successorSHA256});expected.intermediateSources.push({ref,blob:git(['rev-parse',ref+':'+receiptPath]).toString().trim(),sha256:hash(bytes)});expected.intermediateSources.push({ref:receiptLineagePolicy.predecessor.ref,blob:receiptLineagePolicy.predecessor.blob,sha256:receiptLineagePolicy.predecessor.sha256});}if(prior.path!==receiptPath)expected.intermediateSources.push({ref:prior.successorRef,blob:prior.successorBlob,sha256:prior.successorSHA256});if(sourceStage7Policy.paths.includes(prior.path)){const retained=parseRows(git(['show',sourceStage7Policy.predecessorRef+':'+metadata]).toString()).find(row=>row.path===prior.path);assert(retained,'Stage7 owned source must retain its Stage6 binding');if(retained.successorRef!==prior.successorRef)expected.intermediateSources.push({ref:retained.successorRef,blob:retained.successorBlob,sha256:retained.successorSHA256});}if(workflowPaths.has(prior.path)||nonSourcePaths.has(prior.path)||capture.workflowGuardSources.some(row=>row.path===prior.path)){const middle=workflowPrior.find(r=>r.path===prior.path);assert(middle);if(middle.successorRef!==prior.successorRef)expected.intermediateSources.push({ref:middle.successorRef,blob:middle.successorBlob,sha256:middle.successorSHA256});}if(prior.path==='.github/workflows/ci.yml'){const retained=retainedWorkflowRecord(read);immutableRecord(retained,git);expected.intermediateSources.push({ref:retained.ref,blob:retained.blob,sha256:retained.sha256});}Object.assign(expected,{successorRef:app.ref,successorBlob:app.blob,successorSHA256:app.sha256});}
  if(expected.supplementalSources)expected.supplementalSources=expected.supplementalSources.map(d=>evolutions.has(d.path)?short(evolutions.get(d.path)):d);
  const count=expected.supplementalSources?.length??0,extras=(now.supplementalSources??[]).slice(count);for(const d of extras){assert(allowedExtras.has(d.path),'Unreviewed supplemental source');assert.deepEqual(d,short(allowedExtras.get(d.path)));}
  if(extras.length)expected.supplementalSources=[...(expected.supplementalSources??[]),...extras];assert.deepEqual(now,expected,'Only named app/data successors may advance: '+prior.path);
 }
 // A separately captured current file must also be the exact byte target of
 // every declared live dependency edge; detached historical proofs cannot fill it.
 const checkedEdges=new Set();
 for(const row of after)for(const dep of row.supplementalSources??[]){
  const identity=dep.ref+':'+dep.path+':'+dep.blob;if(checkedEdges.has(identity))continue;checkedEdges.add(identity);
  const bytes=git(['cat-file','blob',dep.blob]);sourceRecord({...dep,bytes:bytes.length},read,git);
 }
 for(const r of [...apps.values(),...auxiliary.values()])assert(after.some(b=>b.path===r.path||b.supplementalSources?.some(d=>d.path===r.path)),'Application or explicit NS dependency missing from current binding graph');
 return true;
}

export function preloadRetainedImmutableObjects(read,git){
 verifyParallelAuthority(read,git);const capture=JSON.parse(read(retainedStage8CapturePath));ensureParallelSources(capture,git,{defaultRetainedCommitBatch:true});
 const ids=new Set(),paths=new Map();const visit=value=>{if(value&&typeof value==='object'){if(typeof value.blob==='string'){assert.match(value.blob,/^[a-f0-9]{40}$/);ids.add(value.blob);if(typeof value.ref==='string'&&/^[a-f0-9]{40}$/.test(value.ref)&&typeof value.path==='string'){const key=value.ref+':'+value.path;assert(!paths.has(key)||paths.get(key).blob===value.blob,'Conflicting independently pinned path records');paths.set(key,{ref:value.ref,path:value.path,blob:value.blob});}}Object.values(value).forEach(visit);}};
 const finite=[sourceStage8CapturePath,capturePath,'docs/parallel-source-20261110/capture-revision74.json','docs/parallel-source-20261110/capture-revision73.json','docs/parallel-source-20261110/capture-revision72.json','docs/parallel-source-20261110/capture-revision71.json','docs/parallel-source-20261110/capture-revision70.json','docs/parallel-source-20261110/capture-revision69.json',retainedStage8CapturePath,retainedStage7V8CapturePath,retainedStage7V7CapturePath,retainedStage7V6CapturePath,retainedStage7CapturePath,retainedStage6CapturePath,sourceStage7CapturePath,appStage5CapturePath,testStage6CapturePath,"docs/ci-balance-20261113/workflow-source.json",personalCapturePath,"docs/completion-first-20261112/source-stage2.json","docs/completion-first-20261112/non-source-stage2.json",completionCapturePath,factoryCapturePath,"docs/milestone60-20261113/source-immutable-prefetch-hints.json"];
 for(const path of finite){assert(accepted.some(row=>row.path===path),"Preloaded capture must have independent authority");visit(JSON.parse(read(path)));}
 git.preloadCommits([...new Set([...factoryPolicy.ancestry,...completionPolicy.ancestry,...workflowPolicy.ancestry,...workflowPolicy.guardAncestry,...personalPolicy.ancestry,...personalPolicy.auxiliaryAncestry,...nonSourcePolicy.ancestry,...appStage5Policy.ancestry,...testStage6Policy.ancestry,...sourceStage7Policy.ancestry,...sourceStage8Policy.ancestry])]);
 if(typeof git.preloadPaths==='function')git.preloadPaths([...paths.values()]);
 git.preloadBlobs([...ids]);
}

function currentStage8Input(read,git){return provePinnedSourceStage8({read,git,root});}
function completeStage8(view,run){const result=run();assertSourceStage8HeadStable(view);return result;}
export function verifyParallelSource(read=readFileSync,git=sourceGit,suppliedRows){const p=currentStage8Input(read,git);return completeStage8(p,()=>retainedVerifyParallelSource(p.historicalInput.read,p.historicalInput.git,suppliedRows));}
export function proveNamedCurrentContext(read=readFileSync,git=sourceGit){const p=currentStage8Input(read,git);return completeStage8(p,()=>{const rows=retainedProveNamedCurrentContext(p.historicalInput.read,p.historicalInput.git);for(const [path,row]of p.live){const prior=rows.get(path);rows.set(path,{current:row.current,recordedSHA256:prior?.recordedSHA256??row.predecessor?.sha256});}return rows;});}
export function assertNamedApplicationSuccessor(file,recordedSHA256,currentBytes,read=readFileSync,git=sourceGit){const p=currentStage8Input(read,git);return completeStage8(p,()=>{const row=p.live.get(file);if(!row)return retainedAssertNamedApplicationSuccessor(file,recordedSHA256,currentBytes,p.historicalInput.read,p.historicalInput.git);const prior=retainedProveNamedCurrentContext(p.historicalInput.read,p.historicalInput.git).get(file);if(prior)assert.equal(recordedSHA256,prior.recordedSHA256);else proveSavedActionsClaim({file,recordedSHA256,row,currentBytes,git});assert(currentBytes.equals(git(['cat-file','blob',row.current.blob])),'Current named application successor differs');return {file,recordedApplicationGit:appRef,currentApplicationGit:row.current.ref,historicalEvidenceOnly:true};});}
export function assertSevenTestSuccessor(file,claim,currentBytes,read=readFileSync,git=sourceGit){const p=currentStage8Input(read,git);return completeStage8(p,()=>retainedAssertSevenTestSuccessor(file,claim,currentBytes,p.historicalInput.read,p.historicalInput.git));}
export function assertFinalTwoScopeTestSuccessor(file,intermediateBytes,currentBytes,git=sourceGit){const p=currentStage8Input(readFileSync,git);return completeStage8(p,()=>retainedAssertFinalTwoScopeTestSuccessor(file,intermediateBytes,currentBytes,p.historicalInput.git,p.historicalInput.read));}
