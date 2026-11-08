import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const packet=JSON.parse(await readFile('docs/calculator-sprint-20261108/first-two-packet.json','utf8'));
test('packet selects the two exact review pending rows without granting acceptance',async()=>{
 const inventory=JSON.parse(await readFile(packet.inventory.path,'utf8'));
 assert.deepEqual(inventory.rows.filter(r=>r.classification==='IMPLEMENTED_REVIEW_PENDING').map(r=>r.masterId),[432,440]);
 assert.deepEqual(packet.rows.map(r=>[r.masterId,r.engineId,r.slug,r.version]),[[432,'conversion.time','time-converter',1],[440,'conversion.frequency','frequency-converter',1]]);
 for(const row of packet.rows){assert.equal(row.retainedExactEngineSHA256Matches,true);assert.equal(row.decisions.competentDecision.status,'PENDING');assert.equal(row.decisions.competentDecision.reviewerName,null);assert.equal(row.decisions.fullyAccepted,false);assert.equal(row.decisions.publicationEligible,false);assert.equal(row.historicalBrowserJourneys.length,3);assert.equal(row.historicalAuthenticatedArtifacts.length,3);}
 assert.equal(packet.productionWrites,false);assert.equal(packet.newApproval,false);
});
test('every current source and retained evidence byte binding still matches',async()=>{
 for(const binding of [packet.inventory,...packet.rows.map(r=>r.engineBinding),...packet.sharedCurrentBindings,...packet.retainedEvidenceBindings]){
 const bytes=await readFile(binding.path);assert.equal(createHash('sha256').update(bytes).digest('hex'),binding.sha256,binding.path);assert.equal(bytes.length,binding.bytes,binding.path);
 }
});
