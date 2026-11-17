import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {verifyCapturedSource} from '../milestone100-20261114/receipt-source-path-stage8.mjs';
const read=async path=>JSON.parse(await readFile(path,'utf8'));
async function verifyReceipt(path){
 const receipt=await read(path);
 assert.equal(receipt.passed,true);assert.equal(receipt.productionWrites,false);assert.equal(receipt.newApproval,false);assert.equal(receipt.releaseHold,true);
 assert.equal(receipt.checks.length,6);
 assert.deepEqual(receipt.artifacts.map(a=>[a.catalogId,a.engineId,a.plan,a.snapshot.calculatorVersion]),[[432,'conversion.time','pro',1],[432,'conversion.time','business',1],[440,'conversion.frequency','pro',1],[440,'conversion.frequency','business',1]]);
 for(const artifact of receipt.artifacts){assert.equal(createHash('sha256').update(JSON.stringify(artifact.snapshot)).digest('hex'),artifact.sha256);assert.equal(artifact.snapshot.calculatorSlug,artifact.catalogId===432?'time-converter':'frequency-converter');assert.equal(artifact.snapshot.output.result,artifact.catalogId===432?252:125000);}
 assert.equal(receipt.negativeReceipts.length,24);
 for(const binding of receipt.sources)await verifyCapturedSource(binding);
 const matrix=await read('docs/acceptance-closure-20261108/first-two-acceptance-matrix.json');
 for(const row of matrix.rows){assert.equal(row.canonicalAccepted,false);assert.equal(row.fullyAccepted,false);assert.equal(row.publicationEligible,false);assert.equal(row.competentDecision.status,'PENDING');assert.equal(row.competentDecision.reviewerName,null);assert.equal(row.newAuthenticatedScenarioExecution,'PASS_SCOPED_CANDIDATE_FIXTURE');}
}
test('retained first-two genuine receipt remains exact-source without approval',()=>verifyReceipt('docs/acceptance-closure-20261108/first-two-auth-receipt.json'));
if(process.env.FIRST_TWO_FRESH_RECEIPT)test('fresh exact-head authenticated receipt is required and fully verified',async()=>{
 await verifyReceipt(process.env.FIRST_TWO_FRESH_RECEIPT);
 const receipt=await read(process.env.FIRST_TWO_FRESH_RECEIPT);
 assert.equal(receipt.sourceCommit,execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim());
});
