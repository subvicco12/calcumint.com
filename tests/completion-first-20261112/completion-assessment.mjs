/** Byte-verifying trusted runner. Reports incomplete full gates; grants no approval. */
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),artifacts=path.resolve(process.env.COMPLETION_ARTIFACTS||'/workspace/artifacts/completion-first-20261112');
const digest=b=>createHash('sha256').update(b).digest('hex');
const browser=JSON.parse(await readFile(path.join(artifacts,'acceptance/browser/receipt.json')));
const account=JSON.parse(await readFile(path.join(artifacts,'business/final-account/account-receipt.json')));
const genuinePath=path.join(artifacts,'business/authenticated-browser-final/positive-journeys-receipt.json');
const genuineBytes=await readFile(genuinePath),genuine=JSON.parse(genuineBytes);
assert(browser.passed&&browser.sourceUnchangedDuringRun&&account.passed&&genuine.positiveJourneysPassed);
const frozen='79bf64466663cc961fdb80365143d0c750dccc6f';assert.equal(genuine.frozenApplicationSourceCommit,frozen);
for(const [file,sha]of Object.entries(browser.sourceHashes))assert.equal(digest(await readFile(path.join(root,file))),sha,'Compiled browser source changed: '+file);
for(const row of browser.downloads)assert.equal(digest(await readFile(row.file)),row.sha256,'Downloaded artifact changed');
const bundle=path.join(artifacts,'completion-assessment.mjs');
await build({stdin:{contents:"export {assessCompletionReceipt} from './src/lib/calculator-factory/completion/acceptance';export {getFactoryWorkflows} from './src/lib/calculator-factory/registry';",resolveDir:root},outfile:bundle,bundle:true,platform:'node',format:'esm',alias:{'@':path.join(root,'src')},logLevel:'silent'});
const {assessCompletionReceipt,getFactoryWorkflows}=await import(pathToFileURL(bundle));
const criteria=['identity-scope','native-feature-applicability','formula-provenance-domain-precision','three-plan-entitlements','browser-interaction','accessibility-recovery','performance','independent-review','exact-source-ci','team-client-sharing','api','embed','automation'];
const receiptEvidence=source=>({path:source,sha256:digest(genuineBytes),sourceSHA:frozen});
const rows=[];
for(const catalogId of [218,219,220,423,430,431,432,438,440]){
 const artifact=browser.downloads.find(row=>row.catalogId===catalogId&&row.plan==='pro'&&row.format==='json');
 const packet=JSON.parse(await readFile(artifact.file));getFactoryWorkflows(catalogId).verify(packet);
 const identity={catalogId,engineId:packet.identity.engineId,slug:packet.identity.calculatorSlug,version:packet.identity.calculatorVersion};
 const actual=account.observations.filter(row=>row.catalogId===catalogId);assert.equal(actual.length,3);
 const downloads=browser.downloads.filter(row=>row.catalogId===catalogId&&row.plan==='pro').map(row=>({identity,path:row.file,sha256:row.sha256,sourceSHA:frozen,format:row.format,byteLength:row.bytes,downloadedInBrowser:true,identityAndValuesReconciled:true}));
 const persistence=genuine.journeys.filter(row=>row.catalogId===catalogId).map(row=>({...receiptEvidence(genuinePath),identity,plan:row.plan,created:row.genuineHistoryAction,reloaded:row.documentReloadRestore,replayedOriginalVersion:row.documentReloadRestore}));
 // Evidence is deliberately not synthesized for missing team/embed/automation,
 // exact-head CI, individual scope adjudication or independent acceptance.
 const observed=['browser-interaction']; // Other established facts remain in individual evidence packets; do not infer full criterion acceptance from one positive browser receipt.
 const receipt={identity,sourceSHA:frozen,scope:'full-engineering',scopeStatement:'Full applicable native I/J/K requirements; no silent exclusions.',criteria:criteria.map(id=>({id,source:'Native catalog I/J/K and docs/blueprint-reconciliation/native-paragraphs.txt',applicability:'required',rationale:'No exemption or substitute workflow has been approved.'})),observations:observed.map(criterionId=>({criterionId,passed:true,evidence:[{...receiptEvidence(genuinePath),identity}]})),downloads,persistence};
 const result=assessCompletionReceipt(receipt);assert.equal(result.fullEngineeringComplete,false);assert(result.failures.includes('Missing observation: team-client-sharing'));
 rows.push({catalogId,identity,result,scope:'full-engineering',freeHistorySaveVerified:true,freeBrowserReloadReplayVerified:false,retained440ApiEmbedMustBeReused:catalogId===440});
}
const result={kind:'ACTUAL_BYTES_AND_FULL_COMPLETION_GATE_NOT_CANONICAL_ACCEPTANCE',frozenRuntime:frozen,downloadBytesVerified:browser.downloads.length,newEngineeringCompletions:rows.filter(row=>row.result.fullEngineeringComplete).length,rows,releaseHold:true};
await mkdir(path.join(artifacts,'acceptance'),{recursive:true});await writeFile(path.join(artifacts,'acceptance/completion-assessment.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({selected:rows.length,downloadBytesVerified:result.downloadBytesVerified,newEngineeringCompletions:result.newEngineeringCompletions,canonicalAccepted:0,publicationEligible:0}));
