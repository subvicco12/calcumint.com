import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const modulePath='../../scripts/recovery-reviewer440.mjs';
test('offline handoff builder exists',()=>assert.equal(readFileSync(new URL(modulePath,import.meta.url),'utf8').includes('buildReviewer440Handoff'),true));
test('exact handoff verifies real pins and refuses engine, authority and packet tamper',async()=>{
 const {buildReviewer440Handoff,verifyReviewer440Handoff}=await import(modulePath);
 const p=buildReviewer440Handoff();assert.equal(verifyReviewer440Handoff(p),true);
 assert.deepEqual(p.identity,{masterId:440,engineId:'conversion.frequency',slug:'frequency-converter',technicalVersion:1});
 assert.equal(p.appointment.status,'NOT_DOCUMENTED_RETAINED_OBSERVATION_ONLY');assert.equal(p.appointment.actualReviewer,null);
 for(const key of ['source','formula','precision','technicalQa'])assert.equal(p.decisions[key].status,'PENDING');
 assert.equal(p.certificationGo,'NO_GO');assert.equal(p.publicationGo,'NO_GO');
 for(const mutate of [x=>x.identity.technicalVersion=2,x=>x.decisions.source.status='GO',x=>x.appointment.actualReviewer='invented',x=>x.certificationGo='GO',x=>x.evidence.pop(),x=>x.evidence[0].sha256='0'.repeat(64)]){
  const altered=structuredClone(p);mutate(altered);assert.throws(()=>verifyReviewer440Handoff(altered));
 }
 const engine=p.evidence.find(x=>x.path==='src/calculators/conversion/catalog-batch-3.ts');
 assert.throws(()=>verifyReviewer440Handoff(p,path=>path===engine.path?Buffer.from('tampered'):readFileSync(path)));
 assert.equal(createHash('sha256').update(readFileSync(engine.path)).digest('hex'),engine.sha256);
});
