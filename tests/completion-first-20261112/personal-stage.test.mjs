import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {assertNamedApplicationSuccessor,proveNamedCurrentContext,capturePath} from '../parallel-source-20261110/core.mjs';
import {verifyExactStage as originalVerifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {nonSourcePolicy} from './non-source-policy.mjs';
import {nonSourceRecords,verifyNonSourceStage,historicalWorkflowWithoutLoginObservations,nativeLoginObservationStep} from './non-source-stage2.mjs';
import {retainedRuntimeBytes,verifyCurrentRuntimeContext} from '../next-cohort-20261110/source/retained-runtime.mjs';
import {workflowPolicy,workflowCapturePath} from './workflows-policy.mjs';
import {workflowRecords,workflowGuardRecords} from './workflows-stage.mjs';
import {personalPolicy,personalCapturePath} from './personal-policy.mjs';
import {personalRecords,personalAuxiliaryRecords,provePersonalAndHistoricalInputs,verifyPersonalAndHistoricalWorkflow as verifyWorkflowAndHistoricalCompletion} from './personal-stage.mjs';
function verifyExactStage(input){const proved=provePersonalAndHistoricalInputs(input);return originalVerifyExactStage({...input,read:proved.historicalRead,git:proved.historicalGit});}
const root=fileURLToPath(new URL('../../',import.meta.url));
const captureBytes=readFileSync(workflowCapturePath),capture=JSON.parse(captureBytes);
const input={policy:workflowPolicy,captureBytes,git:sourceGit,read:readFileSync,root};
test('mandatory live Stage2 composes exact historical Stage1 at5008 and Stage6 without replacing their literal records',()=>{
 const {live,nonSource,guards,historicalCompletion,historicalFactory}=verifyWorkflowAndHistoricalCompletion(input);
 assert.equal(workflowPolicy.predecessorRef,'5008aa4cadd77f7a9a5dc1523cace694f3bbdf47');
 assert.throws(()=>workflowPolicy.paths.push('src/unreviewed-policy-expansion.ts'),TypeError);
 assert.equal(live.size,workflowPolicy.paths.length);assert.equal(historicalCompletion.size,28);assert.equal(historicalFactory.size,23);assert.equal(nonSource.size,4);assert.equal(guards.size,3);
 const map=workflowRecords(readFileSync),path=workflowPolicy.paths[0],row=map.get(path);assert(Object.isFrozen(row)&&Object.isFrozen(row.current));if(row.predecessor)assert(Object.isFrozen(row.predecessor));
 assert.throws(()=>{row.current.sha256='0'.repeat(64);},TypeError);map.clear();assert(workflowRecords(readFileSync).has(path));
 let reads=0;const read=p=>{assert.equal(p,workflowCapturePath);reads++;return captureBytes;};workflowRecords(read);workflowRecords(read);assert.equal(reads,2);
 const mutable=Buffer.from(captureBytes);workflowRecords(()=>mutable);mutable[0]^=1;assert.throws(()=>workflowRecords(()=>mutable),/Independent workflow capture digest differs/);
 const ns=nonSourceRecords(readFileSync);ns.clear();assert.equal(nonSourceRecords(readFileSync).size,4);assert.throws(()=>nonSourcePolicy.paths.push('unreviewed'),TypeError);
 const imports="import {historicalWorkflowWithoutLoginObservations} from '../completion-first-20261112/non-source-stage2.mjs';\n";
 const guard13='tests/full-product-batch13/workflow.test.mjs',old13=sourceGit(['show',workflowPolicy.predecessorRef+':'+guard13]).toString();
 assert.equal(old13.split("job=workflowJobs(yaml)['full-product'];").length,2);assert.equal(readFileSync(guard13,'utf8'),imports+old13.replace("job=workflowJobs(yaml)['full-product'];","job=workflowJobs(historicalWorkflowWithoutLoginObservations(yaml))['full-product'];"),'Original Batch13 assertions remain byte-identical on exact historical workflow view');
 const guard17='tests/full-product-batch17/workflow.test.mjs',old17=sourceGit(['show',workflowPolicy.predecessorRef+':'+guard17]).toString();
 assert.equal(old17.split('assert.equal(workflow,reviewed);').length,2);assert.equal(readFileSync(guard17,'utf8'),imports+old17.replace('assert.equal(workflow,reviewed);','assert.equal(historicalWorkflowWithoutLoginObservations(workflow,readFileSync,git),reviewed);'),'Original00651 sourceRevision and assertions stay literal');
 const runtime='tests/next-cohort-20261110/source/retained-runtime.mjs',oldRuntime=sourceGit(['show',workflowPolicy.predecessorRef+':'+runtime]).toString();
 const expected=oldRuntime.replace("import {proveNamedCurrentContext} from '../../parallel-source-20261110/core.mjs';","import {proveNamedCurrentContext} from '../../parallel-source-20261110/core.mjs';\nimport {readStage2HistoricalRuntime} from '../../completion-first-20261112/retained-runtime-stage2.mjs';").replace(' if(!row)return read(path);',' if(!row){const retained=readStage2HistoricalRuntime(path,read,sourceGit);return retained??read(path);}');
 assert.notEqual(expected,oldRuntime);assert.equal(sourceGit(['show',workflowPolicy.guardRef+':'+runtime]).toString(),expected,'Historical Stage2 runtime keeps both literal arrays/default transport');
 const next=expected.replace('import {proveNamedCurrentContext}', 'import {proveNamedCurrentContext,preloadRetainedImmutableObjects}').replace("const git=completionGitReader(args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}));","const git=completionGitReader((args,options={})=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024,...options}));\nlet immutableObjectsPreloaded=false;").replace(' const row=sources.find(source=>source.path===path);',' const row=sources.find(source=>source.path===path);\n if(sourceGit===git&&!immutableObjectsPreloaded&&(row||["src/lib/native-delivery/technology-five-job-storage.ts","src/lib/native-delivery/technology-five-webhook-worker.ts","tests/gotrue-runtime/acceptance.mjs"].includes(path))){preloadRetainedImmutableObjects(read,git);immutableObjectsPreloaded=true;}');
 assert.notEqual(next,expected);assert.equal(readFileSync(runtime,'utf8'),next,'Exact default-only immutable preload/options successor preserves literal arrays and custom transport');


});
test('every current Stage2 source rejects genuine Stage1 predecessor bytes and current substitutions',()=>{
 const stage3Bytes=readFileSync(personalCapturePath),stage3=JSON.parse(stage3Bytes),p3={policy:personalPolicy,captureBytes:stage3Bytes,git:sourceGit,read:readFileSync,root};
 assert.equal(stage3.rows.length,2);assert.equal(stage3.auxiliaryRows.length,1);assert.throws(()=>personalPolicy.paths.push('src/unadmitted.ts'),TypeError);
 for(const row of stage3.rows)for(const bytes of [Buffer.from('tampered personal source'),sourceGit(['cat-file','blob',row.predecessor.blob])])assert.throws(()=>provePersonalAndHistoricalInputs({...input,read:p=>p===row.path?bytes:readFileSync(p)}),/Current factory bytes differ/);
 assert.throws(()=>originalVerifyExactStage({...p3,captureBytes:Buffer.from('{}')}),/digest differs/);
 const records=personalRecords(readFileSync),first=records.values().next().value;assert(Object.isFrozen(first)&&Object.isFrozen(first.current));records.clear();assert.equal(personalRecords(readFileSync).size,2);
 const mut=Buffer.from(stage3Bytes);personalRecords(()=>mut);mut[0]^=1;assert.throws(()=>personalRecords(()=>mut),/Independent personal capture digest differs/);
 for(const row of personalAuxiliaryRecords(readFileSync).values())assert.throws(()=>provePersonalAndHistoricalInputs({...input,read:p=>p===row.path?sourceGit(['cat-file','blob',row.predecessor.blob]):readFileSync(p)}),/Current personal auxiliary source bytes differ/);
 for(const row of capture.rows){const replacements=[Buffer.from('substituted current Stage2 source')];if(row.predecessor)replacements.push(sourceGit(['cat-file','blob',row.predecessor.blob]));for(const bytes of replacements)assert.throws(()=>verifyExactStage({...input,read:p=>p===row.path?bytes:readFileSync(p)}),/Current factory bytes differ/);}
});
test('Stage2 captures and commits cannot nominate themselves or hide a later current source delta',()=>{
 assert.throws(()=>verifyExactStage({...input,captureBytes:Buffer.from('{}')}),/digest differs/);
 assert.throws(()=>verifyExactStage({...input,git:a=>a[0]==='cat-file'&&a[1]==='commit'?Buffer.from('substituted commit'):sourceGit(a)}),/Commit content address differs/);
 const git=a=>a[0]==='diff'&&a[3]===workflowPolicy.codeRef?Buffer.from('src/unreviewed.ts\0'):sourceGit(a);
 assert.throws(()=>verifyWorkflowAndHistoricalCompletion({...input,git}),/Unreviewed current source delta/);
 const guardRows=workflowGuardRecords(readFileSync);for(const row of guardRows.values())for(const bytes of [Buffer.from('tampered guard source'),sourceGit(['cat-file','blob',row.predecessor.blob])])assert.throws(()=>verifyWorkflowAndHistoricalCompletion({...input,read:p=>p===row.path?bytes:readFileSync(p)}),/Current guard source bytes differ|Current personal auxiliary source bytes differ/);
 const ns=nonSourceRecords(readFileSync);for(const row of ns.values()){for(const bytes of [Buffer.from('tampered NS current source'),...(row.predecessor?[sourceGit(['cat-file','blob',row.predecessor.blob])]:[])])assert.throws(()=>verifyNonSourceStage({...input,read:p=>p===row.path?bytes:readFileSync(p)}),/Current NS source bytes differ/);}
 const source=readFileSync('.github/workflows/ci.yml','utf8'),prior=sourceGit(['show',workflowPolicy.predecessorRef+':.github/workflows/ci.yml']).toString();assert.equal(historicalWorkflowWithoutLoginObservations(source),prior);
 for(const altered of [source.replace(nativeLoginObservationStep,''),source.replace('Preserve sanitized native login observations','unreviewed observation'),source.replace(nativeLoginObservationStep,nativeLoginObservationStep+nativeLoginObservationStep),source.replace('batch13-gotrue/login-observation.json','batch13-gotrue/**'),source.replace(nativeLoginObservationStep,nativeLoginObservationStep.replace('if: always()','if: false')),prior])assert.throws(()=>historicalWorkflowWithoutLoginObservations(altered));

});
test('an overlapping historical Business source discloses the actual latest immutable source ref',()=>{
 const currentCapture=JSON.parse(readFileSync(capturePath));
 const before=sourceGit(['show',workflowPolicy.predecessorRef+':tests/next-cohort-20261110/source/retained-runtime.mjs']).toString(),literal=/const currentContext=Object.freeze\((\[[\s\S]*?\n\])\);/.exec(before);assert(literal);const contexts=JSON.parse(literal[1]),proof=proveNamedCurrentContext();
 for(const row of contexts.filter(row=>workflowPolicy.paths.includes(row.path))){assert.equal(proof.get(row.path)?.recordedSHA256,row.sha256,'Exact unchanged recorded context claim '+row.path);assert.equal(proof.get(row.path)?.current.ref,workflowPolicy.codeRef);}
 for(const path of ['src/app/api/internal/technology-webhooks/process/route.ts','src/lib/native-delivery/technology-five-job-storage.ts','src/lib/native-delivery/technology-five-webhook-worker.ts','src/app/api/business/technology-embeds/route.ts'])assert(workflowPolicy.paths.includes(path),'Actual reviewed current-context overlap remains explicit');
 for(const path of ['src/lib/native-delivery/technology-five-job-storage.ts','src/lib/native-delivery/technology-five-webhook-worker.ts']){const historical=sourceGit(['show',workflowPolicy.predecessorRef+':'+path]);assert(retainedRuntimeBytes(path).equals(historical));assert.throws(()=>retainedRuntimeBytes(path,p=>p===path?historical:readFileSync(p)),/Current factory bytes differ|current context target differs/);assert.throws(()=>retainedRuntimeBytes(path,readFileSync,()=>{throw Error('Missing current provenance');}),/Missing current provenance/);}
 const nsPath='tests/gotrue-runtime/acceptance.mjs',nsOld=sourceGit(['show',workflowPolicy.predecessorRef+':'+nsPath]);assert(retainedRuntimeBytes(nsPath).equals(nsOld));assert.throws(()=>retainedRuntimeBytes(nsPath,p=>p===nsPath?nsOld:readFileSync(p)),/Current NS source bytes differ|Independent current target bytes differ: tests\/gotrue-runtime\/acceptance\.mjs/);assert.throws(()=>retainedRuntimeBytes(nsPath,readFileSync,()=>{throw Error('Missing NS provenance');}),/Missing NS provenance/);
 for(const row of currentCapture.workflowHistoricalClaims){assert.equal(row.ref,'f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5');assert.equal(assertNamedApplicationSuccessor(row.path,row.sha256,readFileSync(row.path)).currentApplicationGit,workflowPolicy.codeRef);assert.throws(()=>assertNamedApplicationSuccessor(row.path,'0'.repeat(64),readFileSync(row.path)),/Exact original F042 source claim required/);}
 for(const row of JSON.parse(readFileSync(personalCapturePath)).rows){const path=row.path;retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs');for(const bytes of [Buffer.from('changed after immutable warm'),sourceGit(['cat-file','blob',row.predecessor.blob])])assert.throws(()=>retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs',p=>p===path?bytes:readFileSync(p)),/Current factory bytes differ/);}
 verifyCurrentRuntimeContext();

 const overlaps=currentCapture.applicationSuccessors.filter(row=>row.historical&&workflowPolicy.paths.includes(row.path));
 assert(overlaps.length>0,'Actual reviewed Business overlap is required by this successor');
 for(const row of overlaps){const bytes=readFileSync(row.path),result=assertNamedApplicationSuccessor(row.path,row.historical.sha256,bytes);assert.equal(result.currentApplicationGit,workflowPolicy.codeRef);assert.equal(result.historicalEvidenceOnly,true);assert.throws(()=>assertNamedApplicationSuccessor(row.path,row.historical.sha256,sourceGit(['cat-file','blob',row.current.blob])));}
});
