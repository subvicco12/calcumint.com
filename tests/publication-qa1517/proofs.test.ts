import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assertPendingReport,type ProofReport} from '../../scripts/publication-qa1517/proofs';
const fixture=():ProofReport=>JSON.parse(readFileSync('docs/publication-qa1517/missing-proofs.json','utf8')) as ProofReport;
test('retains all exact pending tuples and existing artifact receipts',()=>{
 const report=fixture();assertPendingReport(report);
 const baseline=JSON.parse(readFileSync('docs/publication-factory/contracts-evidence.json','utf8')) as typeof import('../../docs/publication-factory/contracts-evidence.json');
 const cohort=JSON.parse(readFileSync('docs/publication-factory/cohort-76.json','utf8')) as typeof import('../../docs/publication-factory/cohort-76.json');
 assert.deepEqual(report.rows.map((r)=>[r.masterId,r.engineId,r.version]),cohort.rows.map((r)=>[r.masterId,r.engineId,r.version]));
 for(const row of report.rows){const original=baseline.rows.find((r)=>r.masterId===row.masterId);assert.equal(row.performance.artifactSHA256,original!.witnesses[0].artifactSHA256);assert.equal(row.performance.inputSHA256,original!.witnesses[0].inputSHA256);}
});
test('rejects promotions, invented canonical URL, deleted and substituted evidence',()=>{
 const mutations:((r:ProofReport)=>unknown)[]=[(r)=>r.rows.pop(),(r)=>r.rows[1]=r.rows[0],(r)=>r.rows[0].requests[0].qaStatus='PASS',(r)=>r.rows[0].requests[1].fullCriterionEvidenceSufficient=true,(r)=>r.rows[0].seo.canonicalURL='/invented',(r)=>r.rows[0].seo.exactPublicBinding=true,(r)=>r.summary.newApprovals=1,(r)=>r.productionWrites=true,(r)=>r.rows[0].performance.warmSamplesMs[0]=-1,(r)=>r.rows[0].performance.warmP95Ms=999,(r)=>r.rows[0].entitlement.baselineArtifactSHA256='substituted'];
 for(const mutate of mutations){const report=fixture();mutate(report);assert.throws(()=>assertPendingReport(report));}
});
test('shared actual local handler receipts cover quota boundaries and preserve denied bytes',()=>{
 const shared=fixture().sharedEntitlement;assert.equal(shared.unknownPlanFallback,'free');assert.equal(shared.historyCapture.observations.length,12);
 for(const plan of ['free','pro','business']){const rows=shared.historyCapture.observations.filter((r)=>r.plan===plan);assert.deepEqual(rows.map((r)=>r.priorCount),[19,20,99,100]);assert.deepEqual(rows.map((r)=>r.writeAccepted),plan==='free'?[true,false,false,false]:[true,true,true,false]);for(const row of rows.filter((r)=>!r.writeAccepted))assert.equal(row.deniedBytesPreserved,true);}
});

test('retains exact eight declared loan-term-bound workloads and rejects stress substitutions',()=>{
 const report=fixture();assertPendingReport(report);assert.equal(report.stressWorkloads.length,8);
 const mutations:((r:ProofReport)=>unknown)[]=[r=>r.stressWorkloads.pop(),r=>r.stressWorkloads[0].engineId='substituted',r=>r.stressWorkloads[0].input.termMonths=1201,r=>r.stressWorkloads[0].warmSamplesMs.pop(),r=>r.stressWorkloads[0].warmSamplesMs[0]=-1,r=>r.stressWorkloads[0].actualValue=2,r=>r.stressWorkloads[0].schemaValidated=false];
 for(const mutate of mutations){const changed=fixture();mutate(changed);assert.throws(()=>assertPendingReport(changed));}
});
