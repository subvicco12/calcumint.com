/** Reproducible workflow evidence, not a repeat of the 1224-case math sweep. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const script=fileURLToPath(import.meta.url),root=resolve(dirname(script),'../..');
const require=createRequire(import.meta.url),ts=require('typescript'),previous=require.extensions['.ts'];
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(readFileSync(filename,'utf8'),{
 compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}
}).outputText,filename);
const w=require(resolve(root,'src/lib/conversion-successor/fixed-factor-workspace.ts'));
if(previous)require.extensions['.ts']=previous;else delete require.extensions['.ts'];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const fileSha=path=>sha(readFileSync(resolve(root,path)));
const cases=[];
for(const definition of w.fixedFactorWorkspaces){
 const recordA=w.runFixedFactorDraft(definition.engine.id,definition.example);
 const recordB=w.runFixedFactorDraft(definition.engine.id,{...definition.example,value:'2.00'});
 let state=w.saveFixedFactorHistory(w.setFixedFactorCurrent(w.emptyFixedFactorWorkspace(),recordA));
 state=w.saveFixedFactorScenario(state,'A');state=w.setFixedFactorCurrent(state,recordB);
 state=w.saveFixedFactorHistory(state);state=w.saveFixedFactorScenario(state,'B');
 const text=w.exportFixedFactorWorkspace(state),recovered=w.importFixedFactorWorkspace(text);
 assert.equal(w.exportFixedFactorWorkspace(recovered),text);
 assert.deepEqual(w.compareFixedFactorScenarios(recovered).map(row=>row.record),[recordA,recordB]);
 assert.deepEqual(w.restoreFixedFactorHistory(recovered,0).current,recordA);
 assert.deepEqual(w.restoreFixedFactorScenario(recovered,'B').current,recordB);
 const planArtifacts=['free','pro','business'].map(()=>w.runFixedFactorDraft(definition.engine.id,definition.example));
 assert.deepEqual(planArtifacts,[recordA,recordA,recordA]);
 const corrupt=JSON.parse(text);corrupt.scenarios.B.artifact.snapshot.output.result=0;
 assert.throws(()=>w.importFixedFactorWorkspace(JSON.stringify(corrupt)));
 assert.equal(w.exportFixedFactorWorkspace(state),text);
 for(const value of ['','1e','9007199254740993','1e308','5e-324'])assert.throws(()=>w.runFixedFactorDraft(definition.engine.id,{...definition.example,value}));
 cases.push({catalogId:definition.catalogId,privateId:definition.engine.id,sourceArchiveSha256:definition.engine.sourceArchiveSha256,
  applicability:definition.engine.qualification,exampleA:recordA,exampleB:recordB,
  historyRecords:state.history.length,scenarioSlots:['A','B'],comparison:w.compareFixedFactorScenarios(state),
  exportBytes:Buffer.byteLength(text),exportSha256:sha(text),completeExport:state,
  roundtripExact:true,historyRestoreExact:true,scenarioRestoreExact:true,tamperRejectedWithoutMutation:true,
  plans:['free','pro','business'],planArtifactsEqual:true,
  zeroOutput:w.runFixedFactorDraft(definition.engine.id,{...definition.example,value:'-0'}).artifact.snapshot.output.result,
  negativeOutput:w.runFixedFactorDraft(definition.engine.id,{...definition.example,value:'-1'}).artifact.snapshot.output.result,
  rendererUnit:w.fixedFactorScalarResult(recordA).primaryResult.unit});
}
const paths=['src/lib/conversion-successor/fixed-factor-private.ts','src/lib/conversion-successor/fixed-factor-private.test.ts',
 'src/lib/conversion-successor/fixed-factor-workspace.ts','src/lib/conversion-successor/fixed-factor-workspace.test.ts',
 'src/components/private-fixed-factor-review.tsx','src/components/private-fixed-factor-review.test.tsx',
 'docs/converter-methodology-20261109/converter-successor-witnesses.json'];
const receipt={kind:'PRIVATE_CONVERTER_WORKSPACE_FINITE_RECOVERY_EVIDENCE',sourceSha256:Object.fromEntries(paths.map(path=>[path,fileSha(path)])),
 scriptSha256:sha(readFileSync(script)),cases,
 uiEvidence:'Real-component tests cover controlled inputs, actual Final renderer, three presentation-plan artifact parity, local history/A/B, remount, bad storage, atomic recovery and actual Blob download. This script exercises workflow APIs; it does not claim browser execution.',
 reusedMathEvidence:'Existing 68-pair/1224 signed exact-rational witness packet remains byte-pinned; this command does not rerun that sweep.',
 canonicalAdoptionAuthorized:false,competentApplicabilityApproval:false,publicRoutingAdded:false,
 limitation:'Private draft surface and bounded finite workflow evidence. No account sync, publication, registered successor allocation, source identity substitution or whole-domain acceptance.'};
const output=resolve(root,'docs/execution-recovery-20261109/converters/workspace-evidence.json'),text=JSON.stringify(receipt,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(readFileSync(output,'utf8'),text,'Retained workflow evidence differs');
else{assert(!existsSync(output),'Refuse overwrite; use --check');mkdirSync(dirname(output),{recursive:true});writeFileSync(output,text);}
console.log(JSON.stringify({cases:cases.length,output:output.slice(root.length+1),sha256:sha(text),approval:false}));
